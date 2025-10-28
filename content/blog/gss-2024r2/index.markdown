---
title: "GSS Release"
date: 2025-10-28T11:14:15-04:00
categories: [Sociology,R]
footnotes: false
htmlwidgets: false
mathjax: false
image: gss-immigration.png
---


{{% figure src="gss-immigration.png" alt="GSS immigration question" caption="Trends in the `immameco` question." %}}

Release 2 of the 2024 GSS cross-section and 1972-2024 culumative data are [now available](https://gss.norc.org/get-the-data.html). I've updated [`gssr`](https://kjhealy.github.io/gssr/) and [`gssrdoc`](https://kjhealy.github.io/gssrdoc/) to incorporate them. There are quite a few changes in the data and variables, thanks in part to some changes in data collection methods and a privacy/disclosure review. 

The `gssr` and `gssrdoc` packages are the nicest way to get General Social Survey data up and running in R. The figure above shows (survey-weighted) trends derived from the [`immameco`](https://kjhealy.github.io/gssrdoc/reference/immameco.html) question. 
