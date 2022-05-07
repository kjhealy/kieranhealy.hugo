---
author: kjhealy
date: "2011-01-11"
#layout: post
slug: emacs-starter-kit-for-the-social-sciences-now-easier-to-install
status: publish
title: 'Emacs Starter Kit for the Social Sciences: Now Easier to Install'
wordpress_id: '1784'
categories:
- Data
- IT
- Politics
- R
- Sociology
---

New in nerdery this week, it's now a bit easier to install the [Emacs Starter Kit for the Social Sciences](http://kjhealy.github.com/emacs-starter-kit/) that I put together (based on lots of great work by [Phil Hagelberg](http://github.com/technomancy/emacs-starter-kit/tree) and, more recently, [Eric Schulte](http://eschulte.github.com/emacs-starter-kit/)). In the past, the fact that [AucTeX](http://www.gnu.org/software/auctex/) was both necessary and had to be compiled locally made for some awkward steps in the installation. But AucTeX is now part of the new [Emacs Package Manager](http://tromey.com/elpa/), so it's possible to install it automatically. I may end up doing this for Org-Mode, too. This just leaves [ESS](http://ess.r-project.org/) as the largest really important package that still needs to be bundled with the starter-kit. In the longer term, things look pretty good for the relationship between the starter-kit and the package system: the kit will specify which packages are needed, the package manager will install them automatically, and the kit will put some nice default settings in place.
