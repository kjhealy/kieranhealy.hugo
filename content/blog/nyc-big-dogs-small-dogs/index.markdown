---
title: "Dogs of New York, Shapes and Sizes Edition"
date: 2026-10-25T13:57:06-04:00
categories: [Visualization,NYC,R,Sociology]
mathjax: false
image: nyc-dog-size-median-zip.png
---

My recent [Dogs of New
York](https://kieranhealy.org/blog/archives/2026/10/14/dogs-of-new-york/), post
got circulated a little. On Friday I got a very nice note from [William
Kornblum](https://www.gc.cuny.edu/people/william-kornblum), an urban and
community studies sociologist who these days is emeritus at CUNY. In the 1980s,
Bill studied the people who use Central Park and wrote a report for the Central
Park Conservancy. Some of that work counted dog-walkers. 

He reminded me that parks in New York City see a lot of dogs. [NYC Parks
estimates](https://www.centralparknyc.org/articles/dogscentralpark) about 1.5
million canine visits to Central Park each year. That is about 4,100 visits a
day, to one park. He also asked:

> Is there a size gradient perhaps? Larger dogs out on the periphery where there
> is more room? Smaller dogs in the dense apartment neighborhoods?

This is a good question; one the data I have can *almost* answer. The main
problem is that the license data contained in
[`nycdogs`](https://kjhealy.github.io/nycdogs/) do not record the size or weight
of any particular dog. Licenses do record the breed that the owner reports
(though, [as we saw
before](https://kieranhealy.org/blog/archives/2026/10/14/dogs-of-new-york/) the
modal breed reported is "Unknown"). But let's see how far we can get by
leveraging our knowledge of breeds. 

To begin we need to give each breed a size. For this I used the American Kennel
Club's breed weights. The AKC lists a weight range for each breed it recognizes,
from its breed standards. Tiago Filho [collected these into one
table](https://github.com/tmfilho/akcdata) for 277 breeds in 2020. I had to make
a few adjustments to reconcile it with the breeds recorded in `nycdogs`, most
notably for two popular city breeds. First, the AKC lists one Dachshund range
that covers both sizes within this breed. Owners often record "Miniature" in the
breed name, so I gave those dogs the AKC miniature limit of 11 pounds. Second,
Pit Bulls are among the most common dogs in the city, but to my knowledge the
AKC does not register them. I used the United Kennel Club's [American Pit Bull
Terrier standard](https://www.ukcdogs.com/american-pit-bull-terrier) instead.

I assigned each breed a "typical weight", which is the middle of its range. Some
standards give only one figure, such as "not more than 6 pounds" for a
Chihuahua. In those cases I used that number. This is not ideal. A breed
standard describes a show dog, not the dog you see in the park. (Though, of
course, in some NYC parks those might be the same. But not in general.) Real
dogs will be heavier or lighter than their standard. Still, a Great Dane is
reliably bigger than a Yorkie, and it's the relative differences we're
interested in.

The second problem is that many dogs have no breed we can use. I work with an
approximation of one record per dog, as in the first post, which gives about
358,000 dogs. I can only assign a breed size to about 60 percent of them:

- About 22 percent are crossbreeds, such as "Labrador Retriever Crossbreed". A
  mix could be any size. I chose not to guess.
- About 10 percent have no breed recorded, mostly "Unknown".
- About 6 percent are "designer" breeds, such as the up-and-coming
  Goldendoodles, Maltipoos, and Morkies. No kennel club sets a standard for
  these.
- About 1.5 percent are Poodles with no size given. A Toy Poodle and a Standard
  Poodle differ by about 50 pounds, so again, I chose to drop these.

Now, if the missing dogs were spread evenly across the city, the missingness
would not matter all that much. We can try to check that. Here is a map showing
the share of dogs in each ZIP code that have a breed size.

{{% figure src="nyc-dog-size-coverage-zip.png" alt="Map of the share of licensed dogs in each ZIP code that have a breed size. Most ZIP codes are between about half and two-thirds." caption="" class="full-width" %}}

Coverage runs from about half to about two-thirds of dogs in each ZIP code. It
is highest on the West Side of Manhattan and in parts of eastern Queens. It is
lowest in central Brooklyn. So, dogs are not
[MCAR](https://stefvanbuuren.name/fimd/sec-MCAR.html) or even
[MAR](https://stefvanbuuren.name/fimd/sec-MCAR.html) in the city. The maps and
analysis below is restricted to describing dogs with a known breed, and that
group is not quite the same in every part of the city.

## Where the big dogs are

For each ZIP code with at least 50 dogs of known size, I calculated the median
typical weight. (As before, I use the city's MODZCTAs, which are ZIP code areas
with some small ones merged.)

{{% figure src="nyc-dog-size-median-zip.png" alt="Median typical breed weight of licensed dogs by ZIP code. The largest medians are in lower Manhattan, brownstone Brooklyn, Woodlawn and City Island in the Bronx, and the Rockaways. The smallest are in most of the Bronx, southeast Queens" caption="" class="full-width" %}}

I didn't try to make the weight categories too fine-grained. Again, the weights
are derived from the breed standard, not individual dogs, and so the
distribution is quite lumpy. Each dog is counted as having the typical weight of
its breed. Very popular breeds therefore pile up on single values. Many ZIP
codes have a median of exactly 12.5 pounds, for example. (That's the Shih Tzu's
weight.)

Even so, we still see a clear pattern. The ZIP codes with the biggest dogs are
in lower Manhattan and brownstone Brooklyn. Park Slope is at the top, with a
median of 29 pounds. Woodlawn and City Island in the Bronx, and the Rockaways in
Queens, also have big dogs. The smallest dogs are in most of the Bronx,
southeast Queens, and East New York and Brownsville in Brooklyn. There, the
median dog weighs 12.5 pounds.

So Bill's idea is partly supported by the evidence. Some of the city's edges,
where people have more room on average, do have bigger dogs. But, on the other
hand, some of the densest apartment neighborhoods in the city have the biggest
dogs of all.

## Size classes

A median can hide a lot. I sorted the breeds into five size classes. I used the
weight bands that you see on bags of dog food: Toy (up to about 9 pounds), Small
(9 to 22), Medium (22 to 55), Large (55 to 99), and Giant (over 99). This is
kind of arbitrary, and not even arbitrary in the "AKC Standard" sense of
arbitrary. But I don't think it's unreasonable.

Across the city, here is how the dogs with a known size divide up:

- About a quarter are Toy dogs.
- About a third are Small.
- About a quarter are Medium.
- 14 percent are Large.
- Fewer than 2 percent are Giant.

Here is the share of each class within each ZIP code.

{{% figure src="nyc-dog-size-classes-zip.png" alt="Share of dogs of each size class, by ZIP code." caption="" class="full-width" %}}

Toy dogs are most common in the Bronx and in parts of Brooklyn and Queens.
Medium dogs cluster in somewhat fancier parts of Brooklyn and lower Manhattan.
Large dogs are most common on Staten Island, in the Rockaways, and (again) in
parts of Manhattan. Giant dogs are rare everywhere.

The same numbers aggregated up to the level of boroughs are a little easier to
compare:

{{% figure src="nyc-dog-size-classes-borough.png" alt="Heatmap of the percent of dogs in each size class, by borough." caption="" class="full-width" %}}

Small dogs are about a third of all licensed dogs in every borough. The
differences are at the ends. A third of the Bronx's dogs are Toy dogs, compared
with about a fifth of Manhattan's. Only 9 percent of the Bronx's dogs are Large,
compared with 16 percent in Manhattan and 17 percent on Staten Island. Staten
Island, the least densely-populated borough, has the largest share of big dogs.
Manhattan is different.

## Mo Money, Mo Doggo

Manhattan and brownstone Brooklyn are dense, but they are also rich. The Bronx
is dense too, but much poorer. Happily, thanks to both [NYC OpenData](https://www.nyc.gov/opendata) and the [Census Bureau](https://www.census.gov), we have relevant measures available that we can construct for each ZIP code.

- *Floor area per home.* This comes from
  [PLUTO](https://www.nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page),
  the city's database of every tax lot. I added up the residential floor area
  and the number of homes on every lot in each ZIP code, and divided. This is
  gross floor area, so it includes halls and stairs. It is a rough measure of
  apartment size. You can use my [`nycpluto`](https://kjhealy.github.io/nycpluto/)
  package to access these data in R.
- *Percent of homes in one- or two-family houses.* This is also from PLUTO,
  using each lot's building class.
- *Median rooms per home,* *percent of homes that are owner-occupied,* and
  *median household income.* These come from the Census Bureau's American
  Community Survey, using the five-year estimates for 2020 to 2024. You can
  query the Census API directly for these, or use my
  [`nycdemog`](https://kjhealy.github.io/nycdemog/) package to get them.

The Census reports these figures for ZCTAs, its version of ZIP code areas. Most
MODZCTAs contain only one ZCTA. Where a MODZCTA contains more than one, I added
up the counts. For the medians, I took an average of the ZCTA medians, weighted
by the number of households. The Census caps median income at $250,000. A few of
the richest ZIP codes in Manhattan hit that cap.

I fit a regression with this data where the outcome is the average typical
weight of the dogs in each ZIP code. I use the mean rather than the median here,
because the median is so lumpy. The predictors are the five measures above, plus
the borough. There are 177 ZIP codes in the model.

The five measures use different units: dollars, square feet, rooms, and
percentages. So the coefficients are hard to compare directly. To make them
comparable, what we can do is ask "If we take a ZIP code that is low on this
measure (at the 25th percentile of ZIP codes) and move it to a high value (the
75th percentile), holding everything else constant, how much bigger or smaller
do its dogs get?" For the boroughs, the figure shows the difference between each
borough and Manhattan.

{{% figure src="nyc-dog-size-effects.png" alt="Dot-and-whisker plot of the estimated effects on average dog size. Income has a clear positive effect of about 3.7 pounds. The housing measures and the boroughs have effects close to zero, with intervals that include zero." caption="" class="full-width" %}}

Income is the clearest result. A ZIP code with a median household income of
$116,000 has dogs that are about 3.7 pounds heavier, on average, than one with a
median income of $67,000. The housing measures make very little difference once
we know income. Floor area, the share of houses, and the share of owners all
have effects close to zero. Median rooms has a small positive effect, maybe.
Floor area per home leans the other way. I wouldn't read much into either of
them. Together, the four housing measures improve the model by no more than we
would expect by chance.

Among the boroughs, Staten Island's dogs are about 2.3 pounds heavier than
Manhattan's at the same levels of income and housing. That fits the idea of room
on the periphery, although the interval is wide. The other boroughs do not
differ much from Manhattan.

In terms of how much variation we can explain, income alone accounts for about
44 percent of the variation in average dog size across ZIP codes. Adding the
borough raises that to 47 percent. Adding all four housing measures raises it
only to 49 percent. 

Here is the income effect on its own. This is a partial regression plot. For
both dog size and income, we remove the part that the borough and the housing
measures predict. What remains shows the relationship between income and dog
size among ZIP codes with similar housing in the same borough.

{{% figure src="nyc-dog-size-income-net.png" alt="Scatterplot of ZIP codes, colored by borough. The x-axis is median income relative to what borough and housing predict. The y-axis is average dog size relative to the same prediction. The points rise from left to right." caption="" class="full-width" %}}

The relationship is pretty good. Each doubling of median household income goes
with about 4.6 more pounds of dog. The points come from every borough. So there
is a size a size gradient, as Bill speculated, but it's not really geography at
work here, it's money. Some of the biggest dogs in New York live in dense,
expensive neighborhoods such as Park Slope, SoHo, and the West Village. The
smallest dogs live in the Bronx, where incomes are much lower. Once we know a
ZIP code's income, its housing tells us almost nothing more about its dogs.
Staten Island is the one place where extra room may add a little to dog size,
beyond what income predicts.

Again, as a paid-up social science rather than infographic guy, I feel like I
have to close with the caveats. Remember these are *breed* weights, not dog
weights. Four in ten dogs have no breed size. And, like we said before, these
are the licensed dogs only. Licensing rates probably vary with income too.
Finally, this is a comparison of ZIP codes, not of households. It tells us that
richer ZIP codes have bigger dogs on average. It does not tell us that richer
people choose bigger dogs, although that seems likely.

Why would money matter more than space? Big dogs cost more to feed and to treat
at the vet. They are harder to keep in buildings that limit pets by weight. And
their owners may need to pay someone to walk them while they are at work.
Perhaps those many daily dog visits to Central Park are part of the answer too.
If you live near a very large park, maybe it's easier to have a very nice
apartment that's comparatively small for your very large dog.

