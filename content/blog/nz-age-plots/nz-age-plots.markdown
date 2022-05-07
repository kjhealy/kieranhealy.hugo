---
date: 2015-07-31T07:19:39-04:00
title: Sex Gaps by Cohort in New Zealand Electoral Constituencies
categories: [Data,Sociology,Visualization]
---

The other day, [Jonathan Marshall](http://www.massey.ac.nz/massey/expertise/profile.cfm?stref=269430) posted a [nice graphic](https://twitter.com/jmarshallnz/status/625228866450124800) showing population age profiles of electoral constituencies in New Zealand, ordered by their tendency to vote left or right. He [put the data on github](https://github.com/jmarshallnz/electorates), and on a long transatlantic flight yesterday I ended up messing around with it a bit. 

Almost the only bit of Demography I know is the old saw that women get sicker but men die quicker. So I thought I'd take a look at differences in the sex composition of age cohorts by constituency. The idea would be that there should be a lot more females in the upper age cohorts, and perhaps more males in the very young cohorts, as the sex ratio at birth is about 1.05 Male/Female. In these data, different constituencies also have different populations and life chances, so maybe we'd see some interesting structure there.

Here's the plot, with constituencies ordered by highest to lowest average sex gap. The code to reproduce it is [available on github](https://github.com/kjhealy/nz-sex-ratios).

{{% figure src="https://kieranhealy.org/files/misc/nz-surplus-males.png" alt="Sex Ratios by 5-year age cohorts in New Zealand Constituencies." caption="Sex Ratios by 5-year age cohorts in New Zealand Constituencies." %}}

You can see some consistent patterns, but also a lot of variation in their size. The older cohorts, especially the very elderly, are much more female-dominated. But while this is true everywhere, the size of the gap varies quite a bit. At the other end of the age distribution, the male/female ratio balances out more quickly in some constituencies than in others. <s>Another interesting pattern is the consistent tendency for there to be a surplus of males in their 40s---it stands out against the general trend from male surplus to female surplus across the age distribution.</s> (Sorry this was an error in my code.) Finally, there are clearly some constituency-specific things going on. I don't think the names of the top eight most-female constituencies are a coincidence, for example. And I am guessing Clutha-Southland and Selwyn are both rural farming constituencies. But beyond that, seeing as I know little about Kiwi political geography or demography, I'll leave the interpretation to others. 


