---
date: "2015-01-20"
title: "American Movie"
categories: [Visualization]
---

*Update, January 22nd:* Now with plots standardized per thousand films released that year.

It's time for another episode of Data Analysis on the Bus. This one follows from [an exchange on Twitter](https://twitter.com/kjhealy/status/557197197004271616), prompted by the coverage of *American Sniper* about the tendency to use the word "American" in film titles, especially when you want things to sound terribly serious. This led to a bit of freewheeling and it has to be said perhaps tendentious cultural theorizing on my part. Rather more usefully, it also prompted Benjamin Schmidt to [send me some IMDB data](https://twitter.com/kjhealy/status/557216536633835521) containing film titles with the word "American" in them. I did a [correspondence analysis](https://twitter.com/kjhealy/status/557232380487155712) with it yesterday at lunchtime, but to be honest I wouldn't lean too heavily on it if I were you. On the bus to work this morning I couldn't resist messing around with it a bit more. I was going to say that this evening's State of the Union Address provides the thinnest of pretexts for posting these pictures, but Michael Lunny just informed me that [Alex Godfrey at the Guardian](http://www.theguardian.com/film/shortcuts/2015/jan/20/beauty-pie-and-sniper-why-hollywood-loves-making-things-american) had more or less the same thought today. So here are the pictures---just some trends, and this time I'll lay off the CultStud speculation. Mostly.

When cleaning the data I first threw out all the porn (the "Adult" genre). Here's the time series for films with "America" or "American" in the title. I don't have IMDB's annual data on total films released so I'm sorry to say, Reviewer C, that these numbers aren't standardized. Why are you peer reviewing a blog post like this in the first place?

*Update:* I couldn't leave well enough alone, so after some very helpful advice from [Gabriel Rossman](http://www.sociology.ucla.edu/faculty/gabriel-rossman), who knows a hell of a lot about this data set, I went and pulled the most recent version of the IMDB Genres file and cleaned it quickly, more or less as before. As always, cleaning data with the attempt to replicate prior results proved to be a sobering experience. The plots aren't strictly comparable, but I'm keeping the originals rather than replacing them with new versions. Instead I'll add the standardized plots (per 1,000 annual films) for comparison.

{{% figure src="https://kieranhealy.org/files/misc/movie-america-year-smooth-all.png" alt="All American" caption="All Films, 1900--2014." %}}

([PDF available.](http://kieranhealy.org/files/misc/movie-america-year-smooth-all.pdf))

It does seem like America is becoming increasingly thoughtful about American things. Next, let's break out the titles by the form the word takes. This was the not-very-serious claim that titles of the form "American Something" tended to be more portentous than either "An American Something" or "Something in America". I'm not prepared to defend this claim beyond a barstool, but here are the trends. It does seem like *American Sniper* is perched on top of a big surge of American Somethings, perhaps signaling Peak American Seriousness. But then again maybe we have a lot further to go.

Here's the version of this plot based on the full IMDB Genres file, standardized by number of films released that year. Again, this isn't strictly comparable because the base data file and the search terms are slightly different, but I believe it more than the raw count plot.

{{% figure src="https://kieranhealy.org/files/misc/movie-america-year-smooth-all-rate.png" alt="All American" caption="All Films, 1900--2014, standardized." %}}

([PDF available.](http://kieranhealy.org/files/misc/movie-america-year-smooth-all-rate.pdf))

Not quite as dramatic a trend---but I think it holds up.


{{% figure src="https://kieranhealy.org/files/misc/movie-america-year-smooth.png" alt="All American" caption="All Films, by Form of Title 1900--2014." %}}

[PDF available.](http://kieranhealy.org/files/misc/movie-america-year-smooth.pdf)

Here's the standardized form-of-title plot:

{{% figure src="https://kieranhealy.org/files/misc/movie-america-year-smooth-rate.png" alt="All American" caption="All Films, by Form of Title 1900--2014, standardized." %}}

[PDF available.](http://kieranhealy.org/files/misc/movie-america-year-smooth-rate.pdf)

Again you can see the uptick in "American <Something>" films in particular. The outlier in the middle of these plots is from 1941, when a series of documentaries were made with "American History" in the title.

Finally, what's the main genre of all these American (sorry I mean "American") films? Here are plots for the five genres with the most titles in the data:

{{% figure src="https://kieranhealy.org/files/misc/movie-america-year-bygenre-smooth.png" alt="All American" caption="Main Genres of Films, 1900--2014." %}}

[PDF available.](http://kieranhealy.org/files/misc/movie-america-year-bygenre-smooth.pdf)

And the standardized version:

{{% figure src="https://kieranhealy.org/files/misc/movie-america-year-bygenre-smooth-rate.png" alt="All American" caption="Main Genres of Films, 1900--2014, standardized." %}}

[PDF available.](http://kieranhealy.org/files/misc/movie-america-year-bygenre-smooth-rate.pdf)

A little less clear, again. Still, though, you can see the recent rise in Documentaries and Dramas as the main sources of recent "American" Titles, which lends credence to the Twilight of Empire Portentousness theory. Comedy is strongly represented as well, so I wouldn't bet the farm on that idea. But whether as tragedy or farce, it seems the future of movies is increasingly American.

