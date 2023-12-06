---
title: "Upset Plots"
date: 2020-04-16T15:29:31-04:00
categories: [R,Visulization]
footnotes: false
htmlwidgets: false
mathjax: false
---

The other day [Nature](https://www.nature.com/articles/d41586-020-01023-2) reported some preliminary results from a study of COVID-19 symptoms that's being carried out via a phone app. The report noted that loss of sense of smell (or "Anosmia") seemed to be a common symptom. The report was accompanied by this graphic, showing the co-occurrence of symptoms in about 1,700 self-reports via the app. 

{{% figure src="/files/misc/covid-symptoms-venn.jpg" alt="COVID Symptoms Venn Diagram" caption="A species of Venn Diagram showing the co-occurrence of reported COVID-19 symptoms." %}}

(Again, please bear in mind that these are preliminary results from the users of a single smartphone app.)

I think it's fair to say that this way of representing the data is pushing the Venn Diagram approach to its limits. It's hard to get a sense of what's going on. That said, representing what are in effect tables of cross-classified counts or frequencies is one of those aspects of data visualization that is surprisingly hard to do effectively. If you have a large number of categories and cross-classifications of discrete measures, things get messy very fast. Continuous data are much easier to display, by comparison.

Still, we can do better. One familiar option would be a heatmap of some sort, showing a matrix of symptoms---perhaps clustered how often they occur together---with the cells shaded by the counts or frequencies. More recently, the _upset plot_, developed by [Lex et al](https://ieeexplore.ieee.org/document/6876017) (2014), has emerged as a useful alternative. An upset plot arranges your co-occurring variables into sets and shows you a bar chart of their frequency. The trick is that it tries to make it easy to see the elements that make up the set. 

There are several implementations of upset plots in R. I'm going to use the [Complex UpSet](https://github.com/krassowski/complex-upset) package, but they're all good. Check out [UpSetR](https://github.com/hms-dbmi/UpSetR), and [ggupset](https://github.com/const-ae/ggupset) as well.

I used a spreadsheet to copy out the data from the _Nature_ report, and then loaded it in to R. 

{{< code r >}}

symptoms <- c("Anosmia", "Cough", "Fatigue", "Diarrhea", "Breath", "Fever")
names(symptoms) <- symptoms


dat <- readxl::read_xlsx("data/symptoms.xlsx") 
dat %>% print(n = nrow(dat))

## # A tibble: 32 x 2
##    combination                                 count
##    <chr>                                       <dbl>
##  1 Anosmia                                       140
##  2 Cough                                          57
##  3 Fatigue                                       198
##  4 Diarrhea                                       12
##  5 Breath                                          5
##  6 Fever                                          11
##  7 Cough&Fatigue                                 179
##  8 Fatigue&Fever                                  28
##  9 Breath&Fatigue                                 10
## 10 Diarrhea&Fatigue                               43
## 11 Anosmia&Fatigue                               281
## 12 Breath&Cough                                    1
## 13 Anosmia&Diarrhea&Fatigue                       64
## 14 Breath&Cough&Fatigue                           22
## 15 Anosmia&Cough&Fatigue                         259
## 16 Anosmia&Fever&Fatigue                          46
## 17 Cough&Fever&Fatigue                            54
## 18 Cough&Diarrhea                                  7
## 19 Cough&Diarrhea&Fatigue                         31
## 20 Anosmia&Breath&Cough&Fatigue                   26
## 21 Anosmia&Cough&Fatigue&Fever                    69
## 22 Anosmia&Breath&Cough&Diarrhea&Fatigue          18
## 23 Anosmia&Breath&Cough&Fatigue&Fever             17
## 24 Breath&Cough&Fatigue&Fever                     11
## 25 Breath&Cough&Diarrhea&Fatigue                   7
## 26 Breath&Cough&Diarrhea&Fatigue&Fever             8
## 27 Diarrhea&Fatigue&Fever                         12
## 28 Cough&Diarrhea&Fatigue&Fever                   17
## 29 Anosmia&Diarrhea&Fatigue&Fever                 17
## 30 Anosmia&Diarrhea&Cough&Fatigue                 41
## 31 Anosmia&Breath&Cough&Diarrhea&Fatigue&Fever    23
## 32 Anosmia&Cough&Diarrhea&Fatigue&Fever           50

{{< /code >}}

We have six basic symptoms ("Breath" means "Shortness of Breath"). They occur in various combinations. We need to get this data into a shape we can work with. We have two tasks. First, it will be convenient to convert this summary back into an observation-level table. The `tidyr` package has a [handy function](https://tidyr.tidyverse.org/reference/uncount.html) called `uncount` that will do this for us. However, we can't do that directly. Think of the table as showing counts of where various combinations of symptoms are `TRUE`. Implicitly, where we don't see a symptom, it's implicitly `FALSE` in those cases where it isn't there. For example, in the first row, the 140 patients reporting Anosmia are implicitly also reporting they don't have any of the other five symptoms. If we don't get those implicit negatives back, we won't get a proper picture of the clustering. 

So, we're going to generate table of `TRUE` and `FALSE` values for our symptom combinations. 

{{< code r >}}
subsets <- dat$combination

## Check if each subset mentions each symptom or not
symptom_mat <- map(subsets, \(x) str_detect(x, symptoms)) %>%
  set_names(nm = subsets) %>%
  map(\(x) set_names(x, nm = symptoms)) %>%
  bind_rows(.id = "subset") %>%
  left_join(dat, join_by(subset == combination))

symptom_mat %>% print(n = nrow(symptom_mat))

## # A tibble: 32 x 7
##    Anosmia Cough Fatigue Diarrhea Breath Fever count
##    <lgl>   <lgl> <lgl>   <lgl>    <lgl>  <lgl> <dbl>
##  1 TRUE    FALSE FALSE   FALSE    FALSE  FALSE   140
##  2 FALSE   TRUE  FALSE   FALSE    FALSE  FALSE    57
##  3 FALSE   FALSE TRUE    FALSE    FALSE  FALSE   198
##  4 FALSE   FALSE FALSE   TRUE     FALSE  FALSE    12
##  5 FALSE   FALSE FALSE   FALSE    TRUE   FALSE     5
##  6 FALSE   FALSE FALSE   FALSE    FALSE  TRUE     11
##  7 FALSE   TRUE  TRUE    FALSE    FALSE  FALSE   179
##  8 FALSE   FALSE TRUE    FALSE    FALSE  TRUE     28
##  9 FALSE   FALSE TRUE    FALSE    TRUE   FALSE    10
## 10 FALSE   FALSE TRUE    TRUE     FALSE  FALSE    43
## 11 TRUE    FALSE TRUE    FALSE    FALSE  FALSE   281
## 12 FALSE   TRUE  FALSE   FALSE    TRUE   FALSE     1
## 13 TRUE    FALSE TRUE    TRUE     FALSE  FALSE    64
## 14 FALSE   TRUE  TRUE    FALSE    TRUE   FALSE    22
## 15 TRUE    TRUE  TRUE    FALSE    FALSE  FALSE   259
## 16 TRUE    FALSE TRUE    FALSE    FALSE  TRUE     46
## 17 FALSE   TRUE  TRUE    FALSE    FALSE  TRUE     54
## 18 FALSE   TRUE  FALSE   TRUE     FALSE  FALSE     7
## 19 FALSE   TRUE  TRUE    TRUE     FALSE  FALSE    31
## 20 TRUE    TRUE  TRUE    FALSE    TRUE   FALSE    26
## 21 TRUE    TRUE  TRUE    FALSE    FALSE  TRUE     69
## 22 TRUE    TRUE  TRUE    TRUE     TRUE   FALSE    18
## 23 TRUE    TRUE  TRUE    FALSE    TRUE   TRUE     17
## 24 FALSE   TRUE  TRUE    FALSE    TRUE   TRUE     11
## 25 FALSE   TRUE  TRUE    TRUE     TRUE   FALSE     7
## 26 FALSE   TRUE  TRUE    TRUE     TRUE   TRUE      8
## 27 FALSE   FALSE TRUE    TRUE     FALSE  TRUE     12
## 28 FALSE   TRUE  TRUE    TRUE     FALSE  TRUE     17
## 29 TRUE    FALSE TRUE    TRUE     FALSE  TRUE     17
## 30 TRUE    TRUE  TRUE    TRUE     FALSE  FALSE    41
## 31 TRUE    TRUE  TRUE    TRUE     TRUE   TRUE     23
## 32 TRUE    TRUE  TRUE    TRUE     FALSE  TRUE     50

{{< /code >}}

OK, so with that table in place, we can use the `uncount()` function to turn our summary back into quasi-individual-level data:

{{< code r >}}
indvs <- symptom_mat %>%
    uncount(count) 

indvs

## # A tibble: 1,764 x 6
##    Anosmia Cough Fatigue Diarrhea Breath Fever
##    <lgl>   <lgl> <lgl>   <lgl>    <lgl>  <lgl>
##  1 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  2 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  3 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  4 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  5 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  6 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  7 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  8 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
##  9 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
## 10 TRUE    FALSE FALSE   FALSE    FALSE  FALSE
## # … with 1,754 more rows
{{< /code >}}

If we hadn't done that tabulation, `uncount` would have given us the wrong answers. Ask me how I know!

Now that we've reconstituted the data, we can draw our graph.

{{< code r >}}

library(ComplexUpset)

upset(data = indvs, intersect = symptoms, 
      name="Symptom Groupings by Frequency. Total pool is 1,764 individuals.", 
      min_size = 0,
      width_ratio = 0.125) +
    labs(title = "Co-Occurence of COVID-19 Symptoms",
         caption = "Data: covid.joinzoe.com/us | Graph: @kjhealy")

{{< /code >}}

{{% figure src="/files/misc/covid-upset-plot-1.png" alt="COVID Symptoms Upset Plot" caption="An UpSet plot showing the co-occurrence of reported COVID-19 symptoms. Click or touch to zoom." %}}

The plot has three pieces. The bar chart shows the number of people in the data who reported some particular combination of symptoms. Each bar is a different combination. Underneath it is a graphical table showing what those combinations are. Each row is one of our six symptoms: Fatigue, Anosmia, Cough, Fever, Diarrhea, and (shortness of) Breath. The black dots and lines show the combination of symptoms that make up each cluster or subset of symptoms. Reading from left to right, we can see that the most common subset of symptoms is the combination of Fatigue and Anosmia, and nothing else. A total of 281 respondents reported this combination. Next is Fatigue, Anosmia, and Cough, with 259 reports, followed by Fatigue alone with 198. And so on across the table. You can see, for example, that there are 23 reports of all six symptoms, and only one report of _just_ the combination of Cough and shortness of Breath.

The third component of the plot is the smaller bar chart to the left of the graphical table. This shows the unconditional frequency count of each symptom across all subsets. You can see that almost everyone reported suffering from Fatigue, for instance, and that Shortness of Breath was the least commonly-reported symptom in absolute terms.

I think upset plots are very useful, on the whole. They clearly outperform Venn diagrams when there's more than a few overlapping sets, and they avoid some of the problems associated with heatmaps, too. Nicholas Tierney puts them to very good use in [naniar](https://github.com/njtierney/naniar), his package for visualizing missing data. The technique doesn't make the problems with visualizing cross-classified counts magically disappear, of course. If you have a large number of intersecting groups it will become unwieldy as well. But then of course you'd start to look for ways to focus on the intersections that matter most, or on alternative ways of ordering the combinations, and so on. (The upset packages have some of these methods built in.) In the meantime, it's often your best option for this kind of task.

The code and data used in this post are [available on GitHub](https://github.com/kjhealy/covid_symptoms).
