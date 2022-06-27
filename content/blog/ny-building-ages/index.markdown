---
title: "New York Building Ages"
date: 2022-06-24T14:10:36-04:00
categories: [visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Following up on [yesterday's first cut](https://kieranhealy.org/blog/archives/2022/06/23/manhattan-building-heights/) at a map of Manhattan's buildings by height, which I'll be revisiting soon, here are two maps of the city's building's by age. First for Manhattan alone and then for the whole of New York City. The latter one is quite compressed, unfortunately, as it contains data on every building footprint in the city.

{{% figure src="https://kieranhealy.org/files/misc/manhattan_ages_po.png" alt="Manhattan's buildings by decade of construction" caption="Manhattan Buildings by Nearest Decade of Construction." %}}



{{% figure src="https://kieranhealy.org/files/misc/nyc_ages_po.png" alt="New York City's buildings by decade of construction." caption="New York City buildings by Decade of Construction." %}}

As before, the data from from New York's Open Data Initiative and were made with `R`, `ggplot`, and the `sf` package.
