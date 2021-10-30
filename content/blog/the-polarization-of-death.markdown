---
title: "The Polarization of Death"
date: 2021-10-30T08:21:45-04:00
categories: [R,visualization,sociology,politics]
footnotes: false
htmlwidgets: false
mathjax: false
---

I'm continuing to update the [`covdata` package](https://kjhealy.github.io/covdata/) in anticipation of a Data Visualization for Social Science course I'll teach next semester. I revisited the Partisan Trajectories graph, as it seems there's more that could be done with it. More on that in the future, I hope. For now, here's an updated version using the 2020 Presidential election as the basis for the deciles, and more recent fatality data. As before, the idea is to take the time series of cumulative COVID-19 deaths and split it into deciles by a county-level quantity of interest. I look at how Republican the county is based on the two-party vote share for the 2020 Presidential election. Counties are cut into deciles by strength of support for Trump in 2020, we aggregate mortality counts to the deciles, and draw a line for each one, giving us an ecological picture of the relationship between deaths and political polarization. We see divergence at the very start for the 0th decile because New York City is in it, and it was hit the hardest by far early on. But then the polarization of death kicks in as COVID spreads everywhere and county-level responses (both individual and governmental) start to vary. By now, it's hard not to think that these gaps are going to continue to widen, given where resistance to vaccines is highest. 

{{% figure src="https://kieranhealy.org/files/misc/partisan-decile-2020-man.png" alt="" caption="Partisanship and COVID deaths at the county level." %}}

The code and data are [on GitHub](https://github.com/kjhealy/covid_polarization).


