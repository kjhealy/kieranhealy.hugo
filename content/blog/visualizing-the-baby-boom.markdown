---
title: "Visualizing the Baby Boom"
date: 2018-04-10T09:31:23-04:00
categories: [R,Sociology,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

To close out what has become [demography](https://kieranhealy.org/blog/archives/2018/04/07/us-monthly-births/) [week](https://kieranhealy.org/blog/archives/2018/04/08/animated-population-pyramids-in-r/), I combined the [US monthly birth data](https://kieranhealy.org/blog/archives/2018/04/07/us-monthly-births/) with data for England and Wales (from the same ONS source [as before](https://kieranhealy.org/blog/archives/2018/04/08/animated-population-pyramids-in-r/)), so that I could look at the trends together. The monthly England and Wales data I have to hand runs from 1938 to 1991. I thought combining the monthly tiled heatmap and the LOESS decomposition would work well as a poster, so I made one. I think it turned out pretty well.

{{% figure src="http://kieranhealy.org/files/misc/combined_births_components.png" alt="" caption="Visualizing the baby boom in the US, and England & Wales." %}}

As a piece of visualization, we can see the strengths and weaknesses of both the tiled heatmaps and the more standard time series plots. The Viridis palette really does a good job of showing a continuous variable in color---far, far better than traditional rainbow and terrain palettes, and for my money also better than most of the standard balanced palettes. The time series decomposition shows the data and the trends together. I separated out the seasonal components for easier viewing. I also played with the aspect ratios of those two pieces in order to convey the seasonality while keeping comparability with the rest of the plot. For this plot, the seasonality is modeled quite simply---other specifications might put more of the remainder into the seasonal trend. You can see that the seasonality of births differs between the US and England & Wales, however. 

Substantively, the plot shows just how big the Baby Boom was in comparison to other "generational" moments (such as Gen-X and Millennials and all that). Those other demographic trends may be in the data, but they are dwarfed by the scale of the Baby Boom. Meanwhile, comparatively, we can see that while the boom happens in  both regions at the same time, the US sustains its post-demobilization boom through the 1950s. The boom in England and Wales is smaller and over much more quickly. Post-war Britain was an austere place, with [rationing of some goods, including meat](https://en.wikipedia.org/wiki/Rationing_in_the_United_Kingdom#Post-Second_World_War) continuing as late as 1954. Things pick up in England and Wales in the 1960s, as the US boom is in decline. The lowest birth rates in England and Wales are in 1977. 

Shameless plug: If you liked this poster and would like to learn how to make something like it, why not take a look at [Data Visualization: A Practical Introduction](http://socviz.co), forthcoming later this year from Princeton University Press. A full draft is available for viewing at <http://socviz.co>. Data and code to reproduce the plots is available at [https://github.com/kjhealy/boom](https://github.com/kjhealy/boom).
