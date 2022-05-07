---
author: kjhealy
date: "2004-11-19"
#layout: post
slug: further-analysis-of-electronic-voting-patterns
status: publish
title: Further Analysis of Electronic Voting Patterns
wordpress_id: '730'
categories:
- Politics
- Sociology
---

Mike Hout and some colleagues at Berkeley have a [working paper](http://ucdata.berkeley.edu/new_web/VOTE2004/election04_WP.pdf) called "The Effect of Electronic Voting Machines on Change in Support for Bush in the 2004 Florida Elections". A [summary](http://ucdata.berkeley.edu/new_web/VOTE2004/election04_Sum.pdf) is also available as well as the data itself. They try to estimate whether the presence of touch-screen electronic voting made a difference to the number of votes cast for Bush, controlling for various demographic characteristics of the counties as well as the proportion of votes cast for the Republican Presidential candidate in 1996 and 2000. Here's the punchline from the results:

> As baseline support for Bush increases in Florida counties, the change in percent voting for Bush from 2000 to 2004 increases, but at a decreasing rate. Electronic voting has a main, positive effect on the dependent variable. Furthermore, there is an interaction effect between baseline support for Bush and electronic voting, and between baseline support for Bush squared and electronic voting. Support for Dole in 1996, county size, median income, and Hispanic population had no significant effect net of the other effects. Essentially, net of other effects, electronic voting had the greatest positive effect on changin percent voting for Bush from 2000 to 2004 in democratic counties. ... Summing these effects for the fifteen counties with electronic voting yields the total estimated excess votes in favor of Bush associated with Electronic Voting; this figure is 130,733.

Hmm. I'm going to go mess around with the data for a while and see what we can see.

**Update**: While mucking around with this, I see from the comments that [Andrew Gelman](http://www.stat.columbia.edu/~gelman/) (Statistics, Columbia) has done the job for me, and much better than I could. He presents [a very nice discussion](http://www.stat.columbia.edu/~cook/movabletype/archives/2004/11/vote_swings_in.html) of these patterns on his blog. You should read all of his post. Here's a figure, similar to one on his blog, that shows the percent swing to Bush in Florida counties in 2004 against the Percent Republican vote in 2000 in the same counties. (A [PDF version](http://www.kieranhealy.org/files/misc/florida-swing.pdf) is also available.)

![image](http://www.kieranhealy.org/files/misc/florida-swing.png)

Counties using electronic voting machines are shown in red. You can see that Broward and Palm Beach counties (which have very large populations and lean strongly Democratic) swung much more toward Bush than was typical for counties where Republicans won less than 47 or 48 percent of the vote in 2000. It turns out that these two counties are driving the findings of Hout et al's model. I ran a model identical to Hout et al's, but with a variable ("pb-brow") added to distinguish Broward and Palm Beach Counties from all the others. Here are the results:

    Coefficients:
    Estimate Std. Error t value Pr(>|t|)
    (Intercept) 2.13e01   9.49e-02   -2.24   0.0289 *
    b00pc        1.03e+00   3.25e-01    3.17   0.0025 **
    b00pc.sq    6.62e01   2.83e-01   -2.34   0.0230 *
    size        2.88e08   7.21e-08   -0.40   0.6908
    etouch       2.98e-01   3.26e-01    0.92   0.3638
    b00pc.e     8.82e01   1.13e+00   -0.78   0.4373
    b00pcsq.e    6.02e-01   9.71e-01    0.62   0.5377
    d96pc       1.58e01   1.19e-01   -1.33   0.1881
    v.change    4.41e08   3.21e-07   -0.14   0.8912
    income      7.89e07   7.64e-07   -1.03   0.3064
    hispanic    5.21e02   3.10e-02   -1.68   0.0988 .
    pb-brow      2.14e-02   5.23e-02    0.41   0.6831—-
    Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1
    Residual standard error: 0.0215 on 55 degrees of freedom
    Multiple R-Squared: 0.539,Adjusted R-squared: 0.447
    F-statistic: 5.84 on 11 and 55 DF,  p-value: 3.55e-06

As you can see, putting in a dummy for Palm Beach and Broward Counties makes the significant effect of "etouch" (i.e., whether a county had electronic voting) go away. Now the only variables significant at conventional levels are the ones measuring the percentage voting for Bush in 2000. (Note that there's also a hint of an effect for 'Hispanic,' as befits their ambiguous role in deciding the election.)[1]

So, all of the e-voting action is explained by two counties. The question is what's happening in those counties. Andrew Gelman again:

> One possibility, as suggested by Hout et al., is cheating, possibly set up ahead of time (e.g., by loading extra votes into the machines before the election or by setting it up to switch or not count some votes) ... but an obvious alternative explanation is that, for various reasons, 3% more people in those counties preferred Bush in 2004, compared to 2000. As can be seen in the graphs above for 2000, 1996, and 1992, such a swing would be unusual (at least compared to recent history), but that doesn't mean it couldn't happen! ... It would make sense to look further at Broward and Palm Beach counties, where swings happened which look unexpected compared to the other counties and compared to 2000, 1996, and 1992. But lots of unexpected things happen in elections, so we shouldn't jump to the conclusion that e-voting is related to these particular surprises.

In other words, if there is cheating it's not centralized cheating where all the e-voting machines mess up in the same way. If you believe that the machines were rigged, focus on the ones in Palm Beach and Broward county. But it seems more likely that these results show the Republican Party Machine was really, really well-organized in Palm Beach and Broward, and they were able to mobilize their vote better than the Democrats. The general swing toward Bush in Florida seems consistent with this story.

**Notes**

fn1. Again, this analysis isn't original to me: see Andrew Gelman's post for more details.
