---
author: kjhealy
date: "2008-10-31"
#layout: post
slug: this-might-be-nice
status: publish
title: This might be nice
wordpress_id: '1395'
categories:
- IT
---

Embedded gists from github.

{{< highlight r >}}

library(lattice)
data <- read.csv("cities.csv",header=TRUE,row.names=1)
quartz()
stripplot(log(data$Population),groups=data$Outcome)

dev.off()

pdf(file="cities.pdf",height=8,width=8)
dotchart(log(data$Population), groups=data$Outcome,xlab="log Population")
dev.off()

pdf(file="cities-rank.pdf",height=8,width=8)
dotchart(-data$Rank, groups=data$Outcome,xlab="Rank Population")
dev.off()


pdf(file="cities-media.pdf",height=8,width=8)
dotchart(log(data$Population), groups=data$Media,xlab="log Population")
dev.off() 

{{< /highlight >}}


And so forth.
