---
title: "Map and Nested Lists"
date: 2022-04-27T15:35:41-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---


On StackOverflow, a questioner with a bunch of data frames (already existing as objects in their environment) wanted to split each of them into two based on some threshold being met, or not, on a specific column. Every one of the data frames had this column in it. Their thought was that they'd write a loop, or use `lapply` after putting the data frames in a list, and write a function that split the data fames, named each one, and wrote them out as separate objects in the environment. 

Here's a tidyverse solution that avoids the need to explicitly write loops, using `map` instead of `lapply`. (I have no particular dislike of `lapply` et fam, I'll just be working with the tidyverse equivalents.) 

I should say at the outset that you could probably do the whole thing using grouped or nested data frames, thus avoiding the need to create the objects in the first place. But if you really do want to create the objects, or perhaps the starting data frames are a little less amenable to living in a single data frame because they have different numbers of columns or something, then working a list of data frames will do very well. You could do something like the following. 

First, let's do some setup to make the example reproducible. 



{{< code r >}}
library(tidyverse)
set.seed(42722)

## Names of the example data frames we'll create
## are df_1 ... df5
df_names <- paste0("df_", 1:5) %>% 
  set_names()

## We'll make the new dfs by sampling from mtcars
base_df <- as_tibble(mtcars, rownames = "model") %>% 
  select(model, cyl, hp)

## Create 5 new data frame objects in our environment.
## Each is a sample of ten rows of three columns from mtcars
df_names %>% 
  walk(~ assign(x = .x,         # each element of df_names in turn
                value = sample_n(base_df, 10), 
                envir = .GlobalEnv))

## Now we have, e.g.
df_1
#> # A tibble: 10 × 3
#>    model               cyl    hp
#>    <chr>             <dbl> <dbl>
#>  1 Chrysler Imperial     8   230
#>  2 Mazda RX4 Wag         6   110
#>  3 Merc 450SE            8   180
#>  4 Porsche 914-2         4    91
#>  5 Toyota Corona         4    97
#>  6 Ford Pantera L        8   264
#>  7 Toyota Corolla        4    65
#>  8 Merc 280C             6   123
#>  9 Duster 360            8   245
#> 10 Merc 230              4    95
{{< /code >}}

This is a handy use of `walk()`, by the way, which works just the same as `map()` except it's for when you are interested in producing side-effects like a bunch of graphs or output files or, as here, new objects, rather than further manipulating a table or tables of data.

Next, get these five data frames and put them in a list, which is where the question starts from. 

{{< code r >}}
df_list <- map(df_names, get)
{{< /code >}}

Here we use `get()`, which returns the _value_ of a named object (i.e., for our purposes, the object). We have `map()` feed the vector of df names to it, and because `map()` always returns a list we get the data frames we created, now bundled into a list.

Because I'm working with Tidyverse functions, I wrote `map(df_names, get)` out of habit. But there's also a Base R function that does the same thing, for the case of getting named objects into a named list. It's `mget()`. I could have written

{{< code r >}}
df_list <- mget(df_names) 
{{< /code >}}

to get the same result. It looks like this:


{{< code r >}}
df_list

#> $df_1
#> # A tibble: 10 × 3
#>    model               cyl    hp
#>    <chr>             <dbl> <dbl>
#>  1 Chrysler Imperial     8   230
#>  2 Mazda RX4 Wag         6   110
#>  3 Merc 450SE            8   180
#>  4 Porsche 914-2         4    91
#>  5 Toyota Corona         4    97
#>  6 Ford Pantera L        8   264
#>  7 Toyota Corolla        4    65
#>  8 Merc 280C             6   123
#>  9 Duster 360            8   245
#> 10 Merc 230              4    95
#> 
#> $df_2
#> # A tibble: 10 × 3
#>    model                 cyl    hp
#>    <chr>               <dbl> <dbl>
#>  1 Toyota Corolla          4    65
#>  2 Pontiac Firebird        8   175
#>  3 Merc 280                6   123
#>  4 Merc 450SE              8   180
#>  5 Toyota Corona           4    97
#>  6 Lincoln Continental     8   215
#>  7 Ferrari Dino            6   175
#>  8 Merc 450SLC             8   180
#>  9 Dodge Challenger        8   150
#> 10 Lotus Europa            4   113
#> 
#> $df_3
#> # A tibble: 10 × 3
#>    model                cyl    hp
#>    <chr>              <dbl> <dbl>
#>  1 Fiat 128               4    66
#>  2 Hornet 4 Drive         6   110
#>  3 Fiat X1-9              4    66
#>  4 Hornet Sportabout      8   175
#>  5 Maserati Bora          8   335
#>  6 Merc 230               4    95
#>  7 Valiant                6   105
#>  8 Mazda RX4 Wag          6   110
#>  9 Toyota Corona          4    97
#> 10 Cadillac Fleetwood     8   205
#> 
#> $df_4
#> # A tibble: 10 × 3
#>    model               cyl    hp
#>    <chr>             <dbl> <dbl>
#>  1 Fiat X1-9             4    66
#>  2 AMC Javelin           8   150
#>  3 Chrysler Imperial     8   230
#>  4 Valiant               6   105
#>  5 Hornet Sportabout     8   175
#>  6 Merc 240D             4    62
#>  7 Merc 280              6   123
#>  8 Mazda RX4 Wag         6   110
#>  9 Lotus Europa          4   113
#> 10 Hornet 4 Drive        6   110
#> 
#> $df_5
#> # A tibble: 10 × 3
#>    model                cyl    hp
#>    <chr>              <dbl> <dbl>
#>  1 Chrysler Imperial      8   230
#>  2 Porsche 914-2          4    91
#>  3 Camaro Z28             8   245
#>  4 Merc 450SL             8   180
#>  5 Toyota Corona          4    97
#>  6 Hornet 4 Drive         6   110
#>  7 Cadillac Fleetwood     8   205
#>  8 Merc 280C              6   123
#>  9 Toyota Corolla         4    65
#> 10 Pontiac Firebird       8   175

{{< /code >}}


Now, working with this list of data frames, we can split each one into the over/under. If the split criteria were more complex we could write a more involved function to do it. But here we use `if_else` to create a new column in each data frame based on a threshold value of `cyl`.

{{< code r >}}
## - a. Create an over_under column in each df in the list, 
##      based on whether `cyl` in that particular df is < 5 or not
## - b. Split on this new column.
## - c. Put all the results into a new list called `split_list`

split_list <- df_list %>% 
  map(~ mutate(., 
               over_under = if_else(.$cyl > 5, "over", "under"))) %>% 
    map(~ split(., as.factor(.$over_under))) 
{{< /code >}}

The `.` inside the `mutate()` and `split()` functions are pronouns standing for "the thing we're referring to/computing on right now". In this case, that's "the current data frame as we iterate through `df_list`".  Now we have a nested list. Each of `df_1` to `df_5` is split into an over or under table. The whole thing looks like this:

{{< code r >}}
split_list
#> $df_1
#> $df_1$over
#> # A tibble: 6 × 4
#>   model               cyl    hp over_under
#>   <chr>             <dbl> <dbl> <chr>     
#> 1 Chrysler Imperial     8   230 over      
#> 2 Mazda RX4 Wag         6   110 over      
#> 3 Merc 450SE            8   180 over      
#> 4 Ford Pantera L        8   264 over      
#> 5 Merc 280C             6   123 over      
#> 6 Duster 360            8   245 over      
#> 
#> $df_1$under
#> # A tibble: 4 × 4
#>   model            cyl    hp over_under
#>   <chr>          <dbl> <dbl> <chr>     
#> 1 Porsche 914-2      4    91 under     
#> 2 Toyota Corona      4    97 under     
#> 3 Toyota Corolla     4    65 under     
#> 4 Merc 230           4    95 under     
#> 
#> 
#> $df_2
#> $df_2$over
#> # A tibble: 7 × 4
#>   model                 cyl    hp over_under
#>   <chr>               <dbl> <dbl> <chr>     
#> 1 Pontiac Firebird        8   175 over      
#> 2 Merc 280                6   123 over      
#> 3 Merc 450SE              8   180 over      
#> 4 Lincoln Continental     8   215 over      
#> 5 Ferrari Dino            6   175 over      
#> 6 Merc 450SLC             8   180 over      
#> 7 Dodge Challenger        8   150 over      
#> 
#> $df_2$under
#> # A tibble: 3 × 4
#>   model            cyl    hp over_under
#>   <chr>          <dbl> <dbl> <chr>     
#> 1 Toyota Corolla     4    65 under     
#> 2 Toyota Corona      4    97 under     
#> 3 Lotus Europa       4   113 under     
#> 
#> 
#> $df_3
#> $df_3$over
#> # A tibble: 6 × 4
#>   model                cyl    hp over_under
#>   <chr>              <dbl> <dbl> <chr>     
#> 1 Hornet 4 Drive         6   110 over      
#> 2 Hornet Sportabout      8   175 over      
#> 3 Maserati Bora          8   335 over      
#> 4 Valiant                6   105 over      
#> 5 Mazda RX4 Wag          6   110 over      
#> 6 Cadillac Fleetwood     8   205 over      
#> 
#> $df_3$under
#> # A tibble: 4 × 4
#>   model           cyl    hp over_under
#>   <chr>         <dbl> <dbl> <chr>     
#> 1 Fiat 128          4    66 under     
#> 2 Fiat X1-9         4    66 under     
#> 3 Merc 230          4    95 under     
#> 4 Toyota Corona     4    97 under     
#> 
#> 
#> $df_4
#> $df_4$over
#> # A tibble: 7 × 4
#>   model               cyl    hp over_under
#>   <chr>             <dbl> <dbl> <chr>     
#> 1 AMC Javelin           8   150 over      
#> 2 Chrysler Imperial     8   230 over      
#> 3 Valiant               6   105 over      
#> 4 Hornet Sportabout     8   175 over      
#> 5 Merc 280              6   123 over      
#> 6 Mazda RX4 Wag         6   110 over      
#> 7 Hornet 4 Drive        6   110 over      
#> 
#> $df_4$under
#> # A tibble: 3 × 4
#>   model          cyl    hp over_under
#>   <chr>        <dbl> <dbl> <chr>     
#> 1 Fiat X1-9        4    66 under     
#> 2 Merc 240D        4    62 under     
#> 3 Lotus Europa     4   113 under     
#> 
#> 
#> $df_5
#> $df_5$over
#> # A tibble: 7 × 4
#>   model                cyl    hp over_under
#>   <chr>              <dbl> <dbl> <chr>     
#> 1 Chrysler Imperial      8   230 over      
#> 2 Camaro Z28             8   245 over      
#> 3 Merc 450SL             8   180 over      
#> 4 Hornet 4 Drive         6   110 over      
#> 5 Cadillac Fleetwood     8   205 over      
#> 6 Merc 280C              6   123 over      
#> 7 Pontiac Firebird       8   175 over      
#> 
#> $df_5$under
#> # A tibble: 3 × 4
#>   model            cyl    hp over_under
#>   <chr>          <dbl> <dbl> <chr>     
#> 1 Porsche 914-2      4    91 under     
#> 2 Toyota Corona      4    97 under     
#> 3 Toyota Corolla     4    65 under
{{< /code >}}


We can look at particular pieces of this by e.g.

{{< code r >}}

split_list$df_3$under

#> # A tibble: 6 × 4
#>   model                cyl    hp over_under
#>   <chr>              <dbl> <dbl> <chr>     
#> 1 Hornet 4 Drive         6   110 under     
#> 2 Hornet Sportabout      8   175 under     
#> 3 Maserati Bora          8   335 under     
#> 4 Valiant                6   105 under     
#> 5 Mazda RX4 Wag          6   110 under     
#> 6 Cadillac Fleetwood     8   205 under

{{< /code >}}  

This is handy because we can use tab completion in our IDE to investigate the tables in the list. 

We could just work with the list like this. Or we could bind them by row into a big data frame, assuming they all have the same columns. But the original questioner wanted them as separate data frame objects with the suffix `_over` or `_under` as appropriate. To extract all the "over" data frames from our `split_list` object and make them objects with names of the form `df_1_over` etc, we can do

{{< code r >}}
split_list %>% 
  map("over") %>%                               # subset to "over" dfs only
  set_names(nm = ~ paste0(.x, "_over")) %>%     # name each element, add the _over suffix
  walk2(.x = names(.), #                        # write out each df with its name
        .y = .,
        .f = ~ assign(x = .x,
                value = as_tibble(.y),
                envir = .GlobalEnv))
{{< /code >}}

The line `map("over")` works just like---and in fact, behind the scenes is in fact using--- the `pluck()` function to retrieve the nested list elements named "`over`". This is equivalent to something like 


{{< code r >}}
lapply(split_list, `[[`, "over")
{{< /code >}}

in Base R, which applies the `[[` selector to the named element.

We use `walk2()` rather than `walk()` because the function we're iterating needs two arguments to work: a vector of names for the objects, and the tibbles to be assigned to those names.

Now in our environment we have e.g.

{{< code r >}}
df_5_over

#> # A tibble: 3 × 4
#>   model            cyl    hp over_under
#>   <chr>          <dbl> <dbl> <chr>     
#> 1 Porsche 914-2      4    91 over      
#> 2 Toyota Corona      4    97 over      
#> 3 Toyota Corolla     4    65 over
{{< /code >}}

We can get the "under" data frames as objects in the same way.

As I said above, depending on what was needed it might---in fact, it would probably---make more sense to do the whole thing from start to finish using a single tibble, grouping  or perhaps nesting the data as needed. Or, if we did start for whatever reason with different object, but we knew they all had the same columnar layout, we could bind them by row into a big data frame indexed by their names, like this:

{{< code r >}} 
df_all <- bind_rows(df_list, .id = "id")

df_all

#> # A tibble: 50 × 4
#>    id    model               cyl    hp
#>    <chr> <chr>             <dbl> <dbl>
#>  1 df_1  Chrysler Imperial     8   230
#>  2 df_1  Mazda RX4 Wag         6   110
#>  3 df_1  Merc 450SE            8   180
#>  4 df_1  Porsche 914-2         4    91
#>  5 df_1  Toyota Corona         4    97
#>  6 df_1  Ford Pantera L        8   264
#>  7 df_1  Toyota Corolla        4    65
#>  8 df_1  Merc 280C             6   123
#>  9 df_1  Duster 360            8   245
#> 10 df_1  Merc 230              4    95
#> # … with 40 more rows

{{< /code >}}

From there you could group the big data frame by `id` and then make the over/under measures and whatever else you wanted. But if you do want to mess around with lists (something that becomes curiously more tempting the more time you spend with wither Base R lists or `purrr`) this is how you might begin.


