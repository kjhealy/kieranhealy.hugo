---
title: "A PCoA of New York City Neighborhoods and Street Tree Species"
date: 2024-03-03T12:56:07-05:00
categories: [visualization,sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


Hello and welcome back to NEW YORK STREET TREE FACTS. Thank you for subscribing. This is all I do now. Following on from previous dabbling, I went and did some metric scaling exercises of the sort that Ecologists do for species prevalence. There is a _very_ interesting story to be told about the many under-exploited overlaps between methods in Ecology and those in Sociology, particularly when it comes to methods for inductive multi-dimensional classification, and also models of the "mixed-effects" variety. But that is a topic for another day. That's because I am an Ecologist now, except I don't really know anything about trees. I do know how to draw pictures, though. So, here is one.  


{{% figure src="nyc_trees_pcoa.png" alt="A Principal Coordinates Analysis of New York City NTA Neighborhoods and their Street Tree Species" caption="A Principal Coordinates Analysis of New York City NTA Neighborhoods and their Street Tree Species" %}}

This figure is also available [as a PDF file](nyc_trees_pcoa.pdf). Scaling methods like this benefit from large figures, on the whole. This figure was made by taking the matrix of neighborhoods (in the rows) and street tree species prevalence (in the columns), standardizing it by neighborbood, and calculating a [Bray–Curtis dissimilarity](https://en.wikipedia.org/wiki/Bray–Curtis_dissimilarity) matrix. While R's built-in `dist()` function doesn't do Bray-Curtis, the `vegan` package in R has a drop-in `dist` replacement that does. With that in hand we do a classical MDS, or Principal Coordinates Analysis, with `cmdscale` and ask it for two dimensions back. We plot the neighborhoods on this basis and also project the species back in with their weighted average scores. 

For presentation I colored in the neighborhood by borough, and also added a bit of color to the labels for the tree species. The more common the tree species, the more yellow the label is. 

The figure works out quite nicely, I think. The presence or absence of relatively rare trees structures a good deal of the variation. For some of the very extreme cases we tend to see strong presence of just one or two species of tree. For example, in Starrett City (way off at the very top of the graph), 31% of trees are London Planetrees, compared to 11% percent for the median NTA. (The London Planetree is the most common street tree in the city as a whole, making up 12.7% of all street trees.) Almost 18% of its trees are Honeylocusts, compared to the NTA median of 9.7%. Meanwhile Stuyvesant Town/Cooper Village (on the far right of the plot). 62% of all trees are Honeylocusts. Not coincidentally, both of these NTAs are housing projects rather than regular neighborhoods, with the result that their internal management is doing the tree planting rather than the Parks Department.

The PCoA nicely suggests that the "typical street tree" tends (but only tends!) to vary across boroughs. Honeylocusts and Ginkos in Manhattan; Callery Pears in Queens; Cherry in the Bronx; maybe Japanese Zelkovas (also called Keyakis, I am reliably informed by a NY tree-knower) in Brooklyn; and ~~cops~~ Maples on Staten Island. 

