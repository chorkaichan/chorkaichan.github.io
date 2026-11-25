---
title: 'Music and Generative AI from an Engineer’s Point of View'
date: '2026-12-01'
tags: ['Notes']
draft: false
summary: 'How today’s AI works and how it has changed the work of software engineers, followed by my personal take on the future of music and AI. This is the Day 1 post of the "Musicians’ Lives and AI Advent Calendar 2026".'
---

## Introduction

This is the Day 1 post of the "[Musicians’ Lives and AI Advent Calendar 2026](https://qiita.com/advent-calendar/2026/musician-and-ai)" (音楽家の生活とAI活用 Advent Calendar 2026).

I make my living as a software engineer (building websites and smartphone apps), and I'm also active as a singer, mainly in choirs.

With AI advancing so quickly and drawing more and more attention, there have been a growing number of attempts to make active use of AI, not only in the engineering community but among musicians as well. Writing with the help of AI and building services for musicians are typical examples.

However, I feel that AI has developed so rapidly that it has caused no small amount of confusion. People's reactions vary too: some use it extensively, while others are actively opposed to it.

So in this post, aimed at people who aren't quite sure what AI is, I'd like to explain how the things we now call AI work and how engineers use them in their daily work, and through that share the kind of "gut feeling" that serves as a starting point for discussing AI. After that, I'll close with my personal views on the future of music and AI.

## What is AI?

As a general term, AI (Artificial Intelligence) refers to the idea of achieving human intellectual abilities with computers. The "AI" that everyone is talking about these days refers to what came after ChatGPT appeared, but in a broader sense, older technologies such as image recognition (for example, telling whether an animal in a photo is a dog or a cat) are also called AI.

Before ChatGPT, the mainstream AI model was deep learning. Its defining feature is a structure modeled on the human brain, and roughly speaking, it works like this:

- It is made up of a mesh of "small calculators and the connections between them," which correspond to brain cells and synapses in the human brain
- Each calculator receives numbers from the previous layer, performs a calculation, and fires (produces an output) depending on the result
- Once all the calculations across the mesh are done, a result is obtained as a probability

![How deep learning works (illustration)](/static/images/en/2026_12_01_01.png)

The process that decides what calculation each calculator performs is called learning (training). Before ChatGPT, this process was tuned for a specific purpose (telling dogs from cats, machine translation, etc.). Incidentally, one of the visions of artificial general intelligence that people once aimed for was the so-called "whole brain architecture," which would recreate the mechanisms of the entire brain with deep learning. It feels like a different era now.

So how did this change after ChatGPT? In fact, the concept itself hasn't changed much; what changed significantly was how data is handled and how the model is structured (if you want to know more, try searching for "Transformer"). This turned out to work extremely well with large-scale data, and experiments revealed that "the larger the scale, the better the performance." This is called the scaling law.

![Scaling laws](/static/images/en/2026_12_01_02.png)

As the scaling law became widely known, AI developed explosively. This is because the mechanism of AI itself largely follows that of conventional deep learning (or rather, it is a kind of deep learning), so anyone with enough computing resources and data can push AI development forward. That is why OpenAI, which took the world by storm with ChatGPT, didn't end up dominating alone, and startups like Anthropic and tech giants like Google have entered the field one after another.

In other words, if you look at today's AI broadly, understanding deep learning is the quickest way to grasp its characteristics. It is a collection of calculators modeled on the human brain, where various calculations are performed at each synapse in response to an input to produce an output. What I want to emphasize here are two points: "results are output based on probability" and "pre-training has a major effect on the results themselves."

Here is an example of what I mean by results being output based on probability. When classifying dogs and cats, the model might say there is a 70% chance it's a dog and a 30% chance it's a cat. Getting this probability as close to 100% as possible is an easy-to-understand goal.

Now let's apply this to today's AI. When you ask, "When did the Battle of Sekigahara take place?", internally it is still processed by probability: 1600 at 99.9%, 1720 at 0.001%, and so on. Going further, each piece of data is broken down into units called "tokens," and the model calculates the probability of which token will be chosen next.

For example, say the output so far is "Today the rain is…". The probability that "falling" comes next might be 90%, "drizzling" 3%, "pouring" 1%, and so on. These calculations are made at every step, and as tokens keep being chosen one after another like beads on a string, a long piece of text is generated. This isn't limited to text; it applies to many kinds of media, including audio.

![AI keeps choosing the "next word" by probability](/static/images/en/2026_12_01_03.png)

In the music industry, AI music generation tools such as SUNO are often used. The reason they show a certain bias in sound quality and tend to produce songs in similar directions is largely due to this nature of AI, which keeps choosing what has the highest probability.

Having read this far, I think you can get a rough sense that AI can make mistakes and that it tends to lean toward certain kinds of output.

The other thing I want to emphasize is learning. Each company uses huge amounts of data to adjust what calculation each synapse performs. In other words, if the source data is wrong, the reliability of the probabilistic results naturally goes down.

Choral conductor Kota Yanagishima has sounded the alarm about this point in [a post on note](https://note.com/yanadgt/n/n81c0c9dd25e5). As I'll discuss later, today's AI has not yet been trained enough on music, and it hasn't been verified enough either. So what would happen if incorrect information spread across the web? Naturally, we can expect the output of AI to lean toward incorrect content as well.

Low-quality content produced by AI is generally called AI slop. Classical music in particular still has few web media outlets, and since it is a blue ocean, new players, both companies and individuals, keep entering the field. In that situation, the risk of AI slop spreading is easy to understand.

![The vicious cycle of AI slop](/static/images/en/2026_12_01_04.png)

What we should value as a community right now is that writers take responsibility for the content of their articles, and that AI users understand that the answers they get are not always correct.

## Software Engineers and AI

If we roughly divide engineers into hardware engineers, who build the machines themselves, and software engineers, who build the software that runs on them, software engineers are probably among the professions most affected by AI.

As the name LLM (Large Language Model) for some of today's AI suggests, AI can now process large amounts of text data. In other words, retrieving and understanding huge amounts of source code, deciding how to implement something, and carrying it out are right in its wheelhouse. As of late November 2026, it has made headlines that the Riemann hypothesis, a famously difficult problem in mathematics, has been proven with the help of AI, a feat that no mathematician up to today had been able to achieve. I think it's easy to understand if you imagine a top-class talent at this level helping me with my work in their area of strength.

Because of this, I now very rarely write source code by hand myself. Instead, new kinds of work have emerged: using the freed-up time for other tasks, having AI work on several tasks in parallel, and making time to study.

If you ask me whether work has gotten easier, the honest answer is not really. When your hands are free, more work comes in to fill the gap. Summing up what many excellent engineers have been saying, relatively few say the amount of work has decreased, and many describe it as the nature of the work having changed: fitting AI into workflows, running multiple tasks at once, building systems so that work can be left to AI, and so on. If you consider that our value lies not just in diligently getting through the task in front of us, but in improving efficiency and reliability so that we can deliver results more reliably and quickly, this outcome makes sense.

In the United States, where employment regulations are loose, large-scale layoffs keep happening, and as a regular employee I can understand them to some extent (though it's hardly something to welcome). In fact, working as a sole proprietor myself, the amount of work I can handle each day has increased explosively. Because employment regulations remain strong in Japan, the impact there is still limited, but it seems inevitable that AI will affect every industry in various ways from here on.

## Music and AI

As a humble musician, I have used AI for music analysis. From an engineer's perspective, you can more or less hand off a request like "build this feature" and the work goes smoothly, but simply asking AI to analyze a piece caused several problems. For example, in harmonic analysis that even humans might hesitate over, such as whether a chord with accidentals is a borrowed chord or a modulation, I still couldn't fully trust the results without human follow-up.

It's also worth looking at examples of AI composition. [@aug5thmusic](https://x.com/aug5thmusic) benchmarks each new AI model as it comes out by asking it to compose a piece in the style of a particular composer. Of course, recent technological progress has led to better and better pieces being produced, but considering that these same models have the academic ability to pass the University of Tokyo entrance exam at the top of the class with ease, I have to say that there is still room for growth if this is the level of work they produce.

So can we say that AI will stay within a certain level of musical ability from now on? The answer is definitely NO. Training, tuning and the systems around it are simply not sufficient yet, and if, for example, a company seriously built a general-purpose AI composition tool, it could quickly become a game changer. As for performance, besides the example of SUNO mentioned earlier, I expect that a future where more refined classical performances are generated endlessly is not far off. Even if reproducing the acoustic sound you hear live is difficult (because today's listening environments, such as headphones, don't allow for it), a future where we get output comparable to today's human recordings is not far off either.

Naturally, the question arises: will human creativity be wiped out by AI? Personally, I'm optimistic about this. Taking mathematics as an example, the Riemann hypothesis may have been solved, but there is no news yet of an entirely new field of mathematics being established. As the labels in its history show, classical music has a history of breaking away from, evolving, or reconstructing past styles such as Classicism and Romanticism. As for whether AI can take on this process of destruction and creation, I am currently skeptical.

Another good thing about classical music is that the acoustic sound produced by humans is what's valued. The reason not many people enjoy listening to player pianos is probably the shared premise that the subtle differences in nuance from each performer are the very thing worth listening to. Even if there were a player piano that perfectly imitated a virtuoso pianist, I believe it would provoke an aversion similar to that toward AI slop.

Furthermore, the fact that singing and playing instruments are full of "experience" is another big reason I feel positive in the face of AI. AI will fundamentally change many things, but it cannot replace the joy of the act of performing. That's why I expect more and more people who gain free time thanks to AI to start making music themselves in search of that "experience." Of course, there are countless activities in the world that offer experiences, so even if there is great demand, interest may end up scattered, and the movement may turn out to be tiny. Even so, the reception of music in Japan, sparked by things like the Utagoe movement (a postwar movement of group singing) and the piano boom led by Yamaha, has been remarkable. Considering how unusual it is that Japan has the world's second-largest music market, large enough to sustain an industry within the country, I believe there is a good chance that music could lead a movement centered on "experience."

## Closing

Looking back at history, technological progress has had irreversible impacts before. Starting with the invention of the steam engine, the birth of the internet is a more recent example. The explosive development of AI this time seems likely to have a disruptive impact great enough to join this history. There will be some backlash, but I think the most important thing first is to "look at it squarely."

Our society will likely continue to change dramatically. But at the same time, some things don't change, and I believe that amid everything that keeps changing, the value of "what doesn't change" will be reaffirmed again and again. As a humble musician, I'll keep hoping that music continues to play its part in society, and that we keep developing it.
