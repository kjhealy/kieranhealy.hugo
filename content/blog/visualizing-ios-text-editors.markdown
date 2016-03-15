---
#layout: post
title: "Visualizing iOS Text Editors"
date: "2012-04-18"
comments: true
categories: [Nerdery,Data,R,Visualization,Apple]
---

The other day [Brett Terpstra posted](http://brettterpstra.com/ios-text-editors/) a gigantic and quite beautifully-executed feature comparison of all of the text editors available for iOS devices. The table is really terrific and also a bit overwhelming, as there's so much data. On the bus home yesterday, it struck me that it might make for a nice data  visualization exercise. There are all kinds of ways one might choose to represent the information, of course---how you visualize data depends on what you want to do with it.  Brett's way of presenting it is great, not least because of the way it's styled and augmented with dynamic touches which are all way beyond me. Naturally, it's focused on looking at the features of specific editors. I found myself wondering whether the information in the table could be used to highlight similarities and differences between editors and features, and maybe find whether there is any coherence in feature-sets and the editors that offer them.  

I made a CSV file of the table and dumped it into R. Here's a reproduction of Brett's table as a figure, with blocks of color for the data values. The figure was produced with ggplot. 

{{% img src="https://kieranhealy.org/files/misc/spec-cluster-alphabetical.png" %}}
_A version of the original table._ ([PNG](http://kieranhealy.org/files/misc/spec-cluster-alphabetical.png) or a [PDF](http://kieranhealy.org/files/misc/spec-cluster-alphabetical.pdf) of this.)

The apps are ordered alphabetically from top to bottom, and the features are grouped as presented in the original table---columns are grouped left to right under by Platform, Sync capabilities, Export options, and miscellaneous other features. (Note that I've omitted the price information in this version.) If you're interested in specific editors, you can look at their features across the rows, and you can see the prevalence of particular features looking down the columns. 

What if we just wanted to get a bird's-eye sense of the sort of features that tend to go together, or which editors are similar to one another in terms of their features? We can  cluster editors by features they share. Here's one way of doing that: 

{{% img src="https://kieranhealy.org/files/misc/cluster-by-name.png" %}}
_Clustering Editors_ ([PNG](http://kieranhealy.org/files/misc/cluster-by-name.png), [PDF](http://kieranhealy.org/files/misc/cluster-by-name.pdf).)

The dendrogram suggests some hypotheses about groups of editors that are similar. I've only used one or two of these products, so it's hard for me to say whether it's a plausible clustering overall. The fine-grain of it seems pretty decent, with, e.g., Gusto and Gusto Mobile ending up adjacent to each other. Two of the apps I've used (Writing Kit and Notesy) are also close to one another, and far away from apps like Vim and AppWriter, which in turn are close to one another. 

We can cluster features as well as clustering the apps themselves:

{{% img src="https://kieranhealy.org/files/misc/cluster-by-feature.png" %}}
_Clustering Features_ ([PNG](http://kieranhealy.org/files/misc/cluster-by-feature.png), [PDF](http://kieranhealy.org/files/misc/cluster-by-feature.pdf).)

This arranges the feature set a little differenty from the original table. There's one broad set of clusters around HTML and Markdown support; syncing features _except_ Dropbox (e.g. WebDAV, iTunes, proprietary, etc) together with Text search, and Browser/URL support. Then there's Price, sort of by itself, and a second clustering around Platform, live-editing features such as word count and appearance options, printing, Dropbox, and TextExpander support. 

If we take the orderings yielded by the cluster analyses and apply them to the table---i.e., permute the rows according to the editor clustering and the columns according to the feature clustering we get this:

{{% img src="https://kieranhealy.org/files/misc/spec-cluster-full.png" %}}
_Re-ordering the table based on the clustering_ ([PNG](http://kieranhealy.org/files/misc/spec-cluster-full.png), [PDF](http://kieranhealy.org/files/misc/spec-cluster-full.pdf).)

The clustering reorganizes the features and editors pretty well---reading across the rows you can now see the editors which implement simlilar feature sets. Looking down the columns we can see (to the right) the set of features that most of the editors implement, and (toward the left) the features which are much less common. They're separated by a couple of features which most editors either don't support or for which information is unavailable right now. 

Finally, we can facet the rows of the table according to the price of the app:

{{% img src="https://kieranhealy.org/files/misc/spec-cluster-by-price.png" %}}
_Faceting on Price_ ([PNG](http://kieranhealy.org/files/misc/spec-cluster-by-price.png), [PDF](http://kieranhealy.org/files/misc/spec-cluster-price.pdf).)

This suggests to me that there isn't a straightforward relationship between features and price. The green tiles don't become more and more common as you go down the rows from free apps to the most expensive ones. There is _some_ relationship: you can see that the apps priced at $1.99 or below are not as feature-rich as those priced at $2.99 or above. But within each of those broad classes features are about the same. 

Of course, not all features are equally important, and lists of features---even one as extensive as this---won't capture everything about an app. But it's fun to look for patterns here, especially given that the sheer number of text-editing apps available is so large.  

If you are interested, the code and data used to make the plots are in [this github repo](https://github.com/kjhealy/editors).
