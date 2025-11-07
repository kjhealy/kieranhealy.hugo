---
title: "Mamdani vs Sliwa and Cuomo"
date: 2025-11-06T12:57:44-05:00
categories: [politics,R,visualization]
mathjax: false
image: subway-mamdani-slimo-detail.png
---


Mamdani's victory in the New York City mayoral election gave me the opportunity to draw a few maps, and also to learn a bit about incorporating additional spatial data into maps drawn in R. R is not a specialized piece of GIS software. ESRI's [ArcGIS](https://www.arcgis.com/) is the 800lb gorilla in this world and [QGIS](https://qgis.org)  the [GIMP](https://www.gimp.org) to its Photoshop, so to speak.

Still, you can do a lot of spatial stuff in R, grounded in the [`sf` package](https://r-spatial.github.io/sf/) and its many friends. Plus you get the benefit of all the data manipulation and analysis that R is really good at. So, having gotten the precinct-level results for the election, some maps from New York City (e.g., the [clipped borough boundaries map](https://www.nyc.gov/content/planning/pages/resources/datasets/borough-boundaries)), and [GTFS data from the MTA](https://www.mta.info/developers) describing the structure of the subway system, I was able to draw some things. I strongly approve of the existence of the [GTFS](https://gtfs.org), by the way. It's a spec for encoding transit data and lots of cities use it. Really handy. 

Anyway, here's a map. For each precinct with more than twenty voters, I combined the Sliwa/Cuomo vote into what we might call (purely for compactness reasons) the Slimo vote, calculated the Mamdani and Slimo vote shares as a proportion, and subtracted the former from the latter. That gets us a score raning from -1 to +1. I then cut that into bins, ten on each side of the zero line, to get deciles in each direction. That's what we fill the precincts with. For the map I also drew the subway stations and lines. Several lines that are right next to each other are in effect drawn on top of one another in several places, e.g. the A and the C, or the 1 and the 3, etc, but that doesn't matter for this map. (You may have heard that drawing transit maps meant for navigation is a really hard information design challenge.) We then use a discrete, diverging scale. Here's the result.

{{% figure src="subway-mamdani-slimo.png" alt="Precinct-level vote shares for Mamdani vs Sliwa/Cuomo" caption="Oh, choropleths" class="full-width" %}}

I chose a blue-green color gradient partly to experiment with it and partly because neither the election nor this particular cut of the data is quite the usual Blue vs Red, Democrat vs Republican. For one thing we have amalgamated two candidates on one side of the spectrum. For another, Cuomo is in some sense a Democrat, so the way voters were split is trickier than it normally would be. [Andrew Gelman has some more thoughts on this today](https://statmodeling.stat.columbia.edu/2025/11/06/if-cuomo-had-been-able-to-run-against-mamdani-head-to-head/). 

You can see a bunch of nice neighborhood patterns, such as e.g. the Hasidic communities in Brooklyn who voted strongly for Cuomo. And you can also see evidence of the [characteristic weakness of choropleths](https://kieranhealy.org/blog/archives/2015/06/12/americas-ur-choropleths/), which is the way they can force a number characterizing some number of persons to be represented by a shape representing some area of space. 

One solution to this is to make a dot-density map. You put a dot on the map for every person (or maybe every n people) you want to represent. Here's what that looks like, with a 1-to-1 representation of dots to voters. 

{{% figure src="subway-mamdani-slimo-dotmap300.png" alt="Precinct-level vote shares for Mamdani vs Sliwa/Cuomo, dot-density version" caption="Dot dot dot." class="full-width" %}}

This is better than a choropleth in some key ways. For one thing, you can see that---even in New York City---some places are both much more densely populated than others and also more likely to turn out to vote. To be clear, when I say "each dot represents one vote", it's not as if I know the identity of every voter, or how they voted, or can precisely locate them to their home address. I promise I don't know that. Only the NSA and the Phone Company know that stuff. What I do know is how many votes were cast for each candidate within each of the 4,200 or so precincts. And I have a polygon that represents the shape of each precinct. So I spatially sample without replacement within each polygon to randomly place a dot for each voter within their precinct. With two million or so votes the pointillist effect ends up being quite effective.

{{% figure src="subway-mamdani-slimo-detail3.png" alt="Precinct-level vote shares for Mamdani vs Sliwa/Cuomo, dot-density version, high-res detail" caption="Detail of the PDF." %}}

There are costs, of course. Color choice is harder, especially with more than one category of dot at once. The image tends to look less bright because you're not using a big swatch of paint across a large area. The visual impression is also very sensitive to small changes in the size of the dots and to settings like their alpha transparency. In addition, when you draw a few million dots at any kind of resolution then your file size gets big real fast. The image above is a 300dpi 4,500x4,500 pixel PNG and it's 10mb in size before being crushed down further (with `optipng`) to 8.6mb or so. I could make a JPG of course, which would be a lot smaller, but then you start running into the question of why you made a dot-density map in the first place, because you lose detail in the raster. Meanwhile, thanks to the wonders of multiplication, a 600dpi version of the same image is much sharper to zoom in on but is also about 34mb in size. Meanwhile a PDF, as a vector format, is even bigger, weighing in at 60MB. Rendering a PDF with that many vector elements does not make Preview or Illustrator happy, let me tell you. The benefit of course is that you can scale it up to any size you like without loss, as shown above. Because browsers are crazy and so is javascript, it's possible to serve up dot density maps like this in real time in a way that makes them zoomable and fluid, but that's not my department. 

