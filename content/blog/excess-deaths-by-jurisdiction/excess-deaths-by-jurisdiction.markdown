---
title: "Excess Deaths by Jurisdiction"
date: 2020-10-08T20:41:32-04:00
categories: [Sociology,R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Although yesterday's [excess deaths plots by cause graph](https://kieranhealy.org/blog/archives/2020/10/06/excess-deaths-by-cause/) was for the whole of the United States only, the table we made did the same calculations on the whole CDC dataset, so the resulting `df_excess` table has numbers for all U.S. states and several other jurisdictions, such as New York City. 

{{< code r >}}

> df_excess   
## # A tibble: 4,428 x 9
## # Groups:   jurisdiction, cause [810]
##    jurisdiction cause        year deaths baseline baseline_sd  excess pct_excess pct_sd
##    <chr>        <chr>       <dbl>  <dbl>    <dbl>       <dbl>   <dbl>      <dbl>  <dbl>
##  1 Alabama      All Cause    2015  24261   25278         750. -1017       -4.19    2.97
##  2 Alabama      All Cause    2016  24864   25278         750.  -414       -1.67    2.97
##  3 Alabama      All Cause    2017  25413   25278         750.   135        0.531   2.97
##  4 Alabama      All Cause    2018  25621   25278         750.   343        1.34    2.97
##  5 Alabama      All Cause    2019  26231   25278         750.   953        3.63    2.97
##  6 Alabama      All Cause    2020  30278   25278         750.  5000       16.5     2.97
##  7 Alabama      Alzheimer's  2015   1014    1152.        101.  -138.     -13.6     8.75
##  8 Alabama      Alzheimer's  2016   1110    1152.        101.   -42.2     -3.80    8.75
##  9 Alabama      Alzheimer's  2017   1204    1152.        101.    51.8      4.30    8.75
## 10 Alabama      Alzheimer's  2018   1150    1152.        101.    -2.2     -0.191   8.75
## # … with 4,418 more rows
 
{{< /code >}}

This means we can make similar plots for these jurisdictions. Making a multi-panel plot for all the states _and_ all the causes would be a little too much, though. Instead, here are two graphs. First, we can look at excess deaths for a number of causes but just for ten or so states with large populations. 

{{% figure src="/files/misc/excess_by_selected_cause_jurisdiction.png" alt="" caption="Excess mortality across a number of causes by selected jurisdictions." %}}

I include All Cause mortality, i.e. all recorded deaths, along with the more specific causes. 

Next, for all-cause mortality only, here are all the jurisdictions arranged from high to low average total mortality across the period, which is essentially a proxy for overall population size.

{{% figure src="/files/misc/excess_all_cause_by_jurisdiction.png" alt="" caption="Excess all-cause mortality by jurisdictions." %}}

In addition to the clear patterns for this year, there are a couple of other things to note about the jurisdiction-level numbers. First, the smaller the population of a place the noisier the numbers are going to be, which is why we stick to All Cause mortality. Second, even here there are some issues. Wisconsin, for instance, has some strange periodic dips in its 2015-2019 numbers that clearly seem to be reporting or recording problems. Feel free to tell me what's happening with mortality reporting in the state if you know. The upshot here is that one of the years has one data point radically below the average number of deaths, which pulls the range of the state way out of line. Second, there are also data reporting issues for this year in at least North Carolina, Connecticut, and West Virginia. These states have been lagging more than average in their reporting of recent deaths since around July or August, and it is artificially suppressing their excess mortality numbers. I expect these numbers to shift as time goes on. 

Beyond that though, the devastating impact of COVID-19 on mortality in the United States is absolutely obvious by now. That shock has hit right across the United States, too, though of course much moreso in some places than in others. 
