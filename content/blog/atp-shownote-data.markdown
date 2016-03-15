---
date: 2015-05-15T14:18:00-04:00
title: ATP Shownote Data
categories: [Data,Nerdery,Gender]
---

The hosts at [Accidental Tech Podcast](http://atp.fm) have been thinking about how to broaden their base of listeners to include more women. Good for them. They're getting plenty of advice (and a certain amount of flak), which I won't add to. But in general when doing this kind of thing it can be helpful to look back on what your past practice has been. For example, it can be useful to audit one's own habits of linking and engagement. Often exclusion is less a matter of explicit boundary policing (though God knows there's enough of that in the tech sector) and more a matter of passive [homophily](http://en.wikipedia.org/wiki/Homophily). Who do you talk about and link to? As I've discussed in [another context](http://kieranhealy.org/blog/archives/2015/02/25/gender-and-citation-in-four-general-interest-philosophy-journals-1993-2013/), when it comes to gender often the interesting processes are at the level of who and what are taken as being worth talking about.

To that end I went and quickly scraped the shownotes for all the episodes I could easily get hold of (numbers 18 to 117). There are about 2250 non-unique links across these episodes. The code to scrape the notes and a CSV of the resulting dataset [are on Github](https://github.com/kjhealy/atpfm).

Here's a plot of the most-linked websites in the notes, with sponsors, self-links, and links to the personal sites of the authors mostly removed. 

{{% figure src="https://kieranhealy.org/files/misc/atp-link-count.png" alt="ATP link count" caption="Most-Linked sites in the ATP Shownotes." %}}

The exclusion of Sponsors and self-links is imperfect. For instance links to ArsTechnica mostly go to earlier writing by John Siracusa, and Relay.fm go mostly to another podcast Casey Liss appears on. Wikipedia is by far the most-linked site, so I've put the x-axis on a log-like scale to rein it in a little. Twitter links go to individual tweets. Amongst the industry commentators, Daring Fireball, Ben Thompson, and Jason Snell are well-represented. Most of the links to iMore go to episodes of the Debug podcast. Links to the Verge and Anandtech mostly go to news and reviews. If I had more time the obvious thing to do would be to code the gender of the authors of those linked pieces.

Here's a somewhat more boring disaggregation of the tweets linked to in the notes, again with self-links removed and just showing everyone with two or more links. 

{{% figure src="https://kieranhealy.org/files/misc/atp-tweet-count.png" alt="ATP tweet count" caption="Most-Linked Tweeters in the ATP Shownotes." %}}

I'll leave the interpretation to others.

Finally, here's a table of links to Github repositories. The numbers here are Episode numbers, not link frequencies.

|Episode|Link Tex                  |
|------:|:-------------------------|
|     22|Backup Bouncer            |
|     24|FMDB                      |
|     55|FCModel                   |
|     62|Second Crack              |
|     64|Casey's flower boxes      |
|     64|his Objective-C code      |
|     67|Showbot                   |
|     67|formal module support     |
|     67|es6-module-transpiler     |
|     71|Casey's Showbot           |
|     73|Github rolled out CSP     |
|     91|.NET on Github            |
|     92|source                    |
|     93|Kestrel                   |
|     93|libuv                     |
|     95|Accidentalbot             |
|     95|Camel                     |
|     95|FCModel                   |
|     97|camo                      |
|    100|marked                    |
|    100|markdown-it               |
|    103|Vips                      |
|    104|GitHub Camo SSL proxy     |
|    111|video transcoding scripts |
|    115|Electron                  |


I don't have time to look at this data in any more depth, but [it's available at Github](https://github.com/kjhealy/atpfm) if you want to take a further look. I'm pretty sure every single listener to ATP is a better programmer than I am, so feel free.
