---
title: "Iterating on the GSS"
date: 2022-04-08T17:57:54-04:00
categories: [sociology,R,gss,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Let’s say we’re working with the General Social Survey. We’re
interested in repeatedly fitting some model each year to see how some
predictor changes over time. For example, the GSS has
a longstanding question named `fefam`, where respondents are asked to
give their opinion on the following statement:

> It is much better for everyone involved if the man is the achiever
> outside the home and the woman takes care of the home and family.

Respondents may answer that they Strongly Agree, Agree, Disagree, or
Strongly Disagree with the statement (as well as refusing to answer, or
saying they don’t know). Perhaps we’re interested in what predicts
respondents being inclined to agree with the statement.

## Setup

First we load the packages we’ll need.

{{< code r >}}
library(tidyverse)
library(survey)
library(srvyr)
library(broom)
library(gssr) # https://kjhealy.github.io/gssr
{{< /code >}}

Next, the data.

{{< code r >}}
data(gss_all)
gss_all

## # A tibble: 68,846 × 6,311
##     year    id    wrkstat  hrs1  hrs2      evwork   occ prestige  wrkslf wrkgovt
##    <dbl> <dbl>  <dbl+lbl> <dbl> <dbl>   <dbl+lbl> <dbl>    <dbl> <dbl+l> <dbl+l>
##  1  1972     1 1 [workin… NA(i) NA(i) NA(i)         205       50 2 [som…   NA(i)
##  2  1972     2 5 [retire… NA(i) NA(i)     1 [yes]   441       45 2 [som…   NA(i)
##  3  1972     3 2 [workin… NA(i) NA(i) NA(i)         270       44 2 [som…   NA(i)
##  4  1972     4 1 [workin… NA(i) NA(i) NA(i)           1       57 2 [som…   NA(i)
##  5  1972     5 7 [keepin… NA(i) NA(i)     1 [yes]   385       40 2 [som…   NA(i)
##  6  1972     6 1 [workin… NA(i) NA(i) NA(i)         281       49 2 [som…   NA(i)
##  7  1972     7 1 [workin… NA(i) NA(i) NA(i)         522       41 2 [som…   NA(i)
##  8  1972     8 1 [workin… NA(i) NA(i) NA(i)         314       36 2 [som…   NA(i)
##  9  1972     9 2 [workin… NA(i) NA(i) NA(i)         912       26 2 [som…   NA(i)
## 10  1972    10 1 [workin… NA(i) NA(i) NA(i)         984       18 2 [som…   NA(i)
## # … with 68,836 more rows, and 6,301 more variables: commute <dbl>,
## #   industry <dbl>, occ80 <dbl>, prestg80 <dbl>, indus80 <dbl+lbl>,
## #   indus07 <dbl>, occonet <dbl>, found <dbl>, occ10 <dbl+lbl>, occindv <dbl>,
## #   occstatus <dbl>, occtag <dbl>, prestg10 <dbl>, prestg105plus <dbl>,
## #   indus10 <dbl+lbl>, indstatus <dbl>, indtag <dbl>, marital <dbl+lbl>,
## #   martype <dbl+lbl>, agewed <dbl>, divorce <dbl+lbl>, widowed <dbl+lbl>,
## #   spwrksta <dbl+lbl>, sphrs1 <dbl+lbl>, sphrs2 <dbl+lbl>, …
{{< /code >}}

We select the subset of variables of interest, together with the survey
weights, which we'll use later on.

{{< code r >}}
cont_vars <- c("year", "id", "ballot", "age")
cat_vars <- c("race", "sex", "fefam")
wt_vars <- c("vpsu",
             "vstrat",
             "oversamp",
             "formwt",              # weight to deal with experimental randomization
             "wtssall",              # weight variable
             "sampcode",            # sampling error code
             "sample")              # sampling frame and method
my_vars <- c(cont_vars, cat_vars, wt_vars)

# clean up labeled vars as we go, create compwt
gss_df <- gss_all %>%
  filter(year > 1974 & year < 2021) %>% 
  select(all_of(my_vars)) %>% 
  mutate(across(everything(), haven::zap_missing), # Convert labeled missing to regular NA
         across(all_of(wt_vars), as.numeric),
         across(all_of(cat_vars), as_factor), 
         across(all_of(cat_vars), fct_relabel, tolower),
         across(all_of(cat_vars), fct_relabel, tools::toTitleCase),
         compwt = oversamp * formwt * wtssall)
{{< /code >}}

The outcome we’re interested in is `fefam`:

{{< code r >}} 
gss_df %>% 
  count(fefam) 

## # A tibble: 5 × 2
##   fefam                 n
##   <fct>             <int>
## 1 Strongly Agree     2543
## 2 Agree              8992
## 3 Disagree          13061
## 4 Strongly Disagree  5479
## 5 <NA>              30138
{{< /code >}}

We’ll recode it so that it’s a binary outcome:

{{< code r >}}
gss_df <- gss_df %>% 
  mutate(fefam_d = forcats::fct_recode(fefam,
                                  Agree = "Strongly Agree",
                                  Disagree = "Strongly Disagree"),
    fefam_n = recode(fefam_d, "Agree" = 1, "Disagree" = 0))

# factor version
gss_df %>% 
  count(fefam_d) 

## # A tibble: 3 × 2
##   fefam_d      n
##   <fct>    <int>
## 1 Agree    11535
## 2 Disagree 18540
## 3 <NA>     30138

# numeric version, 1 is "Agree"
gss_df %>% 
  count(fefam_n) 

## # A tibble: 3 × 2
##   fefam_n     n
##     <dbl> <int>
## 1       0 18540
## 2       1 11535
## 3      NA 30138
{{< /code >}}

## Unweighted models

Let’s predict whether a respondent agrees with the `fefam` statement
based on their age, sex, and race. If we want to fit a model for the
entire dataset and do not care about survey weights, then we can do the
following.

{{< code r >}}
out_all <- glm(fefam_n ~ age + sex + race, 
              data = gss_df, 
              family="binomial", 
              na.action = na.omit)

summary(out_all)

## 
## Call:
## glm(formula = fefam_n ~ age + sex + race, family = "binomial", 
##     data = gss_df, na.action = na.omit)
## 
## Deviance Residuals: 
##     Min       1Q   Median       3Q      Max  
## -1.6809  -0.9516  -0.7550   1.1813   1.8716  
## 
## Coefficients:
##               Estimate Std. Error z value Pr(>|z|)    
## (Intercept) -1.9185878  0.0399581 -48.015  < 2e-16 ***
## age          0.0323648  0.0007275  44.486  < 2e-16 ***
## sexFemale   -0.2247518  0.0248741  -9.036  < 2e-16 ***
## raceBlack    0.0668275  0.0363201   1.840   0.0658 .  
## raceOther    0.3659411  0.0493673   7.413 1.24e-13 ***
## ---
## Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
## 
## (Dispersion parameter for binomial family taken to be 1)
## 
##     Null deviance: 39921  on 29980  degrees of freedom
## Residual deviance: 37746  on 29976  degrees of freedom
##   (30232 observations deleted due to missingness)
## AIC: 37756
## 
## Number of Fisher Scoring iterations: 4
{{< /code >}}


We can get `broom` to give us a tidy summary of the results:

{{< code r >}}
tidy(out_all)

## # A tibble: 5 × 5
##   term        estimate std.error statistic  p.value
##   <chr>          <dbl>     <dbl>     <dbl>    <dbl>
## 1 (Intercept)  -1.92    0.0400      -48.0  0       
## 2 age           0.0324  0.000728     44.5  0       
## 3 sexFemale    -0.225   0.0249       -9.04 1.63e-19
## 4 raceBlack     0.0668  0.0363        1.84 6.58e- 2
## 5 raceOther     0.366   0.0494        7.41 1.24e-13
{{< /code >}}

We are primarily interested in getting annual estimates of the same
model. At this point it might be tempting to write a loop, taking a
piece of the dataset, fitting the model, and saving the results to an
object or a file. But if we do that we will end up doing things like
explicitly “growing” an object a piece (i.e. a year) at a time, and we
will also have to worry about keeping track of every object we create
and so on. It’s better to do the iteration directly in the pipeline via
grouping instead.

Again, if we are ignoring the weights, we can do this:

{{< code r >}}
out_yr <- gss_df %>% 
  group_by(year) %>% 
  group_map_dfr(possibly(~ tidy(glm(fefam_n ~ age + sex + race, 
                       data = .x, 
                       family = "binomial", 
                       na.action = na.omit), 
                       conf.int = TRUE), 
                     otherwise = NULL))

out_yr

## # A tibble: 105 × 8
##     year term        estimate std.error statistic  p.value conf.low conf.high
##    <dbl> <chr>          <dbl>     <dbl>     <dbl>    <dbl>    <dbl>     <dbl>
##  1  1977 (Intercept)  -1.20     0.178      -6.75  1.47e-11  -1.55     -0.854 
##  2  1977 age           0.0483   0.00388    12.4   1.56e-35   0.0408    0.0561
##  3  1977 sexFemale    -0.341    0.118      -2.90  3.77e- 3  -0.572    -0.111 
##  4  1977 raceBlack    -0.0613   0.180      -0.340 7.34e- 1  -0.412     0.295 
##  5  1977 raceOther     0.188    0.576       0.326 7.44e- 1  -0.912     1.40  
##  6  1985 (Intercept)  -1.89     0.168     -11.2   2.89e-29  -2.23     -1.56  
##  7  1985 age           0.0432   0.00332    13.0   1.03e-38   0.0368    0.0498
##  8  1985 sexFemale    -0.261    0.112      -2.34  1.94e- 2  -0.481    -0.0426
##  9  1985 raceBlack     0.148    0.189       0.782 4.34e- 1  -0.223     0.519 
## 10  1985 raceOther    -0.319    0.338      -0.944 3.45e- 1  -1.00      0.329 
## # … with 95 more rows
{{< /code >}}

Pretty neat, right? That’s a compact way to produce tidied estimates for a series of
regressions.

What’s happening in the pipeline? Fundamentally, we group the data by
year, run a `glm()` on each year, and then immediately `tidy()` the
output. The call to `group_map_dfr()` binds all the tidied output
together by row, with `year` acting as an index column. The `.x` there
in `data = .x` is a dplyr placeholder that means in general “the thing
we’re computing on right now”, and in this specific case “the data for a
specific year as we go down the list of years”.

You you can see from the output that we have no results before 1977 or
between 1977 and 1985. That’s because the `fefam` question was not asked
during those years. If we just ran the `glm()` call directly with
`group_map_dfr()` it would fail because of this. We’d get this error:

{{< code r >}}
#> Error in `contrasts<-`(`*tmp*`, value = contr.funs[1 + isOF[nn]]) : 
#>  contrasts can be applied only to factors with 2 or more levels
{{< /code >}}

This is the `glm()` function saying “You’ve asked me to run this model
that contains a factor but I can’t because the factor has no levels”.
The reason it has no levels is that there’s no data at all, because the
question wasn’t asked that year, so the model fails.

To avoid this, we wrap the function call in `possibly()`. This is a
function from `purrr` that says “Try something, but if it fails do the
following instead”. So we ask, in effect,

{{< code r >}}
possibly(~ tidy(glm()), otherwise = NULL)
{{< /code >}}

Each time the model fails we get a `NULL` result and the assembly of our
final table of output can continue. In this case we know the dataset
well enough and the model is simple enough that the only reason the
model fails should be if the question wasn’t asked that year. But more
generally, when running a sequence of independent tasks it’s good to
have code that (a) can fail gracefully, (b) continue to run even if one
piece fails, and (c) allows for some investigation of the errors later.
The `purrr` package has several related functions—`possibly()`,
`safely()`, and `quietly()`—that make this easier in pipelined code.

With our tidied output we could make a plot like this:

{{< code r >}}
out_yr %>% 
  filter(term == "sexFemale") %>% 
  ggplot(mapping = aes(x = year, 
                       y = estimate,
                       ymin = conf.low,
                       ymax = conf.high)) +
  geom_hline(yintercept = 0, linetype = "dotted") + 
  geom_line() + 
  geom_pointrange() + 
  theme_bw()
{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/gss-fefam-example-1.png" alt="GSS fefam example" caption="Our (unweighted) coefficient over time." %}}



## Tables and models on the weighted data

The proper used of survey weights in regression models is a thing people
argue about, but I won’t pursue that here. We can turn the tibble into a
survey object by integrating the weights and other sampling information
using Thomas Lumley’s `survey` package, and Greg Freedman Ellis’s
`srvyr`, which integrates `survey` functions with the tidyverse.

First we create a survey design object. This is our GSS data with
additional information wrapped around it.

{{< code r >}}
options(survey.lonely.psu = "adjust")
options(na.action="na.pass")

## Before 1975 vpsus are not available
gss_svy <- gss_df %>%
  filter(year > 1974) %>%  
  mutate(stratvar = interaction(year, vstrat)) %>%
  as_survey_design(id = vpsu,
                     strata = stratvar,
                     weights = compwt,
                     nest = TRUE)
gss_svy

## Stratified 1 - level Cluster Sampling design (with replacement)
## With (4555) clusters.
## Called via srvyr
## Sampling variables:
##  - ids: vpsu
##  - strata: stratvar
##  - weights: compwt
## Data variables: year (dbl), id (dbl), ballot (dbl+lbl), age (dbl+lbl), race
##   (fct), sex (fct), fefam (fct), vpsu (dbl), vstrat (dbl), oversamp (dbl),
##   formwt (dbl), wtssall (dbl), sampcode (dbl), sample (dbl), compwt (dbl),
##   fefam_d (fct), fefam_n (dbl), stratvar (fct)
{{< /code >}}

We’re now in a position to calculate some properly-weighted summary
statistics. For example:

{{< code r >}}
gss_svy %>%
  drop_na(fefam_d) %>% 
  group_by(year, sex, race, fefam_d) %>%
  summarize(prop = survey_mean(na.rm = TRUE, 
                               vartype = "ci"))

## # A tibble: 252 × 7
## # Groups:   year, sex, race [126]
##     year sex    race  fefam_d   prop prop_low prop_upp
##    <dbl> <fct>  <fct> <fct>    <dbl>    <dbl>    <dbl>
##  1  1977 Male   White Agree    0.694   0.655     0.732
##  2  1977 Male   White Disagree 0.306   0.268     0.345
##  3  1977 Male   Black Agree    0.686   0.564     0.807
##  4  1977 Male   Black Disagree 0.314   0.193     0.436
##  5  1977 Male   Other Agree    0.632   0.357     0.906
##  6  1977 Male   Other Disagree 0.368   0.0936    0.643
##  7  1977 Female White Agree    0.640   0.601     0.680
##  8  1977 Female White Disagree 0.360   0.320     0.399
##  9  1977 Female Black Agree    0.553   0.472     0.634
## 10  1977 Female Black Disagree 0.447   0.366     0.528
## # … with 242 more rows
{{< /code >}}

Let’s fit our model again, this time with `svyglm()` instead of `glm()`.
The arguments are slightly different: `data` becomes `design`, and the
“binomial” family becomes `quasibinomial()` for reasons explained in the
`svyglm()` documentation.

{{< code r >}}
out_svy_all <- svyglm(fefam_n ~ age + sex + race, 
                  design = gss_svy, 
                  family = quasibinomial(),
                  na.action = na.omit)
{{< /code >}}                      

Broom gives us a tidy table of the estimates:

{{< code r >}}
tidy(out_svy_all)

## # A tibble: 5 × 5
##   term        estimate std.error statistic   p.value
##   <chr>          <dbl>     <dbl>     <dbl>     <dbl>
## 1 (Intercept)  -1.83    0.0480     -38.1   3.04e-232
## 2 age           0.0311  0.000853    36.4   5.29e-217
## 3 sexFemale    -0.240   0.0279      -8.63  1.40e- 17
## 4 raceBlack     0.0285  0.0436       0.653 5.14e-  1
## 5 raceOther     0.385   0.0589       6.52  8.87e- 11
{{< /code >}}

Again, we are interested in annual estimates. We use `group_map_dfr()`
and `possibly()` again:

{{< code r >}}
out_svy_yrs <- gss_svy %>% 
  group_by(year) %>% 
  group_map_dfr(possibly(~ tidy(svyglm(fefam_n ~ age + sex + race, 
                       design = .x, 
                       family = quasibinomial(),
                       na.action = na.omit),
                       conf.int = TRUE), 
                     otherwise = NULL))

out_svy_yrs

## # A tibble: 105 × 8
##     year term        estimate std.error statistic  p.value conf.low conf.high
##    <dbl> <chr>          <dbl>     <dbl>     <dbl>    <dbl>    <dbl>     <dbl>
##  1  1977 (Intercept)  -1.09     0.184      -5.93  3.74e- 7  -1.46    -0.720  
##  2  1977 age           0.0469   0.00403    11.6   2.63e-15   0.0388   0.0550 
##  3  1977 sexFemale    -0.344    0.126      -2.73  9.05e- 3  -0.599   -0.0901 
##  4  1977 raceBlack    -0.144    0.215      -0.669 5.07e- 1  -0.576    0.288  
##  5  1977 raceOther     0.276    0.552       0.500 6.19e- 1  -0.835    1.39   
##  6  1985 (Intercept)  -1.90     0.205      -9.29  1.79e-12  -2.31    -1.49   
##  7  1985 age           0.0447   0.00377    11.9   3.86e-16   0.0371   0.0523 
##  8  1985 sexFemale    -0.268    0.135      -1.99  5.20e- 2  -0.538    0.00243
##  9  1985 raceBlack     0.119    0.293       0.405 6.88e- 1  -0.470    0.707  
## 10  1985 raceOther    -0.486    0.279      -1.75  8.69e- 2  -1.05     0.0731 
## # … with 95 more rows
{{< /code >}}

And here’s our quick plot again:

{{< code r >}}
out_svy_yrs %>% 
  filter(term == "sexFemale") %>% 
  ggplot(mapping = aes(x = year, 
                       y = estimate,
                       ymin = conf.low,
                       ymax = conf.high)) +
  geom_hline(yintercept = 0, linetype = "dotted") + 
  geom_line() + 
  geom_pointrange() + 
  theme_bw()
{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/gss-fefam-example-2.png" alt="GSS fefam example 2" caption="Our (survey-weighted) coefficient over time." %}}


## A quick word about `group_map()` and `group_map_dfr()`

Just like the `apply` family of functions in base R, the `map` family in
`purrr` is a way to iterate on data without explicitly writing a loop.
Because its operations are vectorized, R already does this with many
functions. If we start with some letters,

{{< code r >}}
letters

##  [1] "a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q" "r" "s"
## [20] "t" "u" "v" "w" "x" "y" "z"
{{< /code >}}

and we want to make them upper-case, we don’t have to write a loop. We
do

{{< code r >}}
toupper(letters)

##  [1] "A" "B" "C" "D" "E" "F" "G" "H" "I" "J" "K" "L" "M" "N" "O" "P" "Q" "R" "S"
## [20] "T" "U" "V" "W" "X" "Y" "Z"
{{< /code >}}

The `toupper()` function goes along each element of `letters` and
converts it. You can think of a `map` operation as generalizing this
idea. For example, here’s the first few rows and the first five columns
of the `mtcars` data:

{{< code r >}}
head(mtcars[,1:5])

##                    mpg cyl disp  hp drat
## Mazda RX4         21.0   6  160 110 3.90
## Mazda RX4 Wag     21.0   6  160 110 3.90
## Datsun 710        22.8   4  108  93 3.85
## Hornet 4 Drive    21.4   6  258 110 3.08
## Hornet Sportabout 18.7   8  360 175 3.15
## Valiant           18.1   6  225 105 2.76
{{< /code >}}

we can take the mean of each of these columns by using `map()` to feed
them one at a time to the `mean()` function.

{{< code r >}}
map(mtcars[,1:5], mean)

## $mpg
## [1] 20.09062
## 
## $cyl
## [1] 6.1875
## 
## $disp
## [1] 230.7219
## 
## $hp
## [1] 146.6875
## 
## $drat
## [1] 3.596563
{{< /code >}}

The `map()` function always returns a list. But variants of it return,
for example, a vector of numbers:

{{< code r >}}
map_dbl(mtcars[,1:5], mean)

##        mpg        cyl       disp         hp       drat 
##  20.090625   6.187500 230.721875 146.687500   3.596563
{{< /code >}}

When we’re working with data, we normally won’t use `map()` directly.
Instead various `dplyr` operations will do what we want, like this:

{{< code r >}}
mtcars %>% 
  summarize(across(everything(), 
                   mean))

##        mpg    cyl     disp       hp     drat      wt     qsec     vs      am
## 1 20.09062 6.1875 230.7219 146.6875 3.596563 3.21725 17.84875 0.4375 0.40625
##     gear   carb
## 1 3.6875 2.8125
{{< /code >}}

We can group by some variable and then summarize across all columns,
too:

{{< code r >}}
mtcars %>% 
  group_by(cyl) %>% 
  summarize(across(everything(), mean))

## # A tibble: 3 × 11
##     cyl   mpg  disp    hp  drat    wt  qsec    vs    am  gear  carb
##   <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl>
## 1     4  26.7  105.  82.6  4.07  2.29  19.1 0.909 0.727  4.09  1.55
## 2     6  19.7  183. 122.   3.59  3.12  18.0 0.571 0.429  3.86  3.43
## 3     8  15.1  353. 209.   3.23  4.00  16.8 0     0.143  3.29  3.5
{{< /code >}}

More complex grouped operations need a little more work. That’s what we
did above when we used `group_map_dfr()`. The function took our grouped
survey data and fed it a year at a time to a couple of nested functions
that produced tidied output from a glm. If you try using `group_map()`
instead in the code above you’ll see that you’ll get a *list* of tidied
results rather than a data frame with the groups bound together in
row-order—that’s what the `dfr` part means.

