---
title: "Dataviz Workshop at RStudio::conf"
date: 2020-02-18T12:29:51-05:00
categories: [R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

> Workshop materials are available here:  https://rstd.io/conf20-dataviz <br>
> Consider buying the book; it's good: [Data Visualization: A Practical Introduction](http://socviz.co) / [Buy on Amazon](https://www.amazon.com/Data-Visualization-Introduction-Kieran-Healy/dp/0691181624)


I was delighted to have the opportunity to teach a two-day workshop on Data Visualization using ggplot2 at this year's [rstudio::conf(2020)](https://rstudio.com/conference/) in January. It was my first time attending the conference and it was a terrific experience. I particularly appreciated the friendly and constructive atmosphere that RStudio so clearly goes out of its way to encourage and sustain.

The workshop focused on learning how to think about good data visualization in principle, and how to do it in practice. After many years of trying and often failing to learn how to make good visualizations myself, I became convinced of two things. First, there is a real need for an approach that effectively combines the _why_ of visualization with the _how_. A lot of otherwise excellent introductions to data visualization will teach you why some visualizations work better than others, and will present a series of mouth-watering examples of fabulous graphics. Then you sit down in front of an empty `.Rmarkdown` file and ... now what? How do I _do_ that?

Meanwhile, many very good, detailed introductions to writing ggplot2 code may be a little out of reach for beginners or---perhaps more often---will tend to get picked up by users in a recipe-like or piecemeal way. People cast around to find out how to more or less solve a particular problem they are having. But they leave without really having a good grasp on why the code they are using looks the way it does. The result is that even people who are pretty used to working in R and who regularly make graphs from data end up with a hazy idea of what they're doing when they use ggplot. 

The second thing I became convinced of as I developed this material was that data visualization is a _fantastic_ way to introduce people to the world of data analysis with R generally. When visualizing data with R and ggplot, it's possible to produce satisfying results almost right away. That makes it easier to introduce other tidyverse principles and tools in an organic fashion.

For both of those reasons, I ended up [writing a book](http://socviz.co) that approached things in just the way I wanted: a practical introduction to data visualization using ggplot2 that kept both the ideas and the code in view, and tried to do so in an engaging and approachable way. It was this text that formed the core of the workshop.

While teaching over the two days, I was assisted by four TAs:

- [Mara Averick](http://www.twitter.com/dataandme/)
- [Dewey Dunnington](https://www.twitter.com/paleolimbot/)
- [Ari Spirgel](https://www.twitter.com/ariespirgel/)
- [Thomas Lin Pedersen](https://www.twitter.com/thomasp85)

When I saw the roster, my first reaction was that mine was the only name I didn't recognize. Having Thomas as a TA, in particular, did rather threaten to cross the line from the merely embarrassing to the faintly absurd. It was a real treat to meet and work with everyone for the first time. 

The materials from the workshop are available at the [GitHub repository for the course](https://rstd.io/conf20-dataviz). The repo contains all the code we went through as well as PDFs of all of the slides. The code and the slides also include additional examples and other extensions that we did not have time to cover in over the two days, or that I just mentioned in passing.

One of the benefits of teaching a short course like this is that I get a (sometimes sharp!) reminder of what works best and what needs tweaking across the various topics covered. Revisiting the code, in particular, is always necessary just because the best way to do something will change over time. For example, a few of the small tricks and workarounds that I show for dealing with boxplots will shortly become unneccessary, thanks to the work of Thomas, Dewey, and others on the next version of ggplot. I'm looking forward to incorporating those elements and more into the next version of the workshop. 

Data visualization is a powerful way to explore your own data and communicate your results to other people. One of the themes of the book, and the workshop, is that it is in most ways a tool like any other. It won't magically render you immune to error or make it impossible for you to fool others, or fool yourself. But once you get a feel for how to work with it, it makes your work easier and better in many ways. The great strength of the approach taken by the grammar of graphics in general and ggplot in particular is that it gives people a powerful "flow of action" to follow. It provides a set of concepts---mappings, geoms, scales, facets, layers, and so on---that let you look at other people's graphics and really see how their component pieces fit together. And it implements those concepts as a series of functions that let you coherently assemble graphics yourself. The goal of the workshop was to bring people to the point where they could comfortably write code that would clearly say what they wanted to see. 

