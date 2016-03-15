---
#layout: post
title: "Talk Radio"
date: "2012-07-17"
comments: true
categories: [Data,Nerdery,Internet,Visualization]
---

After our analysis of the [Hypercritical data](http://www.kieranhealy.org/blog/archives/2012/07/13/trying-to-rein-it-in/) it only seemed fair to check whether other [5by5](http://5by5.tv) hosts were prone to talk longer the longer their show has been on the air. As it happens, the spreadsheet-like layout of iTunes makes it easy to copy and paste episode data into a usable format. (Although, inevitably, some cleaning is required---a pox on you, inconsistent time formats.) I used the episode-length data for the 5by5 shows I subscribe to that also had a large-enough number of episodes to look at. Here's the collective trend for four shows that were in my iTunes podcast list:

{{% img src="https://www.kieranhealy.org/files/misc/5by5-show-lengths.png" %}}

[Click for a larger version](http://www.kieranhealy.org/files/misc/5by5-show-lengths.png).

You have to say, the linear trend doesn't look good for Dan. Comparing their first few episodes to the most recent ones, the tendency is for shows to add about thirty or forty minutes to their average length (over seventy or eighty episodes). It's the Freshman 15 of podcasting. 

We can also break out the trends by show. In this next figure we also replace the linear regression with a series of local trendlines to see how particular shows have developed over time:

{{% img src="https://www.kieranhealy.org/files/misc/5by5-shows-comp.png" %}}

[Click for a larger version](http://www.kieranhealy.org/files/misc/5by5-shows-comp.png).

We [already know](http://www.kieranhealy.org/blog/archives/2012/07/13/trying-to-rein-it-in/) that Hypercritical has been getting longer. But Back to Work and The Critical Path are also on steady, slower, but still quite linear upward trajectories. Build & Analyze, meanwhile, has an interesting pattern, somewhat reiminiscent of crash dieting: a tendency toward increasing episode length followed by a noticeable reduction (though not to the initial baseline), and subsequently a period of backsliding that ends up at a greater average length than before. 

Of course, interpreting the data is a separate matter. On the one hand, there is the prospect of the [5by5 Singularity](http://donschaffner.tumblr.com/post/27430785897/while-2000nickels-and-kjhealy-have-crafted-elegant). On the other, if the overall rate of increase is merely keeping pace with the growth rate in the length of the average American's commute, then listeners may well be very happy.

*Update:* This got quite a bit of attention! There's a [followup post](http://www.kieranhealy.org/blog/archives/2012/07/18/more-5by5-data/) with some new figures (including data from *The Incomparable*), if you're interested, and I've also made the code and data available [in a Github repository](https://github.com/kjhealy/5by5-figures). 
