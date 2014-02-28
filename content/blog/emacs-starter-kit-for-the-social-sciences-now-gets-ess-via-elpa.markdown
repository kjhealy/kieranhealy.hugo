---
author: kjhealy
date: "2011-01-11"
#layout: post
slug: emacs-starter-kit-for-the-social-sciences-now-gets-ess-via-elpa
status: publish
title: Emacs Starter Kit for the Social Sciences now gets ESS via ELPA
wordpress_id: '1790'
categories:
- Data
- IT
- R
- Sociology
---

More starter kit stuff. Up till now, the [Emacs Starter Kit for the Social Sciences](http://kjhealy.github.com/emacs-starter-kit/) included [ESS](http://ess.r-project.org/), but bundled it with the git repo. A better option would be to have it installed via the package mechanism, [like AucTeX is now](http://www.kieranhealy.org/blog/archives/2011/01/11/emacs-starter-kit-for-the-social-sciences-now-easier-to-install/), but it's not included. The ELPA system is allows you to specify repositories besides the official ones, so I've [created](http://kieranhealy.org/packages) a repository on my own site containing just ESS. I've updated the starter kit to include a pointer to it, so now on first install the kit will pull in ESS from there, and compile it for you. Neat. Eventually there should be some more official solution, but in the meantime this works nicely.
