---
title: "Comparing Distributions"
date: 2021-12-19T15:29:38-05:00
categories: [R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

When we want to see how something varies across categories, the _trellis_ or _small multiple_ plot is a good friend. We repeatedly draw the same graph once for each category, lining them up in a way that makes them comparable. Here's an example from [my book](https://amzn.to/2vfAixM), using the `gapminder` data, which provides a cross-national time series of GDP per capita for many countries.  

{{< code r >}}
library(tidyverse)
library(gapminder)
p <- ggplot(data = gapminder, mapping = aes(x = year, y = gdpPercap))
p + geom_line(color="gray70", aes(group = country)) +
    geom_smooth(size = 1.1, method = "loess", se = FALSE) +
    scale_y_log10(labels=scales::dollar) +
    facet_wrap(~ continent, ncol = 5) +
    labs(x = "Year",
         y = "GDP per capita",
         title = "GDP per capita on Five Continents", 
         subtitle = "Individual countries shown in gray, trend in blue.")
{{< /code >}}


{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-17-1.png" alt="Small multiple of gapminder data." caption="A Gapminder small multiple." %}}
    
Sometimes, we're interested in comparing distributions across categories in something like this way. In particular, I'm interested in cases where we want to compare a distribution to some reference category, as when we look at subpopulations in comparison to an overall distribution.

## Generate some population and subgroup data 

Say we have some number of observed units, e.g., three thousand “counties” or
whatever. Each county has some population. Across all counties, the population
is distributed log-normally. Within counties, the populations are divided into
three groups. The particular proportions of groups A, B, and C will vary across
counties but always sum to one within each county.

{{< code r >}}

## Keep track of labels for as_labeller() functions in plots later.
grp_names <- c(`a` = "Group A",
               `b` = "Group B",
               `c` = "Group C",
               `pop_a` = "Group A",
               `pop_b` = "Group B",  
               `pop_c` = "Group C",  
               `pop_total` = "Total",                 
               `A` = "Group A", 
               `B` = "Group B", 
               `C` = "Group C")


 set.seed(1243098)

 N <- 3e3
 alphas <- c(1.5, 0.9, 2)

 pop <- round(rlnorm(N, meanlog = 10.3, sdlog = 1.49), 0)

 df <- as_tibble(gtools::rdirichlet(N, alphas), 
                        .name_repair = "unique") %>% 
   rename_with(~ c("a", "b", "c")) %>% 
   rowid_to_column("unit") %>% 
   add_column(pop_total = pop) %>% 
   mutate(across(a:c, 
                 .fns = list(pop = ~ round(.x * pop_total, 0) + 1),
                 .names = "{fn}_{col}"))

 df

 ## # A tibble: 3,000 × 8
 ##     unit     a      b     c pop_total pop_a pop_b  pop_c
 ##    <int> <dbl>  <dbl> <dbl>     <dbl> <dbl> <dbl>  <dbl>
 ##  1     1 0.156 0.196  0.648      6467  1008  1269   4194
 ##  2     2 0.288 0.154  0.558    211075 60729 32579 117771
 ##  3     3 0.165 0.391  0.443    128243 21186 50184  56876
 ##  4     4 0.294 0.124  0.582     76843 22561  9555  44730
 ##  5     5 0.301 0.146  0.553     12178  3671  1780   6730
 ##  6     6 0.397 0.148  0.455      2707  1076   401   1232
 ##  7     7 0.364 0.258  0.378    143261 52112 36987  54166
 ##  8     8 0.859 0.0375 0.103     61109 52517  2290   6305
 ##  9     9 0.129 0.477  0.394     61718  7968 29433  24320
 ## 10    10 0.185 0.182  0.632      3217   597   588   2035
 ## # … with 2,990 more rows

{{< /code >}}

In the tibble we've just made up, `unit` is our county, `a`, `b`, and `c` are the proportions of the groups within each county, and the `pop_` columns are the total populations and the subgroup populations. We make a vector of 3,000 populations using `rlnorm` and a plausible values based on the mean and standard deviations of the logged population of US counties. A call to `rdirichlet` produces the matrix of subgroup populations where each row sums to one. Then we multiply the populations by their respective proportions, and now we have a world of three thousand counties, each with some population that we've also broken out by group. 

We can look at the distribution of group populations across counties:

{{< code r >}}
df %>% 
   pivot_longer(a:c) %>% 
   ggplot() + 
   geom_area(mapping = aes(x = value, y = ..count.., 
                           color = name, fill = name), 
             stat = "bin", bins = 20, size = 0.5) + 
   scale_fill_manual(values = alpha(my_oka, 0.7)) + 
   scale_color_manual(values = alpha(my_oka, 1)) + 
   guides(color = "none", 
          fill = "none") + 
   labs(x = "Logged Population", y = "Count", 
        title = "Subgroup distribution across units") + 
   facet_wrap(~ name, nrow = 1, labeller = as_labeller(grp_names)) 
{{< /code >}}


{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-4-1.png" alt="The distribution of the county populations of our three subgroups." caption="The distribution of the county populations of our three subgroups." %}}

From now on let’s just work with the population counts.

{{< code r >}}
df <- df %>% 
  select(unit, pop_a:pop_c, pop_total)

df

## # A tibble: 3,000 × 5
##     unit pop_a pop_b  pop_c pop_total
##    <int> <dbl> <dbl>  <dbl>     <dbl>
##  1     1  1008  1269   4194      6467
##  2     2 60729 32579 117771    211075
##  3     3 21186 50184  56876    128243
##  4     4 22561  9555  44730     76843
##  5     5  3671  1780   6730     12178
##  6     6  1076   401   1232      2707
##  7     7 52112 36987  54166    143261
##  8     8 52517  2290   6305     61109
##  9     9  7968 29433  24320     61718
## 10    10   597   588   2035      3217
## # … with 2,990 more rows

{{< /code >}}

Here's what our population totals look like across groups, including the total:

{{< code r >}}

df %>%
  pivot_longer(pop_a:pop_total) %>% 
  group_by(name) %>% 
  summarize(total = sum(value)) %>% 
  ggplot(mapping = aes(x = total, y = name, fill = name)) +  
  geom_col() + 
  guides(fill = "none") + 
  scale_fill_manual(values = alpha(c( my_oka[1:3], "gray40"), 0.9))  + 
  scale_x_continuous(labels = scales::label_number_si()) + 
  scale_y_discrete(labels = as_labeller(grp_names)) +
  labs(y = NULL, x = "Population")

{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-6-1.png" alt="Population totals." caption="Population totals." %}}

## Single panels

Now we can plot the group-level population distributions across counties. Again, we
want to compare group distributions to one another and to the overall population
distribution by county. A single-panel histogram showing all four distributions isn't very satisfactory. Even though we're using `alpha` to make the columns semi-transparent, it's still very muddy.

{{< code r >}}
df %>%
  pivot_longer(cols = pop_a:pop_total) %>%
  ggplot() + 
  geom_histogram(mapping = aes(x = log(value), y = ..count.., 
                          color = name, fill = name), 
            stat = "bin", bins = 20, size = 0.5,
            alpha = 0.7) + 
  scale_color_manual(values = alpha(c( my_oka[1:3], "gray40"), 1),
                     labels = as_labeller(grp_names)) + 
  scale_fill_manual(values = alpha(c( my_oka[1:3], "gray40"), 0.6),
                    labels = as_labeller(grp_names)) + 
  labs(x = "Logged Population", y = "Count", color = "Group", 
       fill = "Group",
       title = "Comparing Subgroups: Histograms", 
       subtitle = "Overall distribution shown in gray")
{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-7-1.png" alt="Histogram of all groups.." caption="Histogram of all groups." %}}

If we use a `geom_density()` rather than `geom_histogram()` we'll generate kernel density estimates for each group. These look a little better, but not great.

{{< code r >}}
df %>%
  pivot_longer(cols = pop_a:pop_total) %>%
  ggplot() + 
  geom_density(mapping = aes(x = log(value), 
                          color = name, fill = name), 
            alpha = 0.5) + 
  scale_color_manual(values = alpha(c( my_oka[1:3], "gray40"), 1),
                     labels = as_labeller(grp_names)) + 
  scale_fill_manual(values = alpha(c( my_oka[1:3], "gray40"), 0.6),
                    labels = as_labeller(grp_names)) + 
  labs(x = "Logged Population", y = "Density", 
       title = "Comparing Subgroups: Density", 
       color = "Group", 
       fill = "Group")
{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-8-1.png" alt="Kernel densities." caption="A single panel of kernel densities." %}}

Better, but still not great. A very serviceable compromise that has many of the virtues of a small multiple but has the advantage of keeping things in one panel is a ridgeline plot, courtesy of Claus Wilke's `geom_ridgeline():

{{< code r >}}
df %>%
  pivot_longer(cols = pop_a:pop_total) %>%
  ggplot() + 
  geom_density_ridges(mapping = aes(x = log(value + 1), 
                                    y = name, 
                                    fill = name), 
                      color = "white") + 
  scale_fill_manual(values = alpha(c( my_oka[1:3], "gray40"), 0.7)) + 
  scale_y_discrete(labels = as_labeller(grp_names)) + 
  guides(color = "none", fill = "none") + 
  labs(x = "Logged Population", y = NULL, title = "Comparing Total and Subgroups: Ridgelines") + 
  theme_ridges(font_family = "Myriad Pro SemiCondensed")
{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-9-1.png" alt="Ridgeline plot." caption="A ridgeline plot."  %}}

Ridgeline plots look good and scale pretty well when there are larger numbers of categories to put on the vertical axis, especially if there's a reasonable amount of structure in the data, such as a trend or sequence in the distributions. They can be slightly inefficient in terms of space with smaller numbers of categories. When the number of groups gets large they work best in a very strongly tall and narrow aspect ratio that can be hard to integrate into a page. 

## Histograms with a reference distribution

Like with the Gapminder plot, we can facet our plot so that every subgroup gets its own
panel. But instead of having the Total population be its own panel, we will put it inside each group's panel as a reference point. This allows us to compare the group to the overall population, and also makes eyeballing differences between the group distributions a little easier. To do this, we're going to need to have some way to put the total population distribution into every panel. The trick is to hold on to the total population by only pivoting the subgroups to long format. That leaves us with repeated
values for the total population, `pop_total`, like this:

{{< code r >}}
df %>%
  pivot_longer(cols = pop_a:pop_c)

## # A tibble: 9,000 × 4
##     unit pop_total name   value
##    <int>     <dbl> <chr>  <dbl>
##  1     1      6467 pop_a   1008
##  2     1      6467 pop_b   1269
##  3     1      6467 pop_c   4194
##  4     2    211075 pop_a  60729
##  5     2    211075 pop_b  32579
##  6     2    211075 pop_c 117771
##  7     3    128243 pop_a  21186
##  8     3    128243 pop_b  50184
##  9     3    128243 pop_c  56876
## 10     4     76843 pop_a  22561
## # … with 8,990 more rows
{{< /code >}}

When we draw the plot, we first call on `geom_histogram()` to draw the
distribution of the total population, setting the color to gray. Then we
call it again, separately, to draw the subgroups. Finally we facet on
the subgroup names. This leaves us with a faceted plot where each panel
shows one subpopulation’s distribution and, for reference behind it, the
overall population distribution.

{{< code r >}}
df %>%
  pivot_longer(cols = pop_a:pop_c) %>%
  ggplot() + 
  geom_histogram(mapping = aes(x = log(pop_total), y = ..count..), 
                bins = 20, alpha = 0.7,
                fill = "gray40", size = 0.5) + 
  geom_histogram(mapping = aes(x = log(value), y = ..count.., 
                          color = name, fill = name), 
            stat = "bin", bins = 20, size = 0.5,
            alpha = 0.7) + 
  scale_fill_okabe_ito() + 
  scale_color_okabe_ito() + 
  guides(color = "none", fill = "none") + 
  labs(x = "Logged Population", y = "Count", 
       title = "Comparing Subgroups: Histograms", 
       subtitle = "Overall distribution shown in gray") + 
  facet_wrap(~ name, nrow = 1, labeller = as_labeller(grp_names)) 
{{< /code >}}


{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-11-1.png" alt="Histograms." caption="Histograms with a reference distribution in each panel." %}}

This is a handy trick. We’ll use it repeatedly in the remaining figures, as we look at different ways of drawing the same comparison.

While putting the reference distribution behind the subgroup distribution is handy, the way the layering works produces an overlap that some viewers find difficult to read. It seems like a third distribution (the darker color created by the overlapping area) has appeared along with the two we're interested in. We can avoid this by taking advantage of the underused `geom_step()` and its `direction` argument. We can tell `geom_step()` to use a binning method (`stat = "bin"`) that's the same as `geom_histogram()`. Here we're also using the computed `..density..` value rather than `..count..`, but we could use `..count..` just fine as well. 

{{< code r >}}
df %>% 
   pivot_longer(cols = pop_a:pop_c) %>%
   ggplot() + 
   geom_histogram(mapping = aes(x = log(value), y = ..density.., 
                           color = name, fill = name), 
             stat = "bin", bins = 20, size = 0.5,
             alpha = 0.7) + 
   geom_step(mapping = aes(x = log(pop_total), y = ..density..), 
                 bins = 20, alpha = 0.9,
                 color = "gray30", size = 0.6, 
             stat = "bin",
             direction = "mid") + 
   scale_fill_manual(values = alpha(my_oka, 0.8)) + 
   scale_color_manual(values = alpha(my_oka, 1)) + 
   guides(color = "none", fill = "none") + 
   labs(x = "Logged Population", y = "Density", 
        title = "Comparing Subgroups: Histograms (Density)", 
        subtitle = "Overall distribution shown in outline") + 
   facet_wrap(~ name, nrow = 1, labeller = as_labeller(grp_names)) 

{{< /code >}}

With `geom_step()`, we get a histogram with just its outline drawn. This works quite well, I think. Because we're just drawing the outline, we call it _after_ we've drawn our histograms, so that it sits in a layer on top of them. 

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-14-1.png" alt="Histogram and outline." caption="Group histograms and overall distribution in outline."%}}

## Frequency polygons

A final option, half way between histograms and smoothed kernel density estimates, is to use filled and open _frequency polygons_. Like `geom_histogram()`, these use `stat_bin()` behind the scenes but rather than columns they draw filled areas (`geom_area`) or lines (`geom_freqpoly`). The code is essentially the same as `geom_histogram` otherwise. We switch back to counts on the y-axis here. 

{{< code r >}}
df %>% 
  pivot_longer(cols = pop_a:pop_c) %>%
  ggplot() + 
  geom_area(mapping = aes(x = log(value), y = ..count.., 
                          color = name, fill = name), 
            stat = "bin", bins = 20, size = 0.5) + 
  geom_freqpoly(mapping = aes(x = log(pop_total), y = ..count..), 
                bins = 20, 
                color = "gray20", size = 0.5) + 
  scale_fill_manual(values = alpha(my_oka, 0.7)) + 
  scale_color_manual(values = alpha(my_oka, 1)) + 
  guides(color = "none", fill = "none") + 
  labs(x = "Logged Population", y = "Count", 
       title = "Comparing Subgroups: Frequency Polygons", 
       subtitle = "Overall distribution shown in outline") + 
  facet_wrap(~ name, nrow = 1, labeller = as_labeller(grp_names)) 

{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-15-1.png" alt="Frequency polygons." caption="Frequency polygons, filled and unfilled." %}}

We can do the same thing with kernel densities, of course:

{{< code r >}}
df %>% 
  pivot_longer(cols = pop_a:pop_c) %>%
  ggplot() + 
  geom_density(mapping = aes(x = log(value), 
                          color = name, fill = name), 
            size = 0.5) + 
  geom_density(mapping = aes(x = log(pop_total)), 
                color = "gray20", size = 0.5) + 
  scale_fill_manual(values = alpha(my_oka, 0.7)) + 
  scale_color_manual(values = alpha(my_oka, 1)) + 
  guides(color = "none", fill = "none") + 
  labs(x = "Logged Population", y = "Density", 
       title = "Comparing Subgroups: Kernel Densities", 
       subtitle = "Overall distribution shown in outline") + 
  facet_wrap(~ name, nrow = 1, labeller = as_labeller(grp_names)) 
{{< /code >}}

{{% figure src="https://kieranhealy.org/files/misc/ref-distribs-16-1.png" alt="Kernel densities with an outline reference distribution." caption="Kernel densities with an outline reference distribution." %}}

While these look good, kernel densities can be a little tricker for people to interpret than straightforward bin-and-count histograms. So it's nice to have the frequency polygon as an option to use when you just want to show counts on the y-axis.

The full code for this post is [available on GitHub](https://github.com/kjhealy/distros). 
