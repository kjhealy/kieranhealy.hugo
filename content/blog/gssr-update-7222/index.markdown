---
title: "gssr Update"
date: 2024-04-01T07:50:45-04:00
categories: [Sociology,R]
footnotes: false
htmlwidgets: false
mathjax: false
---


[NORC released](https://gss.norc.org/get-the-data) version 2a of the 1972-2022 General Social Survey cumulative file. I’ve updated [`{gssr}`](https://kjhealy.github.io/gssr/), an R package that makes it more convenient for R users to work with GSS Data. One handy feature of `{gssr}` is that it lets you see documentation for individual GSS variables as R help pages.

{{% figure src="fefam_help.png" alt="fefam_help" caption="Details on every GSS variable are available in the R help system." %}}

`gssr` is a data package, bundling several datasets into a convenient
format. The relatively large size of the data in the package means it is
not suitable for hosting on [CRAN](https://cran.r-project.org/), the
core R package repository.

### Install direct from GitHub

You can install gssr from [GitHub](https://github.com/kjhealy/gssr)
with:

``` r
remotes::install_github("kjhealy/gssr")
```

### Loading the data

``` r
library(gssr)
#> Package loaded. To attach the GSS data, type data(gss_all) at the console.
#> For the codebook, type data(gss_dict).
#> For the panel data and documentation, type e.g. data(gss_panel08_long) and data(gss_panel_doc).
#> For help on a specific GSS variable, type ?varname at the console.
```

### Single GSS years

You can quickly get the data for any single GSS year by using
`gss_get_yr()` to download the data file from NORC and put it directly
into a tibble.

``` r
gss18 <- gss_get_yr(2018)
#> Fetching: https://gss.norc.org/documents/stata/2018_stata.zip

gss18
#> # A tibble: 2,348 × 1,068
#>    year         id wrkstat   hrs1        hrs2        evwork      wrkslf  wrkgovt
#>    <dbl+lbl> <dbl> <dbl+lbl> <dbl+lbl>   <dbl+lbl>   <dbl+lbl>   <dbl+l> <dbl+l>
#>  1 2018          1 3 [with … NA(i) [iap]    41       NA(i) [iap] 2 [som… 2 [pri…
#>  2 2018          2 5 [retir… NA(i) [iap] NA(i) [iap]     1 [yes] 2 [som… 2 [pri…
#>  3 2018          3 1 [worki…    40       NA(i) [iap] NA(i) [iap] 2 [som… 2 [pri…
#>  4 2018          4 1 [worki…    40       NA(i) [iap] NA(i) [iap] 2 [som… 2 [pri…
#>  5 2018          5 5 [retir… NA(i) [iap] NA(i) [iap]     1 [yes] 2 [som… 2 [pri…
#>  6 2018          6 5 [retir… NA(i) [iap] NA(i) [iap]     1 [yes] 2 [som… 2 [pri…
#>  7 2018          7 1 [worki…    35       NA(i) [iap] NA(i) [iap] 2 [som… 1 [gov…
#>  8 2018          8 1 [worki…    89 [89+… NA(i) [iap] NA(i) [iap] 2 [som… 2 [pri…
#>  9 2018          9 1 [worki…    40       NA(i) [iap] NA(i) [iap] 1 [sel… 2 [pri…
#> 10 2018         10 1 [worki…    40       NA(i) [iap] NA(i) [iap] 2 [som… 2 [pri…
#> # ℹ 2,338 more rows
#> # ℹ 1,060 more variables: occ10 <dbl+lbl>, prestg10 <dbl+lbl>,
#> #   prestg105plus <dbl+lbl>, indus10 <dbl+lbl>, marital <dbl+lbl>,
#> #   martype <dbl+lbl>, divorce <dbl+lbl>, widowed <dbl+lbl>,
#> #   spwrksta <dbl+lbl>, sphrs1 <dbl+lbl>, sphrs2 <dbl+lbl>, spevwork <dbl+lbl>,
#> #   cowrksta <dbl+lbl>, cowrkslf <dbl+lbl>, coevwork <dbl+lbl>,
#> #   cohrs1 <dbl+lbl>, cohrs2 <dbl+lbl>, spwrkslf <dbl+lbl>, …
```

The GSS data comes in a *labelled* format, mirroring the way it is encoded for Stata and SPSS platforms. The numeric codes are the content of the column cells. The labeling information is stored as an attribute of the column. 

Here's a typical workflow for getting the data ready:

``` r
suppressPackageStartupMessages({
  library(tidyverse)
  library(survey)
  library(srvyr)
})


library(gssr)
#> Package loaded. To attach the GSS data, type data(gss_all) at the console.
#> For the codebook, type data(gss_dict).
#> For the panel data and documentation, type e.g. data(gss_panel08_long) and data(gss_panel_doc).
#> For help on a specific GSS variable, type ?varname at the console.

## Fn to capitalize strings nicely (from chartr)
capwords <- function(x, strict = FALSE) {
  cap <- function(x) paste(toupper(substring(x, 1, 1)),
                           {x <- substring(x, 2); if(strict) tolower(x) else x},
                           sep = "", collapse = " " )
  sapply(strsplit(x, split = " "), cap, USE.NAMES = !is.null(names(x)))
}

## Th variables we want
cont_vars <- c("year", "id", "ballot", "age")
cat_vars <- c("race", "sex", "fefam")
wt_vars <- c("vpsu", "vstrat", "wtssps")
my_vars <- c(cont_vars, cat_vars, wt_vars)

## Get and clean up the 2018 data
gss_fam <- gss_get_yr(2018) |>
  select(all_of(my_vars)) |>
  mutate(
    # Convert all missing to NA
    across(everything(), haven::zap_missing),
    # Convert all weight vars to numeric
    across(all_of(wt_vars), as.numeric),
    # Convert year to numeric
    year = as.integer(year),
    # Make all categorical variables factors and relabel nicely
    across(all_of(cat_vars), forcats::as_factor),
    across(all_of(cat_vars), \(x) forcats::fct_relabel(x, capwords, strict = TRUE)),
    fefam = forcats::fct_recode(fefam, NULL = "IAP", NULL = "DK", NULL = "NA"),
    young = ifelse(age < 26, "Yes", "No"),
    fefam_d = forcats::fct_recode(fefam,
                                  Agree = "Strongly Agree",
                                  Disagree = "Strongly Disagree"),
    fefam_n = recode(fefam_d, "Agree" = 0, "Disagree" = 1))
#> Fetching: https://gss.norc.org/documents/stata/2018_stata.zip

## Take a look
gss_fam |>
  select(-vpsu, -vstrat) |>
  relocate(c(fefam_d, fefam_n), .after = fefam)
#> # A tibble: 2,348 × 11
#>     year    id ballot       age   race  sex   fefam fefam_d fefam_n wtssps young
#>    <int> <dbl> <dbl+lbl>    <dbl> <fct> <fct> <fct> <fct>     <dbl>  <dbl> <chr>
#>  1  2018     1 1 [ballot a] 43    White Male  Disa… Disagr…       1  1.91  No   
#>  2  2018     2 3 [ballot c] 74    White Fema… <NA>  <NA>         NA  0.915 No   
#>  3  2018     3 2 [ballot b] 42    White Male  Disa… Disagr…       1  0.609 No   
#>  4  2018     4 2 [ballot b] 63    White Fema… Disa… Disagr…       1  0.642 No   
#>  5  2018     5 3 [ballot c] 71    Black Male  <NA>  <NA>         NA  0.396 No   
#>  6  2018     6 1 [ballot a] 67    White Fema… Disa… Disagr…       1  0.529 No   
#>  7  2018     7 3 [ballot c] 59    Black Fema… <NA>  <NA>         NA  1.61  No   
#>  8  2018     8 3 [ballot c] 43    White Male  <NA>  <NA>         NA  0.672 No   
#>  9  2018     9 2 [ballot b] 62    White Fema… Stro… Disagr…       1  0.594 No   
#> 10  2018    10 2 [ballot b] 55    White Male  Disa… Disagr…       1  0.482 No   
#> # ℹ 2,338 more rows

## Put in a survey object
options(survey.lonely.psu = "adjust")
options(na.action="na.pass")

gss_svy <- gss_fam |>
  mutate(stratvar = interaction(year, vstrat)) |>
  as_survey_design(id = vpsu,
                   strata = stratvar,
                   weights = wtssps,
                   nest = TRUE)

gss_svy
#> Stratified 1 - level Cluster Sampling design (with replacement)
#> With (156) clusters.
#> Called via srvyr
#> Sampling variables:
#>  - ids: vpsu
#>  - strata: stratvar
#>  - weights: wtssps
#> Data variables: year (int), id (dbl), ballot (dbl+lbl), age (dbl+lbl), race
#>   (fct), sex (fct), fefam (fct), vpsu (dbl), vstrat (dbl), wtssps (dbl), young
#>   (chr), fefam_d (fct), fefam_n (dbl), stratvar (fct)
```


### The Cumulative Data File

The GSS cumulative data file is large. It is not loaded by default when
you invoke the package. (That is, `gssr` does not use R’s “lazy loading”
facility. The data file is too big to do this without error.) To load
one of the datasets, first load the library and then use `data()` to
make the data available. For example, load the cumulative GSS file like
this:

``` r
data(gss_all)
```

This will take a moment. Once it is ready, the `gss_all` object is
available to use in the usual way:

``` r
gss_all
#> # A tibble: 72,390 × 6,694
#>    year         id wrkstat    hrs1        hrs2        evwork      occ   prestige
#>    <dbl+lbl> <dbl> <dbl+lbl>  <dbl+lbl>   <dbl+lbl>   <dbl+lbl>   <dbl> <dbl+lb>
#>  1 1972          1 1 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 205   50      
#>  2 1972          2 5 [retire… NA(i) [iap] NA(i) [iap]     1 [yes] 441   45      
#>  3 1972          3 2 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 270   44      
#>  4 1972          4 1 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap]   1   57      
#>  5 1972          5 7 [keepin… NA(i) [iap] NA(i) [iap]     1 [yes] 385   40      
#>  6 1972          6 1 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 281   49      
#>  7 1972          7 1 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 522   41      
#>  8 1972          8 1 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 314   36      
#>  9 1972          9 2 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 912   26      
#> 10 1972         10 1 [workin… NA(i) [iap] NA(i) [iap] NA(i) [iap] 984   18      
#> # ℹ 72,380 more rows
#> # ℹ 6,686 more variables: wrkslf <dbl+lbl>, wrkgovt <dbl+lbl>,
#> #   commute <dbl+lbl>, industry <dbl+lbl>, occ80 <dbl+lbl>, prestg80 <dbl+lbl>,
#> #   indus80 <dbl+lbl>, indus07 <dbl+lbl>, occonet <dbl+lbl>, found <dbl+lbl>,
#> #   occ10 <dbl+lbl>, occindv <dbl+lbl>, occstatus <dbl+lbl>, occtag <dbl+lbl>,
#> #   prestg10 <dbl+lbl>, prestg105plus <dbl+lbl>, indus10 <dbl+lbl>,
#> #   indstatus <dbl+lbl>, indtag <dbl+lbl>, marital <dbl+lbl>, …
```

In addition to the integrated help, information about the variables is also contained in the `gss_dict`
object:

``` r
data(gss_dict)
gss_dict
#> # A tibble: 6,663 × 12
#>      pos variable label     missing var_doc_label value_labels var_text years   
#>    <int> <chr>    <chr>       <int> <chr>         <chr>        <chr>    <list>  
#>  1     1 year     gss year…       0 gss year for… [NA(d)] don… None     <NULL>  
#>  2     2 wrkstat  labor fo…      36 labor force … [1] working… 1. Last… <tibble>
#>  3     3 hrs1     number o…   30830 number of ho… [89] 89+ ho… 1a. If … <tibble>
#>  4     4 hrs2     number o…   70989 number of ho… [89] 89+ ho… 1b. If … <tibble>
#>  5     5 evwork   ever wor…   46944 ever work as… [1] yes; [2… 1c. If … <tibble>
#>  6     6 occ      r's cens…   48123 r's census o… [NA(d)] don… 2a. Wha… <tibble>
#>  7     7 prestige r's occu…   48123 r's occupati… [NA(d)] don… 2a. Wha… <tibble>
#>  8     8 wrkslf   r self-e…    4041 r self-emp o… [1] self-em… 2e. (Ar… <tibble>
#>  9     9 wrkgovt  govt or …   44311 govt or priv… [1] governm… 2f. (Ar… <tibble>
#> 10    10 commute  travel t…   71060 travel time … [97] 97+ mi… 2g. Abo… <tibble>
#> # ℹ 6,653 more rows
#> # ℹ 4 more variables: var_yrtab <list>, col_type <chr>, var_type <chr>,
#> #   var_na_codes <chr>
```

There are also a few convenience functions. For example, to see which years some questions were ask, use `gss_which_years()`:

``` r
gss_all |> 
  gss_which_years(c(industry, indus80, wrkgovt, commute)) |> 
  print(n = Inf)

## # A tibble: 34 × 5
##    year      industry indus80 wrkgovt commute
##    <dbl+lbl> <lgl>    <lgl>   <lgl>   <lgl>  
##  1 1972      TRUE     FALSE   FALSE   FALSE  
##  2 1973      TRUE     FALSE   FALSE   FALSE  
##  3 1974      TRUE     FALSE   FALSE   FALSE  
##  4 1975      TRUE     FALSE   FALSE   FALSE  
##  5 1976      TRUE     FALSE   FALSE   FALSE  
##  6 1977      TRUE     FALSE   FALSE   FALSE  
##  7 1978      TRUE     FALSE   FALSE   FALSE  
##  8 1980      TRUE     FALSE   FALSE   FALSE  
##  9 1982      TRUE     FALSE   FALSE   FALSE  
## 10 1983      TRUE     FALSE   FALSE   FALSE  
## 11 1984      TRUE     FALSE   FALSE   FALSE  
## 12 1985      TRUE     FALSE   TRUE    FALSE  
## 13 1986      TRUE     FALSE   TRUE    TRUE   
## 14 1987      TRUE     FALSE   FALSE   FALSE  
## 15 1988      TRUE     TRUE    FALSE   FALSE  
## 16 1989      TRUE     TRUE    FALSE   FALSE  
## 17 1990      TRUE     TRUE    FALSE   FALSE  
## 18 1991      FALSE    TRUE    FALSE   FALSE  
## 19 1993      FALSE    TRUE    FALSE   FALSE  
## 20 1994      FALSE    TRUE    FALSE   FALSE  
## 21 1996      FALSE    TRUE    FALSE   FALSE  
## 22 1998      FALSE    TRUE    FALSE   FALSE  
## 23 2000      FALSE    TRUE    TRUE    FALSE  
## 24 2002      FALSE    TRUE    TRUE    FALSE  
## 25 2004      FALSE    TRUE    TRUE    FALSE  
## 26 2006      FALSE    TRUE    TRUE    FALSE  
## 27 2008      FALSE    TRUE    TRUE    FALSE  
## 28 2010      FALSE    TRUE    TRUE    FALSE  
## 29 2012      FALSE    FALSE   TRUE    FALSE  
## 30 2014      FALSE    FALSE   TRUE    FALSE  
## 31 2016      FALSE    FALSE   TRUE    FALSE  
## 32 2018      FALSE    FALSE   TRUE    FALSE  
## 33 2021      FALSE    FALSE   FALSE   FALSE  
## 34 2022      FALSE    FALSE   FALSE   FALSE 
```
