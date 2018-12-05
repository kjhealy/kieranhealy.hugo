---
title: "Heatmaps of Mortality Rates"
date: 2018-12-04T11:21:06-05:00
categories: [R,Sociology,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

As part of the run-up to the release of [Data Visualization](https://amzn.to/2vfAixM) (out in about ten days! Currently 30% off on Amazon!), I've been playing with graphing different kinds of data. One great source of rich time-series data is [mortality.org](http://mortality.org), which hosts a collection of standardized demographic data for a large number of countries. Mortality rates are often interesting to look at as a heatmap, as we get data for a series of ages (e.g., mortality rates) over some time period. If we make a grid with time on the x-axis and age on the y-axis, we can fill in the boxes with a color representing the rate. A side-effect of that sort of representation is that the diagonals track age cohorts from the bottom left to the upper right of the graph, as people age at the rate of one year per year. 

Available mortality data for England and Wales runs back to 1841. Here's sample code for a plot of that for males:

{{< highlight r >}}

p <- ggplot(subset(britain, age < 101), aes(x = year, y = age, fill = ntile(male, 100)))
p_out <- p + geom_raster() +
    scale_fill_viridis_c(option = "A", direction = -1) +
    scale_x_continuous(breaks = seq(1845, 2015, by = 15)) +
    ylim(c(0, 100)) +
    guides(fill = guide_legend(nrow = 1, title.position = "top", label.position = "bottom")) +
    labs(x = "Year", y = "Age", fill = "Male Death Rate Percentile",
         title = "Male Mortality Rates in England and Wales, 1841-2016",
         subtitle = "Binned by percentile",
         caption = "@kjhealy / http://socviz.co. Data: Human Mortality Database.") +
    theme(legend.position = "top",
          legend.title = element_text(size = 8))

p_out
ggsave("figures/britain_men.png", p_out, height = 9, width = 10)
ggsave("figures/britain_men.pdf", p_out, height = 9, width = 10)


{{< /highlight >}}

You can look at the full code on [GitHub](https://github.com/kjhealy/lexis_surface).


Here's the figure for both males and females:


{{% figure src="http://kieranhealy.org/files/misc/britain_mortality_combined_media-01.png" alt="" caption="Mortality rates in England and Wales, 1841-2016, binned by percentile." %}}

A [higher resolution PDF](http://kieranhealy.org/files/misc/britain_mortality_combined_media.pdf) is also available. 

The devastating impact of the First and Second World Wars is immediately evident in the graph for males. The Influenza epidemic of 1918 is also clearly visible (most obviously in the female graph). Meanwhile other patterns are also clear, most notably declining infant mortality and increasing life expectancy. The remarkable effect of improved health care after WWII is especially striking. It also brings out some residual differences for men as they enter adulthood and are more likely to die than women of the same age, mostly due to their higher rate of death from accidents of various kinds. We can also make out some apparent cohort effects along the diagonals, notably starting with those born in 1918. They remained at a higher risk of death for their whole lives. (At the same time, it's also possible that some of these are due to recording errors---especially for earlier years, and in cases where they coincide with rounded decades.)

The data for France go back even further, and we have a full two centuries from 1816 to 2016. Here's what that looks like.

{{% figure src="http://kieranhealy.org/files/misc/france_mortality_combined_media-01.png" alt="" caption="Mortality rates in France, 1816-2016," %}}

Again, a [higher resolution PDF](http://kieranhealy.org/files/misc/france_mortality_combined_media.pdf) is also available. As with the data for England and Wales, you can see the large effects of wars and epidemics, the decline in infant mortality, and the increase in life expectancy (especially after WWII). The French series also seems to show stronger cohort effects, especially in the 19th century. Notably, I think you can make out (slightly different) diagonals for both men and women that would, if we had the data, intersect the x-axis between around 1789 and 1800, suggesting there were cohort mortality effects for being born during the period of the Revolution and the Terror.

The graphs were made using R and ggplot, of course. I quickly stuck them together in Illustrator (which I wouldn't do normally, but I was using it for other reasons). Note that there are a few decisions lurking in the background about how to represent the data. If you plot the raw mortality rates, what you'll find is that the wars tend to drown out all the other data in the series, washing out the other trends. There are various ways to approach this, such as logging the rates. In the end I binned the death rates into percentiles as a compromise. But there are other choices one could make here. The palette is the "Magma" variant of the viridis scale---the latter now comes conveniently built-in to the most recent major version of ggplot. 

