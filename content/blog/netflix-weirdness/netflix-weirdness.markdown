---
author: kjhealy
date: "2008-11-23"
#layout: post
slug: netflix-weirdness
status: publish
title: Netflix Weirdness
wordpress_id: '1420'
categories:
- Data
---

There's an [article on the Netflix Prize](http://www.nytimes.com/2008/11/23/magazine/23Netflix-t.html?partner=permalink&exprod=permalink) in the *Times* today. You know, where Netflix made half of its ratings data available to people and offered a million bucks to anyone who could write a recommendation algorithm that would do some specified percent better than Netflix's own. What tripped me up was this sentence about one of the more successful teams:

> The first major breakthrough came less than a month into the competition. A team named Simon Funk vaulted from nowhere into the No. 4 position, improving upon Cinematch by 3.88 percent in one fell swoop. Its secret was a mathematical technique called singular value decomposition. It isn't new; mathematicians have used it for years to make sense of prodigious chunks of information. But Netflix never thought to try it on movies.

Can this possibly be true? I'd have thought that just about the most obvious way to look for some kind of structure in data like this would be to do a principal components analysis, and PCA is (more or less) just the [SVD](http://en.wikipedia.org/wiki/Singular_value_decomposition) of a data matrix. PCA is a quite straightforward technique (evidence for this includes the fact that I know about and use it myself). It's powerful, but it's not like it's some kind of slightly obscure method that isn't ever applied to data of this kind. And there's a whole family of related and more sophisticated approaches you could use instead. If you'd asked me about the prize before I read this article, I would naively have said "Well, it's this effort to get people to help Netflix do better than I guess anyone could using something like bog-standard PCA."

Maybe the article just got written up in a way that misrepresents the contribution of the team who introduced the method to the data. Or maybe I am misunderstanding something. I guess I should page [Cosma](http://www.cscs.umich.edu/~crshalizi/weblog/%20http://www.cscs.umich.edu/~crshalizi/weblog/) and see what he thinks.
