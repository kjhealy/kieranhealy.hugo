---
title: "Map and Nested Lists"
date: 2022-04-27T15:35:41-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---


On StackOverflow, a questioner with a bunch of data frames wanted to split each of them into two based on some threshold being met or not on a specific column. Their thought was to write a function that split a given data frame in two, then name each one and then write it out to disk with `assign()`. Then they'd put that in a loop, or use `lapply` after putting the data frames in a list.  

Here's a tidyverse solution that avoids the need to explicitly write loops, and using `map` instead of `lapply`. 

I should say at the outset that you could probably do the whole thing using grouped or nested data frames, thus avoiding the need to create the objects in the first place. But if you really do want to create the objects, or perhaps the starting data frames are a little less amenable to living in a single data frame because have different numbers of columns, then working with lists will do very well. You could do something like the following. 

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

Next, get these five data frames and put them in a list, which is where the question starts from. 

{{< code r >}}
df_list <- map(df_names, get)
{{< /code >}}

Here we use `get(), which returns the _value_ of a named object (i.e., for our purposes, the object). We have `map()` feed the vector of df names to it, and because `map()` always returns a list we get the data frames we created, now bundled into a list.

Because I'm working with Tidyverse functions, I wrote `map(df_list, get)` out of habit. But there's also a Base R function that does the same thing, for the case of getting named objects into a named list. It's `mget()`. I could have written

{{< code r >}}
df_list <- mget(df_names)
{{< /code >}}

and gotten the same result. 

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

Now we have a nested list. Each of `df_1` to `df_5` is split into an over or under table. We can look at them by e.g.

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

We could just work with the list like this. Or we could bind them by row into a big data frame, assuming they all have the same columns. But the original questioner wanted them as separate data frame objects with the suffix `_over` or `_under` as appropriate. To extract all the "over" data frames from our `split_list` object and make them objects with names of the form `df_1_over`` etc, we can do

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

We can get the "under" dat frames as objects in the same way.

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


