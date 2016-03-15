---
#layout: post
title: "A Co-Citation Network for Philosophy"
date: "2013-06-18"
comments: false
categories: [Philosophy,Sociology,Data,Visualization]
---

<small>*Corrections and Changes as of June 26th, 2013:* See the end of the post for details on some changes and fixes to errors in the data.</small>

What have English-speaking philosophers been talking about for the last two decades? I'm asking---and presenting an answer to---this question partly out of an ongoing research interest in philosophy, partly out of some recent "Does anyone know ...?" questions I've been asked, and partly to play with some new text-processing and visualization methods. There are of course many ways to make the general question specific. Here's the beginnings of an answer based on some work I did yesterday evening.

[Click here for the dynamic version of the network visualization](http://kieranhealy.org/philcites/). Read on for more details about the scope, limits, and interpretation of the data. Follow-up posts can be found [here](http://kieranhealy.org/blog/archives/2013/06/19/lewis-and-the-women) and [here](http://kieranhealy.org/blog/archives/2013/06/24/citation-networks-in-philosophy-some-followup). A [PDF Poster of the co-citation graph](http://kieranhealy.org/files/misc/philosophy-citation-poster.pdf) is also available.

## Data Sources and Methods
I took twenty years worth of articles from four major English-language philosophy journals and generated a network from it based on the citations contained in those articles. The substantive idea is as follows. An academic discipline is a sort of exclusive, ongoing conversation. The conversation is carried on, amongst other settings, through books and articles. In many disciplines there are a few high-status general-interest journals that claim to publish the best work in the field. Particular members of the field will of course disagree about how true that is, but for my purposes the point is just a descriptive one. I am interested in what high-status actors in a field are talking about, and one source of information about this is what gets published in high-prestige journals that claim to represent the core of the discipline.

In what follows, I'm very indebted to---i.e., I am basically copying---something [Neal Caren did last year for Sociology](http://nealcaren.web.unc.edu/a-sociology-citation-network/), and I'd like to thank Neal for making his code available, and for writing it in the first place.

So, we start from four high-impact, highly-selective, general-interest philosophy journals: *Nous*, the *Journal of Philosophy*, the *Philosophical Review*, and *Mind*. Two decades worth of articles from these journals is about 2,200 articles. What we are interested in is not so much the articles themselves, but the books and papers those articles *cite*. Take the content of the journals as representing the high-prestige end of "the field", that is, professional, academic, English-speaking philosophy. Now take the citations as representing *what the field is talking about*. All told, these 2,200 elite papers cite thirty four thousand items. (Not 34,000 unique items, just 34,000 in total.) These items can be books or articles from any time or source---Aristotle and Kant are in there, alongside the most recent work. We construct a co-citation network based on this data. Two cited items are connected if they are cited by the same paper in our database of 2,200 articles. The more often any single paper is cited, the more important it's likely to be. But the more often any two papers are cited *together*, the more likely they are to be part of some research question or ongoing problem or conversation topic within the discipline.

Our 2,200 articles and 34,000 citations works out to an average of about 15 citations per paper. To academics outside of philosophy this will seem like a very low number. Citations flowing from general literature reviews,  summaries of previous results, or ritual signaling of affiliation are not the norm in philosophy. This makes for an informative body of data, as citations are very much more likely to reflect topics of substantive current interest in the field.

All told, the co-citation matrix has just over a million edges, or article pairs that are cited together at least once. This is far too many to show in a single picture. And seeing as we want to know what the field is focused on, we don't need to. We are mostly interested in connections between the most cited articles. So having constructed it we can thin out the network and just show the connections between the approximately five hundred most cited items in our four journals. Items that make the cut have been cited at least ten times *in our four journals* over the past twenty years.

Again, these are *not* the most cited items in philosophy, nor are they the most cited *authors* in philosophy, nor are they the most cited papers *published* in these journals. We are looking at the *most cited items* in articles published in our journals. This means the same author may appear in different places in the graph for different books or papers. Each particular book or paper only appears once, however. Here what it looks like.

{{% img src="https://kieranhealy.org/files/misc/philcites-static.png" %}}

This is rather hard to read. You can [zoom in for a larger view](http://kieranhealy.org/files/misc/philcites-static.png) if you like, but I recommend instead that you look at this [dynamic visualization of the network](http://kieranhealy.org/philcites/), which you can move around and look at in more detail. Some of this post is repeated on that page (just in case people land there first). [Go play with it for a while](http://kieranhealy.org/philcites/), then come back here.

The graph shows co-citation patterns for just over 500 most-cited items over the past twenty years, based on the articles published in our four journals. (It's 520 items in total, where the cutoff is having received at least ten citations.) The colors of the nodes represent the results of a community-detection algorithm applied to the co-citation matrix. The community colors are generated inductively, not assigned in advance. If the community-detection method is working well, then it will have good face validity. That is, readers familiar with recent philosophical debates ought to see familiar clusters reflecting, for example, recognizably important debates in various parts of the discipline. I think the community detection works quite well. To my eye, we can see large, clear communities around questions in metaphysics and epistemology, amongst others. Large subdisciplinary topics are also visible, for instance the community around conditionals and causation. There is also a metaethics cluster, a political philosophy cluster, and other recognizable, smaller debates.

By the standards of citation analysis the graph is quite sparse. This is a good thing---as mentioned above, the norms of citation in philosophy mean that connections between citations (and the appearance of citations at all in a paper) are much more than usually informative about what's happening in a field. Here are some rather impressionistic observations based on the structure of the graph and the communities detected in the analysis.

## Metaphysics

The core of the graph, inside the main component, is a group of highly-cited items clustered around the two most important items in the dataset: Saul Kripke's *Naming and Necessity* and David Lewis's *On the Plurality of Worlds*. The two communities centered on these works are bridged by Lewis (1968), Lewis (1983), Forbes (1985), and Fine (1994).

{{% img src="https://kieranhealy.org/files/misc/philcites-metaphysics.png" %}}

The two big clusters are also connected to two other groups: one centered on Quine's *Word and Object*, and the other on David Chalmers' *The Conscious Mind*, about which more in a moment.

## Epistemology

The second largest component of the graph is about epistemology. Here the key works are by Tim Williamson (2000), Keith DeRose (1995), and John Hawthorne (2004). Interestingly, there is also a central paper by Lewis here as well (Lewis 1996). As we shall see, this is going to be a common occurrence. This main epistemology cluster bridges to what seems like an older conversation around work by Larry Bonjour (1985), Alvin Plantiga (1993), and Alvin Goldman (1986).

{{% img src="https://kieranhealy.org/files/misc/philcites-epistemology.png" %}}

## Divided Mind

Interestingly, there seem to be two separate clusters in the philosophy of mind. The first seems to be about consciousness, anchored by Chalmers (1986):

{{% img src="https://kieranhealy.org/files/misc/philcites-mind-1.png" %}}

And the second, with many of the same authors---but not the same articles or books---is arguing with Jerry Fodor about intentionality:

{{% img src="https://kieranhealy.org/files/misc/philcites-mind-2.png" %}}

## Ethics, Metaethics, and Political Philosophy
Work in ethics, metaethics, and political philosophy form components disconnected from the main graph. (At least, it's disconnected at this level of resolution---this would of course change if we included lower-cited items.) First, there is a component centered around John Rawls's (1971) *A Theory of Justice*.

{{% img src="https://kieranhealy.org/files/misc/philcites-rawls.png" %}}

There is also a larger metaethics component whose main branch connects Michael Smith's *The Moral Problem*, Tim Scanlon's *What We Owe to Each Other*, and Derek Parfit's *Reasons and Persons*. Christine Korsgaard's *The Sources of Normativity* is also notable here.

{{% img src="https://kieranhealy.org/files/misc/philcites-metaethics.png" %}}


## Smaller Debates
There are some nice examples of smaller or more relatively self-contained debates that are separated from the main clusters of activity. Again, I emphasize that this talk of "self-containment" or "separateness" is relative: we are only looking, remember, at connections between the 500 most highly-cited papers in the dataset. Here we see an example of this sort of compact cluster of co-citations arguing---I think---about free will, with work by Harry Frankfurt, Peter van Inwagen, and others. 

{{% img src="https://kieranhealy.org/files/misc/philcites-small-1.png" %}}

And here is the smallest such example, as papers cite a debate between Kendall Walton (1990) and Mark Crimmins (1998):

{{% img src="https://kieranhealy.org/files/misc/philcites-small-2.png" %}}

## Summary
A co-citation network is a useful way to get a sense of what is being talked about within a field, and how the topics of disciplinary conversation are connected to one another or not. It's especially useful in a field like philosophy, where citation is sparse. I'll reiterate that I did this mostly as a learning exercise for my own benefit, and it's not yet finished. (Really, I've hardly started.) For people unfamiliar with this sort of analysis, remember that communities are detected inductively and, at this stage, the technique is basically descriptive, and works best as a tool to help clarify ideas about the field rather than prove or disprove hypotheses. Remember also what's being represented: co-citation networks generated from material referenced in twenty years of articles in four generalist journals. It is not a complete picture of the field. But it is, I think, useful for getting a sense of what's been important in these journals and---to the degree that those journals really do set the agenda---maybe also for the field itself.

In a follow-up post, I hope to look a little more closely at some other aspects of the data. In particular, I want to say more about the astonishing influence of David Lewis on the field and, separately, take a look at the relative prevalence of citations to items by men and women in the data. More on those soon.


#### Changes and Corrections
*June 26th, 2013.* Further errors found and corrected in the dataset. All of these involve merging variant citations to the same work. Notable changes in the graph are the increased prominence of Davidson (1980), van Inwagen (1990), Putnam (1975), and (to a lesser degree), Wittgenstein (1953). I thank Brad Wray for drawing my attention to some of these errors.

*June 20th, 2013.* I have corrected several errors in the dataset, and made some changes to make the citation counts more accurate. First, a phantom item credited to "Anonymous" and notionally appearing on a single page of *Philosophical Perspectives* had a relatively high citation count (it was the 119th-ranked item). It has now been deleted. Second, the raw data from the Thompson Reuters Web of Knowledge citation database contains twelve cases citing "Christine Korsgaard (1998) Naming and Necessity". These are in fact cites to Kripke (1980). Third, I have taken the three different ways *Naming and Necessity* is cited in the database and amalgamated them into a single cite to Kripke (1980). Finally, based on some further analysis I changed the cutoff point from the top 500 to all items with at least ten citations. I did this so as not to arbitrarily exclude some items with the same number of citations as other, included items. Now we have 526 items instead of 500, all of which have been cited at least 10 times. These changes are reflected in the discussion. I thank Juan Comesana, Gary Ostertag, Laura Schroeter, and Dave Chalmers for help identifying issues in the raw data.

These corrections and changes mean the network is rewired a little, with the cluster around *Naming and Necessity* becoming more central. These changes are reflected in the discussion above.  
