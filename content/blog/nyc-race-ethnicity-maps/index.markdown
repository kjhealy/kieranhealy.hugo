---
title: "Race and Ethnicity in New York City"
date: 2024-05-29T07:33:56-04:00
categories: [Visualization,R]
footnotes: false
htmlwidgets: false
mathjax: false
---


I'm about to start work on a second edition of my [Data Visualization](https://socviz.co) book. As a result I continue to mess around with stuff I'm considering including in a new edition. The other day I pulled some block-level Census data and drew a map of the distribution of people of color in New York City, which is to say the share of the population that reports being something other than Non-Hispanic White. I've polished that map a little more and drawn some additional ones. As before, the main substantive issues to bear in mind are (a) how the Census measures and classifies race and ethnicity, and (b) the new and I am inclined to think [unwise](https://www.aeaweb.org/articles?id=10.1257/pandp.20191107) practice of "differential privacy". The main thing to know about the former is that in the present US schema people of Hispanic or Latino origin may be of any race. This is the reason that "Non-Hispanic White" is a category for example. The main thing to know about the latter is that it deliberately introduces noise into counts within units where the observed N is small. 

The other thing to remember is every [choropleth maker's](https://kieranhealy.org/blog/archives/2015/06/12/americas-ur-choropleths/) oldest friend, the [Modifiable Areal Unit Problem](https://en.wikipedia.org/wiki/Modifiable_areal_unit_problem). Census Blocks are the smallest spatial unit we can make a choropleth map of, but they're not "real", so to speak.

As usual, the tools used to make these maps are R, ggplot, and the [tidycensus](https://walker-data.com/tidycensus/) and [sf](https://r-spatial.github.io/sf/) packages. Together, of course, with the really phenomenal range of data made available by the [Census Bureau API](https://www.census.gov/data/developers/data-sets.html). 

For these new versions I decided to add a little more context by sketching in some of the coastline, particularly the outline of New Jersey to the west, along with a reminder that Long Island continues to exist past the Queens border, etc These  coastal outlines come from the [NOAA CUSP maps](https://nsde.ngs.noaa.gov).


{{% figure src="ny_pctpoc_2020_out_600.png" alt="" caption="New York City's POC population." %}}


{{% figure src="ny_pct_black_alone_2020_out_600.png" alt="" caption="New York City population, percent reporting 'Black Alone' to race question." %}}


{{% figure src="ny_pct_hispanic_2020_out_600.png" alt="" caption="New York City population, percent Hispanic/Latino origin." %}}


{{% figure src="ny_pct_asian_alone_2020_out_600.png" alt="" caption="New York City population, precent reporting 'Asian Alone' to race question." %}}

PDFs of these maps: 

- [Percent POC](ny_pctpoc_2020_out.pdf)
- [Percent Black Alone](ny_pct_black_alone_2020_out.pdf) 
- [Percent Hispanic/Latino](ny_pct_hispanic_2020_out.pdf)    
- [Percent Asian Alone](ny_pct_asian_alone_2020_out.pdf) 
