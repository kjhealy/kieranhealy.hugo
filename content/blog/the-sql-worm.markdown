---
author: kjhealy
date: "2003-01-25"
#layout: post
slug: the-sql-worm
status: publish
title: The SQL Worm
wordpress_id: '243'
categories:
- Internet
---

Late last night [Fiachra](http://www.u.arizona.edu/~kjhealy/images/dellasaurus-rex-1.jpg), my trusty linux workstation and blog-server, started getting hit by the [Microsoft SQL Worm](http://news.bbc.co.uk/2/hi/technology/2693925.stm "BBC NEWS | Technology | Virus-like attack hits web traffic") that's been [flooding Internet traffic](http://slashdot.org/article.pl?sid=03/01/25/1245206&mode=thread&tid=109) in the past 18 hours. My log files are full of attempts to connect to UDP Port 1434. I don't run MS SQL server, of course, but obviously enough servers do (and run with vulnerable versions) for it to propagate like crazy.

Fiachra was getting hit every few seconds—- and it's just a regular workstation sitting on an office desk. I pity the admins who had to deal with a bank of routers lit up like Christmas trees. [Here's a picture](http://fiachra.soc.arizona.edu/blog/archives/reachability.html) of the worm's effects on host reachability. Ouch. Nothing like a Distributed Denial of Service attack to remind us of the Fundamental Interconnectedness of All Things.
