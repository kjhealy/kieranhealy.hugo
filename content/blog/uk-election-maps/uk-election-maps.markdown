---
date: "2015-05-09"
title: Who Came Second in the UK Election?
categories: [Data,Politics,Sociology,Visualization,R]
---

The United Kingdom's election results are being digested by the chattering classes. So, yesterday afternoon I thought I'd see if I could grab the election data to make some pictures. Because the ever-civilized BBC has [election web pages](http://www.bbc.com/news/politics/constituencies) with a sane HTML structure, this proved a lot more straightforward than I feared. (Thanks also in no small part to statistician [Hadley Wickham](http://had.co.nz)'s `rvest` scraping library, alongside many other tools he has contributed to the community of social scientists who use [R](http://www.r-project.org) to do data analysis.)

Here are two maps. The first is a version of the one you've seen showing the winning party in every constituency in Great Britain (*sic*: excluding Northern Ireland).

{{% figure src="https://kieranhealy.org/files/misc/uk-2015-winners.png" alt="Constituencies by Winning Candidate." caption="British Constituencies by Winning Candidate." %}}

The SNP sweep in Scotland; the solid Tory South; Labour strongholds in parts of London, Liverpool, and the coal-mining regions of England and Wales---you've seen this one already. 

Now here's an alternative map. It shows the results with constituencies colored by the *second*-place candidate. 

{{% figure src="https://kieranhealy.org/files/misc/uk-2015-runners-up.png" alt="Constituencies by Runner-Up Candidate." caption="British Constituencies by Runner-Up Candidate." %}}

It's eye-opening. Like the United States, the UK has a First-Past-the-Post (FPTP) election system. Those of us (like me) who grew up in countries with some kind of [Proportional Representation](http://en.wikipedia.org/wiki/Proportional_representation) system, whether by [List](http://en.wikipedia.org/wiki/Party-list_proportional_representation) or [Single Transferable Vote](http://en.wikipedia.org/wiki/Single_transferable_vote), are generally made a bit queasy by FPTP. Proportional Representation aims to have the composition of Parliaments accurately reflect the range of support for parties. FPTP just wants to select a winner as quickly as possible. This means that in these systems there's often a fairly substantial discrepancy between vote share and seats. A few percentage points more in total vote share can create a parliamentary landslide. This can be an advantage, of course, if what you want is certainty about who will form a government, or if you want to avoid small parties holding the balance of power. But apart from that, a consequence of FPTP systems is that the *electoral base* of smaller parties---as opposed to their effective political strength---is easy to underestimate just from a winner's map.

In many British constituencies, of course, the race was straightforwardly between the two largest parties. It was Tories vs Labour, with one winning and the other coming in second. But that's by no means the only story. In the Runners-Up map, you can see that Scotland looks much more varied than before. With  fifty percent of the vote, the SNP won fifty six of the fifty nine available seats. The second place map shows a bit of the heterogeneity amongst the other half of voters. In Wales, in addition to the nationalist Plaid Cymru, you can also see the memory of Lloyd George in the support for Liberals. And it's the South coast, Thames Estuary, and the East of England that are perhaps the most striking. There, outside of London, the uniform sea of Tory blue gives way to Liberal Democrats and strong UKIP support---just with no Members of Parliament to show for it. One wonders whether the short-term certainties of FPTP might not propel either larger and less-predictable long-term shifts, given what amounts to substantial disenfranchisement, or more competition at the level of local government.

There's plenty more you could do with this data. The code to produce the maps (and scrape the numbers, if you'd like) [is available on Github](https://github.com/kjhealy/uk-elections).


