---
#layout: post
title: "Sociology Rankings and the Fabio Effect"
date: "2013-03-26"
comments: true
categories: [Sociology,Data]
---

When I posted the [Sociology Department Rankings for 2013](http://kieranhealy.org/blog/archives/2013/03/25/sociology-department-rankings-for-2013/) I joked that Indiana made it to the Top 10 "due solely to Fabio mobilizing a team of role-playing enthusiasts to relentlessly vote in the survey. (This is speculation on my part.)" Well, some further work with the dataset on the bus this morning suggests that the Fabio Effect is something to be reckoned with after all.

The dataset we collected has---as best we can tell---635 respondents. More precisely it has 635 unique anonymized IP addresses, so probably slightly fewer actual people, if we assume some people voted at work, then maybe again via their phone or from home. Our 635 respondents made 46,317 pairwise comparisons of departments. Now, in any reputational survey of this sort there is a temptation to enhance the score of one's own institution, perhaps directly by voting for them whenever you can (if you are allowed) or more indirectly by voting down potential peers whenever you can. For this reason some reputational surveys (like the Philosophical Gourmet Report) prohibit respondents from voting for their employer or Ph.D-granting school. The All our Ideas framework has no such safeguards, but it does have a natural buffer when the number of paired comparisons is large. One has the opportunity to vote for one's own department, but the number of possible pairs is large enough that it's quite hard to influence the outcome. 

It's not impossible, however. The distribution of votes across our 635 respondents has a very long tail. While 75 percent of respondents registered just over 70 votes before finding something better to do, and 95 percent of respondents were done after about 250 votes, a brave few carried on for much longer. 

{{% img src="https://kieranhealy.org/files/misc/aoi2013-votefreq.png" %}}

As you can see, a small number of respondents cast more than 500 votes, and a few lonely souls cast more than a thousand. I found myself wondering whether these few extreme cases materially affected the final rank order. And in the course of answering that question I found what might fairly be described as somewhat suspicious voting patterns in several---but notably not all---of our Supervoters. In particular, the respondent with the very largest number of votes (1425 in total) had two favorite departments. He or she voted on them multiple times in separate contests---more than thirty times apiece---and both departments won *every time*. (By chance, this voter was never presented with the two in a head-to-head contest.) 

Now, it's possible for this to happen quite straightforwardly: the departments that emerge at the top of the overall ranking are by definition the ones that win all or nearly all of their head-to-head contests. And given the range of disagreement about which departments should win, as reflected in the error bars around the point estimates, there are quite a few such departments. However, in the case of our Supervoter, the favored departments were somewhat further down in the final rankings, making their 100 percent winning streak seem a little odd, particularly given that no other voters shared their view in several high-disparity cases. 

To preserve the confidentiality of the voting process---and bearing in mind that I do not have any identifying information whatsoever about the Supervoter in question---I will refer to the improbably favored departments by the pseudonyms "Hoosier University at Flowerington" and "The Fighting University of Our Lady", and name the associated Supervoter phenomenon "The Fabio Effect". Two other Supervoters also displayed somewhat suspicious voting patterns, showing a uniform but perhaps difficult-to-justify preference for Cornelius College and Twin-Citiversity, respectively, over all-comers.

The original rankings still stand, all the same, if only because the original error-ranges easily cover the shuffling around that happens once you re-run the model with the offending Supervoters removed. But I thought it would be worth showing what the rank-order looks like when the Fabio Effect is accounted for.

{{% img src="https://kieranhealy.org/files/misc/aoi2013-bradley-terry-ranking-top50-nofabio.png" %}}
