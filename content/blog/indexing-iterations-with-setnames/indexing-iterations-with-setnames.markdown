---
title: "Indexing Iterations with set_names()"
date: 2022-04-10T12:42:30-04:00
categories: [sociology,R]
footnotes: false
htmlwidgets: false
mathjax: false
---


As [mentioned last time](https://kieranhealy.org/blog/archives/2022/04/08/iterating-on-the-gss/),
we often want to build up a data frame iteratively. The `map()` family
of functions in `purrr` can help with this. Here I’ll show a handy
pattern for keeping track of what you’ve added to the data frame you’re
making.

The `map_dfr()` function will take a vector, apply a function to each
element of it, and then return the results as a data frame bound
row-by-row. For example, the U.S. Census Bureau provides annual
estimates of median household income for areas in the United States. We
can get them using Kyle Walker’s `tidycensus` package.

{{< code r >}}
library(tidyverse)
library(tidycensus)


out <- get_acs(geography = "county", 
                    variables = "B19013_001",
                    state = "NY", 
                    county = "New York", 
                    survey = "acs1",
                    year = 2005)

out

## # A tibble: 1 × 5
##   GEOID NAME                      variable   estimate   moe
##   <chr> <chr>                     <chr>         <dbl> <dbl>
## 1 36061 New York County, New York B19013_001    55973  1462
{{< /code >}}

We could get all the counties in New York state (and in the country) if
we wanted this way, for any particular year.

{{< code r >}}
out <- get_acs(geography = "county", 
                    variables = "B19013_001",
                    state = "NY", 
                    survey = "acs1",
                    year = 2005)

out

## # A tibble: 38 × 5
##    GEOID NAME                         variable   estimate   moe
##    <chr> <chr>                        <chr>         <dbl> <dbl>
##  1 36001 Albany County, New York      B19013_001    50054  2030
##  2 36005 Bronx County, New York       B19013_001    29228   853
##  3 36007 Broome County, New York      B19013_001    36394  2340
##  4 36009 Cattaraugus County, New York B19013_001    37580  2282
##  5 36011 Cayuga County, New York      B19013_001    42057  2406
##  6 36013 Chautauqua County, New York  B19013_001    35495  2077
##  7 36015 Chemung County, New York     B19013_001    37418  3143
##  8 36019 Clinton County, New York     B19013_001    44757  3500
##  9 36027 Dutchess County, New York    B19013_001    61889  2431
## 10 36029 Erie County, New York        B19013_001    41967  1231
## # … with 28 more rows
{{< /code >}}

What if we want the results for *every* available year? [As with the GSS](https://kieranhealy.org/blog/archives/2022/04/08/iterating-on-the-gss),
we _could_ write an explicit loop to download each piece and then bind
them all together into a data frame. But it’s better to use `map_dfr()`
to do this for us. In the process, we’ll take advantage of a nice way to
make sure our rows are properly indexed by year.

There’s a `set_names()` function that can be used to attach labels to
the elements of a vector:

{{< code r >}}
x <- c(1:10)

x

##  [1]  1  2  3  4  5  6  7  8  9 10

x <- set_names(x, nm = letters[1:10])

x

##  a  b  c  d  e  f  g  h  i  j 
##  1  2  3  4  5  6  7  8  9 10
{{< /code >}}

By default, `set_names()` will label a vector with that vector’s values:

{{< code r >}}
c(1:10) %>% 
  set_names()

##  1  2  3  4  5  6  7  8  9 10 
##  1  2  3  4  5  6  7  8  9 10
{{< /code >}}

Meanwhile, `map_dfr()` has an `.id` argument that lets you add a
row-identifier to whatever you are binding. Like this:

{{< code r >}}
df <- 2005:2019 %>% 
  map_dfr(~ get_acs(geography = "county", 
                    variables = "B19013_001",
                    state = "NY", 
                    county = "New York", 
                    survey = "acs1",
                    year = .x), 
        .id = "id")

df

## # A tibble: 15 × 6
##    id    GEOID NAME                      variable   estimate   moe
##    <chr> <chr> <chr>                     <chr>         <dbl> <dbl>
##  1 1     36061 New York County, New York B19013_001    55973  1462
##  2 2     36061 New York County, New York B19013_001    60017  1603
##  3 3     36061 New York County, New York B19013_001    64217  2002
##  4 4     36061 New York County, New York B19013_001    69017  1943
##  5 5     36061 New York County, New York B19013_001    68706  1471
##  6 6     36061 New York County, New York B19013_001    63832  2125
##  7 7     36061 New York County, New York B19013_001    66299  1783
##  8 8     36061 New York County, New York B19013_001    67099  1640
##  9 9     36061 New York County, New York B19013_001    72190  2200
## 10 10    36061 New York County, New York B19013_001    76089  2016
## 11 11    36061 New York County, New York B19013_001    75575  2566
## 12 12    36061 New York County, New York B19013_001    77559  2469
## 13 13    36061 New York County, New York B19013_001    85071  3520
## 14 14    36061 New York County, New York B19013_001    85066  3480
## 15 15    36061 New York County, New York B19013_001    93651  3322
{{< /code >}}

Our `id` column tracks the year. But we’d like it to *be* the year. So,
we use `set_names()`, and also name it `year` when we create it:

{{< code r >}}
df <- 2005:2019 %>% 
  set_names() %>% 
  map_dfr(~ get_acs(geography = "county", 
                    variables = "B19013_001",
                    state = "NY", 
                    county = "New York", 
                    survey = "acs1",
                    year = .x), 
        .id = "year") %>% 
  mutate(year = as.integer(year))

df

## # A tibble: 15 × 6
##     year GEOID NAME                      variable   estimate   moe
##    <int> <chr> <chr>                     <chr>         <dbl> <dbl>
##  1  2005 36061 New York County, New York B19013_001    55973  1462
##  2  2006 36061 New York County, New York B19013_001    60017  1603
##  3  2007 36061 New York County, New York B19013_001    64217  2002
##  4  2008 36061 New York County, New York B19013_001    69017  1943
##  5  2009 36061 New York County, New York B19013_001    68706  1471
##  6  2010 36061 New York County, New York B19013_001    63832  2125
##  7  2011 36061 New York County, New York B19013_001    66299  1783
##  8  2012 36061 New York County, New York B19013_001    67099  1640
##  9  2013 36061 New York County, New York B19013_001    72190  2200
## 10  2014 36061 New York County, New York B19013_001    76089  2016
## 11  2015 36061 New York County, New York B19013_001    75575  2566
## 12  2016 36061 New York County, New York B19013_001    77559  2469
## 13  2017 36061 New York County, New York B19013_001    85071  3520
## 14  2018 36061 New York County, New York B19013_001    85066  3480
## 15  2019 36061 New York County, New York B19013_001    93651  3322
{{< /code >}}

Now `year` is just the year. The `year` column will be created as a
character vector, so we convert it back to an integer again at the end.
(Thanks to Dan Hicks for reminding me about this.)

The result is that we can now do something like this:

{{< code r >}}
## Every county this time.
2005:2019 %>% 
  set_names() %>% 
  map_dfr(~ get_acs(geography = "county", 
                    variables = "B19013_001",
                    state = "NY", 
                    survey = "acs1",
                    year = .x), 
        .id = "year") %>% 
  mutate(year = as.integer(year)) %>% 
  ggplot(mapping = aes(x = year, y = estimate, group = year)) + 
  geom_boxplot(fill = "lightblue", alpha = 0.5, outlier.alpha = 0) + 
  geom_jitter(position = position_jitter(width = 0.1), shape = 1) +
  scale_y_continuous(labels = scales::label_dollar()) + 
  labs(x = "Year", y = "Dollars", 
  title = "Median Household Income by County in New York State, 2005-2019", 
  subtitle = "ACS 1-year estimates", 
  caption = "Data: U.S. Census Bureau.") + 
  theme_minimal()
{{< /code >}}


{{% figure src="https://kieranhealy.org/files/misc/r-setnames-example-nyinc.png" alt="A boxplot of median household income over time in New York State counties." caption="Household income in New York State." %}}









