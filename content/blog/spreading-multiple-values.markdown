---
title: "Spreading Multiple Values"
date: 2018-11-06T16:47:27-05:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Earlier this year my colleague [Steve Vaisey](http://stephenvaisey.com) was converting code in some course notes from Stata to R. He asked me a question about tidily converting from long to wide format when you have multiple value columns. This is a little more awkward than it should be, and I've run into the issue several times since then. I'm writing down the answer (or, an answer) here so that I can find it again myself. Maybe it will be of use to other people as well. 

Here's a motivating example, using some made-up data. What we have are measures of sex, race, stratum (from a survey, say), education, and income. Of these, everything is categorical except income. Here's what it looks like:

{{< highlight r >}}

library(tidyverse)
library(data.table)
#> 
#> Attaching package: 'data.table'
#> The following objects are masked from 'package:dplyr':
#> 
#>     between, first, last
#> The following object is masked from 'package:purrr':
#> 
#>     transpose

gen_cats <- function(x, N = 1000) {
    sample(x, N, replace = TRUE)
}

set.seed(101)
N <- 1000

income <- rnorm(N, 100, 50)

vars <- list(stratum = c(1:8),
          sex = c("M", "F"),
          race =  c("B", "W"),
          educ = c("HS", "BA"))

df <- as_tibble(map_dfc(vars, gen_cats))
df <- add_column(df, income)

df

#>  A tibble: 1,000 x 5
#>     stratum sex   race  educ  income
#>      <int> <chr> <chr> <chr>  <dbl>
#>  1       6 F     W     BA      83.7
#>  2       7 F     B     HS     128. 
#>  3       1 F     B     BA      66.3
#>  4       2 M     B     BA     111. 
#>  5       4 M     B     BA     116. 
#>  6       6 F     W     BA     159. 
#>  7       7 F     W     BA     131. 
#>  8       6 M     W     HS      94.4
#>  9       4 F     W     HS     146. 
#> 10       7 M     B     BA      88.8
#> # ... with 990 more rows

{{< /highlight >}}

In order to do a bit of modeling, what Steve wanted to do was to get a table with the data grouped by sex, race, and stratum, but with averages and totals for income by education. In particular, he needed to spread the average income and count values by education into columns. One way to do this, just to show what's needed, is using the `data.table` library: 

{{< highlight r >}}

## Data Table
data.table::setDT(df)
dt_wide <- data.table::dcast(df, sex + race + stratum ~ educ,
              fun = list(mean, length),
              value.var = "income")

head(dt_wide)
#>    sex race stratum income_mean_BA income_mean_HS income_length_BA
#> 1:   F    B       1      101.56368      115.51767               16
#> 2:   F    B       2       92.97993       90.54429               12
#> 3:   F    B       3      114.20984      103.88870               18
#> 4:   F    B       4       90.51281      103.28220               13
#> 5:   F    B       5      110.94754       70.65812               12
#> 6:   F    B       6       97.82804       88.66467                9
#>    income_length_HS
#> 1:               23
#> 2:               15
#> 3:               11
#> 4:               15
#> 5:               10
#> 6:               17

{{< /highlight >}}

As you can see, we stratify by sex, race, and stratum, and then in the new columns we have average income values and observation counts for BA and HS values of education.

The `data.table` library is great, and does the job nicely. What if we wanted to keep everything in the tidyverse, just for expositional purposes? A first cut gets us some of the way:

{{< highlight r >}}

## Simple tidy summary
tv_wide1 <- df %>% group_by(sex, race, stratum, educ) %>%
    summarize(mean_inc = mean(income), N = n())

tv_wide1
# A tibble: 64 x 6
# Groups:   sex, race, stratum [?]
   sex   race  stratum educ  mean_inc     N
   <chr> <chr>   <int> <chr>    <dbl> <int>
 1 F     B           1 BA       102.     16
 2 F     B           1 HS       116.     23
 3 F     B           2 BA        93.0    12
 4 F     B           2 HS        90.5    15
 5 F     B           3 BA       114.     18
 6 F     B           3 HS       104.     11
 7 F     B           4 BA        90.5    13
 8 F     B           4 HS       103.     15
 9 F     B           5 BA       111.     12
10 F     B           5 HS        70.7    10
# ... with 54 more rows

{{< /highlight >}}

There the education variable is still tidily organized, and so the mean income and count variables are their own columns, rather than widened out. To widen them in the way we want, we will need to do a bit more work. In effect---and this is a general strategy when doing this kind of thing with `tidyr`---we `gather()` the data into a long-enough form, then temporarily re-aggregate it to the level we want using `unite()`, and finally `spread()` the result into columns. I'll show the results of each of the additional steps cumulatively, so you can see what each stage of the pipeline produces. 

First we gather the summaries (mean income and N observations) for each value of the  education variable, still stratifying on sex, race, and stratum:

{{< highlight r >}}

## 1. gather()
tv_wide2 <- df %>% group_by(sex, race, stratum, educ) %>%
    summarize(mean_inc = mean(income), N = n()) %>%
    gather(variable, value, -(sex:educ))

tv_wide2

# A tibble: 128 x 6
# Groups:   sex, race, stratum [32]
   sex   race  stratum educ  variable value
   <chr> <chr>   <int> <chr> <chr>    <dbl>
 1 F     B           1 BA    mean_inc 102. 
 2 F     B           1 HS    mean_inc 116. 
 3 F     B           2 BA    mean_inc  93.0
 4 F     B           2 HS    mean_inc  90.5
 5 F     B           3 BA    mean_inc 114. 
 6 F     B           3 HS    mean_inc 104. 
 7 F     B           4 BA    mean_inc  90.5
 8 F     B           4 HS    mean_inc 103. 
 9 F     B           5 BA    mean_inc 111. 
10 F     B           5 HS    mean_inc  70.7
# ... with 118 more rows

{{< /highlight >}}

The `gather()` step has converted the `mean_inc` and `N` columns into long form, with `variable` and `value` columns. 

We then use `unite()` to create a temporary variable that unites the education variable with the means and counts for each row. In effect we're sticking the `educ` and `variable` columns together:

{{< highlight r >}}

## 2. unite()
tv_wide2 <- df %>% group_by(sex, race, stratum, educ) %>%
    summarize(mean_inc = mean(income), N = n()) %>%
    gather(variable, value, -(sex:educ)) %>%
    unite(temp, educ, variable)

tv_wide2

# A tibble: 128 x 5
# Groups:   sex, race, stratum [32]
   sex   race  stratum temp        value
   <chr> <chr>   <int> <chr>       <dbl>
 1 F     B           1 BA_mean_inc 102. 
 2 F     B           1 HS_mean_inc 116. 
 3 F     B           2 BA_mean_inc  93.0
 4 F     B           2 HS_mean_inc  90.5
 5 F     B           3 BA_mean_inc 114. 
 6 F     B           3 HS_mean_inc 104. 
 7 F     B           4 BA_mean_inc  90.5
 8 F     B           4 HS_mean_inc 103. 
 9 F     B           5 BA_mean_inc 111. 
10 F     B           5 HS_mean_inc  70.7
# ... with 118 more rows
{{< /highlight >}}

As you can see, `educ` and `variable` are gone, replaced by a single new variable, `temp` that's glued them together. Finally we `spread()` this `temp` variable into columns, giving us separate columns for BA Mean income, BA N observations, HS Mean income, and HS N observations:

{{< highlight r >}}

## 3. spread()
tv_wide2 <- df %>% group_by(sex, race, stratum, educ) %>%
    summarize(mean_inc = mean(income), N = n()) %>%
    gather(variable, value, -(sex:educ)) %>%
    unite(temp, educ, variable) %>%
    spread(temp, value)

tv_wide2

# A tibble: 32 x 7
# Groups:   sex, race, stratum [32]
   sex   race  stratum BA_mean_inc  BA_N HS_mean_inc  HS_N
   <chr> <chr>   <int>       <dbl> <dbl>       <dbl> <dbl>
 1 F     B           1       102.     16       116.     23
 2 F     B           2        93.0    12        90.5    15
 3 F     B           3       114.     18       104.     11
 4 F     B           4        90.5    13       103.     15
 5 F     B           5       111.     12        70.7    10
 6 F     B           6        97.8     9        88.7    17
 7 F     B           7        70.2    17        99.0    21
 8 F     B           8       116.     15       101.      8
 9 F     W           1        86.4    20        93.0     8
10 F     W           2       104.     14        93.4    12
# ... with 22 more rows

{{< /highlight >}}

This table is the same as the `data.table` output, except that the naming conventions for the created columns are a little different.

Because we might be doing this gather-unite-spread step quite often, it'd be useful to have a function to bundle up the steps for us into something more convenient. Dan Sullivan has [helpfully written one for us](https://community.rstudio.com/t/spread-with-multiple-value-columns/5378/2) on the Rstudio community website. It uses tidyeval conventions for its internals. 

{{< highlight r >}}

multi_spread <- function(df, key, value) {
    # quote key
    keyq <- rlang::enquo(key)
    # break value vector into quotes
    valueq <- rlang::enquo(value)
    s <- rlang::quos(!!valueq)
    df %>% gather(variable, value, !!!s) %>%
        unite(temp, !!keyq, variable) %>%
        spread(temp, value)
}


{{< /highlight >}}

The multi-spread function generalizes to more than two values, by the way. It lets us do this:

{{< highlight r >}}
## Final version
tv_wide3 <- df %>% group_by(sex, race, stratum, educ) %>%
    summarize(mean_inc = mean(income), N = n()) %>%
    multi_spread(educ, c(mean_inc, N))

tv_wide3

# A tibble: 32 x 7
# Groups:   sex, race, stratum [32]
   sex   race  stratum BA_mean_inc  BA_N HS_mean_inc  HS_N
   <chr> <chr>   <int>       <dbl> <dbl>       <dbl> <dbl>
 1 F     B           1       102.     16       116.     23
 2 F     B           2        93.0    12        90.5    15
 3 F     B           3       114.     18       104.     11
 4 F     B           4        90.5    13       103.     15
 5 F     B           5       111.     12        70.7    10
 6 F     B           6        97.8     9        88.7    17
 7 F     B           7        70.2    17        99.0    21
 8 F     B           8       116.     15       101.      8
 9 F     W           1        86.4    20        93.0     8
10 F     W           2       104.     14        93.4    12
# ... with 22 more rows
{{< /highlight >}}

And there we are. A tidyverse-only way to `spread()` with multiple value columns. 
