---
title: "Street Tree Diameters and Income in New York City Neighborhoods"
date: 2024-02-29T08:18:28-04:00
categories: [visualization,sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


Here's a figure showing the relationship between the median diameter of street-trees (i.e., trees not in parks) and median household income for New York City neighborhoods at the NTA level. The idea is that there should be a relationship between how leafy a neighborhood is and how well-off it is. But there's more than one way to measure this. For example, you could count the _density_ of trees in a neighborhood on the grounds the richer neighborhoods will be denser in street trees. This is a reasonable way to approach things.  On the other hand, remedial tree-planting programs can take place in less well-off neighborhoods. This will increase the tree density but the trees will all be small. So you could also count how _big_ those trees are on average, because the larger the diameter of its trunk the longer a tree has been around. A lot of big street trees suggests a mature neighborhood with well-established vegetation. But of course this isn't perfect either, because in cities some places just aren't suitable for tree-planting, or wealthy neighborhoods are by the sea where it's harder for trees to grow big, and so on. 

I've broken out the graph by borough. The relationship is strongest in the Bronx; in Manhattan you have rich tree-lined UES and UWS neighborhoods, but also wealthy mid- and lower-Manhattan neighborhoods where planting isn’t possible.

{{% figure src="tree_diameter_by_income_faceted.png" alt="New York City NTA tree diameters, facted by Borough." %}}

The figure is also available [as a PDF file](tree_diameter_by_income_faceted.pdf).

New York's [Open Data program](https://opendata.cityofnewyork.us) makes a lot of great material available. The Street Tree survey is one of the most fun to play with. 

Incidentally, Drawing faceted plots of NYC would be a lot more elegant if there were six boroughs instead of five. Please consider splitting Queens in two. Or actually, just eliminate Staten Island.
