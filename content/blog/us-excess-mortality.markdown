---
title: "US Excess Mortality"
date: 2020-09-24T13:17:28-04:00
categories: [R,visualization,sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---

The CDC recently released some new data on mortality counts by state and cause of death in the U.S., allowing us to get a look at excess mortality patterns due to the COVID-19 pandemic. I've folded the data into [the covdata package](http://kjhealy.github.io/covdata/). As an illustration of the sort of thing you can do with it---and of the sort of thing you can do with ggplot and R---here's a graph of various aspects of mortality in the U.S. so far this year.


{{% figure src="/files/misc/cdc/usa_patch.png" alt="" caption="An overview of mortality in the US in 2020" %}}

This figure has three panels. At the top is the weekly count of deaths from all causes in the United States. Counts for 2020 so far are highlighted in red. In gray are the equivalent counts for the years 2015 to 2019. More or less reliable data is available for about the first thirty weeks of the year so far, so we stop there. If you're not familiar with mortality data of this sort, one thing that will jump out at you is its strongly seasonal character. People are more likely to die in the Winter than in the Summer. You'll also note the relative stability of these patterns. The grey lines over the past five years are pretty steady, as the ordinary cycle of things continues. It's this patterned character to the data that lets us infer excess mortality, when things are worse than usual for some reason. Not everything is fixed, of course. For example, the flu season in the Winter of 2017-2018 was [exceptionally severe](https://www.cdc.gov/flu/about/burden-averted/2017-2018.htm) and is the reason there's a high peak for one of the gray lines. The severity of the flu is easy to underestimate. 

The bottom left panel shows the same weekly data as the upper panel, but broken out by major cause of death. The causes are ordered from highest to lowest by prevalence, with Malignant Neoplasms (that is, cancer) and heart disease being the leading causes in the country in these data. The bottom right panel shows the CDC's own calculation of the percentage difference between each cause of death so far this year as compared to its average in the five previous years. The ordering of the panels is the same, from highest to lowest overall number of deaths. But because the column charts show weekly changes, you can see where excess deaths are being registered within each cause. 

I think the data make some patterns quite clear. Most obviously, deaths attributed to influenza and pneumonia surge upwards beginning about ten weeks into the year. But so, too, do deaths from Alzheimer's, hypertension, and diabetes. While I'm not a public health expert, I think the distribution of these surges is clearly suggestive of the differential impact on various groups of people, such as the elderly and those more likely to suffer from various diseases.

As I say, these data are available at the state as well as the national level. Here, for example, is the same graph for New York:


{{% figure src="/files/misc/cdc/new_york_patch.png" alt="" caption="New York State" %}}


And here, for contrast, is Georgia:

{{% figure src="/files/misc/cdc/georgia_patch.png" alt="" caption="Georgia" %}}

I imagine a serious dive into this data would reveal not just structural variation across states but also evidence of differences in reporting and attribution. The data for states with smaller populations is of course much noisier than for bigger ones, as breaking things down by fourteen causes of death on a week by week basis causes you to run out of degrees of freedom pretty quickly. 

These plots were all made in R and ggplot, and assembling the multiple panels was made much easier thanks to Thomas Lin Pedersen's fabulous [patchwork](https://patchwork.data-imaginist.com) package. The combination of patchwork and [purrr](https://purrr.tidyverse.org) makes the production of a whole lot of plots quite efficient. I'll put a repository with the code on GitHub once I've cleaned it up a little. In the meantime, here are links to graphs for all the jurisdictions in the data. Bear in mind that the graphs have different y-axes, each appropriate to the range of variation within each state and directly connected to the number of people that live in that jurisdiction. So you can't just overlay one on top of another. For a PDF version of any one of these, replace the `.png` extension in the file name with a `.pdf`.


| Jurisdictions| | |
|--------------|------------------|------------------|
| [Alabama](/files/misc/cdc/alabama_patch.png)                           | [Kentucky](/files/misc/cdc/kentucky_patch.png)           | [North Carolina](/files/misc/cdc/north_carolina_patch.png) |
| [Alaska](/files/misc/cdc/alaska_patch.png)                             | [Louisiana](/files/misc/cdc/louisiana_patch.png)         | [North Dakota](/files/misc/cdc/north_dakota_patch.png)     |
| [Arizona](/files/misc/cdc/arizona_patch.png)                           | [Maine](/files/misc/cdc/maine_patch.png)                 | [Ohio](/files/misc/cdc/ohio_patch.png)                     |
| [Arkansas](/files/misc/cdc/arkansas_patch.png)                         | [Maryland](/files/misc/cdc/maryland_patch.png)           | [Oklahoma](/files/misc/cdc/oklahoma_patch.png)             |
| [California](/files/misc/cdc/california_patch.png)                     | [Massachusetts](/files/misc/cdc/massachusetts_patch.png) | [Oregon](/files/misc/cdc/oregon_patch.png)                 |
| [Colorado](/files/misc/cdc/colorado_patch.png)                         | [Michigan](/files/misc/cdc/michigan_patch.png)           | [Pennsylvania](/files/misc/cdc/pennsylvania_patch.png)     |
| [Connecticut](/files/misc/cdc/connecticut_patch.png)                   | [Minnesota](/files/misc/cdc/minnesota_patch.png)         | [Puerto Rico](/files/misc/cdc/puerto_rico_patch.png)       |
| [Delaware](/files/misc/cdc/delaware_patch.png)                         | [Mississippi](/files/misc/cdc/mississippi_patch.png)     | [Rhode Island](/files/misc/cdc/rhode_island_patch.png)     |
| [District of Columbia](/files/misc/cdc/district_of_columbia_patch.png) | [Missouri](/files/misc/cdc/missouri_patch.png)           | [South Carolina](/files/misc/cdc/south_carolina_patch.png) |
| [Florida](/files/misc/cdc/florida_patch.png)                           | [Montana](/files/misc/cdc/montana_patch.png)             | [South Dakota](/files/misc/cdc/south_dakota_patch.png)     |
| [Georgia](/files/misc/cdc/georgia_patch.png)                           | [Nebraska](/files/misc/cdc/nebraska_patch.png)           | [Tennessee](/files/misc/cdc/tennessee_patch.png)           |
| [Hawaii](/files/misc/cdc/hawaii_patch.png)                             | [Nevada](/files/misc/cdc/nevada_patch.png)               | [Texas](/files/misc/cdc/texas_patch.png)                   |
| [Idaho](/files/misc/cdc/idaho_patch.png)                               | [New Hampshire](/files/misc/cdc/new_hampshire_patch.png) | [Utah](/files/misc/cdc/utah_patch.png)                     |
| [Illinois](/files/misc/cdc/illinois_patch.png)                         | [New Jersey](/files/misc/cdc/new_jersey_patch.png)       | [Vermont](/files/misc/cdc/vermont_patch.png)               |
| [Indiana](/files/misc/cdc/indiana_patch.png)                           | [New Mexico](/files/misc/cdc/new_mexico_patch.png)       | [Virginia](/files/misc/cdc/virginia_patch.png)             |
| [Iowa](/files/misc/cdc/iowa_patch.png)                                 | [New York](/files/misc/cdc/new_york_city_patch.png)      | [Washington](/files/misc/cdc/washington_patch.png)          |
| [Kansas](/files/misc/cdc/kansas_patch.png)                             | [New York City](/files/misc/cdc/new_york_patch.png)      | [Wisconsin](/files/misc/cdc/wisconsin_patch.png)           |
|                                                                        |                                                          | [Wyoming](/files/misc/cdc/wyoming_patch.png)               |





