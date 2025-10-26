---
title: "TSA Screening Volume and Epiweeks"
date: 2025-02-20T19:42:59-05:00
categories: [visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

{{% figure src="tsa_volumes_daily.png" alt="" caption="Should I take my laptop out or not?" class="full-width" %}}

I drew a [picture of Subway ridership volume](https://kieranhealy.org/blog/archives/2025/02/19/mta-ridership/) yesterday, in the wake of some absurdly disingenuous official statements about New York City's congestion pricing scheme somehow restricting New York to a "small elite". The Subway has higher daily throughput than every TSA Airport in the United States combined. (And, even now, ridership remains down from pre-COVID levels.) So I put in TSA traveler screening volumes on the MTA graph for comparison, just to help make the point. 

The TSA makes daily checkpoint counts available back to January 2019 on its website. I imagine more data is available elsewhere. Plotting this series by itself, as shown above, provides a nice picture what the pandemic did to the world. A six year daily time-series means it is possibly the least mobile-friendly graphic I have ever made. Main lesson: COVID-19 really did a number on everyone; perhaps you have heard about it. 

Because this is daily data over six years, we can see the fine-grain of the time series in, for instance, periodic fluctuations in the pulse of workday vs weekend travel, and also the difference between travel rates on days of the work week. For instance, here's the first two weeks of October 2019:

{{% figure src="tsa_volumes_daily_sample.png" alt="" caption="Don't travel on Fridays" %}}

We could also [decompose](https://kieranhealy.org/blog/archives/2023/12/20/the-baby-boom-again/) the series into its various components if we wanted to. But for our purposes here we're just interested in a simple total of the number of travelers going through TSA checkpoints each week. 

This is trickier than it seems. For time series that are both fine-grained and of long duration we have to be a bit careful when we aggregate by a unit like the week. On what day does the week start? (The leading choices are Sunday or Monday.) Also, more importantly, what do we do with the fragments of weeks that occur more often than not at the start and end of the year? We will end up with "weeks" of our data representing just one or two actual days. For instance, if we have our TSA data with a `count` column and a `date` column in proper [ISO-8601](https://www.iso.org/iso-8601-date-and-time-format.html) date format, we can extract the year and the calendar weeks from the dates, like this:

{{< code r >}}
tsa |>
  mutate(week = week(date),
         year = year(date))
#> # A tibble: 2,224 × 5
#>    date       mode         count  week  year
#>    <date>     <chr>        <dbl> <dbl> <dbl>
#>  1 2025-02-01 tsa_volume 1791123     5  2025
#>  2 2025-01-31 tsa_volume 2272211     5  2025
#>  3 2025-01-30 tsa_volume 2217849     5  2025
#>  4 2025-01-29 tsa_volume 1792491     5  2025
#>  5 2025-01-28 tsa_volume 1599137     5  2025
#>  6 2025-01-27 tsa_volume 2088017     5  2025
#>  7 2025-01-26 tsa_volume 2302112     5  2025
#>  8 2025-01-25 tsa_volume 1785853     4  2025
#>  9 2025-01-24 tsa_volume 2257748     4  2025
#> 10 2025-01-23 tsa_volume 2158117     4  2025
#> # ℹ 2,214 more rows
{{< /code >}}

Each row here is a day. We want to group the rows by `year` and `week` and sum the `count` column to get our weekly total traffic. But when we do that, we find our graph looks like this:

{{% figure src="tsa_volumes_noepi_wkly.png" alt="Aiee" caption="Sudden dips due to short weeks at the end of the year." %}}

The time series craters suddenly at the end of the year or the beginning of a new year because it's showing a "weekly" value that was summed over just a few actual days, perhaps just one. Let's go back and take a look at how we divvied up the weeks. This time, instead of summing our counts we'll just tally the rows within each group---i.e. find the number of days that were actually in each "week" we made. I'll just focus in on the end of 2019 and beginning of 2020:

{{< code r >}}
tsa |>
  mutate(week = week(date),
         year = year(date)) |> 
  filter(date > ymd("2019-12-02") & date < ymd("2020-01-15")) |> 
  arrange(date) |> 
  group_by(year, week) |>
  tally()
#> # A tibble: 7 × 3
#> # Groups:   year [2]
#>    year  week     n
#>   <dbl> <dbl> <int>
#> 1  2019    49     7
#> 2  2019    50     7
#> 3  2019    51     7
#> 4  2019    52     7
#> 5  2019    53     1
#> 6  2020     1     7
#> 7  2020     2     7
{{< /code >}}

Weeks 49 through 52 of 2019 all have seven days in them. But our calendar week method has left us with a "week" at the end of 2019 (week 53) that is only one day long. But when we group and sum our counts, it is a week like all the others, despite having six fewer counts in it. Hence the giant crater when we graph it. 

To get around this problem, we need a rule that ensures every week of the year has seven days in it. Inevitably, there is more than one standard for doing this. Most of the rest of the world uses the ISO Week, or isoweek. The United States uses the CDC's Epidemiological Week, or epiweek. They disagree on which day the week starts. The ISO Week convention says Monday. The epiweek convention says Sunday. But the rule for counting weeks is otherwise the same. You just pop over into the adjacent year and steal days from there. The first epiweek of the year ends on the first Saturday of January, as long as that day falls at least four days into the month. This means the first epiweek of a year can begin in the last calendar week of the previous year. 

Reconciling ISO weeks and epiweeks is _mostly_ straightforward, but of course also kind of a pain in the neck. The same calendar Sunday will generally be in different isoweeks and epiweeks ... unless January 1st falls on a Thursday, in which case *only* Sundays will have the _same_ week number between the two systems that year. Oy. 

Anyway, if we use `epiweek()` and `epiyear()` instead of `week()` and `year()` to construct our weekly series from our daily one, then we ensure by definition that all of our weeks have seven days in them, which gives us the continuity we want for plotting our weekly series. If we remake the plot, it looks like this:

{{% figure src="tsa_volumes_wkly.png" alt="" caption="Smooth sailing. Or flying. You know what I mean." class="full-width" %}}

And now we have a smooth (epi)weekly series aggregated from our daily data.
