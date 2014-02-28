---
author: kjhealy
date: "2007-12-13"
#layout: post
slug: the-right-tools-for-the-job
status: publish
title: The Right Tools for the Job
wordpress_id: '1097'
categories:
- Data
- orgtheory
- Sociology
---

A [discussion](http://scatter.wordpress.com/2007/12/13/little-black-corvette) about Mac applications at Scatterplot (which is threatening to spill over into a Windows vs OS X war) reminded me of something. Although not by any means a [quant jock](http://scatter.wordpress.com/2007/11/26/querying-quants-a-triptych/), a good deal of my work involves analyzing quantitative data. Almost since I learned how to do that kind of thing at all, I have used software tools designed to make the process easier and less error-prone.

The most basic of these is a proper programmer's text editor with support for whatever statistical software I'm using. One of the simplest things that an editor of this kind can do is highlight the syntax of your code in a way that makes it more readable. Typically they will also passively signal to you when you've done something wrong (like forget a closing brace or semicolon or quotation mark), [automagically](http://en.wiktionary.org/wiki/automagical) indent your code in an intelligent way, and perhaps also allow you to "fold up" chunks of code (such as long functions) if you don't want to see them. Beyond that, many editors integrate well with your statistics software, allowing you to send bits of code or whole files to the stats package for execution, and subsequently see the results, without leaving the editor or putting your hand on the mouse to tediously cut and paste stuff over. It's all about reducing errors and improving flow. Here's a screenshot of an R file in [TextMate](http://macromates.com/), for instance.

[![Editing Code](http://www.kieranhealy.org/files/misc/textmate-shot.png)](http://www.kieranhealy.org/files/misc/textmate-shot.png)

Until recently I took it for granted that the many people much more knowledgeable than me about statistics were all well aware of this kind of thing. But then a quant-jock colleague dropped by one day and asked me what the hell all the colored text was on my screen. Astonishingly, he had always edited his (extensive, voluminous, complex, vertiginous) Stata code in Notepad. Notepad! He was unaware of the very concept of a professional text editor. So, I helped him install [WinEdt](http://www.winedt.com/) on his PC and set up a few simple bits and pieces to mark up his code and send it seamlessly to Stata.

He came back a few days later with the air of someone who has just had a religious experience. And he said unto me, "You have changed my life, man." Subsequently, the Good News spread to some other friends who had previously been living in the Uttermost Monochromatic Darkness and the effects upon them were similarly revelatory. Further conversions followed.

As you might expect, there's path-dependence here. It seems that a number of (very good!) sociology programs that teach their students excellent quantitative skills nevertheless leave this component out of the mix altogether, presumably because the teachers themselves never got into using these tools. This led to my friend thinking maybe he would email his eminent former teacher and tell him that it was—*quel horreur*—some Princeton culture guy who had turned him on to the path of righteousness.

Meanwhile, it dawned on me shortly afterward that I had just given away my sole comparative advantage to a bunch of people who really have no need whatsoever to be made more productive than they already are. But the cat's out of the bag now.
