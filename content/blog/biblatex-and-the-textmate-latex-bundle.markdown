---
author: kjhealy
date: "2010-01-09"
#layout: post
slug: biblatex-and-the-textmate-latex-bundle
status: publish
title: Biblatex and the Textmate Latex bundle
wordpress_id: '1584'
categories:
- IT
---

I've been using Philipp Lehman's [biblatex package](http://www.ctan.org/tex-archive/help/Catalogue/entries/biblatex.html) to manage citations in (xe)latex documents. When compiling in TextMate using cmd-R (with latexmk.pl enabled), the bibtex files are not processed properly. BibTeX cannot find the citations and exits (in the html window) with

`Found 0 errors, and 0 warnings in 0 runs`

bibtex exited with status 2

Biblatex works in part by generating an additional bibfile called *file*-blx.bib in the same directory as the *file*.tex being processed. This is in addition to whatever *main*.bib file is being used to store actual citations and located in the BIBINPUTS directory. The problem is that that TextMate can't find this file during its compilation sequence:

<script src="http://gist.github.com/272908.js?file=bibtexoutput.tex"></script>

The solution is to explicitly append the current directory to BIBINPUTS in Preferences \>; Advanced \>; Shell Variables, so that instead of , say,

`/Users/kjhealy/Library/texmf/bibtex/bib`

you have,

`/Users/kjhealy/Library/texmf/bibtex/bib:.`

Note the period at the end there. That way Textmate will search the current directory for bibtex files in addition to looking wherever your .bib files are. This has been your weekend bit of Textmate nerdery.
