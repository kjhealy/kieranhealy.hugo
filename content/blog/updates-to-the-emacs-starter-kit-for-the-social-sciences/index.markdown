---
#layout: post
title: "Updates to the Emacs Starter Kit for the Social Sciences"
date: "2013-02-21"
comments: true
categories: [Nerdery,Emacs]
---

I've made some updates to the [Emacs Starter Kit for the Social Sciences](http://www.kieranhealy.org/resources/emacs-starter-kit.html). In addition to various bits of cleanup, bug fixes, and package updates, I eliminated the need for any git submodules. This simplifies the installation, and allows for people to install the starter kit from a zipfile instead of via git (although git is still recommended). Because major components like Auctex and ESS are now available as packages, less has to be contained in the kit itself. 

The main problem I encountered while testing the new version is a certain flakiness on the part of Emacs when it contacts the ELPA and Marmalade servers to download the various packages. I've encountered three different errors: a long period of hanging without response; a generic "can't parse HTTP buffer" message; and a specific insistence that "The package 'auctex' is not available for installation". The latter one in particular is strange, because it's definitely there in the ELPA package repository. 

Dealing with these errors is annoyingly close to magical handwaving. The first option is to simply quit and relaunch Emacs and have it try again. This often works (though more than one try is sometimes required). The second, specifically for the auctex error, is to do <code>M-x list-packages</code> and then retry via quitting and relaunching Emacs. Sometimes the installation goes smoothly first time, sometimes this kind of messing around is required before Emacs finally decides auctex is in fact available and installs it. If these problems persist after a couple of tries, the best thing to do is simply to install the offending package or packages manually. Do <code>M-x list-packages</code> and in the resulting buffer search or scroll down the list to, e.g., auctex, mark it for installation by pressing <code>i</code> and then install it (or them) by hitting <code>x</code>. With the packages in place, restart Emacs and the starter kit will finish setting itself up.

Unfortunately I don't think there's anything else I can do to make these intermittent installation errors go away. If you use the kit, let me know if you run into any other problems with the installation. 
