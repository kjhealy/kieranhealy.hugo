---
date: 2015-12-15T08:21:27-05:00
title: Redrawing a Bad Slide
categories: [Data, Visualization, Nerdery]
---

Marissa Mayer's performance as CEO of Yahoo has been criticized by various people. Yesterday, Eric Jackson, an investment fund manager, sent a 99-slide presentation to Yahoo's board outlining his best case against Mayer.  Paging through the presentation/hatchet-job gives some insight into what passes for analysis in the world of corporate investment and finance. I'm not too interested in the details. From a design and communication point of view, though, the slides are generally terrible.

It's not that I dislike slides. Slide presentations are a very useful means of communication. I firmly believe most people who complain about "Death by PowerPoint" have not sat through enough talks where the presenter hasn't even bothered to prepare slides. But it's striking to see how fully the slide deck has escaped its origins as an aid to communication and metastasized into a freestanding quasi-format. Business, the Military, and Academia have all been infected by this tendency in various ways. Never mind taking the time to write a memo or an article, just give us endless pages of bullet points and charts. The disorienting effect is one of constant summary of a discussion that never took place.

I ended up taking a closer look at some of the slides that present data. Here's a typical example.

{{% figure src="http://www.kieranhealy.org/files/misc/springowl.jpg" caption="What Fresh Hell Is This?" %}}

The slide seems to want to say something about the relationship between Yahoo's number of employees and its revenue. The natural thing to do in that case would be to make some kind of scatterplot to see if there was a relationship between these variables. Instead, though, the slide puts time on the x-axis and uses two y-axes to show the employee and revenue data. It plots the revenues as a bar chart and the employee data as points connected by slightly wavy lines. It's not clear whether the connecting line segments are just manually added or if there's some principle underlying the wiggles. The revenue values are used as labels within the bars. The points are not labeled. Employee data goes to 2015 but revenue data only to 2014. An arrow points to the date Mayer was hired as CEO, and a red dotted line seems to indicate ... actually I'm not sure. Maybe some sort of threshold below which employee numbers should fall? Or maybe just the last observed value, to allow comparison across the series? I don't know. Finally, you'll also notice that while the revenue numbers are annual, there is more than one observation per year for some of the later employee numbers. A bit of googling around leads me to believe that the person who made this graph got their data [from this time series](https://atlas.qz.com/charts/41iiceqt), which matches the values and number of observations in the chart. More recent years have quarterly employee data.

How should we redraw this chart? Let's focus on getting across the relationship between employee numbers and revenue, as that seems to be the motivation for it in the first place. As a secondary element, we want to say something about Mayer's role in this relationship. The original sin of the slide is that it plots two series of numbers using two different y-axes, something there is almost never a good reason to do. If you ask me, I think this happened because of the [absolute fixation on trends](http://kieranhealy.org/blog/archives/2015/07/22/apple-sales-trends-q2-2015/) that's characteristic of business analysts. Time is almost the only thing they ever put on the x-axis.

To redraw the chart I took the numbers from the bars on the chart together with the employee data [from the source I mentioned](https://atlas.qz.com/charts/41iiceqt). Where there was quarterly data I used the end-of-year number for employees, except for 2012. Mayer was appointed in July of 2012. Ideally we would have quarterly revenue and quarterly employee data for all years, but given that we don't the most sensible thing to do is to keep things annualized except for the one year of interest, when Mayer arrives as CEO. It's worth doing this because otherwise the large round of layoffs that immediately preceded her arrival would be misattributed to her tenure as CEO. So we have two observations for 2012 in the plot. They have the same revenue data but different employee data.

{{% figure src="http://www.kieranhealy.org/files/misc/yahoo-employees-revenue-1.png" caption="Yahoo Employees vs Revenue, version 1." %}}

We plot the employee vs revenue relationship as points, put in a linear regression line showing the association (standard error range in gray), and color the points based on whether Mayer was CEO. From this figure it looks like Mayer's years as CEO are associated with lower than average numbers on both revenue and employees.

Because the data are a time series---especially because there aren't that many observations---it's useful to keep that element visible somehow in the chart. The original slide did this by putting time on the x-axis, but that led to all kinds of problems. Instead, we can keep the scatterplot axes but use line segments to "join the dots" of the yearly observations in order, labeling each point with its year. The result is a plot that shows the trajectory of the company over time, like a snail moving across a flagstone. Again, we have two observations for 2012.

{{% figure src="http://www.kieranhealy.org/files/misc/yahoo-employees-revenue-2.png" caption="Yahoo Employees vs Revenue, version 2." %}}

This way of looking at the data suggests---as is common when new CEOs arrive at companies---that Mayer was appointed after a period of falling revenues and just following a very large round of layoffs. Since then, either through new hires or acquisitions, employee numbers have crept back up a little while revenues have continued to fall. I think this version conveys what the original slide was trying to get across, just rather more clearly. 

Finally, as suggested by Dan Davies, we can make the analysis community happy by putting time back on the x-axis and plotting the ratio of revenue to employees on the y-axis. This gives us the all-important trend back, only sensibly this time.

{{% figure src="http://www.kieranhealy.org/files/misc/yahoo-employees-revenue-3.png" caption="Yahoo Employees vs Revenue, version 3." %}}

There are other ways to represent this data. If you want to try yourself, or just see what I did, the R code and data [are available on GitHub](https://github.com/kjhealy/yahoo).
