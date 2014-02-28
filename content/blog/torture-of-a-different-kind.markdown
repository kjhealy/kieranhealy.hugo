---
author: kjhealy
date: "2004-05-13"
#layout: post
slug: torture-of-a-different-kind
status: publish
title: Torture of a different kind
wordpress_id: '628'
categories:
- Sociology
---

Remember to watch the [Eurovision Song Contest](http://www.eurovision.tv/) this weekend. If you have no idea what this is, you can read my [primer on the subject](http://www.kieranhealy.org/blog/archives/000433.html) from last year.

**Update**: Never let it be said that the tools of empirical social science are not abused on this website. I decided to see whether my prejudices about the geopolitics of the Eurovision were empirically confirmable. To this end, I dug up data on voting patterns in the Eurovision from 1975 to 1999. (If only all social science data were this easily available.) Confining ourselves to a group of countries who competed during (almost) all these years, we can aggregate their voting scores into a directed graph representing their preferences for one another's songs over the years. Given that Eurovision songs are (to a first approximation) uniformly worthless, we can assume that votes express a simple preference for one nation over another, uncomplicated by any aesthetic considerations. We then abuse the tools of network analysis to see how the voting patterns cluster. And to think [Drezner](http://www.danieldrezner.com) got published in [Slate](http://www.slate.com) for calculating a [correlation coefficient](http://www.danieldrezner.com/archives/000865.html#000865).

![cluster analysis](http://www.kieranhealy.org/files/misc/cluster.png)

As we can see, the main counterintuitive result is that Ireland and the UK form a distinctive group by themselves. It seems that their more-or-less shared language makes for a common cause against the rest of Europe, 600 years of colonial oppression notwithstanding. Though now that I think of it, the oppression is the reason the languages are shared in the first place. Elsewhere, as expected, Norway and Sweden sit snugly alongside one another, although surprisingly Finland is not included. Similarly, the BeNeLux nations cluster together. France and Spain show some similarities also. On the fringes, Israel, Germany and Switzerland are left out in the cold.

It's well known that unscrupulous researchers can manipulate data to their own ends. This is particularly true of graphical representations of network data, so we take full advantage of this here. The following figure shows the basic graph data, with the layout determined by the structural equivalence distances of the nodes, based on the Hamming metric.

![seham](http://www.kieranhealy.org/files/misc/seham.png)

The main benefit of this approach here is that it allows the UK to be separated from Ireland and placed firmly on the periphery. The central European core remains evident, as does the Sweden/Norway love-fest and the relative isolation of Finland from its Scandinavian so-called neighbors. France and Germany emerge alongside Israel in this picture, which should make American hawks ask just who is calling the tune in the Middle East these days.
