---
title: "Cross National Death Rates"
date: 2020-12-18T10:55:42-05:00
categories: [Sociology,R,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---


Data from the Short Term Mortality Fluctuations dataset compiled by the [Human Mortality Database](https://mortality.org) continues to be very interesting. When thinking about how to interpret the 2020 data in a cross-national and longitudinal context, it's clear that there are several things to bear in mind. For example, and at a bare minimum:

- Countries vary widely in their _average_ mortality rates
- Mortality rates, on the whole, tend to fall over time, so the further back in time we can get data the higher the mortality rate for those years will tend to be
- In the immediate context of the pandemic, countries differed substantially in their response to COVID

Each of these things (and more besides) complicates the question of comparison, and also complicates the counterfactual for what counts as a "good" national response to COVID. 

Here's a graph showing the overall mortality rates by week for a selection of countries. The grey lines are the available rates for previous years. The red line for each country is 2020 up to Week 40. Even though these are rates, and not raw counts, we'll still see noisier series for relatively smaller countries (like Luxembourg) and tighter series for larger ones (like the United States) just because of the law of large numbers.

{{% figure src="/files/misc/country_comp.png" alt="Comparative mortality rates over time" caption="Comparative mortality rates over time" %}}

In general, the longer the mortality series available for a country, the more likely its 2020 series will fit within the overall range of rates, or even seem to be typical, given the tendency of mortality rates to be falling. Similarly, the more effectively a country suppressed COVID (or for other reasons remained unaffected by it) the more its 2020 series will look typical. 

For countries where there's a clear spike in the series or a clear period of sustained higher mortality, I think it's worth separating two points. The first is the overall level of excess mortality that a country records for the year. Excess mortality counts can be tricky to conceptualize because you need to assess the number of counterfactual deaths---the people who would have died of something else this year anyway, if they had not died from COVID. (There's also the second-order question of people who are at present still alive but who would have died of something this year---a car accident, perhaps---had they not been at home and locked down.) So it may turn out that overall excess mortality in some countries will be closer to the average of the recent past than expected. The question of the right comparison point appears once more here, as comparing mortality over a long period will almost always tend to make the present look good. 

The second point to bear in mind is that, apart from the overall mortality level, there's also the question of the size of the mortality shock experienced by countries where COVID surged. This is more a question of the effect at the margin, that is, of the effect of the sudden appearance of a disease that overwhelmed the system's capacity to cope. The spikes in Spain, Italy, France, the UK, and to a lesser extent the US are of obvious interest here. (The US has both a spike and a sustained excess, due largely to the combination of a very large population and wide regional variation in when and to what extend outbreaks have happened.) Even if total all-cause mortality for 2020 ends up being roughly in line with the past when annualized---and, to be clear, in many cases it will be much worse---the effects of the shock still quite clear. Systems set to manage some number of deaths per year at a reasonably steady rate were unable to manage an unexpected surge over the course of a few weeks. Net of seasonal changes in mortality rates (which health systems are generally geared to cope with, as more people die in the winter), the only other mortality shock of comparable scale that really stands out in these data is in France, where the effects of the 2003 heat wave are clearly visible. This event was of a substantially shorter duration than France's COVID spike, though.

All of this is just at the country-level. There's a whole other world of questions when it comes to breaking down the effects of the pandemic across age groups and other categories. 

Given the speed at which decent data is becoming available, and the efforts of public health agencies to produce it and research units like the HMD to clean and harmonize it, it's quite demoralizing to see nonsense of various sorts continue to be peddled in the service of playing down the scope and effects of the pandemic, or worse. 

As usual, the graph above was produced using ggplot with the [covdata](https://kjhealy.github.io/covdata/) package, which gathers up several sources of publicly available data, including that from the HMD, in a format that makes it easy to work with in R.
