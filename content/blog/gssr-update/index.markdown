---
title: "gssr Update"
date: 2023-12-02T11:25:12-05:00
categories: [sociology,r,nerdery]
footnotes: false
htmlwidgets: false
mathjax: false
---


The [General Social Survey](http://gss.norc.org), or GSS, is one of the cornerstones of US public opinion research and one of the most-analyzed datasets in Sociology. My colleague Steve Vaisey aptly describes it as the Hubble Space Telescope of American social science. It is routinely used in research, in teaching, and as a reference point in discussions about changes in American society since the early 1970s. It is also a model of open, public data. The [National Opinion Research Center](http://norc.org) already provides many excellent tools for working with the data, and has long made it freely available to researchers. Casual users of the GSS can examine the [GSS Data Explorer](https://gssdataexplorer.norc.org), and social scientists can [download complete datasets](http://gss.norc.org/Get-The-Data) directly. At present, the GSS is provided to researchers in a variety  of commercial formats: Stata (`.dta`), SAS, and SPSS (`.sav`). It's not too difficult to get the data into R using the [Haven](http://haven.tidyverse.org) package, but it can be a little annoying to have to do it repeatedly, or across projects. After doing it one too many times, a few years ago I got tired of it and I made an R package instead, `gssr`. Full details are available [at the gssr homepage](https://kjhealy.github.io/gssr).

{{% figure src="fefam_svy.png" alt="Plot of GSS data from gssr" caption="GSS 'fefam' variable trends over time" %}}

This update to the `gssr` package (version 0.4) provides the GSS Cumulative Data File (1972-2022), three GSS Three Wave Panel Data Files (for panels beginning in 2006, 2008, and 2010, respectively), and the 2020 panel file. This version of also integrates survey codebook information about variables directly into R's help system, allowing them to be accessed via the help browser or from the console with `?`, as if they were functions or other documented objects.

{{% figure src="fefam_help.png" alt="Screenshot of RStudio help system" caption="GSS 'fefam' variable information inside R's help system." %}}

The `gssr` package makes the GSS a little more accessible to users of R, the free software environment for statistical computing. In a small way it helps make the GSS even more open than it already is.





