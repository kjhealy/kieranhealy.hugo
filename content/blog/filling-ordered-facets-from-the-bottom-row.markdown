---
title: "Filling Ordered Facets From the Bottom Row"
date: 2018-04-06T11:05:35-04:00
categories: [R,Visualization,Sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---

On Twitter the other day, [Philip Cohen put up](https://twitter.com/familyunequal/status/981538113729286144) some data on changes in Bachelor's degrees awarded between 1995 and 2015. The data come from the [National Center for Education Statistics](https://nces.ed.gov/programs/digest/d17/tables/dt17_322.10.asp?current=yes). It seemed like a good candidate for drawing as a figure, so I had a go at it:

{{% figure src="files/misc/degree-change-9515.png" alt="" caption="Changes in the number of Bachelor's degrees awarded over the past twenty years." %}}

Afterwards, I was messing around with the data and wanted to draw some time-series plots for the various subject areas the NCES tracks. After cleaning up the data, we end up with a tidy table that looks like this:

{{< highlight r >}}

> data_l
# A tibble: 594 x 5
# Groups:   yr [18]
   field_of_study                                      yr  count  yr_pct cutoff
   <chr>                                            <int>  <dbl>   <dbl> <lgl> 
 1 Agriculture and natural resources                 1970 1.27e4  1.51   FALSE 
 2 Architecture and related services                 1970 5.57e3  0.663  FALSE 
 3 Area; ethnic; cultural; gender; and group stud…  1970 2.58e3  0.307  FALSE 
 4 Biological and biomedical sciences                1970 3.57e4  4.25   TRUE  
 5 Business                                          1970 1.15e5 13.7    TRUE  
 6 Communication; journalism; and related programs   1970 1.03e4  1.23   TRUE  
 7 Communications technologies                       1970 4.78e2  0.0569 FALSE 
 8 Computer and information sciences                 1970 2.39e3  0.284  TRUE  
 9 Education                                         1970 1.76e5 21.0    TRUE  
10 Engineering                                       1970 4.50e4  5.36   TRUE  
# ... with 584 more rows

{{< /highlight >}}


The data and code for everything here (including the figure above) is [available on Github](https://github.com/kjhealy/nces-degrees), by the way. 

What we want is a small-multiple of the trends for each subject area with more than two percent of degrees conferred. That's what the `cutoff` variable is for. When we create small multiples, we almost always want to order them in some sensible way. This is almost never the default of alphabetically by category. Instead, we will reorder the panels (the _facets_, in ggplot's terms) by some statistic of interest---most often, the mean value of the variable we're showing. We set up some labels (because we'll be reusing them) and draw the plot. The key bit is the `~ reorder(field_of_study, -yr_pct)` instruction. 

{{< highlight r >}}

my_xlab = "Year"
my_ylab = "Percent of all BAs conferred"
my_caption = "Data from NCES Digest 2017, Table 322.10"
my_subtitle = "Observations are every 5 years from 1970-1995, and annually thereafter"
my_title_1 = "US Trends in Bachelor's Degrees Conferred, 1970-2015,\nfor Areas averaging more than 2% of all degrees"
my_title_2 = "US Trends in Bachelor's Degrees Conferred, 1970-2015,\nfor Areas averaging less than 2% of all degrees"

p <- ggplot(subset(data_l, cutoff == TRUE),
            aes(x = yr,
                y = yr_pct,
                group = field_of_study))

p + geom_line() +
    facet_wrap(~ reorder(field_of_study, -yr_pct),
               labeller = label_wrap_gen(width = 35),
               ncol = 5) +
    labs(x = my_xlab,
         y = my_ylab,
         caption = my_caption,
         title = my_title_1,
         subtitle = my_subtitle) +
    theme_minimal() +
    theme(strip.text.x = element_text(size = 6))
{{< /highlight >}}


{{% figure src="files/misc/facet-row-1.png" alt="" caption="Facets ordered by the mean value of the time series, from top left to bottom right. The bottom row is not completely filled." %}}


The result is a nice graph. R and ggplot have taken care of the layout for us. As is often the case, the number of categories doesn't fit evenly into the number of rows in the plot. There's a space left over in the bottom row. By default, ggplot will add x-axis labels to the next available panel on the row above ("English Language and Literature/Letters"). 

Again on Twitter, [DrDrang asked](https://twitter.com/drdrang/status/981616683965210625) if there was a way, in effect, to force the bottom row of the plot to be filled in. Ggplot's small multiples intelligently minimize redundancy in x- and y-axes labeling, but maybe we don't like having that gap at the bottom and the associated need for another labeled axis in the row above. The `facet_wrap()` function has an `as.table` argument that's set to `TRUE` by default. The help says 

> If `TRUE`, the default, the facets are laid out like a table with highest values at the bottom-right. If `FALSE`, the facets are laid out like a plot with the highest value at the top-right.

We can set `as.table` to `FALSE`:

{{< highlight r >}}

p + geom_line() +
    facet_wrap(~ reorder(field_of_study, -yr_pct),
               labeller = label_wrap_gen(width = 35),
               ncol = 5, as.table = FALSE) +
    labs(x = my_xlab,
         y = my_ylab,
         caption = my_caption,
         title = my_title_1,
         subtitle = my_subtitle) +
    theme_minimal() +
    theme(strip.text.x = element_text(size = 6))

{{< /highlight >}}


{{% figure src="files/misc/facet-row-2.png" alt="" caption="Facets ordered by setting as.table to FALSE. The bottom row is filled, but the ordering of the facets is not right, because the fill order now starts at the bottom left." %}}

This fills the bottom row, but it breaks the high-to-low ordering that we're trying to set with `reorder()`. We can get it back manually. First we create `vars`, which summarizes the areas of study by mean number of degrees awarded over the years. Separately, we great a vector, `o`, the same length as the subset of categories we're going to display. 

{{< highlight r >}}

vars <- area_pcts[!area_pcts$cutoff,] %>% arrange(desc(mean_pct))
o <- c(10:14, 5:9, 1:4)

p <- ggplot(subset(data_l, cutoff == TRUE),
            aes(x = yr,
                y = yr_pct,
                group = field_of_study))

p + geom_line() +
    facet_wrap(~ factor(field_of_study, levels = vars$field_of_study[o], ordered = TRUE),
               labeller = label_wrap_gen(width = 35),
               ncol = 5, as.table = FALSE) +
    labs(x = my_xlab,
         y = my_ylab,
         caption = my_caption,
         title = my_title_1,
         subtitle = my_subtitle) +
    theme_minimal() +
    theme(strip.text.x = element_text(size = 6))


{{< /highlight >}}

Here, instead of using `reorder()`, we recode the `field_of_study` variable on the fly, reordering its factor levels to reflect the desired panel order. We keep `as.table = FALSE`. The `field_of_study` categories then appear in the order we want. 


{{% figure src="files/misc/facet-row-3.png" alt="" caption="Keeping as.table set to FALSE, we manually re-order the field of study variable to re-establish the order." %}}


We can do the same again for the fields with less than two percent of all degrees on average:

{{< highlight r >}}

vars <- area_pcts[area_pcts$cutoff,] %>% arrange(desc(mean_pct))
o <- c(15:19, 10:14, 5:9, 1:4)

p <- ggplot(subset(data_l, cutoff == FALSE),
            aes(x = yr,
                y = yr_pct,
                group = field_of_study))

p + geom_line() +
    facet_wrap(~ factor(field_of_study, levels = vars$field_of_study[o], ordered = TRUE),
               labeller = label_wrap_gen(width = 35),
               ncol = 5, as.table = FALSE) +
    labs(x = my_xlab,
         y = my_ylab,
         caption = my_caption,
         title = my_title_2,
         subtitle = my_subtitle) +
    theme_minimal() +
    theme(strip.text.x = element_text(size = 6))

{{< /highlight >}}

{{% figure src="files/misc/facet-row-4.png" alt="" caption="Same again for degrees with <2% of BAs." %}}


Because we have a different number of categories, we need to manually reorder the variable again. This isn't an ideal solution. What we really want is a way to automatically figure out how many facets we have, and then fill them from the bottom in the order we desire. I'm not sure this is easily doable. 

