---
author: kjhealy
date: "2009-01-02"
#layout: post
slug: visualizing-wpa-spending
status: publish
title: Visualizing WPA Spending
wordpress_id: '1448'
categories:
- Data
---

Over on the Edge of the American West, Eric has been working up some graphs on what the WPA spent its money on. Eric's [own presentation of the data](http://edgeofthewest.files.wordpress.com/2008/12/wpabillions.jpg) showed clearly that the WPA spent much more of money on highways roads and streets than anything else—so much so, in fact, that graphing it directly obscured some of the variation across the other categories. There was [some discussion](http://edgeofthewest.wordpress.com/2008/12/30/tufte-i-aint/). My own view in that conversation was (a) that dotplots were preferable to barcharts, and, more substantively, (b) that if you wanted to hone in on the smaller categories, it would be easiest to graph them separately, having established "Highways, roads and streets" as the predominant focus of spending.

But there's always the temptation to try to capture everything at once, and clearly. So [Duncan Agnew followed up](http://edgeofthewest.wordpress.com/2008/12/31/presents/) with a [very nice bit of work](http://edgeofthewest.files.wordpress.com/2008/12/wpaplot.png) that took advantage of two colors to plot two scales on a dotplot, one to show the main distribution (on a billion-dollar scale) and one to better show the smaller categories (in millions of dollars). Dogmatism about principles of data visualization is no great virtue, and Duncan shows that you can break the rule that you shouldn't have two scales on the same axis and still have a readable chart. But what if we wanted not to break the rule, and plot only one series? In that case the obvious thing would be to take the log of the data to bring the observations more neatly into line. The cost is that you lose the initial point of the exercise, which was to show how much more spending there was on roads than on any other category. But those detail-obsessed historians wanted to be able to see the fine grain of the other kinds of expenditure. So maybe the thing to do is to artificially partition the graph into panels based on the order of magnitude of spending, plot the range within each order of magnitude, with header at the top of each panel to remind the reader what sort of scale they are looking at. That way we can see the detail of the smaller categories without wholly forgetting they are very much smaller than the largest. And here it is:

[![WPA expenditure](http://www.kieranhealy.org/files/misc/WPAexpenditure.png)](http://www.kieranhealy.org/files/misc/WPAexpenditure.png)

Click on the image for a closer look, or [click here](http://www.kieranhealy.org/files/misc/WPAexpenditure.pdf) for a nicer PDF version.

In effect, what I've done here is choose to break a different rule from Duncan. Instead of putting two scales on the same axis, I have made one axis discontinuous between panels, skipping values in order to compress the horizontal size. Hence the reminder at the top of each panel that you're shifting up an order of magnitude each time. Despite the rulebreaking, there's still some principle at work because instead of just putting a discontinuity right at the end (to incorporate the largest value) the panels are split consistently by powers of ten, and it makes sense to think of WPA expenditures as falling into groups like "stuff they spent billions on" versus "stuff they spent tens of millions on" or "stuff they only spent a few million dollars on" and so on. I think it works OK, though of course as always these choices depend on judgments about presenting the data honestly and clearly making the point you want to convey. Bear in mind that this is just one-dimensional data. It's striking how complex even quite simple data can be to present effectively.
