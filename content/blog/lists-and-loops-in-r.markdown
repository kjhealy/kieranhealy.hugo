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

<script src="http://gist.github.com/322442.js?file=rossman.r"></script>
