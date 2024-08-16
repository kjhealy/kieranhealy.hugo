---
title: "gssr is now two packages: gssr and gssrdoc"
date: 2024-04-15T16:18:57-04:00
categories: [R, data,gss]
footnotes: false
htmlwidgets: false
mathjax: false
---


{{% admonition info Summary %}}

My gssr package is now two packages: [gssr](https://kjhealy.github.io/gssr/) and [gssrdoc](https://kjhealy.github.io/gssrdoc/). They're also available as binary packages via R-Universe which means they will install much faster.

{{% /admonition %}}


<p class="clearfix"><a href="http://kjhealy.github.io/gssr"><img src="/files/misc/hex-gssr.png" width="280" align="left"><a href="http://kjhealy.github.io/gssrdoc"><img src="/files/misc/hex-gssrdoc.png" width="280" align="left"></a></p>


The [GSS](https://gss.norc.org) is a big survey with a big codebook. Distributing it as an R package poses a few challenges. It's too big for CRAN, of course, but that's fine because CRAN is not a repository for datasets in any case. For some time, my `gssr` package has bundled the main data file, the panel datasets, and functions for getting the file for a particular year directly from NORC. Recently, I started integrating the codebook---or at least, summaries of every variable in the 1972-2022 data file---into the package. It's a handy feature. It lets you look up GSS variables as if they were R functions:

{{% figure src="fefam_help.png" alt="fefam in R" caption="Looking up a GSS variable" %}}

The main downside to doing this is that it makes a large package even larger. In addition, it takes a fair amount of time to install from source because more than 6,500 variables have to be documented during the installation. Providing binary packages would be much better. R OpenSci's [R-Universe](https://r-universe.dev/search/)  provides a package-building service that rests on a bunch of GitHub Actions. But the resource constraints of GitHub's runners meant that building a source package would fail on Ubuntu (specifically), and this meant that I couldn't use it. To get around this I have split the package in two. There’s now [gssr](https://kjhealy.github.io/gssr/), which has the datasets (and the ability to fetch yearly datasets) exactly as before, and [gssrdoc](https://kjhealy.github.io/gssrdoc/), which provides the integrated help. They are fully independent of one another. If you install both, you get exactly what `gssr` used to give you by itself. I think splitting them like this is worth it just because R-Universe can build package binaries of each now, and this means installation is _much faster_ and you can use `install.packages()`. To install both, do:

{{< code r >}}
# Install 'gssr' from 'ropensci' universe
install.packages('gssr', repos =
  c('https://kjhealy.r-universe.dev', 'https://cloud.r-project.org'))

# Also recommended: install 'gssrdoc' as well
install.packages('gssrdoc', repos =
  c('https://kjhealy.r-universe.dev', 'https://cloud.r-project.org'))
{{< /code >}}


You can of course permanently add my or any other R-Universe repo to the default list of repos that `install.packages()` will search by using `options()` either in a project or in your `.Rprofile`. The [R-Universe help repo](https://github.com/r-universe-org/help) has some additional details. 

Note that if you install both packages you can just load `library(gssr)`, but if you don't want to load `gssrdoc` you can still query it at the console with e.g. `??polviews` or `?gssrdoc::fefam`. 
