---
author: kjhealy
date: "2004-09-08"
#layout: post
slug: iem-analysis-spitnpolish-dept
status: publish
title: IEM Analysis Spit'n'Polish Dept
wordpress_id: '692'
categories:
- Misc
---

As a spin-off from Daniel's discussion of [whether the DEM04 contract is overvalued](http://www.crookedtimber.org/archives/002460.html) on the [Iowa Electronic Markets](http://128.255.244.60/graphs/graph_Pres04_WTA.cfm), here's a version of the trend surface he calculated that shows [differences between the Black-Scholes valuation and the observed market price](http://www.kieranhealy.org/files/misc/dem04.pdf) over time (you can look at it in smaller [PNG](http://www.kieranhealy.org/files/misc/dem04.png) format or better-quality [PDF](http://www.kieranhealy.org/files/misc/dem04.pdf)). I created it using [R](http://www.r-project.org/), the free[1] statistics package because I [didn't like Excel's default effort](http://www.crookedtimber.org/archives/kerrychart2/surface.JPG) and I hadn't had a reason to use R's `wireframe()` function before. It's still not up to the standards of the [Bill Clevelands](http://cm.bell-labs.com/cm/ms/departments/sia/wsc/) or [Ed Tuftes](http://www.edwardtufte.com/) of this world, but it was the best I could manage on short notice. Thanks to Daniel for sending me the data, and remember that whereas I am happy to field questions about graph colors and chart widgets, technical queries about option valuation, Black-Scholes volatility fluctuations and arbitrage should still be directed to him.

fn1. As in "free to make your own mistakes."
