---
title: "A COVID Small Multiple"
date: 2020-03-27T11:02:38-04:00
categories: [R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

John Burn-Murdoch has been doing [very good work at the Financial Times](https://www.ft.com/coronavirus-latest) producing various visualizations of the progress of COVID-19. One of his recent images is a small-multiple plot of cases by country, showing the trajectory of the outbreak for a large number of countries, with a the background of each small-multiple panel also showing (in grey) the trajectory of every other country for comparison. It's a useful technique. In this example, I'll draw a version of it in R and ggplot. The main difference is that instead of ordering the panels alphabetically by country, I'll order them from highest to lowest current reported cases. 

Here's the figure we'll end up with:

{{% figure src="/files/misc/cov_case_sm.png" alt="covid small multiple" caption="Cumulative reported COVID-19 cases to date, top 50 Countries" %}}

There are two small tricks. First, getting _all_ the data to show (in grey) in each panel while highlighting just _one_ country. Second, for reasons of space, moving the panel labels (in ggplot's terminology, the strip labels) inside the panels, in order to tighten up the space a bit. Doing this is really the same trick both times, viz, creating a some mini-datasets to use for particular layers of the plot.

The code for this (including code to pull the data) is in [my COVID GitHub repository](https://github.com/kjhealy/covid). See the [repo](https://github.com/kjhealy/covid) for details on downloading and cleaning it. Just this morning the ECDC changed how it's supplying its data, moving from an Excel file to your choice of JSON, CSV, or XML, so [this earlier post walking through the process for the Excel file](https://kieranhealy.org/blog/archives/2020/03/21/covid-19-tracking/) is already out of date for the downloading step. There's a new function in the repo, though.

We'll start with the data mostly cleaned and organized. 

{{< code r >}}
> covid
# A tibble: 7,320 x 14
   date_rep     day month  year cases deaths countries_and_territories geo_id countryterritory_code pop_data2018 date       iso2  iso3  cname      
   <chr>      <dbl> <dbl> <dbl> <dbl>  <dbl> <chr>                     <chr>  <chr>                        <dbl> <date>     <chr> <chr> <chr>      
 1 28/03/2020    28     3  2020    16      1 Afghanistan               AF     AFG                       37172386 2020-03-28 AF    AFG   Afghanistan
 2 27/03/2020    27     3  2020     0      0 Afghanistan               AF     AFG                       37172386 2020-03-27 AF    AFG   Afghanistan
 3 26/03/2020    26     3  2020    33      0 Afghanistan               AF     AFG                       37172386 2020-03-26 AF    AFG   Afghanistan
 4 25/03/2020    25     3  2020     2      0 Afghanistan               AF     AFG                       37172386 2020-03-25 AF    AFG   Afghanistan
 5 24/03/2020    24     3  2020     6      1 Afghanistan               AF     AFG                       37172386 2020-03-24 AF    AFG   Afghanistan
 6 23/03/2020    23     3  2020    10      0 Afghanistan               AF     AFG                       37172386 2020-03-23 AF    AFG   Afghanistan
 7 22/03/2020    22     3  2020     0      0 Afghanistan               AF     AFG                       37172386 2020-03-22 AF    AFG   Afghanistan
 8 21/03/2020    21     3  2020     2      0 Afghanistan               AF     AFG                       37172386 2020-03-21 AF    AFG   Afghanistan
 9 20/03/2020    20     3  2020     0      0 Afghanistan               AF     AFG                       37172386 2020-03-20 AF    AFG   Afghanistan
10 19/03/2020    19     3  2020     0      0 Afghanistan               AF     AFG                       37172386 2020-03-19 AF    AFG   Afghanistan
# … with 7,310 more rows
{{< /code >}}

This is the data as we get it from the ECDC, with some cleaning of the country codes and the date format. We'll calculate some cumulative totals and do some final recoding of the country labels.

{{< code r >}}

cov_case_curve <- covid %>%
  select(date, cname, iso3, cases, deaths) %>%
  drop_na(iso3) %>%
  group_by(iso3) %>%
  arrange(date) %>%
  mutate(cu_cases = cumsum(cases), 
         cu_deaths = cumsum(deaths)) %>%
  filter(cu_cases > 99) %>%
  mutate(days_elapsed = date - min(date),
          end_label = ifelse(date == max(date), cname, NA),
          end_label = recode(end_label, `United States` = "USA",
                        `Iran, Islamic Republic of` = "Iran", 
                        `Korea, Republic of` = "South Korea", 
                        `United Kingdom` = "UK"),
         cname = recode(cname, `United States` = "USA",
                        `Iran, Islamic Republic of` = "Iran", 
                        `Korea, Republic of` = "South Korea", 
                        `United Kingdom` = "UK"))
                        
> cov_case_curve
# A tibble: 1,262 x 9
# Groups:   iso3 [97]
   date       cname iso3  cases deaths cu_cases cu_deaths days_elapsed end_label
   <date>     <chr> <chr> <dbl>  <dbl>    <dbl>     <dbl> <drtn>       <chr>    
 1 2020-01-19 China CHN     136      1      216         3 0 days       NA       
 2 2020-01-20 China CHN      19      0      235         3 1 days       NA       
 3 2020-01-21 China CHN     151      3      386         6 2 days       NA       
 4 2020-01-22 China CHN     140     11      526        17 3 days       NA       
 5 2020-01-23 China CHN      97      0      623        17 4 days       NA       
 6 2020-01-24 China CHN     259      9      882        26 5 days       NA       
 7 2020-01-25 China CHN     441     15     1323        41 6 days       NA       
 8 2020-01-26 China CHN     665     15     1988        56 7 days       NA       
 9 2020-01-27 China CHN     787     25     2775        81 8 days       NA       
10 2020-01-28 China CHN    1753     25     4528       106 9 days       NA       
# … with 1,252 more rows                        

{{< /code >}}


Then we pick out the top 50 countries, isolating their maximum case value.

{{< code r >}}

## Top 50 countries by >> 100 cases, let's say. 
top_50 <- cov_case_curve %>%
  group_by(cname) %>%
  filter(cu_cases == max(cu_cases)) %>%
  ungroup() %>%
  top_n(50, cu_cases) %>%
  select(iso3, cname, cu_cases) %>%
  mutate(days_elapsed = 1, 
             cu_cases = max(cov_case_curve$cu_cases) - 1e4) 


> top_50

# A tibble: 50 x 4
   iso3  cname     cu_cases days_elapsed
   <chr> <chr>        <dbl>        <dbl>
 1 PAK   Pakistan     94686            1
 2 THA   Thailand     94686            1
 3 ARG   Argentina    94686            1
 4 AUS   Australia    94686            1
 5 AUT   Austria      94686            1
 6 BEL   Belgium      94686            1
 7 BRA   Brazil       94686            1
 8 CAN   Canada       94686            1
 9 CHL   Chile        94686            1
10 CHN   China        94686            1
# … with 40 more rows
{{< /code >}}

This gives us our label layer. We've set `days_elapsed` and `cu_cases` values to the same thing for every country, because these are the x and y locations where the country labels will go.

Next, a data layer for the grey line traces and a data layer for the little endpoints at the current case-count value. 

{{< code r >}}
cov_case_curve_bg <- cov_case_curve %>% 
  select(-cname) %>%
  filter(iso3 %in% top_50$iso3) 

cov_case_curve_endpoints <- cov_case_curve %>% 
  filter(iso3 %in% top_50$iso3) %>%
  group_by(iso3) %>%
  filter(cu_cases == max(cu_cases)) %>%
  select(cname, iso3, days_elapsed, cu_cases) %>%
  ungroup()
{{< /code >}}

We drop `cname` in the `cov_case_curve_bg` layer, because we're going to facet by that value with the main dataset in a moment. That's the trick that allows the traces for all the countries to appear in each panel.

And now we can draw the plot. 

```r {linenos=table,hl_lines=[5,9,12,19,27,29,39]}

cov_case_sm <- cov_case_curve  %>%
  filter(iso3 %in% top_50$iso3) %>%
  ggplot(mapping = aes(x = days_elapsed, y = cu_cases)) + 
  # The line traces for every country, in every panel
  geom_line(data = cov_case_curve_bg, 
            aes(group = iso3),
            size = 0.15, color = "gray80") + 
  # The line trace in red, for the country in any given panel
  geom_line(color = "firebrick",
            lineend = "round") + 
  # The point at the end. Bonus trick: some points can have fills!
  geom_point(data = cov_case_curve_endpoints, 
             size = 1.1, 
             shape = 21, 
             color = "firebrick",
             fill = "firebrick2"
             ) + 
  # The country label inside the panel, in lieu of the strip label
  geom_text(data = top_50, 
             mapping = aes(label = cname), 
             vjust = "inward", 
             hjust = "inward",
             fontface = "bold", 
             color = "firebrick", 
             size = 2.1) + 
  # Log transform and friendly labels
  scale_y_log10(labels = scales::label_number_si()) + 
  # Facet by country, order from high to low
  facet_wrap(~ reorder(cname, -cu_cases), ncol = 5) + 
  labs(x = "Days Since 100th Confirmed Case", 
       y = "Cumulative Number of Cases (log10 scale)", 
       title = "Cumulative Number of Reported Cases of COVID-19: Top 50 Countries", 
       subtitle = paste("Data as of", format(max(cov_curve$date), "%A, %B %e, %Y")), 
        caption = "Kieran Healy @kjhealy / Data: https://www.ecdc.europa.eu/") + 
  theme(plot.title = element_text(size = rel(1), face = "bold"),
          plot.subtitle = element_text(size = rel(0.7)),
          plot.caption = element_text(size = rel(1)),
          # turn off the strip label and tighten the panel spacing
          strip.text = element_blank(),
          panel.spacing.x = unit(-0.05, "lines"),
          panel.spacing.y = unit(0.3, "lines"),
          axis.text.y = element_text(size = rel(0.5)),
          axis.title.x = element_text(size = rel(1)),
          axis.title.y = element_text(size = rel(1)),
          axis.text.x = element_text(size = rel(0.5)),
          legend.text = element_text(size = rel(1)))

ggsave("figures/cov_case_sm.png", 
       cov_case_sm, width = 10, height = 12, dpi = 300)

```

