---
author: kjhealy
date: "2010-02-16"
#layout: post
slug: easily-display-information-about-r-objects-in-emacsess
status: publish
title: 'Easily display information about R objects in Emacs/ESS '
wordpress_id: '1612'
categories:
- Data
- IT
- Sociology
---

I found [this post](http://blogisticreflections.wordpress.com/2009/10/01/r-object-tooltips-in-ess/) that provides a nice function for conveniently showing some information about R objects in ESS mode. ESS already shows some information about functions as you type them (in the status bar) but this has wider scope. Move the point over an R object (a function, a data frame, etc), hit C-c C-g and a tooltip pops up showing some relevant information about the object, such as the arguments a function takes or a basic summary for a vector and so on. As written it's a little unwieldy to use it on large dataframes, but it would be easy to modify the function used to summarize a particular class of object. Here's the code:

<script src="http://gist.github.com/305561.js?file=ess-R-object-tooltip.el"></script>

There's also a quick screencast of it in action:

Pretty handy. I've incorporated this into the [Emacs Starter Kit](http://kjhealy.github.com/emacs-starter-kit/).
