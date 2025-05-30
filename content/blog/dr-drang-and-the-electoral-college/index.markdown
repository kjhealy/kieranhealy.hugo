---
title: "Dr Drang and the Electoral College"
date: 2024-09-06T12:22:48-04:00
categories: [r,nerdery]
footnotes: false
htmlwidgets: false
mathjax: false
---

The other week, the Internet's most beloved [creepy snowman](https://leancrew.com/all-this/) wrote a blog post where he showed how to use a little Python to [group states by their number of electoral college votes](https://leancrew.com/all-this/2024/08/pandas-and-the-electoral-college/) to make a table like this:

| Electors |           States           | PopPct|  ECPct|
|:--------:|:--------------------------:|------:|------:|
|    3     | AK, DE, DC, ND, SD, VT, WY |  1.61%|  3.90%|
|    4     | HI, ID, ME, MT, NH, RI, WV |  3.04%|  5.20%|
|    5     |           NE, NM           |  1.22%|  1.86%|
|    6     |   AR, IA, KS, MS, NV, UT   |  5.60%|  6.69%|
|    7     |           CT, OK           |  2.29%|  2.60%|
|    8     |         KY, LA, OR         |  3.98%|  4.46%|
|    9     |           AL, SC           |  3.13%|  3.35%|
|    10    |     CO, MD, MN, MO, WI     |  8.93%|  9.29%|
|    11    |       AZ, IN, MA, TN       |  8.49%|  8.18%|
|    12    |             WA             |  2.33%|  2.23%|
|    13    |             VA             |  2.60%|  2.42%|
|    14    |             NJ             |  2.77%|  2.60%|
|    15    |             MI             |  3.00%|  2.79%|
|    16    |           GA, NC           |  6.53%|  5.95%|
|    17    |             OH             |  3.52%|  3.16%|
|    19    |           IL, PA           |  7.62%|  7.06%|
|    28    |             NY             |  5.84%|  5.20%|
|    30    |             FL             |  6.75%|  5.58%|
|    40    |             TX             |  9.11%|  7.43%|
|    54    |             CA             | 11.63%| 10.04%|


In fact, he wrote two versions of the the post. The first one used Python's `Pandas` library to get the data in shape, but some of the code Dr Drang wrote was still based around nested loops:

{{< code python >}}
# Print out the summary table
print('State EC   States   Population   Pop Pct   Electors   EC Pct')
for k, v in dfg:
  print(f'    {k:2d}       {v.State.count():2d}    {v.Population.sum():11,d}\
    {v.PopPct.sum():6.2%}     {v.Electors.sum():3d}     {v.ECPct.sum():6.2%}')

{{< /code >}}

Subsequently, after a conversation with [ondaiwai](https://mastodon.social/@odaiwai/113048833410968320) on Mastodon, he rewrote the code to take advantage of Pandas' `agg` function to abstract that loop away. The new code is shown in his [follow-up post](https://leancrew.com/all-this/2024/08/the-electoral-college-again-this-time-with-aggregation/). What `agg` does is manage the group-and-calculate process in a more elegant and readable manner, one that also generalizes more easily to larger numbers of groups and additional kinds of calculation. To be clear, there is nothing wrong with loops as a construction. And, indeed, somewhere in the underlying implementation you will find the loops are still there, beavering away. Rather, the idea is that by introducing a bit of abstraction we end up with a somewhat more expressive and composable way of working with our data. 

At the moment I'm teaching a course that introduces some related ideas to students. I teach it in R, so here I'm going to present essentially the same solution in R that Dr Drang wrote in Python. I'll use the Tidyverse package because that's what I'm teaching with. My goal here, to forestall any tedious remarks from people less intrinsically reasonable than Dr Drang, is not to show a better or faster way to do things, or to get into some boring Python vs R vs Why Don't You Just Rewrite It In Rust argument. Rather, the point is that in both cases we use the same abstractions, often with the same names. In R's terms, we want to move from working with loops to doing things in, loosely speaking, a vectorized manner that's more amenable to being expressed as the application of a sequence of functions. 

The first and most important abstraction that Pandas and R in general share here is a kind of data structure: the dataframe. R was originally written to do data analysis so it comes with that concept built-in. Pandas (and also Polars) add it to Python. A dataframe is just a rectangular table where the columns can be of different types. That is, unlike matrices or arrays or whatever, one column might be made of integers, but the next of character strings, and the next of logical values or date-times, and so on. This is the way tables of data present themselves to us "naturally", as it were. Having something built-in to your programming language that directly represents data in that way is terrifically useful.

The second kind of abstraction, the one that led Dr Drang to rewrite his original post, is some sort of concept of grouping and then acting on pieces of data in order to get something new out the other side. The general idea is sometimes called a _split-apply-combine_ strategy for analysis. We have a table of data; we _split_ it into pieces, e.g. by one of the categorical variables in the table, or according to some other criterion; we _apply_ a function or operation to each of the pieces, which produces some result for each piece; and then we _combine_ the results back into a new table. 

In this case we start with a table of state-level information about how many electors each state has, and what its population is. We want to end up with an "elector-level" table where the rows are numbers of electors and the values (total population, etc) are aggregated from all the states with that many electors. So we split our original state-level table into groups based on the number of electors. Seven states have three electors each. Two states have sixteen electors. And so on. Then we calculate some new quantities within these groupings---e.g. the total population living in "3 Elector" states; the percentage of the overall population that is, etc. Then we combine the results into a new table. 

Dr Drang did this in Python. Here's one way to do it in R. For ease of comparison, I'll mostly replicate Dr Drang's formatting and labeling.

First we read in the data, and create the `PopPct` and `ECPct` columns:

{{< code r >}}
library(tidyverse)

# Import the CSV and create PopPCT and ECPct
df <- read_csv("states.csv", show_col_types = FALSE) |>
  mutate(PopPct = Population/sum(Population),
         ECPct = Electors/sum(Electors))

df
#> # A tibble: 51 × 6
#>    State                Abbrev Population Electors  PopPct   ECPct
#>    <chr>                <chr>       <dbl>    <dbl>   <dbl>   <dbl>
#>  1 Alabama              AL        5108468        9 0.0153  0.0167 
#>  2 Alaska               AK         733406        3 0.00219 0.00558
#>  3 Arizona              AZ        7431344       11 0.0222  0.0204 
#>  4 Arkansas             AR        3067732        6 0.00916 0.0112 
#>  5 California           CA       38965193       54 0.116   0.100  
#>  6 Colorado             CO        5877610       10 0.0175  0.0186 
#>  7 Connecticut          CT        3617176        7 0.0108  0.0130 
#>  8 Delaware             DE        1031890        3 0.00308 0.00558
#>  9 District of Columbia DC         678972        3 0.00203 0.00558
#> 10 Florida              FL       22610726       30 0.0675  0.0558 
#> # ℹ 41 more rows

{{< /code >}}

We don't really need the whole Tidyverse to do what we want here, but we'll just import it for convenience. We put the data in an object called `df`. It's a dataframe. (A "tibble" is the tidverse's name for a dataframe with some nice printing methods and other features added.) In this way of writing R we use the pipe, `|>` to move from step to step. Conceptually it's just like a Unix pipe, which is to say you read it as "and then". You do a thing, and then pass that on down the pipeline to the next function, which does another thing. 

One feature of R in this step is that we can write `PopPct = Population/sum(Population)` to get the population proportion for each row. That's because the calculation is vectorized: the `Population` in the numerator will be each element of the `Population` vector (i.e. each row of the table). The `sum(Population)` in the denominator will be the sum of all the elements of that vector. This way of writing things is very handy and, again, is a "natural" way to express many kinds of calculation that arise when we are doing arithmetic on tables.

Next, we'll do the initial aggregation to group by `Electors` and calculate the summary measures. We could have done this all in one breath above, just by adding more steps to the pipeline, but I've broken it out for ease of reading. This is the "Quick and Dirty Table" from Dr Drang's post. We start with our `df`, group by Electors and then, within each group, count up how many states there are, sum how many electors there are, and also sum the remaining proportion columns. The `across(where())` bit establishes a test for each column (is it numeric?) and `sum` is the function that's applied to each column that meets the test. These calculations are done by the grouping we set in the previous step in the pipeline. 

{{< code r >}}

df |>
  group_by(Electors) |>
  summarize(State_n = n(),
            Electors_n = sum(Electors),
            across(where(is.numeric), sum))

#> # A tibble: 20 × 6
#>    Electors State_n Electors_n Population PopPct  ECPct
#>       <dbl>   <int>      <dbl>      <dbl>  <dbl>  <dbl>
#>  1        3       7         21    5379033 0.0161 0.0390
#>  2        4       7         28   10196485 0.0304 0.0520
#>  3        5       2         10    4092750 0.0122 0.0186
#>  4        6       6         36   18766882 0.0560 0.0669
#>  5        7       2         14    7671000 0.0229 0.0260
#>  6        8       3         24   13333261 0.0398 0.0446
#>  7        9       2         18   10482023 0.0313 0.0335
#>  8       10       5         50   29902889 0.0893 0.0929
#>  9       11       4         44   28421431 0.0849 0.0818
#> 10       12       1         12    7812880 0.0233 0.0223
#> 11       13       1         13    8715698 0.0260 0.0242
#> 12       14       1         14    9290841 0.0277 0.0260
#> 13       15       1         15   10037261 0.0300 0.0279
#> 14       16       2         32   21864718 0.0653 0.0595
#> 15       17       1         17   11785935 0.0352 0.0316
#> 16       19       2         38   25511372 0.0762 0.0706
#> 17       28       1         28   19571216 0.0584 0.0520
#> 18       30       1         30   22610726 0.0675 0.0558
#> 19       40       1         40   30503301 0.0911 0.0743
#> 20       54       1         54   38965193 0.116  0.100

{{< /code >}}

You might have noticed that the `Abbrev` column disappeared in the `summarize()` step. This is because we didn't explicitly use it to create any column of the summary table, so there's no place for it. This would also be true of any other columns the `df` might have that we weren't interested in summarizing just now.

Finally, we want to make the nice Markdown version of the table. It's much the same as before. The difference is that we'll use the state abbreviations (this time it's the full State names that disappear). During the summary step, when the rows are grouped by `Electors`, the `paste0` function  collapses them into a single string whose elements are separated by a ", ". We also calculate the grouped proportions as before in `PopPct` and`ECPct`. Once we've summarized the table, we need to format those proportions as percentages rounded to two decimal places. We apply the `label_percent()` function to those two columns, which does the job for us. We have to write that using the notation for an anonymous, or lambda, function, `\(x) function(x)` because `label_percent()` is a function factory: it's a function that can be given arguments, but whose output is itself a function that accepts an argument (in this case, `x`, a vector of numbers to format as percentages). This is why it's written in the form `label_percent(accuracy=0.01)(x)`. Finally, we grab the `kable()` function from the `knitr` package to take the cleaned-up dataframe as input and output the actual markdown.

{{< code r >}}
df |>
  group_by(Electors) |>
  summarize(States = paste0(Abbrev, collapse = ", "), 
            across(c("PopPct", "ECPct"), sum)) |>
  mutate(across(
    c("PopPct", "ECPct"),
    \(x) scales::label_percent(accuracy = 0.01)(x)
  )) |>
  knitr::kable(align = "ccrr")


| Electors |           States           | PopPct|  ECPct|
|:--------:|:--------------------------:|------:|------:|
|    3     | AK, DE, DC, ND, SD, VT, WY |  1.61%|  3.90%|
|    4     | HI, ID, ME, MT, NH, RI, WV |  3.04%|  5.20%|
|    5     |           NE, NM           |  1.22%|  1.86%|
|    6     |   AR, IA, KS, MS, NV, UT   |  5.60%|  6.69%|
|    7     |           CT, OK           |  2.29%|  2.60%|
|    8     |         KY, LA, OR         |  3.98%|  4.46%|
|    9     |           AL, SC           |  3.13%|  3.35%|
|    10    |     CO, MD, MN, MO, WI     |  8.93%|  9.29%|
|    11    |       AZ, IN, MA, TN       |  8.49%|  8.18%|
|    12    |             WA             |  2.33%|  2.23%|
|    13    |             VA             |  2.60%|  2.42%|
|    14    |             NJ             |  2.77%|  2.60%|
|    15    |             MI             |  3.00%|  2.79%|
|    16    |           GA, NC           |  6.53%|  5.95%|
|    17    |             OH             |  3.52%|  3.16%|
|    19    |           IL, PA           |  7.62%|  7.06%|
|    28    |             NY             |  5.84%|  5.20%|
|    30    |             FL             |  6.75%|  5.58%|
|    40    |             TX             |  9.11%|  7.43%|
|    54    |             CA             | 11.63%| 10.04%|

{{< /code >}}

And we're done. To reiterate, all I wanted to do here was show how basically the same  abstractions---specifically the idea of a dataframe, and the idea of splitting it up into subunits and applying functions those units---are useful when working with data, which is why they're present in the data-focused toolkits of different programming languages. 
