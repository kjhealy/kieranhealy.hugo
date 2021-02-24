---
title: "Covid 19 Tracking"
date: 2020-03-21T15:45:04-04:00
categories: [R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

## Get Your Epidemiology from Epidemiologists

The COVID-19 pandemic continues to rage. I'm strongly committed to what should be the uncontroversial view that we should listen to the recommendations of those institutions and individuals with strong expertise in the relevant fields of Public Health, Epidemiology, Disease Control, and Infection Modeling. I also think that the open availability of data, and the free availability of methods to look at data, is generally a good thing. The tricky part is when these potentially conflict. For example, in a period of crisis it is reasonable to want to find out what's happening and to inform yourself as much as possible about how events are unfolding. People who work with data of some sort will naturally want to look at the available trends themselves. But maybe those same people don't know a great deal about how disease works, or how information about it is collected and processed, or what is likely to happen in a situation like the one we're experiencing. At such times, there's a balance to be struck between using the available tools to come to an informed opinion and recklessly mucking about with data when you don't really know what you're doing. This is especially important when, as is the case now, the Executive response to the crisis in the United States (and in several other countries) has been criminally irresponsible, to the point where even elementary facts about the spread of the disease over the past few months are being distorted. 

Speaking for myself, I definitely want look at what the trends are and I prefer to do so by working directly with the data that official agencies and reliable reporting produces. So in this post I'll show how I'm doing that. But I definitely *don't* want to publicly mess around beyond this. While I might idly fit some models or play with various extrapolations of the data in the privacy of my own home, I'm very conscious that I am not in a position to do this in a professional capacity. So I will firmly set that aside here. There are already many well-qualified people working publicly to actually analyze and model the data, as opposed to looking descriptively at what is happening. For a very good overview of some of the challenges and standard approaches to modeling and forecasting epidemics, read [Rob Hyndman's excellent post](https://robjhyndman.com/hyndsight/forecasting-covid19/). His summary is particularly useful (and cautionary) for anyone coming to the data from e.g. an Econometric or Time Series point of view where it's natural to think in terms of forecasting with lagged variables. 

Anyway, I just want to get an overview of best-available counts of deaths. I'm going to show you how to get the data to draw this graph.

{{% figure src="/files/misc/covid_cumulative_22-03-20.png" alt="Cumulative COVID-19 Deaths" caption="Cumulative COVID-19 Deaths" %}}


## Looking at COVID-19 Data from the European Centers for Disease Control

Each day, the [ECDC](https://www.ecdc.europa.eu) publishes a [a summary spreadsheet of global case and death counts](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide) since the beginning of the epidemic. This is good data collated by an EU-wide agency, and it's what I've been using to keep up with the trends. There are other reliable sources, too, most notably the [Johns Hopkins Coronavirus Dashboard](https://coronavirus.jhu.edu/map.html). Here's what I've been doing to get it into R. Again my principal reason for sharing this code is _not_ to add much of anything on the public side. It's much more of a pedagogical exercise. If you want to look at this data, here's one way to do that. Along the way I'll talk about a few of the things needed to work with the data in a reasonably clean way. Then I'll end up drawing the plot that everyone draws---showing cumulative trends by country in deaths, counted in days since a threshold level of fatalities. 


## Preparation 

First we load some libraries to help us out.

{{< code r >}}

library(tidyverse)
library(lubridate)
library(here)
library(janitor)
library(socviz)
library(ggrepel)
library(paletteer)

{{< /code >}}

Next, we set things up by writing some functions that will help us grab and clean the data. In reality, of course, these functions got written piecemeal and were then cleaned up and moved to the front of the file. I didn't sit down and write them off the top of my head.

The first one is going to grab the spreadsheet from the ECDC and both save the `.xlsx` file to our `data/` folder and create a tibble of the results.

{{< code r >}}

## Download today's excel file, saving it to data/ and reading it in
get_ecdc_data <- function(url = "https://www.ecdc.europa.eu/sites/default/files/documents/",
                          fname = "COVID-19-geographic-distribution-worldwide-", 
                          date = lubridate::today(), 
                          ext = "xlsx", 
                          dest = "data") {
  
  target <-  paste0(url, fname, date, ".", ext)
  message("target: ", target)

  destination <- fs::path(here::here("data"), paste0(fname, date), ext = ext)
  message("saving to: ", destination)
  
  tf <- tempfile(fileext = ext)
  curl::curl_download(target, tf)
  fs::file_copy(tf, destination)
  
  switch(ext, 
  xls = janitor::clean_names(readxl::read_xls(tf)),
  xlsx = janitor::clean_names(readxl::read_xlsx(tf))
  )
}                          

{{< /code >}}

Things to notice: We have to  use `curl_download()` to get the file, because `read_xls` cannot directly grab an Excel file from a URL in the way that e.g. `read_csv()` can for a `.csv` file. So we create a temporary file handle and use `curl` to download the data file to it. Then we copy the file to its permanent home in our `data/` folder, and we read the target file into R with the appropriate `readxl` function.

As we'll see in a moment, the country codes contained in the ECDC data are not quite standard. It will be useful in the long run to make sure that every country has standardized two- and three-letter abbreviations. Some of the countries in the ECDC's `geo_id` variable are missing these. This is a very common situation in data cleaning, where we have a big table with some data we know is missing (e.g., a country code), _and_ we know for sure which cases the data are missing for, _and_ we have a little lookup table that can fill in the blanks. The operation we will need to perform here is called a _coalescing join_. Before I knew that's what it was called, I used to do this manually (I'll show you below). But a little googling eventually revealed both the proper name for this operation and also a very useful function, written by [Edward Visel](https://alistaire.rbind.io) that does [exactly what I want](https://alistaire.rbind.io/blog/coalescing-joins/):

{{< code r >}}

coalesce_join <- function(x, y, 
                          by = NULL, suffix = c(".x", ".y"), 
                          join = dplyr::full_join, ...) {
    joined <- join(x, y, by = by, suffix = suffix, ...)
    # names of desired output
    cols <- dplyr::union(names(x), names(y))
    
    to_coalesce <- names(joined)[!names(joined) %in% cols]
    suffix_used <- suffix[ifelse(endsWith(to_coalesce, suffix[1]), 1, 2)]
    # remove suffixes and deduplicate
    to_coalesce <- unique(substr(
        to_coalesce, 
        1, 
        nchar(to_coalesce) - nchar(suffix_used)
    ))
    
    coalesced <- purrr::map_dfc(to_coalesce, ~dplyr::coalesce(
        joined[[paste0(.x, suffix[1])]], 
        joined[[paste0(.x, suffix[2])]]
    ))
    names(coalesced) <- to_coalesce
    
    dplyr::bind_cols(joined, coalesced)[cols]
}

{{< /code >}}

Next we set up some country codes using ISO2 and ISO3 abbreviations. 

{{< code r >}}

iso3_cnames <- read_csv("data/countries_iso3.csv")
iso2_to_iso3 <- read_csv("data/iso2_to_iso3.csv")

cname_table <- left_join(iso3_cnames, iso2_to_iso3)

cname_table

# A tibble: 249 x 3
   iso3  cname               iso2 
   <chr> <chr>               <chr>
 1 AFG   Afghanistan         AF   
 2 ALA   Åland Islands       AX   
 3 ALB   Albania             AL   
 4 DZA   Algeria             DZ   
 5 ASM   American Samoa      AS   
 6 AND   Andorra             AD   
 7 AGO   Angola              AO   
 8 AIA   Anguilla            AI   
 9 ATA   Antarctica          AQ   
10 ATG   Antigua and Barbuda AG   
# … with 239 more rows
eu <- c("AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA",
        "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD",
        "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE", "GBR")

europe <- c("ALB", "AND", "AUT", "BLR", "BEL", "BIH", "BGR", "HRV", "CYP", "CZE",
        "DNK", "EST", "FRO", "FIN", "FRA", "DEU", "GIB", "GRC", "HUN", "ISL",
        "IRL", "ITA", "LVA", "LIE", "LTU", "LUX", "MKD", "MLT", "MDA", "MCO",
        "NLD", "NOR", "POL", "PRT", "ROU", "RUS", "SMR", "SRB", "SVK", "SVN",
        "ESP", "SWE", "CHE", "UKR", "GBR", "VAT", "RSB", "IMN", "MNE")

north_america <- c("AIA", "ATG", "ABW", "BHS", "BRB", "BLZ", "BMU", "VGB", "CAN", "CYM",
        "CRI", "CUB", "CUW", "DMA", "DOM", "SLV", "GRL", "GRD", "GLP", "GTM",
        "HTI", "HND", "JAM", "MTQ", "MEX", "SPM", "MSR", "ANT", "KNA", "NIC",
        "PAN", "PRI", "KNA", "LCA", "SPM", "VCT", "TTO", "TCA", "VIR", "USA",
        "SXM")

south_america <- c("ARG", "BOL", "BRA", "CHL", "COL", "ECU", "FLK", "GUF", "GUY", "PRY",
                   "PER", "SUR", "URY", "VEN")


africa <- c("DZA", "AGO", "SHN", "BEN", "BWA", "BFA", "BDI", "CMR", "CPV", "CAF",
        "TCD", "COM", "COG", "DJI", "EGY", "GNQ", "ERI", "ETH", "GAB", "GMB",
        "GHA", "GNB", "GIN", "CIV", "KEN", "LSO", "LBR", "LBY", "MDG", "MWI",
        "MLI", "MRT", "MUS", "MYT", "MAR", "MOZ", "NAM", "NER", "NGA", "STP",
        "REU", "RWA", "STP", "SEN", "SYC", "SLE", "SOM", "ZAF", "SHN", "SDN",
        "SWZ", "TZA", "TGO", "TUN", "UGA", "COD", "ZMB", "TZA", "ZWE", "SSD",
        "COD")

asia <- c("AFG", "ARM", "AZE", "BHR", "BGD", "BTN", "BRN", "KHM", "CHN", "CXR",
        "CCK", "IOT", "GEO", "HKG", "IND", "IDN", "IRN", "IRQ", "ISR", "JPN",
        "JOR", "KAZ", "PRK", "KOR", "KWT", "KGZ", "LAO", "LBN", "MAC", "MYS",
        "MDV", "MNG", "MMR", "NPL", "OMN", "PAK", "PHL", "QAT", "SAU", "SGP",
        "LKA", "SYR", "TWN", "TJK", "THA", "TUR", "TKM", "ARE", "UZB", "VNM",
        "YEM", "PSE")

oceania <- c("ASM", "AUS", "NZL", "COK", "FJI", "PYF", "GUM", "KIR", "MNP", "MHL",
        "FSM", "UMI", "NRU", "NCL", "NZL", "NIU", "NFK", "PLW", "PNG", "MNP",
        "SLB", "TKL", "TON", "TUV", "VUT", "UMI", "WLF", "WSM", "TLS")

{{< /code >}}


## Now Actually Get the Data

The next step is to read the data. The file _should_ be called `COVID-19-geographic-distribution-worldwide-` with the date appended and the extension `.xlsx`. But as it turns out there is a typo in the filename. The `distribution` part is misspelled `disbtribution`. I think it must have been introduced early on in the data collection process and so far---possibly by accident, but also possibly so as not to break a thousand scripts like this one---they have not been fixing the typo.

{{< code r >}}

covid_raw <- get_ecdc_data(url = "https://www.ecdc.europa.eu/sites/default/files/documents/",
                           fname = "COVID-19-geographic-disbtribution-worldwide-",
                           ext = "xlsx")
covid_raw

# A tibble: 6,012 x 8
   date_rep              day month  year cases deaths countries_and_t…
   <dttm>              <dbl> <dbl> <dbl> <dbl>  <dbl> <chr>           
 1 2020-03-21 00:00:00    21     3  2020     2      0 Afghanistan     
 2 2020-03-20 00:00:00    20     3  2020     0      0 Afghanistan     
 3 2020-03-19 00:00:00    19     3  2020     0      0 Afghanistan     
 4 2020-03-18 00:00:00    18     3  2020     1      0 Afghanistan     
 5 2020-03-17 00:00:00    17     3  2020     5      0 Afghanistan     
 6 2020-03-16 00:00:00    16     3  2020     6      0 Afghanistan     
 7 2020-03-15 00:00:00    15     3  2020     3      0 Afghanistan     
 8 2020-03-11 00:00:00    11     3  2020     3      0 Afghanistan     
 9 2020-03-08 00:00:00     8     3  2020     3      0 Afghanistan     
10 2020-03-02 00:00:00     2     3  2020     0      0 Afghanistan     
# … with 6,002 more rows, and 1 more variable: geo_id <chr>


{{< /code >}}

That's our base data. The `get_ecdc_data()` function uses `file_copy()` from the `fs` library to move the temporary file to the `data/` folder. It will not overwrite a file if it finds one with that name already there. So if you grab the data more than once a day, you'll need to decide what to do with the file you already downloaded. 

The `geo_id` country code column isn't visible here. We're going to duplicate it (naming it `iso2`) and then join our table of two- and three-letter country codes. It has an `iso2` column as well. 

{{< code r >}}

covid <- covid_raw %>%
  mutate(date = lubridate::ymd(date_rep),
         iso2 = geo_id)

## merge in the iso country names
covid <- left_join(covid, cname_table)

covid

# A tibble: 6,012 x 12
   date_rep              day month  year cases deaths countries_and_t…
   <dttm>              <dbl> <dbl> <dbl> <dbl>  <dbl> <chr>           
 1 2020-03-21 00:00:00    21     3  2020     2      0 Afghanistan     
 2 2020-03-20 00:00:00    20     3  2020     0      0 Afghanistan     
 3 2020-03-19 00:00:00    19     3  2020     0      0 Afghanistan     
 4 2020-03-18 00:00:00    18     3  2020     1      0 Afghanistan     
 5 2020-03-17 00:00:00    17     3  2020     5      0 Afghanistan     
 6 2020-03-16 00:00:00    16     3  2020     6      0 Afghanistan     
 7 2020-03-15 00:00:00    15     3  2020     3      0 Afghanistan     
 8 2020-03-11 00:00:00    11     3  2020     3      0 Afghanistan     
 9 2020-03-08 00:00:00     8     3  2020     3      0 Afghanistan     
10 2020-03-02 00:00:00     2     3  2020     0      0 Afghanistan     
# … with 6,002 more rows, and 5 more variables: geo_id <chr>,
#   date <date>, iso2 <chr>, iso3 <chr>, cname <chr>

{{< /code >}}

At this point we can notice a couple of things about the dataset. For example, not everything in the dataset is a country. This one's a cruise ship:

{{< code r >}}

## Looks like a missing data code
covid %>% 
  filter(cases == -9)

# A tibble: 1 x 12
  date_rep              day month  year cases deaths countries_and_t…
  <dttm>              <dbl> <dbl> <dbl> <dbl>  <dbl> <chr>           
1 2020-03-10 00:00:00    10     3  2020    -9      1 Cases_on_an_int…
# … with 5 more variables: geo_id <chr>, date <date>, iso2 <chr>,
#   iso3 <chr>, cname <chr>

{{< /code >}}

We can also learn, using an `anti_join()` that not all the ECDC's `geo_id` country codes match up with the ISO codes:

{{< code r >}}

anti_join(covid, cname_table) %>%
  select(geo_id, countries_and_territories, iso2, iso3, cname) %>%
  distinct()

# A tibble: 7 x 5
  geo_id   countries_and_territories               iso2    iso3  cname
  <chr>    <chr>                                   <chr>   <chr> <chr>
1 JPG11668 Cases_on_an_international_conveyance_J… JPG116… <NA>  <NA> 
2 PYF      French_Polynesia                        PYF     <NA>  <NA> 
3 EL       Greece                                  EL      <NA>  <NA> 
4 XK       Kosovo                                  XK      <NA>  <NA> 
5 NA       Namibia                                 NA      <NA>  <NA> 
6 AN       Netherlands_Antilles                    AN      <NA>  <NA> 
7 UK       United_Kingdom                          UK      <NA>  <NA> 

{{< /code >}}

Let's fix this. I made a small crosswalk file that can be coalesced into the missing values. In an added little wrinkle, we need to specify the `na` argument in `read_csv` explicity because the missing country codes include Namibia, which has an ISO country code of "NA"! This is different from the missing data code `NA` but `read_csv()` won't know this by default.

{{< code r >}}

cname_xwalk <- read_csv("data/ecdc_to_iso2_xwalk.csv",
                        na = "")

cname_xwalk

# A tibble: 4 x 3
  geo_id iso3  cname         
  <chr>  <chr> <chr>         
1 UK     GBR   United Kingdom
2 EL     GRC   Greece        
3 NA     NAM   Namibia       
4 XK     XKV   Kosovo        

{{< /code >}}

I used to do coalescing like this:

{{< code r >}}

# covid <- covid %>%
#   left_join(cname_xwalk, by = "geo_id") %>% 
#   mutate(iso3 = coalesce(iso3.x, iso3.y),
#          cname = coalesce(cname.x, cname.y)) %>% 
#   select(-iso3.x, -iso3.y, cname.x, cname.y)

{{< /code >}}

Actually, I _used_ to do it using `match()` and some index vectors, like an animal. But now I can use Edward Visel's handy function instead.

{{< code r >}}

covid <- coalesce_join(covid, cname_xwalk, 
                       by = "geo_id", join = dplyr::left_join)

## Take a look again
anti_join(covid, cname_table) %>%
  select(geo_id, countries_and_territories, iso2, iso3, cname) %>%
  distinct()

# A tibble: 7 x 5
  geo_id   countries_and_territories         iso2    iso3  cname      
  <chr>    <chr>                             <chr>   <chr> <chr>      
1 JPG11668 Cases_on_an_international_convey… JPG116… <NA>  <NA>       
2 PYF      French_Polynesia                  PYF     <NA>  <NA>       
3 EL       Greece                            EL      GRC   Greece     
4 XK       Kosovo                            XK      XKV   Kosovo     
5 NA       Namibia                           NA      NAM   Namibia    
6 AN       Netherlands_Antilles              AN      <NA>  <NA>       
7 UK       United_Kingdom                    UK      GBR   United Kin…

{{< /code >}}

Looks like a couple of new territories have been added to the ECDC file since I made the crosswalk file. I'll have to update that soon.

## Calculate and Plot Cumulative Mortality

Now we can actually analyze the data (in the privacy of our own home). Let's draw the plot that everyone draws, looking at cumulative counts. We'll take an arbitrary threshold for number of deaths, let's say ten, start every country from zero days when they hit ten deaths, and count the cumulative deaths since that day. Again, note that we are not modeling or extrapolating from the data here, we're just focusing on getting a count of deaths attributed to the disease. The numbers are definitely undercounts because not all deaths directly attributable to COVID-19 have been counted as such at this point. Not everyone who died from it was tested for it, and so e.g. a chunk of direct COVID-19 deaths will have been mis-classified as flu deaths. 

{{< code r >}}

cov_curve <- covid %>%
  select(date, cname, iso3, cases, deaths) %>%
  drop_na(iso3) %>%
  group_by(iso3) %>%
  arrange(date) %>%
  mutate(cu_cases = cumsum(cases), 
         cu_deaths = cumsum(deaths)) %>%
  filter(cu_deaths > 9) %>%
  mutate(days_elapsed = date - min(date),
         end_label = ifelse(date == max(date), cname, NA))

cov_curve

# A tibble: 245 x 9
# Groups:   iso3 [21]
   date       cname iso3  cases deaths cu_cases cu_deaths days_elapsed
   <date>     <chr> <chr> <dbl>  <dbl>    <dbl>     <dbl> <drtn>      
 1 2020-01-22 China CHN     140     11      526        17 0 days      
 2 2020-01-23 China CHN      97      0      623        17 1 days      
 3 2020-01-24 China CHN     259      9      882        26 2 days      
 4 2020-01-25 China CHN     441     15     1323        41 3 days      
 5 2020-01-26 China CHN     665     15     1988        56 4 days      
 6 2020-01-27 China CHN     787     25     2775        81 5 days      
 7 2020-01-28 China CHN    1753     25     4528       106 6 days      
 8 2020-01-29 China CHN    1466     26     5994       132 7 days      
 9 2020-01-30 China CHN    1740     38     7734       170 8 days      
10 2020-01-31 China CHN    1980     43     9714       213 9 days      
# … with 235 more rows, and 1 more variable: end_label <chr>


{{< /code >}}

See how at the end there we create an `end_label` variable for use in the plot. It only has values for the most recent day in the dataset (i.e. the country name if `date` is `max(date)`, otherwise `NA`).

Now we'll narrow our focus to a few countries and make the plot.

{{< code r >}}

focus_cn <- c("CHN", "GBR", "USA", "IRN", "JPN",
              "KOR", "ITA", "FRA", "ESP")


cov_curve %>%
  filter(iso3 %in% focus_cn) %>% ## focus on just a few countries, defined above
  mutate(end_label = recode(end_label, `United States` = "USA",
                        `Iran, Islamic Republic of` = "Iran", 
                        `Korea, Republic of` = "South Korea", 
                        `United Kingdom` = "UK")) %>%
  ggplot(mapping = aes(x = days_elapsed, y = cu_deaths, 
         color = cname, label = end_label, 
         group = cname)) + 
  geom_line(size = 0.8) + 
  geom_text_repel(nudge_x = 1.1,
                  nudge_y = 0.1, 
                  segment.color = NA) + 
  guides(color = FALSE) + 
  scale_color_manual(values = prismatic::clr_darken(paletteer_d("ggsci::category20_d3"), 0.2)) +
  scale_y_continuous(labels = scales::comma_format(accuracy = 1), 
                     breaks = 2^seq(4, 12),
                     trans = "log2") + 
  labs(x = "Days Since 10th Confirmed Death", 
       y = "Cumulative Number of Deaths (log scale)", 
       title = "Cumulative Deaths from COVID-19, Selected Countries", 
       subtitle = paste("Data as of", format(max(cov_curve$date), "%A, %B %e, %Y")), 
       caption = "Kieran Healy @kjhealy / Data: ECDC") + 
    theme(plot.title = element_text(size = rel(2), face = "bold"),
          plot.subtitle = element_text(size = rel(1.5)),
          axis.text.y = element_text(size = rel(2)),
          axis.title.x = element_text(size = rel(1.5)),
          axis.title.y = element_text(size = rel(1.5)),
          axis.text.x = element_text(size = rel(2)),
          legend.text = element_text(size = rel(2))
          )

{{< /code >}}

Again, a few small details polish the plot. We do a quick bit of recoding on the `end_label` to shorten some country names, and use `geom_text_repel()` to put the labels at the end of the line. We get our y-axis breaks with `2^seq(4, 12)`, which (as case numbers rise) will be easier to extend than manually typing all the numbers. I use a base 2 log scale for the reasons [Dr Drang gives here](https://leancrew.com/all-this/2020/03/exponential-growth-and-log-scales/). It's useful to look at the doubling time, which base 2 helps you see, rather than powers of ten. (The graphs won't look any different.) Finally on the thematic side we can date-stamp the title of the graph using the opaque but standard [UNIX date formatting codes](https://gist.github.com/nikreiman/1408399), with `paste("Data as of", format(max(cov_curve$date), "%A, %B %e, %Y"))`. 

And here's our figure. 

{{% figure src="/files/misc/covid_cumulative_22-03-20.png" alt="Cumulative COVID-19 Deaths" caption="Cumulative COVID-19 Deaths" %}}


The [GitHub repository](https://github.com/kjhealy/covid) for this post also has some code to pull U.S. data from the [COVID Tracking Project](https://covidtracking.com/) currently being run by a group of volunteers. 
