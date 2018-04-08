---
title: "Animated Population Pyramids in R"
date: 2018-04-08T09:22:18-04:00
categories: [Sociology,Visualization,R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Amateur demography week continues around here. Today we are looking at the population of England and Wales since 1961, courtesy of some data from the UK [Office of National Statistics](https://www.ons.gov.uk/peoplepopulationandcommunity/populationandmigration/populationestimates/adhocs/004358englandandwalespopulationestimates1838to2014). We have data on population counts by age (in nice, detailed, yearly increments) broken down by sex. We're going to tidy the data, make a pyramid for a year, and then make an animated gif that shows the changing age distribution of the population over more than fifty years. The code and data to reproduce the figures [is available on Github](https://github.com/kjhealy/england_wales_pop).

Once we've set up our data, we'll have a long table that looks like this:

{{< highlight r >}}

> ages_lon
# A tibble: 9,828 x 7
   group   age year       count     total   pct    yr
   <chr> <int> <chr>      <dbl>     <dbl> <dbl> <int>
 1 Males     0 Mid-1961 402400. 22347000.  1.80  1961
 2 Males     1 Mid-1961 382800. 22347000.  1.71  1961
 3 Males     2 Mid-1961 374500. 22347000.  1.68  1961
 4 Males     3 Mid-1961 366100. 22347000.  1.64  1961
 5 Males     4 Mid-1961 352100. 22347000.  1.58  1961
 6 Males     5 Mid-1961 339500. 22347000.  1.52  1961
 7 Males     6 Mid-1961 331600. 22347000.  1.48  1961
 8 Males     7 Mid-1961 336600. 22347000.  1.51  1961
 9 Males     8 Mid-1961 333100. 22347000.  1.49  1961
10 Males     9 Mid-1961 331600. 22347000.  1.48  1961
# ... with 9,818 more rows


{{< /highlight >}}

Let's begin by making a pyramid for one year only---1968, say. Ggplot doesn't have a native `geom_pyramid()` so to do this we'll need to mess around with the data a little bit to make the output symmetrical. We're going to use `geom_ribbon()` to draw and fill the lines. We could use `geom_bar(stat = "identity")`, too. As an aside, there's a `geom_area()` that is a special case of `geom_ribbon()` with the baseline fixed at zero, which is just what we need, but I found it didn't work properly. So we'll just use `geom_ribbon()` and set the baseline manually instead. 

First we add a dummy `base` measure that's zero for every row. We'll make a new object to do the subsequent recoding. 

{{< highlight r >}}

ages_lon$base <-  0
ages_pyr <- ages_lon

{{< /highlight >}}

Next we'll take all the rows coded as "Males" and flip their percent score to be negative. 

{{< highlight r >}}
ages_pyr$pct[ages_pyr$group == "Males"] <- -ages_lon$pct[ages_lon$group == "Males"]
{{< /highlight >}}

Now we can draw a plot. First we set up a basic object.

{{< highlight r >}}
p <- ggplot(data = subset(ages_pyr, yr == 1968),
            mapping = aes(x = age, ymin = base,
                          ymax = pct, fill = group))
{{< /highlight >}}


Then we add the bells and whistles:

{{< highlight r >}}
p_pyr <- p + geom_ribbon(alpha = 0.5) +
    scale_y_continuous(labels = abs, limits = max(ages_lon$pct, na.rm = TRUE) * c(-1,1)) +
    scale_x_continuous(breaks = seq(10, 80, 10)) +
    scale_fill_manual(values = bly_palette) +
    guides(fill = guide_legend(reverse = TRUE)) +
    labs(x = "Age", y = "Percent of Population",
         title = "Age Distribution of the Population of England and Wales: 1968",
         subtitle = "Age is top-coded at 85.",
         caption = "Kieran Healy / kieranhealy.org / Data: UK ONS.",
         fill = "Group") +
    theme_minimal() +
    theme(legend.position = "bottom",
          plot.title = element_text(size = rel(0.8), face = "bold"),
          plot.subtitle = element_text(size = rel(0.8)),
          plot.caption = element_text(size = rel(0.8)),
          axis.text.y = element_text(size = rel(0.9)),
          axis.text.x = element_text(size = rel(0.9))) +
    coord_flip()
{{< /highlight >}}

The key line is the `scale_y_continuous()` call, which sets the axis `labels` to their absolute values (so they aren't printed as negative numbers), and fixes the `limits` on both sides in one quick step. We also reverse the legend guide for the `fill` variable so that it appears in the same order as drawn on the plot. We flip the coordinates at the end to put age on the y-axis. Everything else is just formatting for the plot --- the labels in `labs()`, the colors in `scale_fill_manual()` and the size adjustments in `theme()`. 

{{% figure src="files/misc/eng-wal-pyr-1968.png" alt="" caption="Population Distribution by Age for England and Wales, 1968." %}}

Not bad. Look at the people who are fifty in 1968---they were born in 1918, and there aren't that many of them. By contrast look at the people who were 23 then. They were born in 1945. 

In the original data, age is top-coded at 85 for this year, so we get an odd-looking spike at the top of the graph. The ONS top-codes age at 85 until 1971, when it switches to a top-code of 90. 

Next, let's do the animation. The `gganimate()` function makes this quite convenient. Underneath, the `animate()` function is at work drawing a few hundred frames and stitching them together into a gif. The only additional information that `gganimate()` needs is that the time variable, or "frame" variable, is `yr`. So we add that as an aesthetic mapping. Apart from that everything is exactly the same, except we adjust the title of the figure to account for the fact that the year will be changing. Then we call `gganimate()` to draw the gif.

{{< highlight r >}}
p <- ggplot(data = ages_pyr,
            mapping = aes(x = age, ymin = base,
                          ymax = pct, fill = group,
                          frame = yr))

p_pyr_ani <- p + geom_ribbon(alpha = 0.5) +
    scale_y_continuous(labels = abs, limits = max(ages_lon$pct, na.rm = TRUE) * c(-1,1)) +
    scale_x_continuous(breaks = seq(10, 80, 10)) +
    scale_fill_manual(values = bly_palette) +
    guides(fill = guide_legend(reverse = TRUE)) +
    labs(x = "Age", y = "Percent of Population",
         title = "Age Distribution of the Population of England and Wales:",
         subtitle = "Age is top-coded at 85 before 1971 and 90 thereafter.",
         caption = "Kieran Healy / kieranhealy.org / Data: UK ONS.",
         fill = "Group") +
    theme_minimal() +
    theme(legend.position = "bottom",
          plot.title = element_text(size = rel(0.8), face = "bold"),
          plot.subtitle = element_text(size = rel(0.8)),
          plot.caption = element_text(size = rel(0.8)),
          axis.text.y = element_text(size = rel(0.9)),
          axis.text.x = element_text(size = rel(0.9))) +
    coord_flip()

## This will take a while to run.
## ani.res option needs a relatively recent version of the animate library
gganimate(p_pyr_ani, filename = "figures/eng-wa-pop-pyr.gif",
          ani.width = 1000, ani.height = 1600, ani.res = 200)

{{< /highlight >}}

{{% figure src="files/misc/eng-wa-pop-pyr-opt.gif" alt="" caption="Population Distribution by Age for England and Wales, 1961-2014." %}}

Now you can sit back, relax, and watch time perform its terrible dance. 


Finally, following a suggestion from Hadley Wickham, we can add labels to some birth years of interest, and thus follow the cohort as it moves through time. We'll make a series of little data frames that keep the label reasonably close to the peak of the cohort's relative size (which of course changes as time passes). 

{{< highlight r >}}

### Marching labels

ww1m_labs <- data.frame(yr = 1961:2008, age = 43:90,
                        lab = "Born 1918", base = 0,
                        group = "Males", gen = "ww1m")

ww1m_labs <- left_join(ww1m_labs, ages_pyr)

ww1m_labs <- ww1m_labs %>% rename(y = pct) %>%
    mutate(y = y - 0.05,
           yend = y - 0.025)


ww2m_labs <- data.frame(yr = 1961:2014, age = 14:67,
                       lab = "Born 1947",
                       base = 0, group = "Males", gen = "ww2m")
ww2m_labs <- left_join(ww2m_labs, ages_pyr)


ww2m_labs <- ww2m_labs %>% rename(y = pct) %>%
    mutate(y = y - 0.05,
           yend = y - 0.025)



xm_labs <- data.frame(yr = 1977:2014, age = 0:37,
                       lab = "Born 1977",
                       base = 0, group = "Males", gen = "x70m")

xm_labs <- left_join(xm_labs, ages_pyr)


xm_labs <- xm_labs %>% rename(y = pct) %>%
    mutate(y = y - 0.05,
           yend = y - 0.025)

ww1f_labs <- data.frame(yr = 1961:2008, age = 41:88,
                       lab = "Born 1920",
                       base = 0, group = "Females", gen = "ww1f")


ww1f_labs <- left_join(ww1f_labs, ages_pyr)

ww1f_labs <- ww1f_labs %>% rename(y = pct) %>%
    mutate(y = y + 0.3,
           yend = y + 0.3)



x64f_labs <- data.frame(yr = 1964:2014, age = 0:50,
                       lab = "Born 1964",
                       base = 0, group = "Females", gen = "ww2")


x64f_labs <- left_join(x64f_labs, ages_pyr)

x64f_labs <- x64f_labs %>% rename(y = pct) %>%
    mutate(y = y + 0.3,
           yend = y + 0.3)


gen_labs <- rbind(ww1m_labs, ww2m_labs, xm_labs, ww1f_labs, x64f_labs)


p <- ggplot(data = ages_pyr,
            mapping = aes(x = age,
                          frame = yr))

p_pyr_ani <- p + geom_ribbon(alpha = 0.5, mapping = aes(ymin = base, ymax = pct, fill = group)) +
    geom_text(data = gen_labs,
              mapping = aes(x = age, y = y, label = lab),
              size = rel(1.8), hjust = 1) +
    scale_y_continuous(labels = abs, limits = max(ages_lon$pct + 0.1, na.rm = TRUE) * c(-1,1)) +
    scale_x_continuous(breaks = seq(10, 80, 10)) +
    scale_fill_manual(values = bly_palette) +
    guides(fill = guide_legend(reverse = TRUE)) +
    labs(x = "Age", y = "Percent of Population",
         title = "Age Distribution of the Population of England and Wales:",
         subtitle = "Age is top-coded at 85 before 1971 and 90 thereafter.",
         caption = "Kieran Healy / kieranhealy.org / Data: UK ONS.",
         fill = "Group") +
    theme_minimal() +
    theme(legend.position = "bottom",
          plot.title = element_text(size = rel(0.8), face = "bold"),
          plot.subtitle = element_text(size = rel(0.8)),
          plot.caption = element_text(size = rel(0.8)),
          axis.text.y = element_text(size = rel(0.9)),
          axis.text.x = element_text(size = rel(0.9))) +
    coord_flip()

## This will take a while to run.
## ani.res option needs a relatively recent version of the animate library
gganimate(p_pyr_ani, filename = "figures/eng-wa-pop-pyr-labs.gif",
          ani.width = 1000, ani.height = 1600, ani.res = 200)

{{< /highlight >}}


{{% figure src="files/misc/eng-wa-pop-pyr-labs-opt.gif" alt="" caption="Population Distribution by Age for England and Wales, 1961-2014, with some birth years of interest labeled." %}}
