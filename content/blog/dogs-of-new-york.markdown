---
title: "Dogs of New York"
date: 2019-10-28T13:18:50-04:00
categories: [R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---


The other week I took a few publicly-available datasets that I use for teaching data visualization and [bundled them up into an R package called `nycdogs`](http://kjhealy.github.io/nycdogs). The package has datasets on various aspects of dog ownership in New York City, and amongst other things you can draw maps with it at the zip code level. The [package homepage](http://kjhealy.github.io/nycdogs) has installation instructions and an example. 

Using this data, I made a poster called _Dogs of New York_. It's a small multiple map of the relative prevalence of the twenty five most common dog breeds in the city, based on information from the city's dog license database. This morning, reflecting on a series of conversations I had with people about the original poster, I tweaked it a little further. In the original version, I used a discrete version of one of the [Viridis palettes](https://cran.r-project.org/web/packages/viridis/vignettes/intro-to-viridis.html), initially the "Inferno" variant, and subsequently the "Plasma" one. These palettes are really terrific in everyday use for visualizations of all kinds, because they are vivid, colorblind-friendly, and perceptually uniform across their scale. I use them all the time, for instance with the [Mortality in France poster](https://kieranhealy.org/blog/archives/2018/12/27/french-mortality-poster/) I made last year. 

When it came to using this palette in a map, though, I ran into an interesting problem. Here's a detail from the "Plasma" palette version of the poster. 

{{% figure src="https://kieranhealy.org/files/misc/nycdogs_plasma_detail.png" alt="Dogs of New York - Plasma version" caption="Detail from the Plasma version of Dogs of New York" %}}

Now, these colors are vivid. But when I showed it to people, opinion was pretty evenly split between people who intuitively saw the darker, purplish areas as signifying "more", and people who intuitively saw the warmer, yellowish areas as signifying "more". So, for example, a number of people asked if I could make the map with the colors range flipped, with yellow meaning "more" or "high" (and indeed, in the very first version of the map I originally _had_ done this). A friend with conflicting intuitions incisively noted that she associated _darker_ colors with "more", in contrast to lighter colors, but also associated _warmer_ colors with "more". The fact that the scale moved from a cooler, darker color through to a different, warmer, lighter color was thus confusing. The warm and vivid quality of the yellow end of the Plasma spectrum seemed to be particularly prone to this confusion. 

I think the small-multiple character of the graph exacerbated this confusion. It shows the selected dog breeds from most (top left) to least (bottom right) common, whereas the guide to the scale (in the top right) showed the scale running from low to high values, or least to most common. 

In the end, after a bit of experimentation I decided to redo the figure in a one-hue HCL scale, the "Oranges" palette from the [Colorspace](https://cran.r-project.org/web/packages/colorspace/vignettes/colorspace.html) package. I also reversed the guide and added a few other small details to aid the viewer in interpreting the graph. Here's the final version. 

{{% figure src="https://kieranhealy.org/files/misc/breedposter_display_top25_orange.png" alt="Dogs of New York Poster" caption="Dogs of New York" %}}

The palette isn't quite as immediately vivid as the Viridis version, but it seems to solve the problems of interpretation, and that's more important. The image is made to be blown up to quite a large size, which I plan on doing myself. To that end, here's a [PDF version of the poster](https://kieranhealy.org/files/misc/breedposter_display_top25_orange.pdf), and a [PDF version that's 18 by 25 inches](https://kieranhealy.org/files/misc/breedposter_top25_orange_18x25.pdf) in size, as well. 


