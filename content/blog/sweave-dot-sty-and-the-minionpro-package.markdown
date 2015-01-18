---
#layout: post
title: "Sweave.sty and the MinionPro package"
date: "2011-12-04"
comments: false
slug: "sweave-dot-sty-and-the-minionpro-package"
categories: [Nerdery]
---

In the spirit of [DenverCoder9](http://xkcd.com/979/), here's a gotcha for those of you using Sweave in conjunction with a the MinionPro package for LaTeX. If you're writing an `.Rnw` file, you may find it breaks your nicely-formatted PDF pipeline---e.g. of the sort that you can [find here](http://www.kieranhealy.org/latex-custom-kjh.html). Instead of rendering in Minion Pro or what have you, everything degrades to Computer Modern instead. Although you will tear your hair out for a while wondering what bit of LaTeX's notoriously fragile and unfriendly font setup has accidentlly broken, the reason for your trouble is in fact that the `Sweave.sty` file that you're using in your `.Rnw` file itself calls an outmoded style file, the 'ae' package. Change the `\setboolean{Sweave@ae}{true}` declaration to `false` instead, and your problem will disappear.

{{< highlight tex >}}
\NeedsTeXFormat{LaTeX2e}
\ProvidesPackage{Sweave}{}

\RequirePackage{ifthen}
\newboolean{Sweave@gin}
\setboolean{Sweave@gin}{true}
\newboolean{Sweave@ae}
\setboolean{Sweave@ae}{false} %% Set this boolean to false to prevent the outmoded ae package being loaded by default below (kjh)
{{< /highlight >}}   

I ran into this problem on my desktop machine last year and evidently solved it (given the note I left to myself in the Sweave file), but of course I forgot and wasted some time today with the same issue on my laptop. Chances are the next time it happens, I will google the problem and find this solution. So, hello, future self, I hope you are well.
