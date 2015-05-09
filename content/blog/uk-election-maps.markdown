---
date: "2015-05-09"
title: Who Came Second in the UK Election?
categories: [Data,Politics,Sociology,Visualization,R]
---

The UK's election results are being digested by the chattering classes. So, yesterday afternoon I thought I'd see if I could grab the election data to make some pictures. Because the BBC has sane HTML structure, this proved a lot more straightforward than I feared---thanks in no small part to [Hadley Wickham](http://had.co.nz)'s `rvest` scraping library together with `ggplot` and `dplyr` and all the other tools he's contributed to the R-using public.

So I grabbed the data and made some pictures. Here are two maps. The first is a version of the one you've seen showing the winning party in every constituency in Great Britain (sic: excluding Northern Ireland).

{{% figure src="http://kieranhealy.org/files/misc/uk-2015-winners.png" alt="Constituencies by Winning Candidate." caption="British Constituencies by Winning Candidate." %}}

The SNP sweep in Scotland, the solid Tory South, the Labour strongholds in parts of London, the Midlands, Northern England, and South Wales. You've seen this one already. 

Here's an alternative map. It shows the results with constituencies colored by the second-place candidate. 

{{% figure src="http://kieranhealy.org/files/misc/uk-2015-runners-up.png" alt="Constituencies by Runner-Up Candidate." caption="British Constituencies by Runner-Up Candidate." %}}

It's eye-opening, I think. The UK has a First-Past-the-Post election system, which means---to those of us raised on [PR-STV](http://en.wikipedia.org/wiki/Single_transferable_vote) that there's a fairly substantial discrepancy between vote share and seats. A consequence is that the electoral base of smaller parties---as opposed to their effective political strength---is easy to underestimate just from a winner's map. In many constituencies, of course, the race was straightforwardly between the two largest parties. It's Tories vs Labour, with one winning and the other coming in second. But that's by no means the only story. In the Runners-Up map, Scotland looks more varied than before, and you can see the memory of Lloyd George in Wales. Meanwhile the South coast, Thames Estuary, and the East of England are also quite striking, as a sea of Tory blue gives way to Lib-Dems and UKIP support.


There's plenty more you could do with this data. The code to produce the maps (and scrape the numbers, if you'd like) [is on Github](https://github.com/kjhealy/uk-elections).


