---
#layout: post
title: "Rating and Specialties"
date: "2012-03-21"
comments: true
categories: [Philosophy, Sociology, PGR]
---

[Yesterday](http://leiterreports.typepad.com/blog/2012/03/about-the-raters.html) we saw that raters come mostly from the top half of of PGR ranked schools, with a good chunk of them from very highly-ranked schools. We also saw that specialty areas are not equally represented in the rater pool. (Specialty areas are not equally represented within departments, either, because not all subfields have equal status---more on that later.) Are voting patterns in the 2006 data connected to the social location of raters? Well, we can only say a little about this given the data constraints. But let's see what can be said. 

First, voting frequency. Might it be the case that _how many votes a rater casts_ is related to the PGR score of their home department? It's easy to think of reasons why this might be true. For example, what if people working at highly-ranked departments are highly opinionated (I know this seems very unlikely, but bear with me) and are happy to vote on every single department in the survey. Alternatively, it might be that people at high-ranking departments are somewhat snobbish (another wildly speculative notion, I admit) and this leads them to care not a whit for 85 of the 99 deparments in the survey. What do the data say?

{{% img src="https://kieranhealy.org/files/misc/pgr-desc-raters-nr-v-empscore-loess.png" %}}

(<a href="http://kieranhealy.org/files/misc/pgr-desc-raters-nr-v-empscore-loess.png">PNG</a>, <a href="http://kieranhealy.org/files/misc/pgr-desc-raters-nr-v-empscore-loess.pdf">PDF</a>.) 

Sadly, there doesn't seem to be much of a relationship either way. The blue line is a [LOESS](http://en.wikipedia.org/wiki/Local_regression) curve that's trying to find the best-fitting locally-weighted path through the data. As you can see, the association is mostly pretty flat, except for raters from very low-scoring departments (PGR < 2, say). You'll recall from yesterday that there aren't very many such raters in the survey, so there's more uncertainty associated with where the line ought to go. Once you get up to raters from departments with a PGR score of 2.5 or higher, the line is more or less flat---not coincidentally it sits around the high 70s. As I said yesterday the median rater evaluated 77 departments in 2006.

By contrast, consider the association between the number of votes a _Department receives_ and its PGR score in 2006:

{{% img src="https://kieranhealy.org/files/misc/pgr-desc-nratedvmean.png" %}} 

(<a href="http://kieranhealy.org/files/misc/pgr-desc-nratedvmean.png">PNG</a>, <a href="http://kieranhealy.org/files/misc/pgr-desc-nratedvmean.pdf">PDF</a>.) 

Much tighter, as you can see. 

What about variation due to specialty areas? Here we can look at the degree of consensus across specialty area and field position (as measured by employer's PGR score). It might be that raters are polarized on either or both dimensions---i.e., judgments about _overall_ reputation are heavily conditional either on the area you work in or the status of your department. (There may be other sources of balkanization in the the field, but I can't measure them here.) If that were true, the fact that there are a lot of Ethicists or Philosophers of Mind in the rater pool might make a big difference to the rankings, as they "voted their specialties", so to speak. In a similar way, it might be that those at lower-ranked departments (or people in the middle) disagree strongly with their higher-status counterparts about the rank order. (I should be careful about using the word 'counterpart' around here. Please don't email me.)

OK, so what can we do to visualize the level of consensus or disagreement between specialists? For a start we can them to create their own _overall_ rankings. That is, take everyone eligible to vote in the Ethics specialty rankings and calculate a new _overall_ PGR ranking using just their votes and no-one else's. Do the same for the other areas: an overall PGR ranking calculated by allowing only the Philosophers of Mind to vote; one calculated by allowing only the Metaphysics specialists, the 17th century specialists, and so on for all the specialty areas. (Some of these "new" overall scores will be calculated from a small number of raters—in several cases fewer than ten.) Once we have this set of new scores, we can see how much variation there is across specialties. Here's a plot of this variation for the top 25 departments:

{{% img src="https://kieranhealy.org/files/misc/pgr-rank-volatility06-t25.png" %}}

(<a href="http://kieranhealy.org/files/misc/pgr-rank-volatility06-t25.png">PNG</a>, <a href="http://kieranhealy.org/files/misc/pgr-rank-volatility06-t25.pdf">PDF</a>.) 

The boxplots show how much variation there is in the distribution of these speciality-based overall PGR scores. The blue area for each department covers the interquartile range (the 
space between the 25th and 75th percentiles). The "whiskers" on the plot extend out to the highest value that's within 1.5 times this range in either direction. Any remaining outlying 
observations beyond the whiskers are marked as dots. The boxplots give a sense of how much disagreement there is _between raters in different subfields_ about the _overall_ rank order 
of departments. As you can see, for the top departments there's a lot of consensus. As you go down the rank order, there's more disagreement. So, for example, if only raters for one 
specific subfield (I haven't checked which) were allowed to vote in the overall PGR ratings, the ANU might fall as low as 40th. Across all specialty areas it stays ranked in the top 20 
most of the time. NYU, on the other hand, never falls out of the top five no matter which specialist subset is assessing it.

We can extend the exericise to all departments, with another very tall figure:

{{% img src="https://kieranhealy.org/files/misc/pgr-rank-volatility06-all.png" %}}

(<a href="http://kieranhealy.org/files/misc/pgr-rank-volatility06-all.png">PNG</a>, <a href="http://kieranhealy.org/files/misc/pgr-rank-volatility06-all.pdf">PDF</a>.) 

Looking at all 99 departments we see a broadly similar sort of pattern to the overall degree of confidence in the actual overall ratings: there's a relatively high degree of consensus around the top seven or eight departments, with some widening of disagreement in around the 10-20 range. Outside the top 20 variability is greatest---i.e., cross-subfield consensus is lowest---in the middle to lower-middle of the table. And for the bottom 20 or so departments there's generally more consensus once again. 

In my next post I'll look at variation if we break out raters by their rank position rather than their specialty areas. 
 
