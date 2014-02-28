---
author: kjhealy
date: "2008-06-29"
#layout: post
slug: git-bibs
status: publish
title: Git Bibs
wordpress_id: '1332'
categories:
- Data
- orgtheory
- Sociology
---

Over the past few months, I've been messing around with [Git](http://git.or.cz/) and [Mercurial](http://www.selenic.com/mercurial/), two modern, distributed version control systems (DVCSs). While designed by software engineers, these systems are very useful to people who, like me, write papers and do data analysis in some plain-text file format or other, who very often revise those files, sometimes splitting them off into different branches as projects develop, and who do this work on more than one computer. I may write something more detailed later about how these systems work, but there are many good tutorials and introductions online already.

A built-in strength of Git and Mercurial is that they are designed to make dispersed, flexibly-organized collaboration very easy. In the open-source world this often happens through publicly available repositories of code for some application or other. I was wondering how I might take advantage of this and came across a post by [Mark Kalderon](http://markelikalderon.com/blog/2008/06/17/gitting-bibtex/) suggesting that BibTeX bibliography files would be a good candidate for sharing in this way. Seeing as [Github](http://github.com) provides free hosting for git repos, I've put up what is effectively my [BibTeX bibfile directory](http://github.com/kjhealy/socbibs/tree/master) as a repository. Anyone can clone it, extend it for their own purposes and, if they wish, propose changes to be pushed back into the main repository. You don't have to know git to use it, though—you can just download the files or the whole directory if you wish.

Right now, the files (unsurprisingly) reflect my own research projects and interests, and are only really of interest if you use LaTeX to write your papers. But you have to start somewhere.
