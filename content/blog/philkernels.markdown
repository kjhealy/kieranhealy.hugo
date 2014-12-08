---
date: "2014-12-08"
title: "Visualizing Philosophy Rankings"
status: publish
categories:
- Philosophy
- Visualization
- Data
---


The new [Philosophical Gourmet Report Rankings](http://www.philosophicalgourmet.com) are out today. The report ranks a selection of Ph.D programs in English-speaking Philosophy departments, both overall and for various subfields, on the basis of the judgments of professional philosophers. The report (and its editor) has been controversial in the past, and of course many people dislike the idea of rankings altogether. But as these things go the PGR is pretty good. It's a straightforward reputational assessment, made by a panel of experts from within the field. The Editorial Board and the expert panel are both named, so you know who is doing the assessing, and people are not allowed to vote for either their present employer or the school from which they received their highest degree. (These features already put it way, way ahead of the likes of US News and World report.) The report has also historically been good about reporting not just average reputational scores but also the median and modal scores. This helps discourage the sort of invidious distinctions between very small differences in average score that rankings tend to encourage. This year the Editors wanted to give even more information about the degree of consensus in the evaluator pool. They asked me to make some figures from using the overall ranking data.

I began very simply with figures showing the [Mean, Median and Mode scores](http://kieranhealy.org/files/misc/website-mmm-alltop50.png) they were already reporting. I also made some [small-multiple histograms](http://kieranhealy.org/files/misc/website-histogram-alltop50.png) which are good for showing the spread of votes within departments. For data like this, though, we are interested in a rank-ordered comparison of departments that can be taken in by scanning along a single axis. The tabular faceting of the histograms don't quite facilitate this. So in addition to those I did kernel density plots of the various rankings as well. Here's the one for the Overall Top 50 departments.

{{% figure src="http://kieranhealy.org/files/misc/website-kernel-alltop50.png" alt="Ranking Kernel Plot" caption="Kernel Density Plots of the 2014 PGR Top 50." %}}

You can get [a PDF version of this plot](http://kieranhealy.org/files/misc/website-kernel-alltop50.pdf) as well.

A kernel density can be thought of roughly as a continuous version of a histogram. It is a smoothed, nonparametric approximation of the underlying distribution of scores. It gives an indication of where scores are concentrated at particular values (visible as peaks in the distribution). The total shaded area of the kernels is proportional to the vote count for that department. The height of the peaks corresponds to the number of times a department was awarded about that score by respondents. In addition, the shading is informative. Darker areas correspond to more votes. Higher-ranking departments do not just have higher scores on average, they are also rated more often. This is because respondents may choose to only vote for a few departments, and when they do this they usually choose to evaluate the higher-ranking departments. Hence higher-ranking departments may appear darker in color, and lower-ranking ones lighter, reflecting the fact that relatively fewer assessments are made about them. The absence of any clear peak in a department's distribution indicates a more uniform distribution of scores awarded. The wider the spread, the wider the range of votes cast. Comparing down the column also gives a good indication of how much the distribution of expert opinion about departments tends to overlap across departments, and at what points on the scale votes are concentrated for different departments.

As with any visualization method there are trade-offs in presentation. This is why we show several different views of the data, as the histograms in particular make local comparison a bit easier. But I think the kernel plots do a good job of showing where and how opinion tends to overlap at various points in the ranking distribution. In particular they suggest that there are various zones or cutpoints into which assessments of departments are "chunked" by evaluators. They also show a few departments about which opinion is relatively spread out (the LSE is one example), or where there is a little more disagreement about whether a department belongs in one zone or another. I hope the users of the report find these visualizations of use. Here are the histograms for comparison.


{{% figure src="http://kieranhealy.org/files/misc/website-histogram-alltop50.png" alt="Vote Histograms by Rank" caption="The 2014 PGR Top 50: Vote Distribution by Department." %}}

You can get [a PDF version of this plot](http://kieranhealy.org/files/misc/website-histogram-alltop50.pdf) as well.
