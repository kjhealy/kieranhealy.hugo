---
title: "A New Baby Boom Poster"
date: 2020-02-26T15:17:22-05:00
categories: [Sociology,R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---


I wanted to work through a few examples of more polished graphics done mostly but perhaps not entirely in R. So, I revisited the Baby Boom visualizations I made a while ago and made a new poster with them. This allowed me to play around with a few packages that I either hadn't made use of or that weren't available the first time around. The most notable additions are [Rob Hyndman's suite of tidy tools for time series analysis](https://robjhyndman.com/software/) and Thomas Lin Pedersen's packages [ggforce](https://ggforce.data-imaginist.com) and [patchwork](https://patchwork.data-imaginist.com). These are all fantastic resources. The time series decomposition was done with the `tsibble` family of tools. Meanwhile `ggforce` and `patchwork` allow for a tremendous degree of flexibility in laying out multiple plots while still being very straightforward to use. Here's a preview of the result:

{{% figure src="https://kieranhealy.org/files/misc/okboomer2_composite_poster-300-01.png" alt="OK boomer" caption="OK Boomer" %}}

For now, the annotations were done in post-production (as they say in the movie biz) rather than in R, but I think I'll be looking to see whether it's worth taking advantage of some other packages to do those in R as well. 

The time series decomposition takes the births series and separates it into trend, seasonal, and remainder components. (It's an STL decomposition; there are a bunch of other alternatives.) Often, the seasonal and remainder components will end up on quite different scales from the trend. The default plotting methods for decompositions will often show variably-sized vertical bars to the left of each panel, to remind the viewer that the scales are different. But `ggforce` has a `facet_col()` function that allows the space taken up by a facet to vary in the same way that one can allow the scales on an ordinary facet's axes to vary. Usually, variable scaling isn't desirable in a small-multiple, because the point is to make comparisons across panels. But in this case the combination of free scales and free spacing is very helpful. 

Here's the snippet of code that makes the time series line graphs: 

{{< code r >}}
p_trends <- ggplot(data_lon, aes(x = date, y = value)) + 
    geom_line(color = "gray20") + 
    scale_x_date(breaks = break_vec, labels = break_labs, expand = c(0,0)) + 
    facet_col(~ name, space = "free", scales = "free_y") + 
    theme(  strip.background = element_blank(),
            strip.text.x = element_blank()) + 
    labs(y = NULL, x = "Year")
{{< /code >}}

Meanwhile combining the trends plot with the tiled heatmap (called `p_tile`) is a piece of cake with `patchwork`: 

{{< code r >}}
(p_tile / p_trends) + plot_layout(heights = c(30, 70)) 
{{< /code >}}

The `/` convention means stack the plot objects, and `plot_layout()` proportionally divides the available space. 

The code for the decomposition and the core plots is [on GitHub](https://github.com/kjhealy/us_births). 

You can [buy a print of this poster](https://kieranhealy.org/prints/baby-boom-v/) in a variety of formats.
