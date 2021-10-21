---
title: "Excess Deaths February Update"
date: 2021-02-24T20:12:42-05:00
categories: [Sociology,Politics,R,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

{{% admonition info Update %}}
Updated on April 29th,  2021.
{{% /admonition %}}


The CDC continues to update its counts of deaths by cause for 2020 as data comes in from the jurisdictions that report to it. The data are by now fairly complete, though there are still significant gaps in several states due to delayed reporting. North Carolina, in particular, has yet to report almost any deaths for the entire final quarter of 2020. But I haven't updated my gallery since last October. A nice post last week from [Dr Drang](https://leancrew.com/all-this/2021/02/closing-out-2020/) and a request from [Cameron Wimpy](https://cwimpy.com) nudged me to do it. 

Here's all-cause mortality for each jurisdiction, ordered by how far off their 2015-2019 average they were in 2020. Even though we're into 2021 there's still a fair amount of under-reporting in this data. North Carolina is omitted as they have barely reported any mortality data since the end of October. Other jurisdictions are still finalizing their numbers.

{{% figure src="/files/misc/excess_all_cause_by_jurisdiction.png" alt="" caption="All-cause mortality by jurisdiction." %}}


Here's an overview for the whole of the United States, based on CDC data as of February 24th 2021.

{{% figure src="/files/misc/cdc/usa_patch.png" alt="" caption="An overview of mortality in the US in 2020" %}}

This figure has four sections. At the top is the weekly count of deaths from all causes in the United States. Counts for 2020 are highlighted in red. In gray are the equivalent counts for the years 2015 to 2019. If you're not familiar with mortality data of this sort, one thing that will jump out at you is its strongly seasonal character. People are more likely to die in the Winter than in the Summer. You'll also note the relative stability of these patterns, which we exploit to draw the graph. The grey lines over the past five years are pretty steady, as the ordinary cycle of things continues. They provide the baseline for the graph---that is, the thing we're comparing the red line of 2020 to. It's this patterned character to the data that lets us infer excess mortality, too. Not everything is fixed, of course. Even absent a pandemic, some years are worse than others. For example, the flu season in the Winter of 2017-2018 was [exceptionally severe](https://www.cdc.gov/flu/about/burden-averted/2017-2018.htm) and is the reason there's a high peak for one of the gray lines. The severity of the flu is easy to underestimate. 

The second section shows the count of COVID-related deaths from week to week. The bars show the "COVID-19 (U071, Multiple Cause of Death)" ICD code. 

The bottom left panel shows the same weekly data as the upper panel, but broken out by major cause of death. When looking at these panels, perhaps the most important thing to bear in mind is that individual deaths may be recorded as having more than one cause.

Causes are ordered from highest to lowest by prevalence, with Malignant Neoplasms (that is, cancer) and heart disease being the leading causes in the country in these data. The bottom right panel shows the CDC's own calculation of the percentage difference between each cause of death so far this year as compared to its average in the five previous years. The ordering of the panels is the same, from highest to lowest overall number of deaths. But because the column charts show weekly changes, you can see where excess deaths are being registered within each cause. I present straight counts here, but the CDC has some modeled estimates of excess deaths due to COVID-19. These estimates attempt to account for the reporting lags that we are still experiencing. For details, [consult their dashboards](https://www.cdc.gov/nchs/nvss/vsrr/covid19/excess_deaths.htm).

The data for these figures comes from the CDC and is available in [covdata](https://kjhealy.github.io/covdata/), a data package of mine that bundles up this and other data in a way that will be useful to researchers and students who use R for data analysis. The plots were made using ggplot2. Changing the extension of any image from .png to .pdf will get you a PDF of the graph.

## A gallery of excess mortality summaries for every jurisdiction the CDC tracks

This gallery contains pictures that are the same as the one above, but there is one for every jurisdiction that the CDC tracks. Click or touch a thumbnail to see the full version and browse the gallery of images. Trend lines for these counts, especially when broken out by cause, will be noisier the smaller the population of the jurisdiction. Some states (e.g. North Carolina, which is a disaster for some reason) are slow in reporting complete statewide totals and so more recent weeks will tend to be under-counted, sometimes severely.

{{< foldergallery src="files/misc/cdc/" >}}
