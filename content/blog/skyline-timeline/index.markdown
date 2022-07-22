---
title: "Skyline Timeline"
date: 2022-06-29T11:55:25-04:00
categories: [visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

One more from the Manhattan data. Here's a plot of all Manhattan's _presently existing_ buildings with their year of construction on the x-axis and their height in feet on the y-axis. With a nice wide aspect ratio and the use of `geom_rect()` to make the columns, we get a plot that looks a little like a skyline itself. Or, as was pointed out on Twitter, a [Manhattan Plot](https://en.wikipedia.org/wiki/Manhattan_plot) of Manhattan itself. Nice.

{{% figure src="https://kieranhealy.org/files/misc/skyline20colorcol.png" alt="Skyline graph" caption="Manhattan building heights by year of construction." %}}

The PNG here is reasonably high-resolution, so you can zoom in a bit.

I added a subtitle to make it clear what is and is not shown on the graph. Most obviously, the Twin Towers aren't there---this isn't a historical dataset of all buildings that have ever existed in Manhattan, just the ones that are there now, arranged by their year of construction. 

To polish things a bit I very slightly jittered the position of each column, the better to get a sense of depth for the amount of construction each year. "Building" outlines are preserved by setting the color (i.e. the border) of the rectangles to a hairline-width light gray  Each observation's height is also binned and used as a fill for the columns, with the alpha dialed down a bit. Again this improves the sense of depth. Because the taller buildings are a quite pale yellow and the alpha transparency is reasonably strong, I set the background to a mid-gray. The end result works quite well I think. 

I also had to correct an error---or, at least, for the purposes of this plot it presented as an error---in the data. In the first cuts at this plot there was a spectactularly tall building dating from 1924. Taller than the Empire State Building. This turned out, in fact, to be the site of [111 W. 57th St](https://en.wikipedia.org/wiki/111_West_57th_Street), just south of Central Park. It's the super-tall sliver building which got done being constructed in 2019. But technically it's a "reconstruction" of the Steinway Building that was built on this site in 1924. So the record was merged in rather than replacing the original one, adding the new height (1428 feet) but keeping the original date (1924). There are just a few merged records like this in the 45,000 or so building footprints in the data. 

As usual the plots were made with `R` and `ggplot`. Although there's no spatial element to this plot, the underlying data are a Simple Features object tidily managed with the `sf` package.
