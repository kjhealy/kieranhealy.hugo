---
title: "Escaping the Malthusian Trap"
date: 2023-01-08T10:49:46-05:00
categories: [Sociology,Economics,R,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---


The Broadberry et al GDP series has estimates of England's real GDP and population from the year 1270 onwards. It's available, along with a lot of other long-run data, from [The Bank of England](https://www.bankofengland.co.uk/statistics/research-datasets). Here's an animation of the series. I sometimes use this as a scene-setter when teaching social theory. It's great because, in addition to the basic story that the series tells (which I find the animation brings out very nicely), it also naturally invites questions about the nature of the data itself. How is a series like this even possible? How was it constructed? What do the estimates mean? What are their scope and limits? What can it tell us about the perspective of someone writing about society in 1600, or 1800, or 2000? 

<video autoplay loop muted playsinline controls="true" width = "100%">
    <source src="./malthusian-fin.mp4" type="video/mp4">
    <source src="./malthusian-fin.mov" type="video/mov">
    <source src="./malthusian-fin.webm" type="video/webm">
</video>

The rough periodization by color is my own, and is there just for convenience. As usual the graph and animation is made using R and ggplot2. The code to reproduce the animation is [available on GitHub](https://github.com/kjhealy/england_gdp_long). 
