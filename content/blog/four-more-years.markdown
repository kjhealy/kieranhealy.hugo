---
author: kjhealy
date: "2006-05-25"
#layout: post
slug: four-more-years
status: publish
title: Four More Years?
wordpress_id: '938'
categories:
- Personal
---

A [comment by Bitch PhD](http://bitchphd.blogspot.com/2006/05/go-tell-norbiz-happy-fucking.html) reminded me that this week I'll have been blogging for four years. I'm not sure what to think about that, so let's look at some data. Here is a time-series of the number of posts per month on [my blog](http://www.kieranhealy.org/blog) from its [inauspicious beginning](http://www.kieranhealy.org/blog/archives/2002/05/21/the-hello-world-entry/) in May 2002 to the present. (Since CT started, I've just posted the same material to my own blog, so the trend represents all my posts.)

![image](http://www.kieranhealy.org/files/misc/postspermonthxy.png)

It's clear that after a quiet start things rapidly got out of control, reaching a frankly unsustainable level of more than two posts per day in the first half of 2003. What caused the radical drop from more than 40 posts a month to less than half of that in June and July of 2003? You're looking at it: [Crooked Timber launched](http://crookedtimber.org/2003/07/08/for-the-benefit-of-mr-kite/) then, and so I got to share the responsibility of sustaining an audience with a bunch of other people. Clearly it took the pressure off. After that came about two years of gradual decline (in every sense, I'm sure), getting down to less than ten posts a month in mid-2005. Things may have picked up again a little recently.

A common pattern is for posts to decline in frequency but increase in length. I think something like this may have happened, but I haven't been able to extract monthly word-counts from WordPress in a convenient way (I don't know enough PHP). Word counts vary quite a bit depending on which plugins you use, but the most conservative estimate is that I've written 289,324 words, for an average of about 311 words per post in 928 posts over the past four years. (The upper-range estimate was 335,053 words, or just shy of the median [Tim Burke](http://weblogs.swarthmore.edu/burke/) post.)

For academic bloggers, there is a pessimistic and an optimistic theory of the relationship between writing, blogging and academic productivity. The optimistic version says that writing is like a physical capacity, and if you practice you get better at it—so regularly writing in your blog means you're in the habit of getting stuff down on paper, and will find it easier to write other things. The pessimistic version says that you have *n* words in you per day (for some low value of *n*), and you can either write them in your blog or write them somewhere more useful. These data don't strongly support either theory. The slow but consistent decline in posting frequency is quite marked (especially if you decompose the time series, which I haven't shown here). So I may not be doing this in four years time if present trends continue. Or perhaps I'm circling a stable equilibrium of verbiage, and becoming very good at punching out 300 to a thousand words, without it amounting to all that much.

**Update**: Thanks to some helpful SQL from Norman David Gerre at CT, I can now calculate the average length of posts each month over the time period. It looks like this:

![image](http://www.kieranhealy.org/files/misc/characterspermonthxy.png)

This offers some support to the less-frequent/more-verbose hypothesis outlined above. I think some of the spikes are a consequence of us doing Book Seminars. If we run the post frequency and average post length time series through a standard decomposition and look at the trend components of each, we get the following. (Average Post Length is divided by 100 to make the trends comparable on a single graph.)

![image](http://www.kieranhealy.org/files/misc/postfreqtrends.png)

So post frequency rises sharply and then declines sharply in the first 18 months, and continues to decline slowly or perhaps level out. Meanwhile the average length of posts climbs consistently over the period, growing more rapidly in 2005 and then falling off again. Maybe I'm entering another pithy period.
