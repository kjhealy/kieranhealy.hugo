---
title: "New York City Hexmaps"
date: 2026-04-19T10:05:54-04:00
categories: [Visualization,R]
mathjax: false
image: nychex-ct-hex-ba.png
---

The five boroughs of New York City can be informally or formally carved up into many different pieces, depending on what it is that you're doing. As part of an ongoing project, I recently made an R package, [(`nycmaps`)](https://kjhealy.github.io/nycmaps/), that lets you draw maps of some of these geographies. Things being what they are, these spatial units don't necessarily overlap in compatible ways. City, State, and Congressional  Districts, School Districts, Police Precincts, Fire Companies, Election Precincts, Municipal Court Districts, Zip Codes ... there are loads of them. Some of them are quite straightforward; others patiently lie in wait to trap unwary analysts (I'm looking at you, Zip Codes / [ZCTAs](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html)). 

### Mapping Tracts and NTAs

Two classifications of particular interest to people like me are Census Tracts and Neighborhood Tabulation Areas (NTAs). Census Tracts are defined by the Census Bureau and form part of a nested set of geographical units that go from the smallest unit the Census keeps tract of (the Block) up to the largest (the whole country). Blocks aggregate to Block groups, Block groups aggregate to Tracts. Tracts aggregate to Counties. There are of course [several complications](https://help.socialexplorer.com/hc/en-us/articles/24930135416733-Census-Geographies). Ideally, [the Census would like](https://www.census.gov/programs-surveys/geography/about/glossary.html#par_textimage_13) tracts to be contiguous, sub-county geographical areas with about 4,000 people in them, or at least between 1,200 and 8,000 people. This means tracts can vary considerably in geographical area. They generally follow visible features of the environment, whether physical or built. Uninhabited areas also get tract designations, so in principle we can get a full tract-level map of an area with no gaps. Here's what a tract-level map of New York City looks like:

{{< code r >}}

ggplot(nycmaps::nyc_census_tracts_2020_sf) +
  geom_sf(aes(fill = boro_name), color = "black", linewidth = 0.1) +
  scale_fill_brewer(palette = "Set2") +
  labs(fill = "Borough") +
  theme_void()
  
{{< /code >}}


{{% figure src="nychex-ct-geo-bare.png" alt="A tract-level map of NYC with the boroughs colored in." caption="2020 NYC Census Tract boundaries." %}}

You can see the variation in tract size (compare e.g. Staten Island tracts with those in lower Manhattan). And you can also see features that are included on the map but, at least to a first approximation, don't have permanent residents. That big roundy blob in the southeast corner of Queens, for instance, is JFK Airport. There are about 2,300 Census Tracts in New York City. (Naturally, their number and spatial layout changes from decennial census to decennial census, because why should life be easy?)

[Neighborhood Tabulation Areas](https://www.nyc.gov/content/planning/pages/resources/datasets/neighborhood-tabulation), meanwhile, are not official Census units. They are one of several units used by New York City government. The idea is to aggregate tracts into units that roughly correspond to neighborhoods that people conventionally refer to. This is, of course, an impossible task, because people don't agree on neighborhood boundaries. But the idea is good. You want something bigger than a tract because those are small enough to be noisy on many measures produced by the main source of tract-level data, the [American Community Survey](https://www.census.gov/programs-surveys/acs.html). But you want something smaller than the next level up, which is a Community District Tabulation Area. Presently, there are 262 NTAs. They look like this:

{{< code r >}}
ggplot(nycmaps::nyc_nta20_sf) +
  geom_sf(aes(fill = boro_name), color = "black", linewidth = 0.1) +
  scale_fill_brewer(palette = "Set2") +
  labs(fill = "Borough") +
  theme_void()
{{< /code >}}

{{% figure src="nychex-nta-geo-bare.png" alt="NTA boundaries" caption="2020 Neighborhood Tabulation Areas" %}}

NTAs have recognizable names:

``` r
nycmaps::nyc_nta20_sf |> select(nta2020, nta_name, nta_abbrev)
```

    Simple feature collection with 262 features and 3 fields
    Geometry type: MULTIPOLYGON
    Dimension:     XY
    Bounding box:  xmin: 913175.1 ymin: 120128.4 xmax: 1067383 ymax: 272844.3
    Projected CRS: NAD83 / New York Long Island (ftUS)
    First 10 features:
       nta2020                            nta_name nta_abbrev
    1   BK0101                          Greenpoint      Grnpt
    2   BK0102                        Williamsburg   Wllmsbrg
    3   BK0103                  South Williamsburg  SWllmsbrg
    4   BK0104                   East Williamsburg  EWllmsbrg
    5   BK0201                    Brooklyn Heights      BkHts
    6   BK0202 Downtown Brooklyn-DUMBO-Boerum Hill   DwntwnBk
    7   BK0203                         Fort Greene      FtGrn
    8   BK0204                        Clinton Hill    ClntnHl
    9   BK0261                  Brooklyn Navy Yard   BkNvyYrd
    10  BK0301           Bedford-Stuyvesant (West)    BdSty_W

When we have a table like this, we can get tract-level data from the Census, for example on educational attainment, and aggregate it to the NTA level. Then we can join that data to the [simple feature collection](https://r-spatial.github.io/sf/) that has our geometries in it. With a little polishing (which you can [read all about in what I personally think of as a very useful book](https://socviz.co)), we get something like this: 

{{% figure src="nychex-nta-geo-ba.png" alt="BA degrees or higher within NTAs, ACS 5-year estimates." caption="BA degrees or higher within NTAs." %}}

Nominally zero-population NTAs get grayed out (JFK, LGA, various parks and cemeteries, Brooklyn Navy Yards, the United Nations, etc). 

Here's what this data looks like at the tract level:

{{% figure src="nychex-ct-geo-ba.png" alt="BA degrees or higher within tracts, ACS 5-year estimates." caption="BA degrees or higher within tracts." %}}

### Hexgrids 

Sometimes we want a more schematic representation of geographies, because [choropleth maps can be tricky to work with](https://socviz.co/07-maps.html#americas-ur-choropleths). There are [many](https://kieranhealy.org/blog/archives/2025/11/06/mamdani-vs-sliwa-and-cuomo/) [possibilities](https://kieranhealy.org/blog/archives/2023/12/06/dorling-cartograms/) here, including not drawing maps at all. One option is to make a schematic kind of cartogram by turning our map polygons into a tessellated grid where each unit gets a single tile. My [`nychex` package](https://kjhealy.github.io/nychex/) provides hexagonal and square tilings for NTAs and tracts in New York City. Turning geographically accurate polygons into regular tiled grids can be a bit tricky, especially when the polygons you are trying to tile contain "holes". But thanks to the [`tilemaps`](https://kaerosen.github.io/tilemaps/) and [`rmapshaper`](http://andyteucher.ca/rmapshaper/) packages we can get reasonably far in a semi-automated way, and then tweak things by manually nudging things around. Our baseline NTA hexmap looks like this:

{{< code r >}}

ggplot(nychex::nyc_nta20_hex_sf) +
  geom_sf(aes(fill = boro_name), color = "black", linewidth = 0.3) +
  scale_fill_brewer(palette = "Set2") +
  labs(fill = "Borough") +
  theme_void()

{{< /code >}}


{{% figure src="nychex-nta-hex-bare.png" alt="Bare NTA hexmap" caption="The opening gameboard for my upcoming strategy game, *Ticket to Ridgewood*" %}}

And here is what our BA prevalence map looks like when mapped with it:

{{% figure src="nychex-nta-hex-ba.png" alt="BA prevalence, NTA hexmap edition." caption="Labeled NTA hexmap" %}}

Here I've labeled the hexes with the (sometimes highly) abbreviated version of their NTA name. Maps like this don't magically solve the difficulties of spatially representing population-based data, but they have their uses. They can be handy if you want to quickly get a sense of variation across units while retaining a roughly spatial layout. They also make some kinds of small-multiple or faceted plots a little easier. 

We don't have to stop at NTA-level resolution. We can do a tract-level one, too. Here's a tract-level base hexmap:

{{% figure src="nychex-ct-hex-bare.png" alt="Bare tract-level hexmap" caption="Ticket to Ridgewood, advanced edition" %}}

This map makes a series of compromises with city geography in order to make room for each tract's hexagon. In particular, northern Manhattan is more detached from the Bronx than is idea, and it was necessary to sever Brooklyn from Queens along their border. (Our simplify-and-tile algorithm had a hard time with the undifferentiated Brooklyn/Queens landmass.) With a fully hand-drawn hexmap we could probably avoid most of these problems, but that would involve quite a substantial amount of work. There's already quite a bit of hand-adjustment in the overall positioning and layout here (especially for things like the Rockaways and other islands or quasi-islands). Sadly there's no magic way to ingegrate the main borough polygons while preserving the orientation of all the hexes. Still, the result isn't bad.

Here's our BA map in tract-level hexagonal form: 

{{% figure src="nychex-ct-hex-ba.png" alt="Tract-level BA hexmap" caption="Tract-level BA map." %}}

The usual benefits and disadvantages of regularized choropleths are in evidence here. Lower Manhattan's population gets a fairer shout, as do parts of Brooklyn and the Bronx. The geography still mostly works. The difficulties flow mostly from the map being at the tract-level in the first place, rather than the tiling. That is, some tracts have unusual shapes that result in quite noisy estimates. For example, sometimes a tract will consist *mostly* of a park or an industrial area, but have a few residential segments. This can mean it ends up being measured too high or too low on the thing we're counting. Or, by contrast, a tract might be almost entirely one kind of entity, like a retirement home, producing results that might seem odd if you don't know what's in that spot. You can see why the City aims at the NTA level for a lot of its summaries. It has ten times fewer units, but things get smoothed out in a way that may be more useful. Any real-world method of measurement comes with some rate of error, which the Census helpfully provides estimates of. Nice maps tempt you to reify observations and spin yarns about what you see, whether it's a finely-detailed spatial polygon or a pleasingly regular hexagon. The finer the observational grain, the more important it is for you to know about the situation on the ground. Literally. 