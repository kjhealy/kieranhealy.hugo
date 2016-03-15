---
title: "Silver vs Krugman"
date: "2014-03-26"
categories: [Data,Politics,IT,Nerdery,Visualization]
---

Nate Silver's relaunched [FiveThirtyEight](http://fivethirtyeight.com) has been getting some flak from critics---including many former fans---for failing to live up to expectations. Specifically, critics have argued that instead of foxily modeling data and working the numbers, Silver and his co-contributors are looking more like regular old opinion columnists with rather better chart software. Paul Krugman has been a prominent critic, [arguing that](http://krugman.blogs.nytimes.com/2014/03/26/data-as-slogan-data-as-substance/) "For all the big talk about data-driven analysis, what [the site] actually delivers is sloppy and casual opining with a bit of data used, as the old saying goes, the way a drunkard uses a lamppost — for support, not illumination." Silver has put his tongue at least part way into his cheek and [pushed back a little](http://fivethirtyeight.com/datalab/for-columnist-a-change-of-tone/) with an article titled, in true <em>Times</em> fashion, "[For Columnist, a Change of Tone](http://fivethirtyeight.com/datalab/for-columnist-a-change-of-tone/)".

> [Krugman] has expressed substantially more negative sentiments about FiveThirtyEight since it left The New York Times, according to a FiveThirtyEight analysis. ... [Krugman] has referred to FiveThirtyEight or editor-in-chief Nate Silver 33 times on his blog. FiveThirtyEight classified each reference based on whether it expressed a favorable, unfavorable or neutral sentiment toward FiveThirtyEight. ... Mr. Krugman referred to FiveThirtyEight or Nate Silver on seven occasions during its independent period. Four of these mentions were favorable, two were neutral, and one was unfavorable. ... During FiveThirtyEight’s tenure with The New York Times, Mr. Krugman referred to FiveThirtyEight or to Nate Silver 21 times. Over all, 15 of these references were favorable, as compared to five neutral references and one unfavorable one. ... But Mr. Krugman’s views of FiveThirtyEight have changed since it re-launched March 17 under the auspices of ESPN. The columnist has mentioned FiveThirtyEight four times in just nine days, all in negative contexts. 

He prints this table:

{{% figure src="https://kieranhealy.org/files/misc/silver-krugman-original.png" alt="Silver v Krugman" caption="Silver v Krugman, Round 1" %}}


Silver goes on to say, "To be sure, the difference in Mr. Krugman’s views could reflect a decline in quality for FiveThirtyEight ... While it can be easy to extrapolate a spurious trend from a limited number of data points, the differences are highly statistically significant. At his current pace, Mr. Krugman will write 425 more blog posts about FiveThirtyEight between now and the 2016 presidential election."

I think new sites always take a little time to settle down, and I hope FiveThirtyEight can get rolling with the kind of quick and accessible, model-based and data-driven analysis that made Silver justly famous. Maybe this post would be a good place to start. Given that he says the differences are "highly statistically significant", a natural question to ask is whether there is any omitted variable bias in the model. I went and looked at the original columns, which Silver helpfully links to in his table, and quickly coded up two new variables: the topic that Krugman was referring to when he mentioned Silver, and whether the item mentioned by Krugman had a worked-out statistical model underneath. That gives us a new table:

{{% figure src="https://kieranhealy.org/files/misc/silver-krugman-2.png" alt="Silver v Krugman 2" caption="Silver v Krugman, Round 2" %}}

It seems to me that either the topic Krugman was writing about or the model-based nature of Silver's discussion might be driving the statistically significant results in the original model. Science marches on. 
