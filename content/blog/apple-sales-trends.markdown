---
date: "2015-04-28"
title: Apple Sales Trends
categories: [Economics,Apple,Visualization]
---

Another Twitter conversation, this time in the evening. Dr Drang put up a [characteristically sharp post](http://leancrew.com/all-this/2015/04/moving-averages-and-the-ipad/) looking at sales trends in Apple Macs, iPhones, and iPads. He used moving averages to show long-term sales trends effectively, and he made a convincing argument that iPad sales are in decline. I ended up grabbing the sales data myself from [barefigur.es](https://barefigur.es) and more or less copying him. Instead of a moving average, here's a plot of the trends showing the individual sales figures with a [LOESS smoother](http://en.wikipedia.org/wiki/Local_regression) fitted to them. 

{{% figure src="http://kieranhealy.org/files/misc/apple-sales-trends.png" alt="Sales trends for Apple products." caption="Quarterly sales data for Apple Macs, iPhones, and iPads." %}}

The story is essentially the same as the good Doctor's. Even though Mac sales have been growing, it's hard to see that from the plot because the other products are on a different order of magnitude in sales. Here's the Mac growth by itself (and for a longer time period).

{{% figure src="http://kieranhealy.org/files/misc/apple-sales-trends-mac.png" alt="Sales trends for Macs." caption="Quarterly sales data for Apple Macs." %}}

Finally, using R's `stl` function we can [decompose the various time series](https://stat.ethz.ch/R-manual/R-devel/library/stats/html/stl.html) into Seasonal, Trend, and Residual components. I haven't played with the various tweaks and options possible here, but this is what the default looks like for the iPad:

{{% figure src="http://kieranhealy.org/files/misc/apple-ipad-decomposition.png" alt="iPad STL decomposition." caption="STL decomposition for iPad sales." %}}

Again, Dr Drang's initial views are confirmed. Here's the iPhone:

{{% figure src="http://kieranhealy.org/files/misc/apple-iphone-decomposition.png" alt="iPhone STL decomposition." caption="STL decomposition for iPhone sales." %}}

Note the much stronger seasonality here. (Also note that the time periods covered are not the same, as the iPhone has been on the market for longer.) Finally, covering the longest time-period of all, here's the Mac decomposition:

{{% figure src="http://kieranhealy.org/files/misc/apple-mac-decomposition.png" alt="iPhone STL decomposition." caption="STL decomposition for iPhone sales." %}}

Here again---even moreso---this initial glance at the data (and I stress it's a glance) suggests the seasonality of Mac sales is also increasing over time. I don't follow the analyst chatter closely enough to say whether this is a well-recognized phenomenon or whether I need to tweak something myself. If you're interested, the code and data [are on Github](https://github.com/kjhealy/apple/blob/master/apple.r).
