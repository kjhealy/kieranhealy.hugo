---
author: kjhealy
date: "2005-04-22"
#layout: post
slug: crooked-timbers-field-of-positions
status: publish
title: Crooked Timber's Field of Positions
wordpress_id: '792'
categories:
- Sociology
---

Thanks to the SQL gurus who responded so quickly to my [question](http://crookedtimber.org/2005/04/22/sql-query-query/). Their help allowed me to get the data I wanted, namely, a table showing how often each of our authors has posted in each of our categories. A matrix like this allows for a [correspondence analysis](http://www.statsoft.com/textbook/stcoran.html) of the joint space of authors and topics, in the spirit of [Pierre Bourdieu](http://www.amazon.com/exec/obidos/ASIN/0804717982/kieranhealysw-20/ref=nosim/).

I've updated the analysis from the original post, following some of my own advice to amalgamate the categories that different people were using to post a short joke or trivial item (like "Look like flies" or "Et Cetera" and so on). I grouped all of them into a "Trivia" category. "Books" and "Literature" were grouped together, as were "Internet", "Intellectual Property" and "Information Technology". Finally, I also grouped "British Politics" and "UK Politics" into a single category. Unfortunately I had to drop Jon Mandle from the analysis (sorry Jon!) because none of his posts has a category.

Correspondence analysis lets you represent two kinds of entity simultaneously in two dimensions, allowing you to see how the elements of each entity are related to one another, and to those in the other entity. The idea is to reduce high-dimensional spaces (many authors, many categories) to low-dimensionsal ones with minimal loss of information. The figure below (also available in [a larger size](http://www.kieranhealy.org/files/misc/dudi-ct.png) and in [PDF format](http://www.kieranhealy.org/files/misc/dudi-ct.pdf)) gives the results for the CT data.

![image](http://www.kieranhealy.org/files/misc/dudi-ct.png)

The results are interesing. You can assess the similarity of authors and categories to one another by their closeness on the diagram—or, more specifically, by the size of the angle formed between any two entities and the origin. Entities further out from the origin are more influential in structuring the dimensions that the figure is constructed on.

The philosophers and political theorists, with the exception of Chris, are on roughly the same dimension. Tom and Micah in are quite similar in their concerns. (Not coincidentally, they're two of the least-frequent posters to CT.) Brian and John Holbo also go together somewhat, covering the academia/philosophy angle. Harry is right on top of the "family life" category, which no-one has posted on (under that title) bar him. Chris has the most differentiated posting profile, being distinctively associated with several topics (history, political theory, UK-related stuff), but also influencing the positin of topics like Music, Architecture (more like Henry in this respect) and the World Economy (more like John Quiggin and Daniel). Unsurprisingly, John Q and Daniel are associated most strongly with a cluster of topics around economics, international finance, the environment and globalization.

Maria's distinctive cluster is around IT issues and European Politics, which is unsurprising given her location and job, but also health care and religion. Henry is associated with Irish Politics, Science and Literature. Belle clusters on four categories—sexual politics books, humor and blogging (it's underneath the others). Ted's most strongly associated with U.S. Politics, as am I, but with Sociology added. Ted, Eszter and I have the dubious disctinction of being quite closely associated with trivia, too.

So rougly speaking we have four groups of people here: the philosophers (Harry, John H, Brian, Tom, Micah); the economists (Daniel, John Q); a fairly heterogenous Social Science/Blogging group (Henry, Belle, Eszter, Ted, Kieran, perhaps also Maria); and Chris in a class by himself—though you could also make a case for Maria in this respect.
