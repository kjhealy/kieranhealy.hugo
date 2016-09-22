---
date: 2016-09-12T15:48:02-04:00
title: Vaccination Beeplot
categories: [Visualization,Data,Sociology]
---

Last year I wrote about [vaccination exemptions in California kindergartens](https://kieranhealy.org/blog/archives/2015/02/03/another-look-at-the-california-vaccination-data/), drawing on school-level data provided by the state of California about the number of kindergarteners with "personal belief exemptions" (or PBEs) that allow them not to be vaccinated. Today I came across a ggplot package called [ggbeeswarm](https://github.com/eclarke/ggbeeswarm) that's designed to create a "beeswarm plot", or a 1-D scatterplot with a bit of information about the density of the distribution. I had used `geom_jitter` to do something like this for one of my plots last year, but the geoms in ggbeeswarm are  better. I revisited the vaccination data and redrew the plot. The code is at the end of [the original repository](https://github.com/kjhealy/vaccines-ca). 

{{% figure src="https://kieranhealy.org/files/misc/pbe-by-school-type-bee.jpg" alt="California Kindergarten PBE Rates by Type of School, 2014-2015" caption="California Kindergarten PBE Rates by Type of School, 2014-15." %}}

There's a [PDF available](http://kieranhealy.org/files/misc/pbe-by-school-type-bee.pdf) as well.

As a reminder, each circle is a school, and each circle shows kindergarten enrollments, not the overall school size. 

