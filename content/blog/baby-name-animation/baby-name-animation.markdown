---
title: "Baby Name Animation"
date: 2019-05-13T15:30:13-04:00
categories: [R,visualization,Sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---

I was playing around with the [gganimate](https://github.com/thomasp85/gganimate) package this morning and thought I'd make a little animation showing a favorite finding about the distribution of baby names in the United States. This is the fact---I think first noticed by Laura Wattenberg, of the Baby Name Voyager---that there has been a sharp, relatively recent rise in boys' names ending in the letter 'n', at the expense of names with 'e', 'l', and 'y' endings.

Our goal is to animate a bar chart showing this distribution as a bar chart with one bar for each letter, which we'll draw once for each year from 1880 to 2017 and then smoothly stitch them together with `gganimate`'s tools. 

Here's the code in full, using the `babynames` dataset, which can be installed from CRAN.



{{< code r >}}
library(tidyverse)
library(babynames)
library(gganimate)


## Custom theme
library(showtext)
showtext_auto()

library(myriad)
import_myriad_semi()

theme_set(theme_myriad_semi())
{{< /code >}}

The `babynames` data looks like this:

{{< code r >}}
> babynames
# A tibble: 1,924,665 x 5
    year sex   name          n   prop
   <dbl> <chr> <chr>     <int>  <dbl>
 1  1880 F     Mary       7065 0.0724
 2  1880 F     Anna       2604 0.0267
 3  1880 F     Emma       2003 0.0205
 4  1880 F     Elizabeth  1939 0.0199
 5  1880 F     Minnie     1746 0.0179
 6  1880 F     Margaret   1578 0.0162
 7  1880 F     Ida        1472 0.0151
 8  1880 F     Alice      1414 0.0145
 9  1880 F     Bertha     1320 0.0135
10  1880 F     Sarah      1288 0.0132
# … with 1,924,655 more rows

{{< /code >}}

We're going to create a plot object, `p`. We take the data and subset it to boys' names, then calculate a table of end-letter frequencies by year. Finally,  we add the instructions for the plot.

{{< code r >}}
## Create the plot object
p <- babynames %>%
    filter(sex == "M") %>%
    mutate(endletter = stringr::str_sub(name, -1)) %>%
    group_by(year, endletter) %>%
    summarize(letter_count = n()) %>%
    mutate(letter_prop = letter_count / sum(letter_count), 
           rank = min_rank(-letter_prop) * 1) %>%
    ungroup() %>%
    ggplot(aes(x = factor(endletter, levels = letters, ordered = TRUE),
               y = letter_prop,
               group = endletter,
               fill = factor(endletter),
               color = factor(endletter))) +
    geom_col(alpha = 0.8) +
    scale_y_continuous(labels = scales::percent_format(accuracy = 1)) +
    guides(color = FALSE, fill = FALSE) +
    labs(title = "Distribution of Last Letters of U.S. Girls' Names over Time",
         subtitle  = '{closest_state}',
         x = "", y = "Names ending in letter",
         caption = "Data: US Social Security Administration. @kjhealy / socviz.co") +
    theme(plot.title = element_text(size = rel(2)),
          plot.subtitle = element_text(size = rel(3)),
          plot.caption = element_text(size = rel(2)),
          axis.text.x = element_text(face = "bold", size = rel(3)),
          axis.text.y = element_text(size = rel(3)),
          axis.title.y = element_text(size = rel(2))) +
    transition_states(year, transition_length = 4, state_length = 1) +
    ease_aes('cubic-in-out')


{{< /code >}}


The first bit of code finds the last letter of every name in `babynames` using `stringr`'s `str_sub()` function. Then we count the number of ending letters and calculate a proportion, which we then rank. From there we hand things over to `ggplot` to draw a column chart. With `gganimate` you draw and polish the plot as normal---here just a column chart using `geom_col()`---and then add the animation instructions using `transition_states()` and `ease_aes()`. The only other trick is the use of the placeholder macro `'{closest_state}'` in the `labs()` call, where we specify the subtitle. This is what gives us the year counter.  

With the plot object ready to go, we call `animate()` to save it to a file.

{{< code r >}}

animate(p, fps = 25, duration = 20, width = 800, height = 600, renderer = gifski_renderer("figures/name_endings_boys.gif"))


{{< /code >}}

And here's the result: 

{{% figure src="https://kieranhealy.org/files/misc/name_endings_boys.gif" alt="Baby boy end-letter trends" caption="Animated distribution of end-letter names for boys." %}}

By switching the filter from `"M"` to `"F"` we can do the same for girls' names:


{{% figure src="https://kieranhealy.org/files/misc/name_endings_girls.gif" alt="Baby girl end-letter trends" caption="Animated distribution of end-letter names for girls." %}}

Girls' names show a very different distribution, with 'a' and 'e' endings very common (perhaps unsurprisingly given the legacy of Latinate names), but there's still substantial variation in how popular 'a' endings are over time. The dominance of 'a' and 'e' is interesting, because girl names show more heterogeneity overall, with parents being more willing to experiment with the names of their daughters rather then their sons. 

