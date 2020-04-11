---
title: "Covdata Package"
date: 2020-04-10T16:27:58-04:00
categories: [R,Sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


{{% figure src="/files/misc/hex-covdata.png" alt="" caption="The covdata logo" %}} 

Partly because it grew out of a few code-throughs I was doing, but mostly as a classroom exercise, I pulled together a small data package for R called [covdata](https://kjhealy.github.io/covdata/index.html), available at <https://kjhealy.github.io/covdata/>. It contains COVID-19 data from three sources: 

- National level data from the [European Centers for Disease Control](https://www.ecdc.europa.eu/en).  
- State-level data for the United States from the [COVID Tracking Project](https://covidtracking.com). 
- State-level and county-level data for the United States from the [_New York Times_](https://github.com/nytimes/covid-19-data). 

I'll keep it up to date for at least the near future. If I get a chance I'll write up a little walkthrough about the process of making a package like this. I find that making data packages for R is both intrinsically useful for data that will be used more than once, and also generally a very accessible and handy way to introduce students to the mechanics of R packaging. It's much more common for regular users of R to have some data that would benefit from packaging than for them to have some set of functions that might usefully be packaged up for other people. 

Here are what the three tables look like, plus a figure at the end.

### Country-Level Data from the ECDC


```r
library(tidyverse)
library(covdata)

covnat
#> # A tibble: 9,858 x 8
#> # Groups:   iso3 [205]
#>    date       cname       iso3  cases deaths  pop_2018 cu_cases cu_deaths
#>    <date>     <chr>       <chr> <dbl>  <dbl>     <dbl>    <dbl>     <dbl>
#>  1 2019-12-31 Afghanistan AFG       0      0  37172386        0         0
#>  2 2019-12-31 Algeria     DZA       0      0  42228429        0         0
#>  3 2019-12-31 Armenia     ARM       0      0   2951776        0         0
#>  4 2019-12-31 Australia   AUS       0      0  24992369        0         0
#>  5 2019-12-31 Austria     AUT       0      0   8847037        0         0
#>  6 2019-12-31 Azerbaijan  AZE       0      0   9942334        0         0
#>  7 2019-12-31 Bahrain     BHR       0      0   1569439        0         0
#>  8 2019-12-31 Belarus     BLR       0      0   9485386        0         0
#>  9 2019-12-31 Belgium     BEL       0      0  11422068        0         0
#> 10 2019-12-31 Brazil      BRA       0      0 209469333        0         0
#> # … with 9,848 more rows
```

### US State-Level Data from the COVID Tracking Project


```r
covus
#> # A tibble: 27,216 x 11
#>    date       state fips  measure count pos_neg death_increase hospitalized_in… negative_increa… positive_increa…
#>    <date>     <chr> <chr> <chr>   <dbl>   <dbl>          <dbl>            <dbl>            <dbl>            <dbl>
#>  1 2020-04-09 AK    02    positi…   235    7223              0                0              146                9
#>  2 2020-04-09 AK    02    negati…  6988    7223              0                0              146                9
#>  3 2020-04-09 AK    02    pending    NA    7223              0                0              146                9
#>  4 2020-04-09 AK    02    hospit…    NA    7223              0                0              146                9
#>  5 2020-04-09 AK    02    hospit…    27    7223              0                0              146                9
#>  6 2020-04-09 AK    02    in_icu…    NA    7223              0                0              146                9
#>  7 2020-04-09 AK    02    in_icu…    NA    7223              0                0              146                9
#>  8 2020-04-09 AK    02    on_ven…    NA    7223              0                0              146                9
#>  9 2020-04-09 AK    02    on_ven…    NA    7223              0                0              146                9
#> 10 2020-04-09 AK    02    recove…    49    7223              0                0              146                9
#> # … with 27,206 more rows, and 1 more variable: total_test_results_increase <dbl>
```

### State-Level and County-Level (Cumulative) Data from the _New York Times_


```r
nytcovstate
#> # A tibble: 2,105 x 5
#>    date       state      fips  cases deaths
#>    <date>     <chr>      <chr> <dbl>  <dbl>
#>  1 2020-01-21 Washington 53        1      0
#>  2 2020-01-22 Washington 53        1      0
#>  3 2020-01-23 Washington 53        1      0
#>  4 2020-01-24 Illinois   17        1      0
#>  5 2020-01-24 Washington 53        1      0
#>  6 2020-01-25 California 06        1      0
#>  7 2020-01-25 Illinois   17        1      0
#>  8 2020-01-25 Washington 53        1      0
#>  9 2020-01-26 Arizona    04        1      0
#> 10 2020-01-26 California 06        2      0
#> # … with 2,095 more rows
```


```r
nytcovcounty
#> # A tibble: 45,880 x 6
#>    date       county      state      fips  cases deaths
#>    <date>     <chr>       <chr>      <chr> <dbl>  <dbl>
#>  1 2020-01-21 Snohomish   Washington 53061     1      0
#>  2 2020-01-22 Snohomish   Washington 53061     1      0
#>  3 2020-01-23 Snohomish   Washington 53061     1      0
#>  4 2020-01-24 Cook        Illinois   17031     1      0
#>  5 2020-01-24 Snohomish   Washington 53061     1      0
#>  6 2020-01-25 Orange      California 06059     1      0
#>  7 2020-01-25 Cook        Illinois   17031     1      0
#>  8 2020-01-25 Snohomish   Washington 53061     1      0
#>  9 2020-01-26 Maricopa    Arizona    04013     1      0
#> 10 2020-01-26 Los Angeles California 06037     1      0
#> # … with 45,870 more rows
```


```r
nytcovcounty %>%
  mutate(uniq_name = paste(county, state)) %>% # Can't use FIPS because of how the NYT bundled cities
  group_by(uniq_name) %>%
  mutate(days_elapsed = date - min(date)) %>%
  ggplot(aes(x = days_elapsed, y = cases, group = uniq_name)) + 
  geom_line(size = 0.25, color = "gray20") + 
  scale_y_log10(labels = scales::label_number_si()) + 
  guides(color = FALSE) + 
  facet_wrap(~ state, ncol = 5) + 
  labs(title = "COVID-19 Cumulative Recorded Cases by US County",
       subtitle = paste("New York is bundled into a single area in this data.\nData as of", format(max(nytcovcounty$date), "%A, %B %e, %Y")),
       x = "Days since first case", y = "Count of Cases (log 10 scale)", 
       caption = "Data: The New York Times | Graph: @kjhealy") + 
  theme_minimal()
#> Don't know how to automatically pick scale for object of type difftime. Defaulting to continuous.
#> Warning: Transformation introduced infinite values in continuous y-axis
```


{{% figure src="/files/misc/nyt-covid-county-sm.png" alt="" caption="County-level plot faceted by state, from the New York Times data." %}} 

