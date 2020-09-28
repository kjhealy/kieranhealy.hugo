---
title: "US Excess Mortality"
date: 2020-09-24T13:17:28-04:00
categories: [R,visualization,sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


{{% admonition info Update %}}

I've redrawn the graphs here to add more information about COVID-19 deaths specifically. This post is getting a substantial amount of traffic and some of the feedback I've gotten suggests people were confused about what exactly was being shown. The original graphs were drawn from [this CDC dataset](https://data.cdc.gov/NCHS/Weekly-counts-of-death-by-jurisdiction-and-cause-o/u6jv-9ijr/), which led some readers to think that there was some undercounting happening. In the new versions, I've used a merged version of the [2014-2018 data](https://data.cdc.gov/NCHS/Weekly-Counts-of-Deaths-by-State-and-Select-Causes/3yf8-kanr) and the ongoing [2019-2020 counts](https://data.cdc.gov/NCHS/Weekly-Counts-of-Deaths-by-State-and-Select-Causes/muzy-jte6). 

I've also put up a [GitHub repository](https://github.com/kjhealy/us_mortality_cdc) containing the code needed to reproduce the graphs here, if you're interested in looking in more detail. 

{{% /admonition %}}


The CDC recently released some new data on mortality counts by state and cause of death in the U.S., allowing us to get a look at excess mortality patterns due to the COVID-19 pandemic. I've folded the data into [the covdata package](http://kjhealy.github.io/covdata/). As an illustration of the sort of thing you can do with it---and of the sort of thing you can do with ggplot and R---here's a graph of various aspects of mortality in the U.S. so far this year.


{{% figure src="/files/misc/cdc/usa_patch.png" alt="" caption="An overview of mortality in the US in 2020" %}}

The figures have four sections. At the top is the weekly count of deaths from all causes in the United States. Counts for 2020 so far are highlighted in red. In gray are the equivalent counts for the years 2015 to 2019. More or less reliable data is available for about the first thirty weeks of the year so far, so we stop there. If you're not familiar with mortality data of this sort, one thing that will jump out at you is its strongly seasonal character. People are more likely to die in the Winter than in the Summer. You'll also note the relative stability of these patterns. The grey lines over the past five years are pretty steady, as the ordinary cycle of things continues. It's this patterned character to the data that lets us infer excess mortality, when things are worse than usual for some reason. Not everything is fixed, of course. For example, the flu season in the Winter of 2017-2018 was [exceptionally severe](https://www.cdc.gov/flu/about/burden-averted/2017-2018.htm) and is the reason there's a high peak for one of the gray lines. The severity of the flu is easy to underestimate. 

The second section shows the count of COVID-related deaths from week to week. The bars show the "COVID-19 (U071, Multiple Cause of Death)" ICD code. 

The bottom left panel shows the same weekly data as the upper panel, but broken out by major cause of death. The causes are ordered from highest to lowest by prevalence, with Malignant Neoplasms (that is, cancer) and heart disease being the leading causes in the country in these data. The bottom right panel shows the CDC's own calculation of the percentage difference between each cause of death so far this year as compared to its average in the five previous years. The ordering of the panels is the same, from highest to lowest overall number of deaths. But because the column charts show weekly changes, you can see where excess deaths are being registered within each cause. Thus far the comparisons are for the first thirty weeks of the year only, as reporting lags make counts from more recent weeks much noisier.

Bear in mind that these are counts and not modeled estimates. For the CDC's own modeling of excess deaths due to COVID-19, [consult their dashboards](https://www.cdc.gov/nchs/nvss/vsrr/covid19/excess_deaths.htm).

I think the data make some patterns quite clear. Most obviously, deaths attributed to influenza and pneumonia surge upwards beginning about ten weeks into the year. But so, too, do deaths from Alzheimer's, hypertension, and diabetes. While I'm not a public health expert, I think the distribution of these surges is clearly suggestive of the differential impact on various groups of people, such as the elderly and those more likely to suffer from various diseases.

As I say, these data are available at the state as well as the national level. Here, for example, is the same graph for New York City:


{{% figure src="/files/misc/cdc/new_york_city_patch.png" alt="" caption="New York City" %}}


And here, for contrast, is Georgia:

{{% figure src="/files/misc/cdc/georgia_patch.png" alt="" caption="Georgia" %}}

I imagine a serious dive into this data would reveal not just structural variation across states but also evidence of differences in reporting and attribution. The data for states with smaller populations is of course much noisier than for bigger ones, as breaking things down by fourteen causes of death on a week by week basis causes you to run out of degrees of freedom pretty quickly. 

These plots were all made in R and ggplot, and assembling the multiple panels was made much easier thanks to Thomas Lin Pedersen's fabulous [patchwork](https://patchwork.data-imaginist.com) package. The combination of patchwork and [purrr](https://purrr.tidyverse.org) makes the production of a whole lot of plots quite efficient. I'll put a repository with the code on GitHub once I've cleaned it up a little. In the meantime, here are links to graphs for all the jurisdictions in the data. Bear in mind that the graphs have different y-axes, each appropriate to the range of variation within each state and directly connected to the number of people that live in that jurisdiction. So you can't just overlay one on top of another. For a PDF version of any one of these, replace the `.png` extension in the file name with a `.pdf`.


| Jurisdictions| | |
| :-- | :-- | :-- |
| [Alabama](/files/misc/cdc/alabama_patch.png) ![alabama](/files/misc/cdc/alabama_patch.jpg)                     | [Alaska](/files/misc/cdc/alaska_patch.png) ![alaska](/files/misc/cdc/alaska_patch.jpg)                 | [Arizona](/files/misc/cdc/arizona_patch.png) ![arizona](/files/misc/cdc/arizona_patch.jpg)                           |
| [Arkansas](/files/misc/cdc/arkansas_patch.png) ![arkansas](/files/misc/cdc/arkansas_patch.jpg)                   | [California](/files/misc/cdc/california_patch.png) ![california](/files/misc/cdc/california_patch.jpg)         | [Colorado](/files/misc/cdc/colorado_patch.png) ![colorado](/files/misc/cdc/colorado_patch.jpg)                         |
| [Connecticut](/files/misc/cdc/connecticut_patch.png) ![connecticut](/files/misc/cdc/connecticut_patch.jpg)             | [Delaware](/files/misc/cdc/delaware_patch.png) ![delaware](/files/misc/cdc/delaware_patch.jpg)             | [District of Columbia](/files/misc/cdc/district_of_columbia_patch.png) ![district_of_columbia](/files/misc/cdc/district_of_columbia_patch.jpg) |
| [Florida](/files/misc/cdc/florida_patch.png) ![florida](/files/misc/cdc/florida_patch.jpg)                     | [Georgia](/files/misc/cdc/georgia_patch.png) ![georgia](/files/misc/cdc/georgia_patch.jpg)               | [Hawaii](/files/misc/cdc/hawaii_patch.png) ![hawaii](/files/misc/cdc/hawaii_patch.jpg)                             |
| [Idaho](/files/misc/cdc/idaho_patch.png) ![idaho](/files/misc/cdc/idaho_patch.jpg)                         | [Illinois](/files/misc/cdc/illinois_patch.png) ![illinois](/files/misc/cdc/illinois_patch.jpg)             | [Indiana](/files/misc/cdc/indiana_patch.png) ![indiana](/files/misc/cdc/indiana_patch.jpg)                           |
| [Iowa](/files/misc/cdc/iowa_patch.png) ![iowa](/files/misc/cdc/iowa_patch.jpg)                           | [Kansas](/files/misc/cdc/kansas_patch.png) ![kansas](/files/misc/cdc/kansas_patch.jpg)                 | [Kentucky](/files/misc/cdc/kentucky_patch.png) ![kentucky](/files/misc/cdc/kentucky_patch.jpg)                         |
| [Louisiana](/files/misc/cdc/louisiana_patch.png) ![louisiana](/files/misc/cdc/louisiana_patch.jpg)                 | [Maine](/files/misc/cdc/maine_patch.png) ![maine](/files/misc/cdc/maine_patch.jpg)                   | [Maryland](/files/misc/cdc/maryland_patch.png) ![maryland](/files/misc/cdc/maryland_patch.jpg)                         |
| [Massachusetts](/files/misc/cdc/massachusetts_patch.png) ![massachusetts](/files/misc/cdc/massachusetts_patch.jpg)         | [Michigan](/files/misc/cdc/michigan_patch.png) ![michigan](/files/misc/cdc/michigan_patch.jpg)             | [Minnesota](/files/misc/cdc/minnesota_patch.png) ![minnesota](/files/misc/cdc/minnesota_patch.jpg)                       |
| [Mississippi](/files/misc/cdc/mississippi_patch.png) ![mississippi](/files/misc/cdc/mississippi_patch.jpg)             | [Missouri](/files/misc/cdc/missouri_patch.png) ![missouri](/files/misc/cdc/missouri_patch.jpg)             | [Montana](/files/misc/cdc/montana_patch.png) ![montana](/files/misc/cdc/montana_patch.jpg)                           |
| [Nebraska](/files/misc/cdc/nebraska_patch.png) ![nebraska](/files/misc/cdc/nebraska_patch.jpg)                   | [Nevada](/files/misc/cdc/nevada_patch.png) ![nevada](/files/misc/cdc/nevada_patch.jpg)                 | [New Hampshire](/files/misc/cdc/new_hampshire_patch.png) ![new_hampshire](/files/misc/cdc/new_hampshire_patch.jpg)               |
| [New Jersey](/files/misc/cdc/new_jersey_patch.png) ![new_jersey](/files/misc/cdc/new_jersey_patch.jpg)               | [New Mexico](/files/misc/cdc/new_mexico_patch.png) ![new_mexico](/files/misc/cdc/new_mexico_patch.jpg)         | [New York City](/files/misc/cdc/new_york_city_patch.png) ![new_york_city](/files/misc/cdc/new_york_city_patch.jpg)               |
| [New York State (excl. NYC)](/files/misc/cdc/new_york_patch.png) ![new_york](/files/misc/cdc/new_york_patch.jpg) | [North Carolina](/files/misc/cdc/north_carolina_patch.png) ![north_carolina](/files/misc/cdc/north_carolina_patch.jpg) | [North Dakota](/files/misc/cdc/north_dakota_patch.png) ![north_dakota](/files/misc/cdc/north_dakota_patch.jpg)                 |
| [Ohio](/files/misc/cdc/ohio_patch.png) ![ohio](/files/misc/cdc/ohio_patch.jpg)                           | [Oklahoma](/files/misc/cdc/oklahoma_patch.png) ![oklahoma](/files/misc/cdc/oklahoma_patch.jpg)             | [Oregon](/files/misc/cdc/oregon_patch.png) ![oregon](/files/misc/cdc/oregon_patch.jpg)                             |
| [Pennsylvania](/files/misc/cdc/pennsylvania_patch.png) ![pennsylvania](/files/misc/cdc/pennsylvania_patch.jpg)           | [Puerto Rico](/files/misc/cdc/puerto_rico_patch.png) ![puerto_rico](/files/misc/cdc/puerto_rico_patch.jpg)       | [Rhode Island](/files/misc/cdc/rhode_island_patch.png) ![rhode_island](/files/misc/cdc/rhode_island_patch.jpg)                 |
| [South Carolina](/files/misc/cdc/south_carolina_patch.png) ![south_carolina](/files/misc/cdc/south_carolina_patch.jpg)       | [South Dakota](/files/misc/cdc/south_dakota_patch.png) ![south_dakota](/files/misc/cdc/south_dakota_patch.jpg)     | [Tennessee](/files/misc/cdc/tennessee_patch.png) ![tennessee](/files/misc/cdc/tennessee_patch.jpg)                       |
| [Texas](/files/misc/cdc/texas_patch.png) ![texas](/files/misc/cdc/texas_patch.jpg)                         | [Utah](/files/misc/cdc/utah_patch.png) ![utah](/files/misc/cdc/utah_patch.jpg)                     | [Vermont](/files/misc/cdc/vermont_patch.png) ![vermont](/files/misc/cdc/vermont_patch.jpg)                           |
| [Virginia](/files/misc/cdc/virginia_patch.png) ![virginia](/files/misc/cdc/virginia_patch.jpg)                   | [Washington](/files/misc/cdc/washington_patch.png) ![washington](/files/misc/cdc/washington_patch.jpg)         | [West Virginia](/files/misc/cdc/west_virginia_patch.png) ![west_virginia](/files/misc/cdc/west_virginia_patch.jpg)               |
| [Wisconsin](/files/misc/cdc/wisconsin_patch.png) ![wisconsin](/files/misc/cdc/wisconsin_patch.jpg)                 | [Wyoming](/files/misc/cdc/wyoming_patch.png) ![wyoming](/files/misc/cdc/wyoming_patch.jpg)               | [United States](/files/misc/cdc/united_states_patch.png) ![wyoming](/files/misc/cdc/united_states_patch.jpg)                                                                       |



