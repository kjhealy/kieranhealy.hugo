---
title: "Bad Weather and the Subway"
date: 2026-05-02T08:59:15-04:00
categories: [visualization,R]
mathjax: false
image: rhythms_2025_weather.png
imagecap: "Bad weather suppresses Subway ridership. But not always."
---

{{% figure src="snow-in-nyc.png" alt="Two figures walking in the snow; trees in the distance." caption="Snow in Inwood, New York. Photograph by the author." class="full-width" %}}

Recently I've been looking at hourly ridership data from the New York City Subway. Last time we learned that [people go to work in the morning and come home in the evening](https://kieranhealy.org/blog/archives/2026/04/25/hourly-subway-station-flows/), for example. (All together now: "Only in New York, baby!") Today we'll learn that bad weather makes people stay at home. Except, sometimes it doesn't. 

Regular readers will recall that the subway system [carries a _lot_ of passengers every day](https://kieranhealy.org/blog/archives/2025/02/19/mta-ridership/). The ridership data for the whole of 2025 represents just over 1.3 billion entries into the system via an OMNY tap or Metrocard. It's available aggregated to hourly resolution by station complex. With that data in hand, we can calculate average hourly ridership for every day of the week. This gives us a profile of what, for example, a Monday or a Wednesday typically looks like, by hour. When calculating the average day-of-the week profile we exclude holidays and the like. 

Meanwhile, the National Weather Service provides data on severe weather events that affected the New York City region in 2025. We could get more fine-grained if we wanted to, but for now we'll just use the [general list of events](https://www.weather.gov/okx/stormarchive) the NWS provides. Then we plot the Subway ridership profile for that specific date against the average profile for whatever day of the week the event happened on.

{{% figure src="rhythms_2025_weather.png" alt="Small multiple showing generally suppressive relatinship between subway ridership and adverse weather days in 2025." caption="Bad weather suppresses Subway ridership, in general. But not always." class="full-width" %}}

The gray lines are the baseline. The red ones are the bad weather day. The basic shape of the gray lines (and many of the red ones) is set by the rhythm of daily life. The sharp double-peak pattern is what someone I've shown too many of these graphs to has taken to calling "The Giant Cat-Ears of Employment". The cat-ear shapes vary by work day (which might be the topic of another post), but are most sharply-contrasted with the weekends, which look more like little hillocks or [drumlins](https://en.wikipedia.org/wiki/Drumlin). 

We can see a few different cases in the panels. First are days when the weather event put no dent at all in people's day. This is because ~~of the incredible toughness resilience of New Yorkers, something they are surprisingly very modest about~~ even though there was a weather event in the region that day, it just didn't impinge on the city much, or at all. The light snow on February 11th or the heavy rain on March 6th are examples here. People just continued to go about their business. 

Second are cases where there's a lot of travel suppression but it's not really---or not wholly---the weather that's responsible. The winter storm on Friday December 26th is a case of this. That's not a regular Friday. Many people are able to stay at home anyway, because it's the day after Christmas.

Third are cases where the weather does seem to have suppressed travel. These are days like the snow on January 19th, or the shitty weather on Sunday February 16th. These events look like they made people stay at home. Some of these are more severe than others. The strongest example is the flash flooding on Thursday July 31st. That happened in the back half of the day and affected the evening commute directly. 

Our fourth and final category is my favorite one. Sometimes snow makes no difference at all, especially if it's on a workday. Sometimes it's snowy on the weekend but you're kind of sick of it, maybe because it's late in the winter, so you're either going about your business as usual or you're just staying indoors. But there's another kind of snow day. 

{{% figure src="rhythms_2025_weather_storm_dec13.png" alt="A close up of Dec 13th and 14th, when the first snow of the season fell and it made people want to go outside." caption="Let's go exploring." class="full-width" %}}

The weekend of [December 13th and 14th 2025](https://www.weather.gov/okx/20251213_14) brought the city's [first measurable snow of the year](https://weather.com/news/news/2025-12-14-first-snow-new-york-city), and in decent amounts, too---[between four and eight inches of accumulation](https://www.weather.gov/okx/20251213_14). Reports remarked on how long it had been in arriving. The result was that, over the weekend, ridership on the subway went _up_. Maybe on the Saturday it was to go out and buy the mandatory bread, milk, and eggs.[^1]  But maybe it was also just to be out in the snow. The next day, the people who didn't have to go work slept in as usual. But that day, too, across the afternoon, more people than usual headed outside and took the subway somewhere. I'd like to think a bunch of them had a sled under their arm. 

[^1]: Maybe, at least for some New Yorkers, it was because it made more sense to take the subway than drive. Though this probably wouldn't be all that many people. It'd be somewhat possible to investigate this with the data at hand, especially if e.g. outlying stations showed higher ridership rates.  
