---
author: kjhealy
date: "2011-01-18"
#layout: post
slug: workflow-and-the-emacs-starter-kit-for-the-social-sciences
status: publish
title: Workflow and the Emacs Starter Kit for the Social Sciences
wordpress_id: '1802'
categories:
- Data
- IT
- R
---

Because the next official release of Emacs will finally have a [built-in package management system](http://tromey.com/elpa/), I've been able to update the [Emacs Starter Kit for the Social Sciences](http://kjhealy.github.com/emacs-starter-kit/) to make it easier to set up. [AucTeX is now installed directly](http://www.kieranhealy.org/blog/archives/2011/01/11/emacs-starter-kit-for-the-social-sciences-now-easier-to-install/) as a package, and so is [ESS](http://www.kieranhealy.org/blog/archives/2011/01/11/emacs-starter-kit-for-the-social-sciences-now-gets-ess-via-elpa/). While the AucTeX package is official, I host the [ESS package](http://kieranhealy.org/packages/) myself. I haven't made any changes to ESS, just added a short `.el` file that the package manager needs. (In particular, an "official" ESS package would be smaller, as some configuration files wouldn't be required — you can look at the AucTeX package [at the official package repo](http://elpa.gnu.org/packages/) to get a sense of this.)

To go with these changes, I've also revised my [Choosing Your Workflow Applications](http://www.kieranhealy.org/files/misc/workflow-apps.pdf) paper, and made the `.org` source file for the paper [available on GitHub](https://github.com/kjhealy/workflow-paper). The idea is that the Starter Kit and the workflow article can be used together to introduce beginning grad students (and other interested parties) to some useful software tools.
