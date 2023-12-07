---
title: "Dorling Cartograms"
date: 2023-12-06T18:40:38-05:00
categories: [visualization,R,sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---

I was writing some examples for next semester's dataviz class and shared one of them---a [Dorling Cartogram](https://www.arcgis.com/home/item.html?id=b686a7679cb747e9825d1d1bb6b26046)---on the socials medias. Some people don't like cartograms, some people do like cartograms; in conclusion, we live in a world of contrasts. 

Also, some people asked for the code. So here it is, fwiw, after the pictures. These are not the most polished figures, but that is kind of the point, as we go through them in class and ~~indoctrinate students in the inflexible ideology of Cultural Marxism~~ discuss them like reasonable people and so on.

{{% figure src="dorling-bl.png" alt="Dorling cartogram, percent Black by county" caption="Percent Black by County" %}}

{{% figure src="dorling-nhw.png" alt="Dorling cartogram, percent Non-Hispanic White by county" caption="Percent Non-Hispanic White by County" %}}

{{% figure src="dorling-asian.png" alt="Dorling cartogram, percent Asian by county" caption="Percent Asian by County" %}}

{{% figure src="dorling-hs.png" alt="Dorling cartogram, percent Hispanic by county" caption="Percent Hispanic by County" %}}

And the code:

{{< code r >}}
## Dorling Cartogram example with US Census data
## Requires you sign up for a free Census API key
## https://api.census.gov/data/key_signup.html
##

## Required packages
library(tidyverse)
library(tidycensus)
library(sf)
library(cartogram)
library(colorspace)

## Setup
options(tigris_use_cache = TRUE)

## Do this
census_api_key("YOUR API KEY HERE")
## or, to install in your .Rprofile follow the instructions at
## https://walker-data.com/tidycensus/reference/census_api_key.html

pop_names <- tribble(
  ~varname, ~clean,
  "B01003_001", "pop",
  "B01001B_001", "black",
  "B01001A_001", "white",
  "B01001H_001", "nh_white",
  "B01001I_001", "hispanic",
  "B01001D_001", "asian"
)

## Get the data
fips_pop <- get_acs(geography = "county",
                    variables = pop_names$varname,
                    cache_table = TRUE) |>
  left_join(pop_names, join_by(variable == varname)) |> 
  mutate(variable = clean) |> 
  select(-clean, -moe) |>
  pivot_wider(names_from = variable, values_from = estimate) |>
  rename(fips = GEOID, name = NAME) |>
  mutate(prop_pop = pop/sum(pop),
         prop_black = black/pop,
         prop_hisp = hispanic/pop,
         prop_white = white/pop,
         prop_nhwhite = nh_white/pop,
         prop_asian = asian/pop)

fips_map <- get_acs(geography = "county",
                    variables = "B01001_001",
                    geometry = TRUE,
                    shift_geo = FALSE,
                    cache_table = TRUE) |>
  select(GEOID, NAME, geometry) |>
  rename(fips = GEOID, name = NAME)


pop_cat_labels <- c("<5", as.character(seq(10, 95, 5)), "100")

counties_sf <- fips_map |>
  left_join(fips_pop, by = c("fips", "name")) |>
  mutate(black_disc = cut(prop_black*100,
                          breaks = seq(0, 100, 5),
                          labels = pop_cat_labels,
                          ordered_result = TRUE),
         hisp_disc = cut(prop_hisp*100,
                         breaks = seq(0, 100, 5),
                         labels = pop_cat_labels,
                         ordered_result = TRUE),
         nhwhite_disc = cut(prop_nhwhite*100,
                            breaks = seq(0, 100, 5),
                            labels = pop_cat_labels,
                            ordered_result = TRUE),
         asian_disc = cut(prop_asian*100,
                          breaks = seq(0, 100, 5),
                          labels = pop_cat_labels,
                          ordered_result = TRUE)) |>
  sf::st_transform(crs = 2163)


## Now we have
counties_sf

## Create the circle-packed version
## Be patient
county_dorling <- cartogram_dorling(x = counties_sf,
                                    weight = "prop_pop",
                                    k = 0.2, itermax = 100)


## Now draw the maps

## Black
out_black <- county_dorling |>
  filter(!str_detect(name, "Alaska|Hawaii|Puerto|Guam")) |>
  ggplot(aes(fill = black_disc)) +
  geom_sf(color = "grey30", size = 0.1) +
  coord_sf(crs = 2163, datum = NA) +
  scale_fill_discrete_sequential(palette = "YlOrBr",
                                 na.translate=FALSE) +
  guides(fill = guide_legend(title.position = "top",
                             label.position = "bottom",
                             nrow = 1)) +
  labs(
    subtitle = "Bubble size corresponds to County Population",
    caption = "Graph: @kjhealy. Source: Census Bureau / American Community Survey",
    fill = "Percent Black by County") +
  theme(legend.position = "top",
        legend.spacing.x = unit(0, "cm"),
        legend.title = element_text(size = rel(1.5), face = "bold"),
        legend.text = element_text(size = rel(0.7)),
        plot.title = element_text(size = rel(1.4), hjust = 0.15))

ggsave("figures/dorling-bl.png", out_black, height = 10, width = 12)

## Hispanic
out_hispanic <- county_dorling |>
  filter(!str_detect(name, "Alaska|Hawaii|Puerto|Guam")) |>
  ggplot(aes(fill = hisp_disc)) +
  geom_sf(color = "grey30", size = 0.1) +
  coord_sf(crs = 2163, datum = NA) +
  scale_fill_discrete_sequential(palette = "SunsetDark", na.translate=FALSE) +
  guides(fill = guide_legend(title.position = "top",
                             label.position = "bottom",
                             nrow = 1,
  )) +
  labs(fill = "Percent Hispanic by County",
       subtitle = "Bubble size corresponds to County Population",
       caption = "Graph: @kjhealy. Source: Census Bureau / American Community Survey") +
  theme(legend.position = "top",
        legend.spacing.x = unit(0, "cm"),
        legend.title = element_text(size = rel(1.5), face = "bold"),
        legend.text = element_text(size = rel(0.7)),
        plot.title = element_text(size = rel(1.4), hjust = 0.15))

ggsave("figures/dorling-hs.png", out_hispanic, height = 10, width = 12)

## NH White
out_white <- county_dorling |>
  filter(!str_detect(name, "Alaska|Hawaii|Puerto|Guam")) |>
  ggplot(aes(fill = nhwhite_disc)) +
  geom_sf(color = "grey30", size = 0.1) +
  coord_sf(crs = 2163, datum = NA) +
  scale_fill_discrete_sequential(palette = "BluYl", na.translate=FALSE) +
  guides(fill = guide_legend(title.position = "top",
                             label.position = "bottom",
                             nrow = 1,
  )) +
  labs(fill = "Percent Non-Hispanic White by County",
       subtitle = "Bubble size corresponds to County Population",
       caption = "Graph: @kjhealy. Source: Census Bureau / American Community Survey") +
  theme(legend.position = "top",
        legend.spacing.x = unit(0, "cm"),
        legend.title = element_text(size = rel(1.5), face = "bold"),
        legend.text = element_text(size = rel(0.7)),
        plot.title = element_text(size = rel(1.4), hjust = 0.15))

ggsave("figures/dorling-nhw.png", out_white, height = 10, width = 12)

## Asian
out_asian <- county_dorling |>
  filter(!str_detect(name, "Alaska|Hawaii|Puerto|Guam")) |>
  ggplot(aes(fill = asian_disc)) +
  geom_sf(color = "grey30", size = 0.1) +
  coord_sf(crs = 2163, datum = NA) +
  scale_fill_discrete_sequential(palette = "Purple-Ora", na.translate=FALSE) +
  guides(fill = guide_legend(title.position = "top",
                             label.position = "bottom",
                             nrow = 1,
  )) +
  labs(fill = "Percent Asian by County",
       subtitle = "Bubble size corresponds to County Population",
       caption = "Graph: @kjhealy. Source: Census Bureau / American Community Survey") +
  theme(legend.position = "top",
        legend.spacing.x = unit(0, "cm"),
        legend.title = element_text(size = rel(1.5), face = "bold"),
        legend.text = element_text(size = rel(0.7)),
        plot.title = element_text(size = rel(1.4), hjust = 0.15))

ggsave("figures/dorling-asian.png", out_asian, height = 10, width = 12)




{{< /code >}}
