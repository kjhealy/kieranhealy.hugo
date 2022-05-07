---
author: kjhealy
date: "2004-06-07"
#layout: post
slug: d-day-in-the-public-mind
status: publish
title: D-Day in the Public Mind
wordpress_id: '644'
categories:
- Sociology
---

With all the [hoopla over D-Day remembrances](http://news.google.com/url?ntc=0M1A0&q=http://www.boston.com/news/world/europe/articles/2004/06/07/west_honors_d_day_sacrifices), I found myself wondering whether remembering the anniversary had become more or less important in the last twenty years. To this end, I spent twenty minutes getting [LexisNexis](http://web.lexis-nexis.com/) to email me *New York Times* stories mentioning D-Day since 1980, running it through the world's kludgiest Perl script to clean it and drop irrelevant entries[1], and looking at the data in [R](http://www.r-project.org).

The result is the figure to the right, which shows the number of stories per year over a 25-year period, though of course the 2004 data only go to June 6th of this year. ![D-Day stories in the Times](http://www.kieranhealy.org/blog/images/nyt-dday.png "D-Day stories in the Times") The number of stories per year varies from zero to 120 with a median of about 17. The two biggest years by far are 1984 and 1994, the 40th and 50th anniversaries respectively. A [smoothed regression line](http://geography.anu.edu.au/GEOG2009/guide/tutorials/loess/) picks out a gentle but consistent upward trend in coverage. There are more stories as time goes by. It's not surprising that the big anniversaries are the most covered. Beyond that, coverage seems to be increasing as the D-Day cohort ages. The contemporary political benefits of making a big deal of such a praiseworthy event probably amplify this trend. This would lead us to expect the D-Day commemorations to decline as time goes by, though on the other hand World War II lives on in our culture (as a good war as well as the biggest one) in a way that most other wars do not.

Of course none of this tells us anything about the *substance* of the commemoration and whether that's changing over time. Historical events are remembered in the light of present-day concerns, and very well-commemorated events or major monuments are reinterpreted or [forgotten](http://www.grantstomb.org/tdr2.html) as circumstances change. I wonder how long this upward trend will continue: it's a question of whether D-Day is tied to the cohort who fought it, or whether its commemoration is attached to its veterans or whether it will become a more general event as time goes by. Probably the former, but it's hard to say.

fn1. Mainly paid death notices of people who had served on D-Day—casual Lexis-Nexis queriers should beware of this kind of thing.
