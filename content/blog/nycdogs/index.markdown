---
title: "Dogs of New York"
date: 2026-10-14T13:17:28-04:00
categories: [Visualization,NYC,R,Sociology]
mathjax: false
image: nyc-dogs-of-nyc-dog-ratio.png
---


I recently updated [nycdogs](https://kjhealy.github.io/nycdogs/), a data package for R that I originally made for teaching purposes. It bundles up New York City's [dog licensing](https://data.cityofnewyork.us/Health/NYC-Dog-Licensing-Dataset/nu7n-tubp/about_data) and [dog bite](https://data.cityofnewyork.us/Health/DOHMH-Dog-Bite-Data/rsgh-akpg/about_data) datasets into an R package. The data is already provided by the city in a directly usable way (as CSV files), but packaging it up makes it easier to integrate with other packages and get things moving a little more quickly in class. 

The `nyc_license` table looks like this:


{{< code r >}}
nyc_license
#> # A tibble: 819,323 × 12
#>    animal_name animal_gender animal_birth_year breed_name       breed_rc zip_code zip   license_issued_date license_expired_date extract_year borough city 
#>    <chr>       <chr>                     <int> <chr>            <chr>    <chr>    <chr> <date>              <date>                      <int> <chr>   <chr>
#>  1 Paige       F                          2014 American Pit Bu… Pit Bul… 10035    10035 2014-09-12          2017-09-12                   2016 Manhat… New …
#>  2 Yogi        M                          2010 Boxer            Boxer    10465    10465 2014-09-12          2017-10-02                   2016 Bronx   Bronx
#>  3 Ali         M                          2014 Basenji          Basenji  10013    10013 2014-09-12          2019-09-12                   2016 Manhat… New …
#>  4 Queen       F                          2013 Akita Crossbreed Akita C… 10013    10013 2014-09-12          2017-09-12                   2016 Manhat… New …
#>  5 Lola        F                          2009 Maltese          Maltese  10028    10028 2014-09-12          2017-10-09                   2016 Manhat… New …
#>  6 Ian         M                          2006 Unknown          Unknown  10013    10013 2014-09-12          2019-10-30                   2016 Manhat… New …
#>  7 Buddy       M                          2008 Unknown          Unknown  10025    10025 2014-09-12          2017-10-20                   2016 Manhat… New …
#>  8 Chewbacca   F                          2012 Labrador Retrie… Labrado… 10013    10013 2014-09-12          2019-10-01                   2016 Manhat… New …
#>  9 Heidi-bo    F                          2007 Dachshund Smoot… Dachshu… 11215    11215 2014-09-13          2017-04-16                   2016 Brookl… Broo…
#> 10 Massimo     M                          2009 Bull Dog, French French … 11201    11201 2014-09-13          2017-09-17                   2016 Brookl… Broo…
#> # ℹ 819,313 more rows
{{< /code >}}

The dataset is good for teaching with for several reasons. First, people like
dogs. Second, it has about 800,000 records, which is a lot in many ways but also
trivial for a modern laptop to work with. Third, the data are pretty clean, but
they're not _that_ clean. There are various things going on in there that invite
us to explore it but also to be careful about what we can and can't be confident
about.

The first thing we ask about any data set like this is: what is each row in this
table? In the case of `nyc_license`, each row is a record of one time-limited
license for a dog. A row is not necessarily the record of a unique dog. When an owner
renews a dog's license, the dog will appear one time for each license period. In
New York City, dog licenses can be issued for one year or five years. The table
does not provide any `dog_id` column that ties sequences of licenses to individual
dogs.

Second, the table contains several "extracts" of the license data. It seems like
the way the provider updates the NYC Open Data record is to periodically pull
from its internal database every year or so and append it to the existing,
previously-released version. The `extract_year` column identifies the extract,
so at least we know that. But it's also the case that a license that was active
in more than one extract year appears in each extract. As a result, the table
has a large number of duplicate rows.

Third, license information is provided by dog owners. This means that there's a
fair amount of noise in the records, because people make typos and other errors.
For instance, the ZIP code data has incomplete ZIPs. Some people provide invalid
ZIP codes (e.g. ones that are fewer than five digits long). Others (about 3,300
records) have ZIP codes that are not in New York City. Eighty percent of these
(about 2,700) are ZIP codes located elsewhere in New York state. Another 77 are
located in Florida, which I kind of like. Five of them live in Boca Raton, for
example. Their kids never call. You'd think it would be easy for them to just
pick up the bone, I mean phone, but you never hear from them.

About 650 rows have valid ZIP codes that are in Manhattan, but these ZIPs are
not
[ZCTAs](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html).
The trouble with ZIP codes is that people think of them as areas, as polygons,
but in fact they are lines. They are defined by the Post Office as postal
routes, i.e. as journeys a mail carrier takes. While they _tend_ to form closed
polygons, they are absolutely not guaranteed to. But people know their ZIP code
and all kinds of analysts (from marketers to political operatives) like thinking
in terms of ZIP codes. So the Census defines [ZIP Code Tabulation
Areas](https://www.census.gov/programs-surveys/geography/guidance/geo-areas/zctas.html)
that are a kind of best-effort at answering the question "What if this ZIP code
were a closed polygon?" ZCTAs exclude every P.O. box and single-address ZIP
nationwide. Manhattan has several buildings that have their own ZIP code. New York City also defines [MODZCTAs](https://data.cityofnewyork.us/Health/Modified-Zip-Code-Tabulation-Areas-MODZCTA-/pri4-ifjk/about_data) that merge some low- or no-population ZCTAs with their neighbors. I use these below.

Fourth, beyond the ZIP codes, owners also provide information about the age and
sex of their dogs, the dog's name, and the dog's breed. Again, this kind of
information tends to be a little noisy. For example, people vary in how they
spell names. They also vary in how they classify their dog by breed. Beyond the
list of "recognized" breeds (itself something that dog owners variably conform
to), some people might describe their dog as, e.g., "Labrador-Sheltie mix" while
others might just say "Unknown". The dataset includes the `breed_name` column from
the original dataset and also `breed_rc`, which is a recoding by me to clean up equivalent terms ("Yorkshire Terrier" and "Terrier, Yorkshire", for example) along with a few other coding decisions.

Finally, and only because I'm choosing to stop here, the table just shows the
number of licensed dogs in New York City. That is definitely not the same as the
number of dogs there. Moreover, license compliance varies quite a bit in ways
that are related to characteristics of the owner that we can't observe, and also
ones that we partially can, like where they live. 

All of which is related to the fact that one of the lolsob-mantras of courses I
teach is "Now you know the true meaning of data". In the graphs and maps below,
I've done the best I can, where appropriate, to uniquely identify individual
dogs in the dataset (even though ultimately we cannot).

## Popular Breeds

With that out of the way, it's time to indulge your prejudices about Dogs, New
Yorkers, and New York Dogs. The most common "breed" of dog in New York is
"Unknown", as befits a city of immigrants, hustlers, scrappy up-and-comers, and
dogs seeking to leave their small-town past behind and remake their identities.
Somewhere between eight and ten percent of records each year have "Unknown"
recorded as their breed. There's some change over time (a declining share), but
I think this is an artifact of how breeds are getting recorded rather than a
change in the composition of the dog population. If we leave the Unknowns out,
here are the trends in annual licenses issued to the twenty most popular breeds.

{{% figure src="nyc-popular-breeds.png" alt="Yorkshire terrier is the most popular breed. Goldendoodles are on the rise." class="full-width" caption="" %}}

Some breeds are pretty steadily popular. Smaller breeds do well in a city full
of apartments. We can also see some evidence here of trends in popularity.
However, these annual numbers are what we might call the prevalence of dogs,
rather than the incidence of new dogs. If we want to get a better sense of
fashion trends in dog breeds, we should look at puppies. (Who doesn't want to
look at puppies?) Because of the structure of the data we can't quite do this.
The best we can do, based on the dog's age, is to examine licenses issued to
dogs younger than a year old. Let's pick out some breeds that seem to be rising,
a few that seem relatively steady, and a few that might be declining. I've
indexed these changes relative to each breed in 2016 by setting the value for
that year to 100. Even though our range is narrow, we use a log scale on the
y-axis because, e.g., a rise in a breed's index from 100 to 200 
reflects the same relative change as a fall from 100 to 50. 

{{% figure src="nyc-breed-trends-young-index.png" alt="The rise of the Maltipoo, Dachshund, and Goldendoodle." caption="" class="full-width" %}}

Maltipoos and Goldendoodles seem to be doing pretty well for themselves. Golden Retrievers
remain steadily popular. Meanwhile, Shiba Inus, beloved fad-breed of the 2010s,
seem to have been affected by their association with crypto and are strongly in
decline. Much drop. Very diminish. Wow. Beagles are also doing poorly. Good grief. 

## Where Breeds Live

We can look at the relative prevalence of breeds by their ZIP code (strictly
speaking, by their [MODZCTA](https://data.cityofnewyork.us/Health/Modified-Zip-Code-Tabulation-Areas-MODZCTA-/pri4-ifjk/about_data)). I hesitate a little on this just because, even with
800,000 licenses, we'll run out of degrees of freedom fairly quickly if we break
things down by breed and ZIP. Relatedly, we should ask what sort of metric we're
trying to show here. What's the denominator? (A surprising amount of Statistics,
I claim, is essentially exploring the question "What happens if I divide by
*this* number instead of *that* number?") Popular dogs are, to a first
approximation, pretty popular all over the city. Most ZIP codes have a solid
contingent of Yorkies. If, for each popular breed, we calculate the share of
that breed as a percentage of all dogs in the ZIP code, we'll see some
ZIP-by-ZIP variation come out. 

It would also be nice to adjust for the fact that different ZIP codes have quite
different shares of the total number of dogs licensed in the city. (Which,
again, is not the same as share of the total number of dogs in the city.) So we
calculate the within-ZIP share and make a ratio of it by dividing that number by
the breed's citywide share. The ratio is 1 when the breed is just as common in
that ZIP code as it is across the whole city. If it's 2, the breed is twice as
common in that ZIP as it is across the city. If it's 0.5, the breed is half as
common in that ZIP as it is in the city as a whole. The main downside of ratios
like this is that they can exaggerate differences a little, especially if the
base rates are small. We have enough breeds in each zip code to make me feel OK
about doing this. But if you refer to the bar charts above you can see that even
for disproportionately popular breeds in zips, you're looking at changes like
"twice as common with respect to a baseline of five percent of all dogs". Here's
the map:

{{% figure src="nyc-dogs-of-nyc-dog-ratio.png" alt="" caption="" class="full-width" %}}

We see some plausible evidence that breeds are distributed across ZIP codes in a
manner that tracks the demography of owners. French Bulldogs in Chelsea, Soho,
and TriBeCa. Havanese on the Upper East Side. Pit Bulls in the Bronx. German
Shepherds on Staten Island. Goldendoodles and King Charles Spaniels in Manhattan
south of 96th.

## The Diffusion of Goldendoodles

Let's take a closer look at the Goldendoodles. In 2015, Goldendoodles weren't
that common. We can ask: where were they initially popular? Did they diffuse
across New York City from focal points where people were more likely to set
trends in breed fashion? Restricting ourselves to young dogs, we can try to look
at each ZIP's share of all Goldendoodle puppies licensed each year from 2015
to 2025. Here's what that looks like:

{{% figure src="nyc-goldendoodles-young-yr-wide.png" alt="" caption="" class="full-width" %}}

In 2015, Goldendoodle puppies are licensed in a relatively small number of ZIP
codes, mostly in Manhattan. Most ZIP codes are doodle-free. Over the next five
years, they gradually spread across the city. By 2023 or 2024, most---though
still not all---ZIP codes are licensing young Goldendoodles. 

Again, the underlying numbers aren't huge. So take all of this with a delicious
treat. I mean, grain of salt. I also wonder what the next few years are going to
look like in terms of dog popularity. Based on the maps above, I think
Australian Shepherds are likely to continue to rise in popularity amongst owners
looking to acquire a fashionable breed. And while they're not on any of the maps
above, the data also suggest that the
[Jindo](https://en.wikipedia.org/wiki/Korean_Jindo), a Korean breed that is a
relatively recent arrival in the US, has been sharply on the rise. If you ask
me, though, if you're in New York City and planning to get a dog, you should
throw in your lot with Unknown and get a good, solid, dog-shaped mutt.
Preferably one with strong views on the state of the Subway these days, or who
knows a guy who can get you a deal on some shirts, or the special ramen, or
tickets. Not tickets for anything in particular. Just, like, tickets. Works out
of an upstairs bar downtown on Water St. Trust me.


