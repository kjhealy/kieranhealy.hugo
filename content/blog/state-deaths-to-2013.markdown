---
date: 2015-12-03T12:08:00-05:00
categories: [Data, Sociology, News, Visualization]
title: Assault Death Rates in the United States 1999-2013
---

Having recently revisited plots of some [international comparative data](http://kieranhealy.org/blog/archives/2015/10/01/assault-death-rates-1960-2013/) on assault death rates in the OECD, here's a quick update to the [state- and region-level plots](http://kieranhealy.org/blog/archives/2012/07/21/assault-deaths-within-the-united-states/) for assault deaths within the United States. [CDC Wonder data](http://wonder.cdc.gov/) now goes up to 2013, so if we query that for adjusted death rates due to assault (based on ICD-10 codes X85-Y09 and Y87.1) we can make some new plots. Here's a boxplot of the yearly trends across states, with some high-rate outliers marked. We don't mark the low-rate outliers as things are complicated there by states where the crude number of assault deaths is so low that it's not possible to construct reliable age-adjusted estimates. This tends to happen in North and South Dakota, Wyoming, Vermont, New Hampshire, and Maine.

{{% figure src="https://www.kieranhealy.org/files/misc/state-assault-boxplots.png" caption="Assault Death rates in US States, 1999-2013." alt="Assault Death rates in US States, 1999-2013." %}}

[(PDF)](http://www.kieranhealy.org/files/misc/state-assault-boxplots.pdf)

As you can see the range of variation is quite wide. We can break out out the boxplots by census regions to get a better sense of it.

{{% figure src="https://www.kieranhealy.org/files/misc/state-assault-boxplots-region.png" caption="Assault Death rates in US States, by Census Region, 1999-2013." alt="Assault Death rates in US States, by Census Region, 1999-2013." %}}

[(PDF)](http://www.kieranhealy.org/files/misc/state-assault-boxplots-region.pdf)

Far more people die of assault in the South, and especially the Deep South, than elsewhere in the country. But as in the [earlier plots](http://kieranhealy.org/blog/archives/2012/07/21/assault-deaths-within-the-united-states/), it's worth remembering that, in comparison to other OECD countries, even the placid Northeast is several times more violent than any other OECD country, except Mexico.

Here's another view of the same data, showing the regional averages (the thick lines) and the individual state trends (the dotted lines). 

{{% figure src="https://www.kieranhealy.org/files/misc/state-assault-lineplots.png" caption="Assault Death rates in US States, by Census Region, 1999-2013." alt="Assault Death rates in US States, by Census Region, 1999-2013." %}}

[(PDF)](http://www.kieranhealy.org/files/misc/state-assault-lineplots.pdf)

And finally here's a small-multiple for each state, ordered from highest to lowest median rate over the period. Notice that for some of the small states mentioned above, estimates are not available and aren't plotted.

{{% figure src="https://www.kieranhealy.org/files/misc/state-assault-sm.png" caption="Assault Death rates in US States, 1999-2013." alt="Assault Death rates in US States, 1999-2013." %}}

[(PDF)](http://www.kieranhealy.org/files/misc/state-assault-sm.pdf)
