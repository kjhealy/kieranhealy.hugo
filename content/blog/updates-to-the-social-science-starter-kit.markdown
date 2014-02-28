---
#layout: post
title: "Updates to the Social Science Starter Kit"
date: "2013-05-28"
comments: true
categories: [Nerdery,R,Emacs,IT]
---

The [Emacs Social Science Starter Kit](http://kieranhealy.org/resources/emacs-starter-kit.html) is a drop-in collection of packages and settings for Emacs 24 aimed at people like me: that is, people doing social science data analysis and writing, using some combination of tools like R, git, LaTeX, [Pandoc](http://johnmacfarlane.net/pandoc/), perhaps some other programming languages (e.g., Python, or Perl), and plain-text formats like Markdown, and Org-Mode. More information on the kit is [available here](http://kieranhealy.org/resources/emacs-starter-kit.html). Some of its highlights are [listed here](http://kieranhealy.org/blog/archives/2013/02/25/ten-things-the-emacs-social-science-starter-kit-gives-you/). It was originally written to accompany a more general article on [Choosing Your Workflow Applications](http://www.kieranhealy.org/files/misc/workflow-apps.pdf). The SSSK is available on [github](http://github.com/kjhealy/emacs-starter-kit).

I've made some changes and additions to the kit recently, initially prompted by the release of [Version 8 of Org-Mode](http://orgmode.org/Changes.html). This was a major release that included a completely rewritten exporter. It is incompatible with the master branch of the Starter Kit. However, because Org-Mode 8 is not yet in the stable release of Emacs 24, I have left the SSSK's `master` branch as-is, and created a new `orgv8` branch. This is where new things are being added, and I am no longer adding features or making fixes to the master branch. When Org-Mode 8 gets into Emacs, the `orgv8` branch will become the `master` branch. New things on the `orgv8` branch include:

1. The newest versions of [ESS](http://ess.r-project.org), [Magit](https://github.com/magit/magit), and other packages previously in the kit.

2. Cleaned up LaTeX exporting from Org-Mode. It now uses XeLaTeX only, and is much simpler than before. As with the earlier setup, you will need my collection of [LaTeX Templates and Styles](http://kieranhealy.org/resources/) for it to work properly.

3. Added [Smartparens](https://github.com/Fuco1/smartparens), [Polymode](https://github.com/vitoshka/polymode), [Powerline](https://github.com/milkypostman/powerline), support for previewing in [Marked](http://markedapp.com), [Visual-Regexp](https://github.com/benma/visual-regexp.el), and better support for [Zenburn](https://github.com/bbatsov/zenburn-emacs) and [Anti-Zenburn](https://github.com/m00natic/anti-zenburn-theme) themes.

4. Python support is better now. 

5. Various clean-up and compatibility updates to accompany the new additions and updates, especially having to do with the many recent improvements to ESS. Autocomplete mode and ESS now work much better together. 


Looking at plain text more generally, I've been trying to take advantage of [Knitr](http://yihui.name/knitr/) as much as possible, as it seems to me to be the future of literate programming in R, particularly in conjunction with Markdown. Support for `.Rmd` files in ESS is not quite there yet, but Polymode provides a workable solution right now. The main benefits of working with Knitr and `.Rmd` is that it is very easy to get to both a good HTML file (i.e., a `.md` file that is easily previewable in Marked) and a good PDF file (via LaTeX). Some inevitable limitations remain, e.g. with the lack of cross-reference and certain limits to citations. But being able to combine R and Markdown is a clear benefit, given the prevalence of the `.md` format and the ease of export to other formats from there (via Pandoc). I should probably write a more thorough post about this at some point. In the meantime, enjoy the Kit.
