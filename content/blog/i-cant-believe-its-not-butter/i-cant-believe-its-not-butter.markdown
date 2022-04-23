---
title: "I Can't Believe It's Not Butter"
date: 2018-08-01T10:20:02-04:00
categories: [Sociology,Data,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Yesterday, [Vox ran a story](https://www.vox.com/science-and-health/2017/2/2/14485226/americans-avocado-consumption-usda-report) about changes in food consumption patterns in the United States over the past few decades. It featured this graph:

{{% figure src="https://kieranhealy.org/files/misc/vox-fat-graph.jpeg" alt="" caption="Vox Time Series" %}}

When I saw it, one of those little bells went off in my head:

{{% figure src="https://kieranhealy.org/files/misc/kh-vox-tweet.png" alt="" caption="" %}}

As a rule, when you see a sharp change in a long-running time-series, you should always check to see if some aspect of the data-generating process changed---such as the measurement device or the criteria for inclusion in the dataset---before coming up with any substantive stories about what happened and why. This is especially the case for something susceptible to change over time, but not to extremely rapid fluctuations. A sudden fifteen-pound-per-person-per-year uptick just seems unlikely. And while such shifts are not impossible, of course, you also have to tap the instruments, so to speak, to make sure everything's OK. 

In this case, it took [Jon Mellon](https://twitter.com/jon_mellon) a few minutes to track down the table the graph was based on, and sure enough, there it was:

{{% figure src="https://kieranhealy.org/files/misc/vox-fat-table.jpg" alt="" caption="The fault, my dear Brutus, is not in ourselves" %}}

In 2000, the number of firms reporting vegetable oil production increased, leading to the spike in the graph. Your theory of the avocado-based transformation of the American diet is invalid. As [Tom Smith](http://www.norc.org/Experts/Pages/tom-smith.aspx), the director of the General Social Survey, likes to say, if you want to measure change, you can't change the measure. 

Relatedly, as the graph itself makes clear---but the original article finesses a bit---the *availability* of fats (as measured through food *production*) is rather different from the *consumption* of fats in people's actual diets. The two are clearly closely related, but they're not the same.

In any case, a central part of looking at your data means using it as an opportunity to understand where the measures you're using come from and what they mean just in methodological terms. 
