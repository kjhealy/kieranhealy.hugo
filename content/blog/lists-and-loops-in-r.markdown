---
author: kjhealy
date: "2010-03-04"
#layout: post
slug: lists-and-loops-in-r
status: publish
title: Lists and Loops in R
wordpress_id: '1617'
categories:
- Data
- Sociology
---

Following up on some [work Gabriel has been doing](http://codeandculture.wordpress.com/2010/02/28/more-r-headaches/), here's a way to accomplish the same sort of thing, with less reliance on loops and more on functions that work on lists. Also, a way to manage the conversion of the .png files to an animated .gif without having to manually rename files. As I say in the comments over at Code and Culture, if the code works as a loop there's not necessarily a strong reason to vectorize it, but I'd be interested to see whether this approach was at all faster. (The use of the pipe command does make it more convenient to manage the files created by igraph's plots, though.)

{{< highlight r >}}
### Following up on
### http://codeandculture.wordpress.com/2010/02/28/more-r-headaches

library(igraph)
library(plyr) # Hadley Wickham FTW, as usual

## ----------------------------------------------------------------------
## NB for file reading and writing below, we're assuming figures/ and
## data/ subdirs exist in the working directory. Change paths as
## appropriate. 
## ----------------------------------------------------------------------

## Generate some fake data. Not the right format (no attributes) but
## that's not relevant here ...
g <- erdos.renyi.game(100, 0.05)
la <- layout.fruchterman.reingold(g)
summary(g)

plot(g, layout=la, vertex.size=4, vertex.label=NA,
     edge.color="gray60", edge.arrow.size=0.3, margin=0)

## Make 53 random graphs, as a list.
g.list <- rlply(53, erdos.renyi.game(100, 0.05))

## Look at one of the graphs
summary(g.list[[23]])

## Write them to separate files in the data/ subdirectory, to
## approximate where GR starts from.
for(i in 1:53) write.graph(g.list[[i]], file=paste("data/",i,"-g.net",sep=""), format="pajek")

### ----------------------------------------------------------------------
### Now we are kind of where GR begins: data in separate files, need
### to read them in, and get them into a list.
### ----------------------------------------------------------------------

## Get the filenames (just find .net files.)
all.the.filenames <- list.files("data/", pattern="\\.net$")
all.the.filenames <- paste("data/", all.the.filenames, sep="")

## Watch out for unix sort/numbering conventions! Numbers inside file
## names are not numerically sortable. ls (and so the vector here)
## will count them 1, 10, 11, 12 ... 2, 20, 21, 22, ... etc. Reorder
## them to get the numbers right. 

## Extract the numbers and reorder the names properly.
ind <- order(as.numeric(gsub("[^[:digit:]]", "", all.the.filenames)))
all.the.filenames <- all.the.filenames[ind]

## Now read in the data files to a list, without looping. llply() is
## from the plyr library; you could use lapply(), too.
g.list.new <- llply(all.the.filenames, read.graph, format="pajek")

### ----------------------------------------------------------------------
### Generate a sequence of PNGs graphplots in the figures/ subdir,
### without looping.
### ----------------------------------------------------------------------

png(file="figures/chrnet_hc%d.png") # see ?png for the %d trick here
l_ply(g.list.new, plot, layout=la, vertex.size=4, vertex.label=NA,
      edge.color="gray60", edge.arrow.size=0.3, margin=0)
dev.off()

### Finally, generate the gif without having to renumber the files
### individually.
png.filenames <- list.files("figures/", pattern="\\.png$")

## Resort properly again
ind <- order(as.numeric(gsub("[^[:digit:]]", "", png.filenames)))
png.filenames <- png.filenames[ind]
png.filenames <- paste("figures/", png.filenames, sep="") # add the path back
png.string <- capture.output(cat(png.filenames))

## Open a pipe to the shell to execute the convert command
## directly.
gifpipe <- pipe(paste("convert", png.string,
                 "figures/out.gif", sep=" "), "w")
close(gifpipe)    
{{< /highlight >}}
