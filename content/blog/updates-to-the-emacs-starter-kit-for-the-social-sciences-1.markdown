---
#layout: post
title: "Updates to the Emacs Starter Kit for the Social Sciences"
date: "2012-04-23"
comments: true
categories: [Data,Sociology,R,Nerdery]
---

I've made some updates to the [Emacs Starter Kit for the Social Sciences](http://kieranhealy.org/emacs-starter-kit.html). The kit builds on Phil Hagelberg's original and [Eric Schulte's](http://eschulte.me/emacs24-starter-kit/) org-mode version, and incorporates some packages and settings that are particularly useful for the social sciences. See the [Starter Kit's Homepage](http://kieranhealy.org/emacs-starter-kit.html) for more details. The new version requires Emacs 24, which is not quite officially released but is in very good shape. See [the project page](http://kieranhealy.org/emacs-starter-kit.html) for more information about what's included in the starter kit and how to install it.

The latest version is a little more streamlined than before, because we can now take advantage of the package-management system that comes standard with Emacs 24. So, several packages that had been bundled-in with the starter kit are now fetched during installation instead. ESS is [now on github](https://github.com/emacs-ess), which makes it possible to include it as a submodule. The color theming now uses Emacs 24's native theming system, not the color-theme package.

I also removed the org-mode submodule, as an up-to-date version of it now comes with Emacs 24. Ideally I'll shortly be able to do this for ESS, too, as it ought to be installable as a package. 

