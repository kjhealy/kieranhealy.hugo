---
title: "The Persistence of the Old Regime, Again"
date: 2019-03-12T11:02:23-04:00
categories: [Sociology,R,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

A few years ago I [wrote a post](https://kieranhealy.org/blog/archives/2014/08/06/persistence-of-the-old-regime/) about the stickiness of college and university rankings in the United States. It's been doing the rounds again, so I thought I'd revisit it and redraw a few of the graphs I made then. 


In 1911, Kendric Babcock made an effort to rank US Universities and Colleges. In his   [report](https://ia700504.us.archive.org/0/items/classificationof01unit/classificationof01unit.pdf), Babcock divided schools into four Classes, beginning with Class I:

{{% figure src="https://kieranhealy.org/files/misc/babcock-class1.png" alt="Class 1" caption="The better sort of school." %}}

And descending all the way to Class IV: 

{{% figure src="https://kieranhealy.org/files/misc/babcock-class4.png" alt="Class IV" caption="One hardly dares look at the transcripts." %}}

Babcock's discussion of his methods is admirably brief (the snippet above hints at the one sampling problem that possibly troubled him), so I recommend you [read the report yourself](https://ia700504.us.archive.org/0/items/classificationof01unit/classificationof01unit.pdf).

University reputations are extremely sticky, the conventional wisdom goes. I was interested to see whether Babcock's report bore that out. I grabbed the US News and World Report [National University Rankings](http://colleges.usnews.rankingsandreviews.com/best-colleges/rankings/national-universities) for 2014 and made a quick pass through them, coding their 1911 Babcock Class. The question is whether Mr Babcock would be satisfied with how his rankings had held up, were he to return to us from the grave, ---more than a century of massive educational expansion and alleged disruption notwithstanding. 

It turns out that he would be quite pleased with himself. 

Here is a plot of the 2014 USNWR National University Rankings, color-coded by Babcock Class. In 2014,  USNWR's highest-ranked school was Princeton, and so it is at the top left of the dotplot. You read down the ranking from there and across the columns.

{{% figure src="https://kieranhealy.org/files/misc/babcock-universities-tile.png" alt="University rankings" caption="University rankings and Babcock classifications." %}}

You can get a [larger image](http://kieranhealy.org/files/misc/babcock-universities-tile.png) or a  [PDF version of the figure](http://kieranhealy.org/files/misc/babcock-universities-tile.pdf) if you want a closer look at it. 

As you can see, for private universities, especially, the 1911 Babcock Classification  tracks prestige in 2014 very well indeed. The top fifteen or so USNWR Universities that were around in 1911 were regarded as Class 1 by Babcock. Class 2 Privates and a few Class 1 stragglers make up the next chunk of the list. The only serious outliers are the [Stevens Institute of Technology](http://stevens.edu) and the [Catholic University of America](http://cua.edu).

The situation for public universities is also interesting. The Babcock Class 1 Public Schools have not done as well as their private peers. Berkeley (or "The University of California" as was) is the highest-ranked Class I public in 2014, with UVa and Michigan close behind. Babcock sniffily rated UNC a Class II school. I have no comment about that, other than to say he was obviously right. Other great state flagships like Madison, Urbana, Washington, Ohio State, Austin, Minnesota, Purdue, Indiana, Kansas, and Iowa are much lower-ranked today than their Class I designation by Babcock in 1911 would have led you to believe. Conversely, one or two Class 4 publics—notably Georgia Tech—are much higher ranked today than Babcock would have guessed. So rankings are sticky, but only as long as you're not public. 

There are some caveats. First, because I was more or less coding this stuff while eating my lunch, I did not attempt to connect schools which Babcock did rate with their current institutional descendants. So, for example, some technical, liberal arts, or agricultural schools that he classified grew into or were absorbed by major state universities in the 20th century. These are not on the charts above. We are only looking at schools that existed under their current name (more or less---there are one or two exceptions) in 1911 and now. 

Second, higher education in the U.S. really has changed a lot since 1911. In particular the postwar expansion of public education introduced many new and excellent public universities, and over the course of the twentieth century even some decent private ones emerged and came to prominence (such as [my own](http://www.duke.edu), which competes with a nearby Class II school).  This biases things in favor of the seeming stability of the rankings, because in the his own data Babcock had the luxury of not having to classify schools that did not yet exist.

We can add schools founded after 1911 (or not ranked by Babcock) back into the chart. Our expectation would be that most of them would not be highly-ranked at present, especially if they are private. And indeed this is what we find. 

{{% figure src="https://kieranhealy.org/files/misc/babcock-universities-tile-all.png" alt="Colleges" caption="Babcock's 1911 Rankings of Public and Private Universities and US News and World Report Rankings for 2014." %}}

You can get a [larger image](http://kieranhealy.org/files/misc/babcock-universities-tile-all.png) or a  [PDF version of the figure](http://kieranhealy.org/files/misc/babcock-universities-tile-all.pdf) if you want a closer look at it.

Now the coding includes a category for universities that appear in the USNWR rankings but which are not in Babcock, either because they did not exist at all in 1911, or had not yet taken their present names. The new additions still leave Babcock's classification looking pretty good. On the private side, Duke, Caltech, and Rice are added to the upper end of the list, but they are the only new entrants that are highly ranked. A number of new private schools appear further down. Meanwhile, on the public side, you can see the appearance of the 20th century schools, most notably the whole California system. The University of California System is an astonishing achievement, when you look at it. It managed to propel five of its campuses into the upper third of the table, where they joined its flagship, Berkeley. But the status ordering that was---take your pick; these data can't settle the question---observed, intuited, or invented by Babcock a century ago remains remarkably resilient. The old regime persists.
