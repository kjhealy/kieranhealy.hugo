---
title: "Widening Multiple Columns Redux"
date: 2019-10-21T11:14:46-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Last year I wrote about the slightly tedious business of [spreading (or widening) multiple value columns](https://kieranhealy.org/blog/archives/2018/11/06/spreading-multiple-values/) in Tidyverse-flavored R. Recent updates to the [tidyr package](https://tidyr.tidyverse.org), particularly the introduction of the `pivot_wider()` and `pivot_longer()` functions, have made this rather more straightforward to do than before. Here I recapitulate the earlier example with the new tools. 

The motivating case is something that happens all the time when working with social science data. We'll load the tidyverse, and then quickly make up some sample data to work with. 

{{< code r >}}

library(tidyverse)

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

{{< /code >}}

What we have are measures of sex, race, stratum (from a survey, say), education, and income. Of these, everything is categorical except income. Here's what it looks like:


{{< code r >}}
df

## # A tibble: 1,000 x 5
##    stratum sex   race  educ  income
##      <int> <chr> <chr> <chr>  <dbl>
##  1       6 F     W     HS      83.7
##  2       5 F     W     BA     128. 
##  3       3 F     B     HS      66.3
##  4       3 F     W     HS     111. 
##  5       6 M     W     BA     116. 
##  6       7 M     B     HS     159. 
##  7       8 M     W     BA     131. 
##  8       3 M     W     BA      94.4
##  9       7 F     B     HS     146. 
## 10       2 F     W     BA      88.8
## # … with 990 more rows

{{< /code >}}

Let's say we want to transform this to a wider format, specifically by widening the `educ` column, so we end up with columns for both the `HS` and `BA` categories, and as we do so we want to calculate both the mean of `income` and the total `n` within each category of `educ`.

For comparison, one could do this with `data.table` in the following way:

{{< code r >}}

data.table::setDT(df)
df_wide_dt <- data.table::dcast(df, sex + race + stratum ~ educ,
              fun = list(mean, length),
              value.var = "income")

head(df_wide_dt)

{{< /code >}}

{{< code r >}}

##    sex race stratum income_mean_BA income_mean_HS income_length_BA income_length_HS 
## 1:   F    B       1       93.78002       99.25489               19                 6
## 2:   F    B       2       89.66844       93.04118               11                16
## 3:   F    B       3      112.38483       94.99198               13                16
## 4:   F    B       4      107.57729       96.06824               14                15
## 5:   F    B       5       91.02870       92.56888               11                15
## 6:   F    B       6       92.99184      116.06218               15                15

{{< /code >}}

Until recently, widening or spreading on multiple values like this was kind of a pain when working in the tidyverse. You can see [how I approached it before](https://kieranhealy.org/blog/archives/2018/11/06/spreading-multiple-values/) in the earlier post. (The code there still works fine.) Previously, you had to put `spread()` and `gather()` through a slightly tedious series of steps, best wrapped in a function you'd have to write yourself. No more! Since `tidyr` v1.0.0 has been released, though, the new function `pivot_wider()` (and its complement, `pivot_longer()`) make this common operation more accessible. 

Here's how to do it now. Remember that in the tidyverse approach, we'll first do the summary calculations, `mean` and `length`, respectively, though we'll use `dplyr`'s `n()` for the latter. Then we widen the long result.

{{< code r >}}

tv_pivot <- df %>%
    group_by(sex, race, stratum, educ) %>% 
    summarize(mean_inc = mean(income),
              n = n()) %>%
    pivot_wider(names_from = (educ),
                values_from = c(mean_inc, n))

{{< /code >}}

This gives us an object that's equivalent to the `df_wide_dt` object created by `data.table`. 

{{< code r >}}

tv_pivot

## # A tibble: 32 x 7
## # Groups:   sex, race, stratum [32]
##    sex   race  stratum mean_inc_BA mean_inc_HS  n_BA  n_HS
##    <chr> <chr>   <int>       <dbl>       <dbl> <int> <int>
##  1 F     B           1        93.8        99.3    19     6
##  2 F     B           2        89.7        93.0    11    16
##  3 F     B           3       112.         95.0    13    16
##  4 F     B           4       108.         96.1    14    15
##  5 F     B           5        91.0        92.6    11    15
##  6 F     B           6        93.0       116.     15    15
##  7 F     B           7       102.        121.     13    13
##  8 F     B           8       105.         88.3    14     8
##  9 F     W           1        92.6       110.     19    13
## 10 F     W           2        98.5       101.     15    19
## # … with 22 more rows

{{< /code >}}

And there you have it. Be sure to check out the complement of `pivot_wider()`, `pivot_longer()`, also.
