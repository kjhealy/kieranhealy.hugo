---
title: "Daily Average Sea Surface Temperature Animation"
date: 2024-04-12T07:13:47-04:00
categories: [Data,R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Yesterday evening I gave a talk about data visualization to [Periodic Tables](https://scienceandsociety.duke.edu/engage/events/periodic-tables/), a Science Cafe run by Misha Angrist. It was a lot of fun! Amongst other things, I made an animation of the [NOAA Daily Sea Surface Temperature Graph](https://kieranhealy.org/blog/archives/2024/04/04/make-your-own-noaa-sea-temperature-graph/) from the other week. Here it is:


<video autoplay loop muted playsinline controls="true" width = "100%">
    <source src="./sst_anim_1min_1280x720.mp4" type="video/mp4">
    <source src="./sst_anim_1min_1280x720.mov" type="video/mov">
    <source src="./sst_anim_1min_1280x720.webm" type="video/webm">
</video>


Here's the static graph.

{{% figure src="global_mean.png" alt="We're fucked" caption="Global mean sea surface temperature 1981-2024" %}}

And because the hardy perennial of whether, for the sake of honesty and not Lying With Graphs, you should always have your y-axis go to zero also came up, I made a zero-baseline version of the average temperature graph. 

{{% figure src="global_mean_kelvin_zero.png" alt="For all you zero-baseline fans" caption="Mean global sea surface temperature with a zero baseline on the y-axis" %}}

I've added these to the [Github repo](https://github.com/kjhealy/noaa_ncei). In making the animation, I found a nice little wrinkle that let me put a ticking version of the year in the title even though year is not the `frame_along` driving the `transition_reveal()` that makes the animation. If I get a chance I'll write this up separately.  
