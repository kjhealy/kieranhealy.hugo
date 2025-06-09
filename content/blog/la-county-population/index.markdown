---
title: "LA County Population"
date: 2025-06-09T12:18:15-04:00
categories: [visualization,R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Another in an [accidental series](https://kieranhealy.org/blog/archives/2025/02/19/mta-ridership/) of "Basic facts about U.S. urban areas presently in the news". This week, West Coast Edition: like other very large American cities, Los Angeles is very big. 

{{% figure src="la_county_annotated.png" alt="Los Angeles County is big" caption="There are a lot of Angelenos." %}}

In fact this is just Los Angeles county, which is both larger than the [City of Los Angeles](https://en.wikipedia.org/wiki/Los_Angeles) proper, but smaller than the [Los Angeles-Long Beach-Anaheim](https://en.wikipedia.org/wiki/Greater_Los_Angeles) [Metropolitan Statistical Area](https://en.wikipedia.org/wiki/Metropolitan_statistical_area). L.A. County has about 9.66 million residents; the City of Los Angeles about 3.8 million residents; and the greater MSA about 12.7 million residents. The Greater LA Region, including out to Oxnard in the West and Palm Springs in the East, has about 18.5 million people. 

With a [U.S. Census Bureau API Key](https://api.census.gov/data/key_signup.html) you can write something like this to get county-level population data to play with, including geometry information for drawing maps:

{{< code r >}}
library(tidyverse)
library(tidycensus)

df <- get_estimates(geography = "county", product = "population", vintage = 2023,
                    geometry = TRUE,
                    keep_geo_vars = TRUE) |>
  tigris::shift_geometry() # Relocate AK, HI, PR for compact maps
#> Using the Vintage 2023 Population Estimates

df |>
  select(GEOID, NAMELSAD, STUSPS, variable, value)  |> 
  filter(variable == "POPESTIMATE") |> 
  arrange(desc(value))
#> Simple feature collection with 3144 features and 5 fields
#> Geometry type: GEOMETRY
#> Dimension:     XY
#> Bounding box:  xmin: -3111747 ymin: -1697746 xmax: 2258200 ymax: 1565782
#> Projected CRS: USA_Contiguous_Albers_Equal_Area_Conic
#> # A tibble: 3,144 × 6
#>    GEOID NAMELSAD           STUSPS variable      value                                                geometry
#>    <chr> <chr>              <chr>  <chr>         <dbl>                                      <MULTIPOLYGON [m]>
#>  1 06037 Los Angeles County CA     POPESTIMATE 9663345 (((-2066923 -203083.1, -2066434 -203272.1, -2065390 -2…
#>  2 17031 Cook County        IL     POPESTIMATE 5087072 (((635130.2 537472.7, 635177.5 537477, 635563.1 537514…
#>  3 48201 Harris County      TX     POPESTIMATE 4835125 (((98841.33 -871973.1, 98931.48 -871800.4, 99057.93 -8…
#>  4 04013 Maricopa County    AZ     POPESTIMATE 4585871 (((-1589798 -296467.3, -1589514 -294927.1, -1588289 -2…
#>  5 06073 San Diego County   CA     POPESTIMATE 3269973 (((-1978629 -234410.6, -1978186 -233478, -1977664 -232…
#>  6 06059 Orange County      CA     POPESTIMATE 3135755 (((-2016106 -184704.9, -2016015 -184550.6, -2015899 -1…
#>  7 12086 Miami-Dade County  FL     POPESTIMATE 2686867 (((1599930 -1197649, 1600157 -1197575, 1600262 -119769…
#>  8 48113 Dallas County      TX     POPESTIMATE 2606358 (((-96981.15 -552050.6, -96961.88 -551295.8, -96943.21…
#>  9 36047 Kings County       NY     POPESTIMATE 2561225 (((1825608 562217.9, 1825608 562236.6, 1825611 562511.…
#> 10 06065 Riverside County   CA     POPESTIMATE 2492442 (((-1973240 -178219, -1971288 -178662.6, -1970834 -176…
#> # ℹ 3,134 more rows
{{< /code >}}


And for your state-level comparison, again including the geometries:

{{< code r >}}
state_df <- get_estimates(geography = "state", product = "population", vintage = 2023,
                          geometry = TRUE,
                          keep_geo_vars = TRUE) |>
  filter(variable == "POPESTIMATE") |>
  tigris::shift_geometry() 
#> Using the Vintage 2023 Population Estimates

state_df |> 
  select(STUSPS, variable, value) |> 
  arrange(desc(value))
#> Simple feature collection with 52 features and 3 fields
#> Geometry type: MULTIPOLYGON
#> Dimension:     XY
#> Bounding box:  xmin: -3111747 ymin: -1697746 xmax: 2258200 ymax: 1565782
#> Projected CRS: USA_Contiguous_Albers_Equal_Area_Conic
#> # A tibble: 52 × 4
#>    STUSPS variable       value                                                                                geometry
#>    <chr>  <chr>          <dbl>                                                                      <MULTIPOLYGON [m]>
#>  1 CA     POPESTIMATE 38965193 (((-2066923 -203083.1, -2066434 -203272.1, -2065390 -203998.6, -2064847 -203983.1, -...
#>  2 TX     POPESTIMATE 30503301 (((123936.1 -866655.9, 124036.5 -866293.1, 124101.4 -866136.8, 124302.4 -866192.1, 1...
#>  3 FL     POPESTIMATE 22610726 (((1539355 -1253701, 1539399 -1253591, 1539568 -1253573, 1539645 -1253677, 1539670 -...
#>  4 NY     POPESTIMATE 19571216 (((1971370 670201.1, 1971466 670819.8, 1971674 671037.9, 1971705 671652.5, 1971826 6...
#>  5 PA     POPESTIMATE 12961683 (((1287712 486864, 1287647 487393.7, 1287516 488466, 1286933 492035.5, 1286933 49203...
#>  6 IL     POPESTIMATE 12549689 (((378605.4 309417.4, 378724.8 310290.3, 378839.6 310581.1, 379159 311074.9, 379230....
#>  7 OH     POPESTIMATE 11785935 (((1093937 536238.6, 1094689 536961.2, 1094790 537429.3, 1094700 537846.3, 1095036 5...
#>  8 GA     POPESTIMATE 11029227 (((1390722 -584139.2, 1390875 -583744.3, 1391189 -583636.6, 1391495 -583725.5, 13914...
#>  9 NC     POPESTIMATE 10835491 (((1799008 17387.01, 1799662 17972.25, 1800801 18183.4, 1802098 18181.65, 1802610 17...
#> 10 MI     POPESTIMATE 10037261 (((1049981 578947.1, 1050107 579034, 1050201 578927.1, 1050205 578748.4, 1050058 578...
#> # ℹ 42 more rows
{{< /code >}}
