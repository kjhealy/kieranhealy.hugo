---
author: kjhealy
date: "2011-02-18"
#layout: post
slug: aligning-labels-in-circular-igraph-layouts
status: publish
title: Aligning labels in circular igraph layouts
wordpress_id: '1838'
categories:
- R
---

![IPE financial integration network ](http://kieranhealy.org/files/misc/ipe-unc-graph.png)

The folks at [IPE at UNC](http://ipeatunc.blogspot.com/2011/02/modeling-global-financial-integration.html) have produced this [nice animated gif](http://dl.dropbox.com/u/14507110/pdfout.gif) of some network data on increasing financial integration in the run-up to the 2008 crisis. They used a small trick I [pointed to](http://www.kieranhealy.org/blog/archives/2010/03/04/lists-and-loops-in-r/) a while ago (just using a pipe, nothing fancy) that lets you generate the gif from within R without tediously typing in filenames. Then they ask,

> Also, a nerdy request: I wasn't able to find a way to put the country labels outside the graph, next to the nodes. I.e., I can move all the labels up or down, left or right, some constant distance. But I want to move them all outward so they sit next to their respective nodes, rather than above/below/to the side of the node. They would be more clearly visible that way. Any suggestions? I'm using igraph, because it supports tnet, so it would have to be something that works with those packages.

So, with a circular graph layout, how to get the labels aligned nicely? Here's an approach that I think will work, and should generalize to however many vertices you have around the circle. The igraph documentation says that the alignment of a label with respect to its vertex is controlled by `vertex.label.degree`, and that

> It is interpreted as an angle in radian, zero means 'to the right', and 'pi' means to the left, up is -pi/2 and down is pi/2. The default value is pi/4

As is common in R, you can give this parameter a scalar argument (0, say, so all labels are aligned to the right) but it will also accept a vector. Because we're plotting the entire graph in a circle, and igraph lays out its nodes predictably when plotting in a circle, we can take advantage of this and calculate the right position for each label with respect to its vertex given the vertex's position on the big circle. Like this.

{{< highlight r >}}
 ### Here's one way to do it.
 
 library(igraph)
 library(ggplot2)
 
 ## The igraph docs say that vertex.label.degree controls the position
 ## of the labels with respect to the vertices. It's interpreted as a
 ## radian, like this:
 ##
 ## Value is : Label appears ... the node
 ## -pi/2: above
 ## 0: to the right of
 ## pi/2: below
 ## pi: to the left of
 ##
 ## We can generalize this. vertex.label.degree can take a vector as
 ## well as a scalar for its argument. So we write a function to 
 ## calculate the right position for a label based on its vertex's location
 ## on the circle.
 
 ## Get the labels aligned consistently around the edge of the circle
 ## for any n of nodes.
 ## This code borrows bits of ggplot2's polar_coord function
 ## start = offset from 12 o'clock in radians
 ## direction = 1 for clockwise; -1 for anti-clockwise.
 
 radian.rescale <- function(x, start=0, direction=1) {
   c.rotate <- function(x) (x + start) %% (2 * pi) * direction
   c.rotate(ggplot2::rescale(x, c(0, 2 * pi), range(x)))
 }
 
 ### Example
 ## Generate some fake data
 n <- 15
 g <- erdos.renyi.game(n, 0.5)
 ## Obviously labeling in this way this only makes sense for graphs
 ## laid out as a circle to begin with
 la <- layout.circle(g)
 
 lab.locs <- radian.rescale(x=1:n, direction=-1, start=0)
 plot(g, layout=la, vertex.size=2, vertex.label.dist=1,
         vertex.label.degree=lab.locs)
{{< /highlight >}}

This gives us a graph with a nice layout, like this:

![circular igraph with properly-aligned labels](http://kieranhealy.org/files/misc/circle-labels.png)

I think this is what they're looking for.
