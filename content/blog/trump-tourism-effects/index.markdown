---
title: "Trump Tourism Effects"
date: 2026-10-01T20:25:09-04:00
categories: [Politics,Visualization]
mathjax: false
image: arrivals-monthly-smoothed.png
---


In the past day or two on social media I kept seeing this graph, from a [Semafor story](https://www.semafor.com/article/09/29/2026/decline-in-tourism-hits-us-economy) on the declining volume of international visitors to the United States.

{{% figure src="semafor-graph.png" alt="" caption="Semafor Graph." %}}

It seems to show, and was being remarked on as showing, that the second Trump administration was responsible for a drop in visitors from abroad from some countries on a scale comparable to the effects of the Covid-19 pandemic. My first thought was “that can’t be true”. And indeed it is not true. I mean, the pandemic shut down air travel almost completely for a while. While the current administration's actions have been terrible in many ways, and led to direct, negative consequences for tourism, too, they haven't been on that scale. Something's wrong with the graph.   

These numbers come from [International Trade Administration's I-94 arrivals data](https://www.trade.gov/i-94-arrivals-program). THey maintain a spreadsheet that counts all international visitors by country of residence who arrive in the U.S., spend at least one night here, are among qualified visa holders, including tourist visas and waivers and so forth. This is monthly data. Right now, we only have data up to August of 2026, and for a couple of countries in the graph only up till June. I think---I am only guessing---that what the person who made this graph did was aggregate to yearly totals, plotted those points, and then smoothed them. But the data for 2026 are only for half the year, hence the giant drop. 

I went and got the data myself and took a look at it. Here's the raw monthly series for the same countries as in the one above:

{{% figure src="arrivals-monthly.png" alt="" caption="The monthly series." %}}

It's noisy because tourism is highly seasonal. Even so, the catastrophic effects of the pandemic are obvious, as is the fact that whatever is going on in the past year isn't nearly as severe as that. Though something *is* going on. We can smooth the monthly data directly by calculating a trailing average, which is just a moving average except the window we're moving across the data doesn't extend beyond the current month. That way, we don't illegitimately "look ahead" of the current month in a way that would make our moving average seem to anticipate the future. If we used an ordinary moving average it might seem like the trend was able to anticipate the Covid-19 downturn, for example. Here's the result:

{{% figure src="arrivals-monthly-smoothed.png" alt="" caption="The smoothed monthly series." %}}

So, no Covid-scale drop. But still, not nothing. The Canadian dip, following the trade war Trump started for no good reason, is very substantial. Just eyeballing it, it seems about twice as large as the downturn that followed the global financial crisis of the Great Recession, which is quite remarkable. It also looks like French tourism has declined, but I'd need to look a little more closely at that series by itself, as it's on quite a different scale.

The general lesson, I suppose, is just that it's always worth trying to cultivate some sort of rough comparative sense of how big or small an effect you should be expecting to see in your data, so that when something goes wrong (as things so often do) you're more likely to be brought up short by it. 


