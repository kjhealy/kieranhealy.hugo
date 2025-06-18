---
title: "Oh Leave it Out"
date: 2025-06-18T10:23:42-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Sometimes we want to repeatedly do things with all but one row of a data frame, where we systematically drop each row in turn and do the thing. For example, [jacknife cross-validation](https://en.wikipedia.org/wiki/Jackknife_resampling) is a kind of very basic bootstrap technique. (It is computationally simpler than and predates the bootstrap.) Or in some areas "leave-one-out" summary statistics are often calculated as a quick robustness check. Sometimes we want to do this within groups, perhaps especially when the groups may be small. 

First a quick reminder about one of R's conventions for referencing the elements of vectors and data frames. If we have

{{< code r >}}
letters
#>  [1] "a" "b" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q" "r" "s" "t" "u" "v" "w" "x" "y" "z"
{{< /code >}}

We can write e.g., 

{{< code r >}}
letters[2]
#> [1] "b"
{{< /code >}}

to get the second element of the `letters` vector. But we can also write 

{{< code r >}}
letters[-2]
#>  [1] "a" "c" "d" "e" "f" "g" "h" "i" "j" "k" "l" "m" "n" "o" "p" "q" "r" "s" "t" "u" "v" "w" "x" "y" "z"
{{< /code >}}

to get everything in `letters` _except_ the second element. Handy. The same goes for data frames. Because those are two dimensional, we write e.g. `df[2,5]` to index the 2nd row and 5th column of `df`. But we can apply negative indices to those too to drop rather than keep a row or a column.

Now, here's a small data frame:

{{< code r >}}

library(tidyverse)

df <- tibble(var1 = rep(LETTERS[1:6], each = 2), 
             var2 = rep(c("Blue", "Green"), 6), 
             val = rpois(12, 4))

df
#> # A tibble: 12 × 3
#>    var1  var2    val
#>    <chr> <chr> <int>
#>  1 A     Blue      2
#>  2 A     Green     8
#>  3 B     Blue      5
#>  4 B     Green     5
#>  5 C     Blue      4
#>  6 C     Green     6
#>  7 D     Blue      6
#>  8 D     Green     9
#>  9 E     Blue      4
#> 10 E     Green     1
#> 11 F     Blue      1
#> 12 F     Green     2

{{< /code >}}

Let's say we want to get leave-one-out means for the Blue and Green groups. Can we do this using `map()` to interate over the groups while dropping each row once within the groups in turn? We can.


{{< code r >}}
df |>
  group_by(var2) |>
  mutate(
    jk_mean = map_dbl(row_number(), \(x) mean(val[-x]))
  )
#> # A tibble: 12 × 4
#> # Groups:   var2 [2]
#>    var1  var2    val jk_mean
#>    <chr> <chr> <int>   <dbl>
#>  1 A     Blue      2     4  
#>  2 A     Green     8     4.6
#>  3 B     Blue      5     3.4
#>  4 B     Green     5     5.2
#>  5 C     Blue      4     3.6
#>  6 C     Green     6     5  
#>  7 D     Blue      6     3.2
#>  8 D     Green     9     4.4
#>  9 E     Blue      4     3.6
#> 10 E     Green     1     6  
#> 11 F     Blue      1     4.2
#> 12 F     Green     2     5.8
{{< /code >}}


The `row_number()` function gives us a unique row index, which `map_dbl()` applies to whatever we want to do next by making it an anonymous lambda function `\(x)`. The values of `x` are fed one at a time to `mean(val[-x])`, and the `val[-x]` part drops the _x_ th element of `val` each time when calculating the mean. 

With `mutate()` we get the whole data frame back, where the `jk_mean` column is the value of the group mean when that row is dropped. If we just want the leave-one-out means and the groups, we can't use `summarize()` directly, because we are getting more than one row per group back. So we use `reframe()` instead:

{{< code r >}}
df |>
  group_by(var2) |>
  reframe(
    jk_mean = map_dbl(row_number(), \(x) mean(val[-x]))
  )
#> # A tibble: 12 × 2
#>    var2  jk_mean
#>    <chr>   <dbl>
#>  1 Blue      4  
#>  2 Blue      3.4
#>  3 Blue      3.6
#>  4 Blue      3.2
#>  5 Blue      3.6
#>  6 Blue      4.2
#>  7 Green     4.6
#>  8 Green     5.2
#>  9 Green     5  
#> 10 Green     4.4
#> 11 Green     6  
#> 12 Green     5.8
{{< /code >}}


Finally, what if for some reason we want a list of twelve left-one-out data frames, again by group? For this we can make use of `map()` twice over: 

{{< code r >}}

jk_list <- df |>
  group_split(var2) |>
  map(\(x) map(seq_len(nrow(x)), \(i) x[-i, ])) |>
  flatten()

length(jk_list)
#> [1] 12

## First element of the list
jk_list[[1]]
#> # A tibble: 5 × 3
#>   var1  var2    val
#>   <chr> <chr> <int>
#> 1 B     Blue      5
#> 2 C     Blue      4
#> 3 D     Blue      6
#> 4 E     Blue      4
#> 5 F     Blue      1

{{< /code >}}

Here we use `group_split()` to get a list with a Blue data frame and a Green data frame. Then we use a map-in-map for a kind of nested loop. The inner `map()` gives us a vector from 1 to whatever the number of rows in each group's data frame is. (Here it's six in each case.) This will get called _i_. The outer map iterates this over each group, giving us `x[-i, ]`, or each grouped data frame _x_ with the _i_ th row dropped in each case. We end up with a list of 12 new data frames. Each has five rows instead of the six originally in its group, with a different row dropped in turn. 
