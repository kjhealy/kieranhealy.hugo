---
title: "A New York City Race and Ethnicity Dotmap"
date: 2024-05-31T17:38:15-04:00
categories: [Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

As promised in the [previous installment](https://kieranhealy.org/blog/archives/2024/05/30/a-population-dotmap-of-new-york-city/), where we drew a dot-density map of New York City's population, I did the same again only coloring it by the race and ethnicity reported by respondents in the 2020 Census. The direct comparison for this map are the block-level [race and ethnicity choropleths](https://kieranhealy.org/blog/archives/2024/05/29/race-and-ethnicity-in-new-york-city/) I drew the other day. The data source is the same, it's just that now we use it to make a dot map with a point for every ten people (on average, we round to the nearest ten) of a particular racial or ethnic group in a given Census block unit. As before we use the current Census categories. We have "racial" categories of White, Black, Asian, and Other. The collapses the Census categories  'Native Hawaiian and Other Pacific Islander', 'American Indian and Alaska Native', and 'Some Other Race' where the numbers are too small to appear on this map. Meanwhile we separately track those reporting 'Two or More Races'. The Census breaks this out into further multiracial categories but here we just code 'Two or More' as 'Multiracial'. Meanwhile we have to cross-classify this with responses to the "Hispanic or Latino" question. Hispanics may be of any race. For the purposes of this map it makes sense to try to show the racial and Hispanic classifications together. So we end up with nine categories. As you can see on the map, many people reporting themselves to be Hispanic/Latino will also say they are "Some other race". Smaller proportions of Hispanic/Latino respondents will identify as White or Black alone. 

Here's the map.

{{% figure src="ny_dotpop_n10_2020_points_hisp_race_5000px.png" alt="NYC population dot-density map by race and ethnicity" caption="Dot-density map for New York City's population by race and ethnicity." %}}

There's also a [higher-resolution PNG version](ny_dotpop_n10_2020_points_hisp_race_1000ppi.png) which is about 20MB in size. 

As before, this map was made with R along with the ggplot2, tidycensus and sf packages (primarily). Some post-processing in Illustrator was a good lesson in how to make a really quite powerful computer run very slowly indeed.

