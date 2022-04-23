---
title: "Get Apple's Mobility Data"
date: 2020-05-23T13:11:14-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---


I've been maintaining [covdata](https://kjhealy.github.io/covdata/), an R package with a variety of COVID-related datasets in it. That means I've been pulling down updated files from various sources every couple of days. Most of these files are at static locations. While their internal structure may change occasionally, and maybe they've moved once or twice at most since I started looking at them, they're generally at a stable location. [Apple's Mobility Data](https://www.apple.com/covid19/mobility) is an exception. The URL for the CSV file changes daily, and not just by incrementing the date or something like that. Instead the file path is a function of whatever version the web CMS is on, and its versioning moves around. Worse, the webpage is dynamically generated in Javascript when it's requested, which means we can't easily scrape it and just look for the URL embedded in the "Download the Data" button. 

I resigned myself to doing the update manually for a bit, and then I got stuck in the weeds of using a headless browser from within R that could execute the Javascript and thus find the URL. But this was a huge pain. When I lamented my situation on Twitter, David Cabo pointed out to me that there's an `index.json` file that's stably-located and contains the information I needed to generate the URL of the day. Here's how to do just that, and then pull in the data to a tibble.

The `index.json` file is just a string of metadata. It looks like this:

{{< code json >}}

{"basePath":"/covid19-mobility-data/2008HotfixDev38/v3",
 "mobilityDataVersion":"2008HotfixDev38:2020-05-21",
 "regions":{"en-us":{"jsonPath":"/en-us/applemobilitytrends.json",
                     "localeNamesPath":"/en-us/locale-names.json",
                     "csvPath":"/en-us/applemobilitytrends-2020-05-21.csv",
                     "initialPath":"/en-us/initial-data.json",
                     "shards":{"defaults":"/en-us/shards/defaults.json"}}}}

{{< /code >}}


So, we grab this file (whose URL we know) and extract the information we want about the `basePath` and `csvPath` that point to the data:

{{< code r >}}

get_apple_target <- function(cdn_url = "https://covid19-static.cdn-apple.com",
                             json_file = "covid19-mobility-data/current/v3/index.json") {
  tf <- tempfile(fileext = ".json")
  curl::curl_download(paste0(cdn_url, "/", json_file), tf)
  json_data <- jsonlite::fromJSON(tf)
  paste0(cdn_url, json_data$basePath, json_data$regions$`en-us`$csvPath)
}

## > get_apple_target()
## [1] "https://covid19-static.cdn-apple.com/covid19-mobility-data/2008HotfixDev38/v3/en-us/applemobilitytrends-2020-05-21.csv"

{{< /code >}}

Then we can grab the data itself, with this function:

{{< code r >}}

get_apple_data <- function(url = get_apple_target(),
                             fname = "applemobilitytrends-",
                             date = stringr::str_extract(get_apple_target(), "\\d{4}-\\d{2}-\\d{2}"),
                             ext = "csv",
                             dest = "data-raw/data",
                             save_file = c("n", "y")) {

  save_file <- match.arg(save_file)
  message("target: ", url)

  destination <- fs::path(here::here("data-raw/data"),
                          paste0("apple_mobility", "_daily_", date), ext = ext)

  tf <- tempfile(fileext = ext)
  curl::curl_download(url, tf)

  ## We don't save the file by default
  switch(save_file,
         y = fs::file_copy(tf, destination),
         n = NULL)

  janitor::clean_names(readr::read_csv(tf))
}

{{< /code >}}


This will pull the data into a tibble, which you can then clean further (e.g., put into long format) as desired.

{{< code r >}}

apple <- get_apple_data()

## target: https://covid19-static.cdn-apple.com/covid19-mobility-data/2008HotfixDev38/v3/en-us/applemobilitytrends-2020-05-21.csv
## Parsed with column specification:
## cols(
##   .default = col_double(),
##   geo_type = col_character(),
##   region = col_character(),
##   transportation_type = col_character(),
##   alternative_name = col_character(),
##   `sub-region` = col_character(),
##   country = col_character(),
##   `2020-05-11` = col_logical(),
##   `2020-05-12` = col_logical()
## )
## See spec(...) for full column specifications.

apple

### A tibble: 3,625 x 136
##   geo_type region transportation_… alternative_name sub_region country x2020_01_13 x2020_01_14 x2020_01_15
##   <chr>    <chr>  <chr>            <chr>            <chr>      <chr>         <dbl>       <dbl>       <dbl>
## 1 country… Alban… driving          NA               NA         NA              100        95.3       101. 
## 2 country… Alban… walking          NA               NA         NA              100       101.         98.9
## 3 country… Argen… driving          NA               NA         NA              100        97.1       102. 
## 4 country… Argen… walking          NA               NA         NA              100        95.1       101. 
## 5 country… Austr… driving          AU               NA         NA              100       103.        104. 
## 6 country… Austr… transit          AU               NA         NA              100       102.        101. 
## 7 country… Austr… walking          AU               NA         NA              100       101.        102. 
## 8 country… Austr… driving          Österreich       NA         NA              100       101.        104. 
## 9 country… Austr… walking          Österreich       NA         NA              100       102.        106. 
##10 country… Belgi… driving          België|Belgique  NA         NA              100       101.        107. 
### … with 3,615 more rows, and 127 more variables: x2020_01_16 <dbl>, x2020_01_17 <dbl>, x2020_01_18 <dbl>,
###   x2020_01_19 <dbl>, x2020_01_20 <dbl>, x2020_01_21 <dbl>, x2020_01_22 <dbl>, x2020_01_23 <dbl>,
###   x2020_01_24 <dbl>, x2020_01_25 <dbl>, x2020_01_26 <dbl>, x2020_01_27 <dbl>, x2020_01_28 <dbl>,
###   x2020_01_29 <dbl>, x2020_01_30 <dbl>, x2020_01_31 <dbl>, x2020_02_01 <dbl>, x2020_02_02 <dbl>,
###   x2020_02_03 <dbl>, x2020_02_04 <dbl>, x2020_02_05 <dbl>, x2020_02_06 <dbl>, x2020_02_07 <dbl>,
###   x2020_02_08 <dbl>, x2020_02_09 <dbl>, x2020_02_10 <dbl>, x2020_02_11 <dbl>, x2020_02_12 <dbl>,
###   x2020_02_13 <dbl>, x2020_02_14 <dbl>, x2020_02_15 <dbl>, x2020_02_16 <dbl>, x2020_02_17 <dbl>,
###   x2020_02_18 <dbl>, x2020_02_19 <dbl>, x2020_02_20 <dbl>, x2020_02_21 <dbl>, x2020_02_22 <dbl>,
###   x2020_02_23 <dbl>, x2020_02_24 <dbl>, x2020_02_25 <dbl>, x2020_02_26 <dbl>, x2020_02_27 <dbl>,
###   x2020_02_28 <dbl>, x2020_02_29 <dbl>, x2020_03_01 <dbl>, x2020_03_02 <dbl>, x2020_03_03 <dbl>,
###   x2020_03_04 <dbl>, x2020_03_05 <dbl>, x2020_03_06 <dbl>, x2020_03_07 <dbl>, x2020_03_08 <dbl>,
###   x2020_03_09 <dbl>, x2020_03_10 <dbl>, x2020_03_11 <dbl>, x2020_03_12 <dbl>, x2020_03_13 <dbl>,
###   x2020_03_14 <dbl>, x2020_03_15 <dbl>, x2020_03_16 <dbl>, x2020_03_17 <dbl>, x2020_03_18 <dbl>,
###   x2020_03_19 <dbl>, x2020_03_20 <dbl>, x2020_03_21 <dbl>, x2020_03_22 <dbl>, x2020_03_23 <dbl>,
###   x2020_03_24 <dbl>, x2020_03_25 <dbl>, x2020_03_26 <dbl>, x2020_03_27 <dbl>, x2020_03_28 <dbl>,
###   x2020_03_29 <dbl>, x2020_03_30 <dbl>, x2020_03_31 <dbl>, x2020_04_01 <dbl>, x2020_04_02 <dbl>,
###   x2020_04_03 <dbl>, x2020_04_04 <dbl>, x2020_04_05 <dbl>, x2020_04_06 <dbl>, x2020_04_07 <dbl>,
###   x2020_04_08 <dbl>, x2020_04_09 <dbl>, x2020_04_10 <dbl>, x2020_04_11 <dbl>, x2020_04_12 <dbl>,
###   x2020_04_13 <dbl>, x2020_04_14 <dbl>, x2020_04_15 <dbl>, x2020_04_16 <dbl>, x2020_04_17 <dbl>,
###   x2020_04_18 <dbl>, x2020_04_19 <dbl>, x2020_04_20 <dbl>, x2020_04_21 <dbl>, x2020_04_22 <dbl>,
###   x2020_04_23 <dbl>, x2020_04_24 <dbl>, …
##
{{< /code >}}

