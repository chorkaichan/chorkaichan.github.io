---
title: 'システム移行について（2022年5月の作業状況）'
date: '2022-06-02'
tags: ['開発状況']
draft: false
summary: '5/14-15にかけて行ったinitium ; auditoriumのシステム移行作業についてまとめています。'
---

## はじめに

5/14-15 にかけて、[initium ; auditorium](https://www.initium-auditorium.com)のシステム移行を行いました。小さなプロジェクトとは言え、貴重な機会なので覚書として文章に残しておこうと思います。

移行前後のシステム構成は次の通りです。

| 種別            | 移行前                     | 移行後                               |
| --------------- | -------------------------- | ------------------------------------ |
| UI ライブラリ   | -                          | Chakra UI                            |
| 認証            | Firebase Auth              | Cognito                              |
| DB              | Firebase Firestore         | MongoDB                              |
| ストレージ      | Cloud storage for Firebase | S3                                   |
| 動画配信        | Mux                        | Mux                                  |
| API（定期実行） | Firebase Functions 　      | Lambda                               |
| メール配信      | Mailgun                    | SES                                  |
| ホスティング    | Vercel                     | Cloudfront + S3 (Serverless Next.js) |
| DNS             | ムームードメイン           | Route53                              |

見ると分かるとおり、動画配信以外の全てが一新されており、その多くが AWS が提供するサービスに置き換わっています。まずは、それぞれについてまとめていこうと思います。

## UI ライブラリ

initium ; auditorium は 2020 年から開発を始めましたが、当時の自分のスキル不足や、これまでの様々な機能追加・仕様変更に伴い、移行前はかなり散らかっている状態でした。[Atomic Design](https://design.dena.com/design/atomic-design-%E3%82%92%E5%88%86%E3%81%8B%E3%81%A3%E3%81%9F%E3%81%A4%E3%82%82%E3%82%8A%E3%81%AB%E3%81%AA%E3%82%8B)にしようとして逆に複雑なコンポーネント構成になっていたり、[WET](https://atmarkit.itmedia.co.jp/ait/articles/1706/01/news167_3.html)なコードになっていたり…。

そんな中システム移行を計画し、ソースコードの多くが変更になることから、良い機会と思いフロントエンドも一から作り直すことにしました。

#### デザインシステム導入

これまでは 1 ページごとの荒い粒度でデザインを検討しており、Figma 上で部品をコンポーネント化することもなく、ただ並べているだけでした。

その結果、開発する段階においてもどの部分を共通コンポーネント化するかが曖昧で、結果として Atomic Design のようで全くそうなっていない、散らかった状態になっていました。

そこで今回は、デザインの段階から Atomic Design を意識して作成することを心がけました。Figma が公式に提供しているデザインシステム「[UI2](https://www.figma.com/community/file/928108847914589057)」を下地にし、Atomic Design の考えにハマるように調整を加えています。

![Design System](/static/images/2022_06_02_01.png)

これにより、Atoms/Molecules/Organisms のコンポーネント分割はかなり綺麗になりました。

#### Chakra UI の導入

コンポーネント分割以外にも、既存のコードには様々な問題がありました。その一つがアクセシビリティです。

例えば次のようなモーダルを想定し、マウスを使用できないユーザーが Tab キーを押して Focus 位置を移動させる時を考えます。モーダルの右下に Focus が移った後、再度 Tab キーを押した際には、右上に Focus が移るのが自然です。しかし、移行前はこうした点を考慮せずに作成していたため、モーダルの裏側の要素にフォーカスが当たっていました。

![モーダル](/static/images/2022_06_02_02.png)

しかし、このようなアクセシビリティを考慮した開発は簡単ではありません。どこかで考慮漏れが起こることは容易に想像できました。

そこで、今回新たに[Chakra UI](https://chakra-ui.com/)を導入することでこれに対応しました。というのも、こうした UI ライブラリには標準でアクセシビリティに対する考慮がされていることから、実装が簡略化できるためです。

[MUI](https://mui.com/)などのライブラリもありますが、以前 JX 通信社の方が「Chakra UI はいいぞ」と仰っていた（[ブログ記事](https://tech.jxpress.net/entry/utility-first-css-in-js)）のを覚えており、正直あまり考えずに Chakra UI を導入することにしました。

使い勝手はかなり良く、props に型の制限があるため Typescript とも相性が良いので重宝しています。ですが、移行前は Tailwind CSS で記述していたので、[Headless UI](https://headlessui.dev/)の方が手軽だったかもしれません（当時は Tailwind を使用した UI ライブラリの存在を把握していませんでした）。とは言え、型の恩恵は大きいので、このまま Chakra UI を使っていこうと考えています。

## 認証

システム移行を検討するきっかけとなったのが、認証に関する 2 つの問題です。

- Firebase Auth でのソーシャルログインが頻繁に中断する（詳しくは[こちら](https://zenn.dev/chorkaichan/articles/09373b26ee2a4c)）
- メールリンク認証を採用しているにも関わらず、メールの到着が遅い

ソーシャルログインが頻繁に中断する問題は 2021 年初から[issue が立てられています](https://github.com/firebase/firebase-js-sdk/issues/4256)が、現在でも抜本的な対応はなされておらず、数日おきに再現確認が報告されています。恐らくブラウザの Cookie の取り扱いが厳しくなったことに由来する問題ですが、Firebase 内部の機能はブラックボックスであるため、詳しいところは分かっていません。

この問題に対応するため、Cognito を用いて再実装することにしました。合わせて、使いにくいと評判だったメールリンク認証も廃止し、メールアドレスとパスワードを用いた認証方法に変更しています。

#### Cognito 実装における注意点

Cognito に関わらず、AWS サービスは実装する上で少々癖がありますが、[Classmethod さん](https://dev.classmethod.jp/tags/amazon-cognito/)を中心にたくさんの解説記事があるため、そこまで苦労せずに進めることができました。

そんな中落とし穴だったのは、メールアドレスを変更する際の挙動です。簡単に言うと「メールアドレスを変更する際、コード検証が完了する以前に Cognito のメールアドレス情報が書き変わってしまう」というものです。この不具合については[AWS 側も把握している](https://github.com/aws-amplify/amplify-js/issues/987#issuecomment-531025897)とのことですが、どうやら先送りになっているようで…。

とは言え[この問題に関する記事](https://www.tolog.info/aws/cognito-address-change/)はたくさん転がっており、それを元に独自で実装することで対処することができました。詳しい内容を知りたい方は、ぜひ一度ググってみてください。

## DB

Firebase Auth をやめたことで、Firestore と連携することができなくなったため、DB 移行も行いました（MongoDB を採用することにした理由は[こちら](https://chorkaichan.github.io/blog/202111-late)）。

リリース以後の機能追加で DB スキーマがごちゃごちゃになっていましたが、この移行作業を通じて整理することができました。マイグレーションについては後述します。

## ストレージ

ストレージに関しては、単純にデータを移送し、データベース内のファイル URL を書き換えるだけだったので、割愛します。

## 動画配信

動画配信は引き続き[Mux](https://www.mux.com/)を使用しています。ゆくゆくはこれも AWS に置き換えたいと思っていますが、優先順位は低めです。

## API（定期実行）

Firebase Function で記述していたスケジュール実行の関数を、Lambda に移植しました。local 実行もでき、デプロイも自動化できる[Serverless Offline](https://www.serverless.com/plugins/serverless-offline)を使用しています。

## メール配信

メールの到着が遅れる件についても、これまでに多くのお問い合わせをいただいています。

[Mailgun](https://www.mailgun.com/)の他に[SendGrid](https://sendgrid.com/)も使ったことがありますが、どちらもメールが数分遅れて届くことはザラにあり、Hotmail など[メール検閲が強固](https://jpneet.com/gadget/hotmail_dontget/)なサービスはそもそもメールが届かないか、迷惑メールに入るケースが頻発していました。恐らくは共有 IP であることから、一部の不正な利用をしているユーザーのせいで[レピュテーション](https://baremail.jp/blog/2019/08/27/280/)が下がっており、その結果上記のような問題が発生しているのではないかと想像しています。

そこで様々なメールサービスを確認したのですが、AWS SES は共有 IP であってもメールの到着率と到着スピードが段違いに良かったことから、今回採用することにしました。これも想像ですが、[SES の本番利用時に申請する必要がある](https://dev.classmethod.jp/articles/relaxing-send-limit-and-removing-sandbox-restriction-in-ses/)ことから、悪意のあるユーザーを締め出すことに成功しているのではないかと考えています。

真相が何であれ、テスト時から現在に至るまで、メール配信で遅延したことは一度もありません。SES はいいぞ。

## ホスティング

Next.js で開発している場合、Vercel でホスティングするのが普通です。しかし、開発メンバー 1 人あたり月 20 米ドルかかるのが地味に痛く、維持費のうち多くの割合がここにかかっていました。

※Hobby プランであれば無料ですが、現在のサイトの API 数が Hobby プランの制限に引っかかってしまうため、Pro プランを選択する必要があります。

そこで、少しでも節約するために[Serverless Next.js](https://www.serverless.com/plugins/serverless-nextjs-plugin)を採用することにしました。

#### Serverless Next.js

Serverless Next.js に関する記事はいくつかありますが、本番運用しているという記事はあまり見かけません。

そのため少し不安はありましたが、ISR など基本的な機能は既に実装されており、致命的な不具合もないことから、十分本番運用に耐えうるライブラリだと感じています。

これまでに気づいたことが数点あるため、備忘録として下記にまとめます。

#### Policy, Role が引き継がれない

[こちらの記事](https://zenn.dev/makumattun/articles/c091602d3060d3#isr%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%97%E3%81%9F%E3%83%9A%E3%83%BC%E3%82%B8%E3%81%A7503%E3%82%A8%E3%83%A9%E3%83%BC%E3%81%AE%E9%A0%BB%E7%99%BA)にある 503 エラーを発生させる問題です。Serverless Next.js の ISR は、SQS を通じて ISR 実行用の Lambda にキューを送ることで実行されるのですが、デプロイ時に Policy, Role が引き継がれないことから Permission エラーが発生します。

この問題は、初回デプロイ時に作成される Policy, Role をコピーして別途作成し、serverless.yml ファイルに指定することで対処することができます。

```
# serverless.yml
auditorium:
  component: "@sls-next/serverless-component@3.8.0-alpha.0"
    inputs:
      # Policyは以下のものを指定
      policy: "arn:aws:iam::123456789012:policy/ServerlessFuctionPolicy"
      # Roleは以下のPolicyを当てたものを含んでいればOK
      roleArn: "arn:aws:iam::123456789012:role/ServerlessFunctionDeploy"
      ...
```

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VisualEditor0",
      "Effect": "Allow",
      "Action": [
        "lambda:CreateFunction",
        "iam:UpdateAssumeRolePolicy",
        "lambda:TagResource",
        "cloudfront:ListFieldLevelEncryptionConfigs",
        "s3:CreateBucket",
        "iam:CreateRole",
        "lambda:GetFunctionConfiguration",
        "iam:AttachRolePolicy",
        "iam:PutRolePolicy",
        "route53:ListHostedZonesByName",
        "cloudfront:CreateInvalidation",
        "lambda:EnableReplication",
        "cloudfront:GetDistribution",
        "logs:CreateLogStream",
        "acm:RequestCertificate",
        "route53:ListResourceRecordSets",
        "lambda:DeleteFunction",
        "cloudfront:GetDistributionConfig",
        "iam:GetRole",
        "cloudfront:TagResource",
        "route53:ChangeResourceRecordSets",
        "sqs:GetQueueAttributes",
        "logs:CreateLogGroup",
        "lambda:UpdateFunctionCode",
        "s3:PutObject",
        "s3:GetObject",
        "acm:DescribeCertificate",
        "cloudfront:ListTagsForResource",
        "cloudfront:ListInvalidations",
        "lambda:ListEventSourceMappings",
        "sqs:DeleteQueue",
        "lambda:PublishVersion",
        "cloudfront:ListDistributionsByWebACLId",
        "cloudfront:ListCloudFrontOriginAccessIdentities",
        "s3:GetBucketTagging",
        "s3:PutAccelerateConfiguration",
        "s3:ListBucket",
        "s3:GetAccelerateConfiguration",
        "lambda:CreateEventSourceMapping",
        "sqs:*",
        "lambda:UntagResource",
        "cloudfront:CreateCloudFrontOriginAccessIdentity",
        "iam:PassRole",
        "lambda:ListTags",
        "s3:PutBucketTagging",
        "ses:*",
        "iam:DeleteRolePolicy",
        "acm:ListCertificates",
        "cloudfront:UpdateDistribution",
        "sqs:SetQueueAttributes",
        "cloudfront:UntagResource",
        "sqs:ListQueues",
        "lambda:GetFunction",
        "lambda:UpdateFunctionConfiguration",
        "cloudfront:CreateDistribution",
        "logs:PutLogEvents",
        "cloudfront:ListPublicKeys",
        "iam:CreateServiceLinkedRole",
        "cloudfront:ListDistributions",
        "cloudfront:ListFieldLevelEncryptionProfiles",
        "s3:PutBucketPolicy",
        "sqs:CreateQueue",
        "cloudfront:ListStreamingDistributions"
      ],
      "Resource": "*"
    }
  ]
}
```

#### ISR がタイムアウトする

MongoDB のコネクション確立に時間がかかるせいか、ISR がタイムアウトし、空ページが表示されることが稀にありました。

こちらについても、serverless.yml 内で Memory 割り当てと Timeout 指定を調整することで改善されました。

```
# serverless.yml
auditorium:
  component: "@sls-next/serverless-component@3.8.0-alpha.0"
  inputs:
    memory:
      defaultLambda: 1024
      apiLambda: 2048
    timeout:
      defaultLambda: 30
      apiLambda: 30
    ...
```

なお蛇足ですが、Serverless Next.js はこれまで Core Maintainer として活動していた Daniel Phang 氏がプロジェクトから離れ、現在停滞気味です。

というわけで、Serverless Next.js に興味のある方は、ぜひ contribute もご検討ください。[こちらの Issue](https://github.com/serverless-nextjs/serverless-next.js/issues/970)を読んだ上で [serverlessnextjs@gmail.com](mailto:serverlessnextjs@gmail.com) に連絡すると、contributors が集まる Slack グループに招待されます。ぜひ一緒にやりましょう。

## DNS

移行前は、別の方が DNS 周りを管理しており、CNAME 設定が必要な際には情報を共有した上でその方に設定してもらうという状態でした。ドメイン移管すれば良いのですが、なるべくお金はかけたくない…。

ということで今回 Route53 を導入し、ネームサーバごと AWS へ移行することで、ドメイン設定をすべて開発者側で行うことができるようになりました。めでたし。

## マイグレーションの流れ

ここまで、各機能について詳しく見ていきましたが、以下では時系列に沿ってシステム以降の流れを記載していきます。

#### 5/3

- 移行計画策定

#### 5/6

- 移行前最後のコンテンツ公開を実施

#### 5/7

- コンテンツ情報・アーティスト情報の DB 移行
  - 事前にスクリプトを用意し、コマンド一つで Firestore から MongoDB へデータが書き込まれるようにしていました（以下同様）

#### 5/8

- Twitter に 5/14 夜からサービスが利用できなくなる旨記載
- Web サイト上に同様のお知らせを掲載
- コンサートパスの販売を停止（コンサート見放題期間と、サービス停止時期が被ってしまうため）

#### 5/10

- iOS, Android アプリの審査提出
  - 審査落ちが複数回発生することを考え、早めに審査に出しました

#### 5/11-5/13

- 細かい不具合修正などを実施

#### 5/14 夜

- サービスの停止
- ドメイン移行
- ユーザー情報、売上情報の DB 移行

#### 5/15

- 本番環境のドメイン設定
- 最終動作確認
- Web サイトオープン
- スマホアプリ配布開始
- 利用者全員へのメール連絡
- 配布後に発覚した[スマホアプリの不具合](https://twitter.com/initium_a/status/1525748291895324672?s=20&t=7mRxO9e76CaVMQ1lFd9ZXg)対応
- iOS, Android アプリの審査再提出

#### 5/16

- アプリ審査落ちにつき、再度審査提出
- 審査に通過。不具合対応済みのアプリを配布開始

## おわりに

本記事ではポイントになる部分を抜粋して記載しましたが、記載するまでもない地道な作業が一番大変でした。自分でも、よく半年以上の期間かけてやり切ったな、と思います。おかげでかなり綺麗なコードになりました。

昨年後半から今までにかけて移行作業に全力でしたが、以後は開発はそこそこにして、今後の initium ; auditorium をどうしていくかの検討に入る予定です。多くの人に話を聞きながら、より良いサービスを考えていければと思っています。
