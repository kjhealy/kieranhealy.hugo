---
title: "Covid Trajectories"
date: 2021-09-03T14:03:39-04:00
categories: [R,visualization,sociology,politics]
footnotes: false
htmlwidgets: false
mathjax: false
---

I updated the [`covdata` package](https://kjhealy.github.io/covdata/) for the first time in a while, as I'll be using it to teach in the near future. As a side-effect, I ended up taking a look at what the ongoing polarization or divergence of the COVID experience is like in different parts of the United States. Here I use county-level data to draw out some of the trends. The idea is to take the time series of COVID-19 deaths and split it into deciles by some county-level quantity of interest. I look at how Republican the county is based on the two-party vote share for the 2016 Presidential election, and also at population density. For each of those quantities we place each county in a decile, aggregate the mortality counts, and draw a line for each decile. The expectation is that we'll see divergence at the very start mostly just for whatever decile New York city counties end up in, because they were hit the hardest by far early on, but then the partisan stuff kicks in as COVID spreads everywhere and county-level responses (both individual and governmental) start to vary. County density and partisan strength are well-correlated, of course. 


The daily mortality counts are sourced from the _New York Times_, which as a series is a little noisy but will do for this exercise because the aggregation to a weekly moving average and by decile smooths a lot of the noise. Density and population data come from the Census. Election data are from the MIT Election Lab. I'd have used their 2020 county data, but at first glance it seemed to be missing about eight hundred counties. 2016 will do fine. Here are the graphs. 

{{% figure src="https://kieranhealy.org/files/misc/partisan-decile-man.png" alt="Partisan trajectory graph" caption="Partisanship and COVID deaths at the county level." %}}

{{% figure src="https://kieranhealy.org/files/misc/density-decile-man.png" alt="Population density trajectory graph" caption="Population density and COVID deaths at the county level." %}}


I'm not entirely happy with the presentation here just because the more lines  you have the harder it is to follow what's happening. In addition there are several alternative ways we might aggregate this, but when the time-dimension is primary it's hard to avoid lines. Though [not impossible](https://kieranhealy.org/prints/mortality-france-v/). I may experiment a little more. 

The code and data are [on GitHub](https://github.com/kjhealy/covid_polarization).
