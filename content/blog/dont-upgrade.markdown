---
author: kjhealy
date: "2004-06-04"
#layout: post
slug: dont-upgrade
status: publish
title: Don't Upgrade
wordpress_id: '641'
categories:
- Misc
---

As a devotee of [structured procrastination](http://www-csli.stanford.edu/~john/procrastination.html) I am constantly on the lookout for things to be doing instead of whatever it is I'm supposed to be doing. As long as what you're doing has some value (even if it has less value than what you're supposed to be doing) then you can end up accomplishing a reasonable amount, except for that thing you avoided doing. But I've learned the hard way that installing and, especially, upgrading software does not fall into the category of Inadvertently Productive Activity. Upgrading is basically guaranteed to not work properly, break something or otherwise create some unexpected and unpleasant effect. Upgrading can be perversely satisfying because you then have to fix whatever it is that got broken, which can involve a considerable amount of clever diagnosis and problem-solving to bring you back to the point where you were a yesterday, before you upgraded. But this is not a healthy approach to life.

This is all common knowledge amongst software developers so I'm surprised that no-one told [The Royal Bank of Canada](http://www.globeandmail.com/servlet/story/RTGAM.20040603.wroyal0603/BNStory/Front/) about it. They upgraded some software and now "today is the fifth day in which [it] cannot tell its 10 million Canadian customers with any certainty how much money is in their accounts." The bank can't process automatic payroll deposits. Sadly, though maybe not surprisingly, this isn't a symmetric error: the bank still knows who owes it money.

The stories are vague about what bit of software went wrong exactly. It would be nice to think that Microsoft is somehow to blame, but this is very unlikely. Although Microsoft's products are up to trivial tasks like [writing letters](http://www.kieranhealy.org/files/oddments/clippy-suicide.jpg) or [making dogs fly](http://www.kieranhealy.org/files/oddments/ms-doggie.jpg) or [running the electronic voting systems of the United States](http://www.blackboxvoting.org/access-diebold.htm), no-one would trust them with something like a transactional database, an air-traffic control system or an electricity grid. Applications for stuff like that are usually written in languages you have never heard of, like [APL](http://www.engin.umd.umich.edu/CIS/course.des/cis400/apl/apl.html). I only know about APL because my colleague [Ron Breiger](http://www.u.arizona.edu/~breiger) uses it to write routines to do social network analysis. He gave me a tutorial in it once. Unlike most languages, APL has more than a hundred primitive operations, each with its own symbol. You need a [special keyboard](http://www.aplusdev.org/keyboard.html) to work it. Ron insists that it's really quite intuitive, but alas unlike most professors he is a genius. Because it has so many primitives, APL is a pithy language. Here is a sample APL program to find all the prime numbers less than or equal to a specified integer:

PRIMES : (˜R ∈ R º**.**× R) / R ← 1 ↓ ιR

That's the whole thing. A [full explanation](http://www.users.cloud9.net/~bradmcc/APL.html) is available, but not from me. I recommend [this page](http://www-users.cs.york.ac.uk/~susan/cyc/p/prog.htm) which contains opinions about APL and better-known languages like C ("A language that combines all the elegance and power of assembly language with all the readability and maintainability of assembly language"), C++ ("an octopus made by nailing extra legs onto a dog") and FORTRAN ("Consistently separating words by spaces became a general custom about the tenth century A.D., and lasted until about 1957, when FORTRAN abandoned the practice").

There is a broader point here about the sociology of credit and confidence in highly-automated contexts that are subject to failure. But mainly I think the lesson is, Don't Upgrade.
