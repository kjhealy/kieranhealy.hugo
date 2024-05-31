---
title: "A Population Dotmap of New York City"
date: 2024-05-30T19:38:23-04:00
categories: [Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Our [New York City map adventure](https://kieranhealy.org/blog/archives/2024/05/29/race-and-ethnicity-in-new-york-city/) continues, this time with a first cut at a population dotmap. We take the block-level Census count for 2020, divide it by ten, and round that to the nearest whole number. Then we sample that number of points at random within the area of each block. So, for example, if a Census block is recorded as having 571 people in it, we mark 57 dots at random within the spatial area of that block. Then we convert each of those dots to coordinates on our map and plot them. The result is a map with a lot of dots that gives a pretty good sense of the population distribution within the city. Here is a relatively scaled-down version because in a city of more than eight million people we end up with a _lot_ of dots.


{{% figure src="ny_dotpop_n10_2020_points_minimal_1200ppi.png" alt="Population dotmap of New York City" caption="Population Dotmap of NYC" %}}


There's also a [higher-resolution version](ny_dotpop_n10_2020_points_minimal_2400ppi.png) which is about 17MB in size. Contrary to my usual practice I won't share a PDF version of this one, because it's really pretty big.

I very much like the pointillist look of this sort of map. They do a good job of compensating for some of the weaknesses of choropleths even though, we have to bear in mind once again, they are ultimately representations of a block-level count. A natural next step (which I imagine I'll get to) would be to take the counts e.g. by race and point-map those with different colors. 
