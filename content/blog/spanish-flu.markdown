---
title: "Spanish Flu"
date: 2020-03-05T20:28:27-05:00
draft: false
categories: [R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

I was teaching some dplyr and ggplot today. Because Coronavirus is in the, uh, air, I decided to work with the mortality data from <http://mortality.org> and have the students practice getting a bunch of data files into R and then plotting the resulting data quickly and informatively. We took a look at the years around the 1918 Influenza Epidemic and, after poking at the data for a little while, came to realize why it was called the _Spanish_ Flu. Here's some code you can run if you download the (freely available) 1x1 mortality files from <mortality.org>. 

{{< code r >}}

library(here)
library(janitor)
library(tidyverse)

## Where the data is locally
path <- "data/Mx_1x1/"

## Colors for later
my_colors <- c("#0072B2", "#E69F00")

## Some utility functions for cleaning
get_country_name <- function(x){
  read_lines(x, n_max = 1) %>%
    str_extract(".+?,") %>%
    str_remove(",")
}

shorten_name <- function(x){
  str_replace_all(x, " -- ", " ") %>%
    str_replace("The United States of America", "USA") %>%
    snakecase::to_any_case()
}

make_ccode <- function(x){
  str_extract(x, "[:upper:]+((?=\\.))")
}

{{< /code >}}

First we're going to make a little tibble of country codes, names, and associated file paths.

{{< code r >}}

filenames <- dir(path = here(path),
                 pattern = "*.txt",
                 full.names = TRUE)

countries <- tibble(country = map_chr(filenames, get_country_name),
                    cname = map_chr(country, shorten_name),
                    ccode = map_chr(filenames, make_ccode),
                    path = filenames)

countries

# A tibble: 49 x 4
   country    cname     ccode path                                    
   <chr>      <chr>     <chr> <chr>                                   
 1 Australia  australia AUS   /Users/kjhealy/Documents/data/misc/lexi…
 2 Austria    austria   AUT   /Users/kjhealy/Documents/data/misc/lexi…
 3 Belgium    belgium   BEL   /Users/kjhealy/Documents/data/misc/lexi…
 4 Bulgaria   bulgaria  BGR   /Users/kjhealy/Documents/data/misc/lexi…
 5 Belarus    belarus   BLR   /Users/kjhealy/Documents/data/misc/lexi…
 6 Canada     canada    CAN   /Users/kjhealy/Documents/data/misc/lexi…
 7 Switzerla… switzerl… CHE   /Users/kjhealy/Documents/data/misc/lexi…
 8 Chile      chile     CHL   /Users/kjhealy/Documents/data/misc/lexi…
 9 Czechia    czechia   CZE   /Users/kjhealy/Documents/data/misc/lexi…
10 East Germ… east_ger… DEUTE /Users/kjhealy/Documents/data/misc/lexi…
# … with 39 more rows

{{< /code >}}

Next we ingest the data as a nested column, clean it a little, and subset it to those countries that we actually have mortality data for from the relevant time period. 

{{< code r >}}

mortality <- countries %>%
  mutate(data = map(path,
                    ~ read_table(., skip = 2, na = "."))) %>%
  unnest(cols = c(data)) %>%
  clean_names() %>%
  mutate(age = as.integer(recode(age, "110+" = "110"))) %>%
  select(-path) %>%
  nest(data = c(year:total))

## Subset to flu years / countries
flu <- mortality %>% 
  unnest(cols = c(data)) %>%
  group_by(country) %>%
  filter(min(year) < 1918)

flu

# A tibble: 298,923 x 8
# Groups:   country [14]
   country cname   ccode  year   age  female    male   total
   <chr>   <chr>   <chr> <dbl> <int>   <dbl>   <dbl>   <dbl>
 1 Belgium belgium BEL    1841     0 0.152   0.187   0.169  
 2 Belgium belgium BEL    1841     1 0.0749  0.0741  0.0745 
 3 Belgium belgium BEL    1841     2 0.0417  0.0398  0.0408 
 4 Belgium belgium BEL    1841     3 0.0255  0.0233  0.0244 
 5 Belgium belgium BEL    1841     4 0.0185  0.0171  0.0178 
 6 Belgium belgium BEL    1841     5 0.0139  0.0124  0.0132 
 7 Belgium belgium BEL    1841     6 0.0128  0.0102  0.0115 
 8 Belgium belgium BEL    1841     7 0.0109  0.00800 0.00944
 9 Belgium belgium BEL    1841     8 0.00881 0.00701 0.00789
10 Belgium belgium BEL    1841     9 0.00814 0.00696 0.00754
# … with 298,913 more rows

{{< /code >}}

For the purposes of labeling an upcoming plot, we're going to make a little dummy dataset. 

{{< code r >}}

dat_text <- data.frame(
  label = c("1918", rep(NA, 5)),
  agegrp = factor(paste("Age", seq(10, 60, 10))),
  year     = c(1920, rep(NA, 5)),
  female     = c(0.04, rep(NA, 5)), 
  flag = rep(NA, 6)
)

dat_text

label agegrp year female flag
1  1918 Age 10 1920   0.04   NA
2  <NA> Age 20   NA     NA   NA
3  <NA> Age 30   NA     NA   NA
4  <NA> Age 40   NA     NA   NA
5  <NA> Age 50   NA     NA   NA
6  <NA> Age 60   NA     NA   NA


{{< /code >}}

And now we filter the data to look only at female mortality between 1900 and 1929 for a series of specific ages: every decade from 10 years old to 60 years old. We'll use that dummy dataset to label the first (but only the first) panel in the faceted plot we're going to draw.

{{< code r >}}

p0 <- flu %>%
  group_by(country, year) %>%
  filter(year > 1899 & year < 1930, age %in% seq(10, 60, by = 10)) %>%
  mutate(flag = country %in% "Spain", 
         agegrp = paste("Age", age)) %>%
  ggplot(mapping = aes(x = year, y = female, color = flag)) + 
  geom_vline(xintercept = 1918, color = "gray80") + 
  geom_line(mapping = aes(group = country)) 

p1 <- p0 +  geom_text(data = dat_text, 
                mapping = aes(x = year, y = female, label = label), 
                color = "black", 
                show.legend = FALSE, 
                group = 1, 
                size = 3) + 
  scale_color_manual(values = my_colors, 
                     labels = c("Other Countries", "Spain")) + 
  scale_y_continuous(labels = scales::percent) + 
  labs(title = "Female Mortality, Selected Ages and Countries 1900-1929", 
       x = "Year", y = "Female Mortality Rate", color = NULL,
       caption = "@kjhealy / Data: mortality.org") + 
  facet_wrap(~ agegrp, ncol = 1) + 
  theme(legend.position = "top")
  
p1

{{< /code >}}


{{% figure src = "https://kieranhealy.org/files/misc/spanish-flu.png" %}}

And thus, Spanish Flu. Though it looks like it was no joke to be an older woman in Spain during any part of the early 20th century. 

