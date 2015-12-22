---
author: kjhealy
date: "2011-01-21"
#layout: post
slug: exporting-org-mode-to-pdf-via-xelatex
status: publish
title: Exporting Org-Mode to PDF via XeLaTeX
wordpress_id: '1810'
categories:
- Data
- Emacs
- Internet
- Nerdery
---

_Note (September 2013):_ Recent changes to Org-Mode since version 8 mean that the instructions here are no longer valid. My [Emacs Starter Kit for the Social Sciences](http://kieranhealy.org/resources/emacs-starter-kit.html) contains a more up-to-date export setup consistent with Org-Mode 8 and higher. The reason the instructions below were complicated was partly because of difficulties exporting with XeLaTeX but partly because I wanted---for perhaps irrational reasons---to preserve the ability to have different export pipelines for XeLaTeX and pdfLaTeX. At any rate, don't follow the instructions below. Look in the Starter Kit and the [supporting template files](https://github.com/kjhealy/latex-custom-kjh) for a currently useful setup.

While updating the [Starter Kit](http://kjhealy.github.com/emacs-starter-kit/) last week I ran into one of those setup issues that I really should be staying away from, but which turned out not to be too difficult to resolve. I use [Org-mode](http://orgmode.org/) mostly as a note-taker, outliner, and as a basic format for writing papers. (I don't really use any its todo-list functionality.) I like it because it is very good at exporting files to various formats, especially PDF (via latex) and HTML. The thing is, what if you want to use [XeLaTeX](http://en.wikipedia.org/wiki/XeTeX) to process your files, rather than pdfLaTeX? The org-mode manual says latex export is controlled by the `org-export-to-pdf-process` variable. As it notes, when creating a PDF file with latex,

> ... it usually takes several runs of 'pdflatex', maybe mixed with a call to 'bibtex' [to get references & bibliographies compiled properly]. Org does not have a clever mechanism to detect which of these commands have to be run to get to a stable result, and it also does not do any error checking. By default, Org uses 3 runs of 'pdflatex' to do the processing.

It goes on to say that you can replace this default with something else. And so this is what I did. I want org-mode to know when to use pdflatex and when to use xelatex, and I want it to do all the bibtex/recompiling stuff silently and intelligently, re-running as needed to get references right and so on. The solution, which is now in the Starter Kit, is inspired by [this post from Bruno Tavernier](http://www.mail-archive.com/emacs-orgmode@gnu.org/msg31328.html), where he provides a function to control running and re-running latex and bibtex as needed. In his version, the compile-recompile cycle is still controlled by org-mode. I made it simpler by getting org-mode to rely instead on [latexmk](http://www.phys.psu.edu/~collins/software/latexmk-jcc/), a script that manages latex compilation sensibly and automatically. It comes included with TeXLive, but the version included is not quite up-to-date enough for our needs. More recent versions have an option allowing you to specify which program to use when "pdflatex" is called. So, with version 4.20 or higher of Latexmk installed properly, and the TeXLive version disabled if necessary (by renaming it `latexmk.old`, say, you can put the following in your `~/.emacs.d/` or equivalent.


{{< highlight common-lisp >}}
    (require 'org-latex)
    (setq org-export-latex-listings t) 
    ;; Originally taken from Bruno Tavernier: \ http://thread.gmane.org/gmane.emacs.orgmode/31150/focus=31432
    ;; but adapted to use latexmk 4.20 or higher.  
    (defun my-auto-tex-cmd ()
      "When exporting from .org with latex, automatically run latex,
       pdflatex, or xelatex as appropriate, using latexmk."
      (let ((texcmd)))
      ;; default command: oldstyle latex via dvi
      (setq texcmd "latexmk -dvi -pdfps %f")        
      ;; pdflatex -> .pdf
      (if (string-match "LATEX_CMD: pdflatex" (buffer-string))
          (setq texcmd "latexmk -pdf %f"))
      ;; xelatex -> .pdf
      (if (string-match "LATEX_CMD: xelatex" (buffer-string))
          (setq texcmd "latexmk -pdflatex=xelatex -pdf %f"))
      ;; LaTeX compilation command
      (setq org-latex-to-pdf-process (list texcmd)))
      (add-hook 'org-export-latex-after-initial-vars-hook 'my-auto-tex-cmd)
      ;; Default packages included in every tex file, pdflatex or xelatex
      (setq org-export-latex-packages-alist
      '(("" "graphicx" t)
      ("" "longtable" nil)
      ("" "float" nil)))
      
      (defun my-auto-tex-parameters ()
      "Automatically select the tex packages to include."
      ;; default packages for ordinary latex or pdflatex export
      (setq org-export-latex-default-packages-alist
      '(("AUTO" "inputenc" t)
      ("T1"   "fontenc"   t)
      (""     "fixltx2e"  nil)
      (""     "wrapfig"   nil)
      (""     "soul"      t)
      (""     "textcomp"  t)
      (""     "marvosym"  t)
      (""     "wasysym"   t)
      (""     "latexsym"  t)
      (""     "amssymb"   t)
      (""     "hyperref"  nil)))
      
        ;; Packages to include when xelatex is used
        ;; (see https://github.com/kjhealy/latex-custom-kjh for the 
        ;; non-standard ones.)
        (if (string-match "LATEX_CMD: xelatex" (buffer-string))
            (setq org-export-latex-default-packages-alist
                  '(("" "fontspec" t)
                    ("" "xunicode" t)
                    ("" "url" t)
                    ("" "rotating" t)
                    ("" "memoir-article-styles" t)
                    ("american" "babel" t)
                    ("babel" "csquotes" t)
                    ("" "listings" nil)
                    ("" "listings-sweave-xelatex" nil)
                    ("svgnames" "xcolor" t)
                    ("" "soul" t)
                    ("xetex, colorlinks=true, urlcolor=FireBrick, plainpages=false, pdfpagelabels, bookmarksnumbered" "hyperref" nil)
                    )))
        
        (if (string-match "LATEX_CMD: xelatex" (buffer-string))
        (setq org-export-latex-classes
        (cons '("article"
        "\\documentclass[11pt,article,oneside]{memoir}
        \\input{vc}
        \\usepackage[style=authoryear-comp-ajs, abbreviate=true]{biblatex}
        \\bibliography{socbib}"
        ("\\section{%s}" . "\\section*{%s}")
        ("\\subsection{%s}" . "\\subsection*{%s}")
        ("\\subsubsection{%s}" . "\\subsubsection*{%s}")
        ("\\paragraph{%s}" . "\\paragraph*{%s}")
        ("\\subparagraph{%s}" . "\\subparagraph*{%s}"))
        org-export-latex-classes))))  
        
        (add-hook 'org-export-latex-after-initial-vars-hook 'my-auto-tex-parameters)

{{< /highlight >}}

The `my-auto-tex-cmd` function looks at your `.org` file and checks whether you've specified which latex to use. If there's no instructions, it just runs regular old latex. If it finds the string `LATEX_CMD: pdflatex` in your file, it runs pdflatex. If it finds `LATEX_CMD: xelatex`, it runs xelatex. Because control is handed off to latexmk, nothing else is needed: it takes care of figuring things out so that the references and citations are correct.

The second half of the code above specifies the latex packages that will be included in the `.tex` file. The variable `org-export-latex-packages-alist` specifies a list of packages that are always included in the header of latex documents, regardless of how they're compiled. The variable `org-export-latex-default-packages-alist` adds additional packages depending on whether latex/pdflatex or xelatex is being used. You can change the content of these as you like. Right now the latex/pdflatex case includes the same packages as org-mode's default setting. The xelatex case reflects my own particular setup (and includes some [small style files of my own](https://github.com/kjhealy/latex-custom-kjh). You should delete the reference to these if you want this to work out of the box.

The upshot is that when you want to export an `.org` file to PDF using XeLaTeX, you simply make sure the line `LATEX_CMD: xelatex` is in your `.org` file, then do `C-c C-e d` as usual, and org-mode, with latexmk in the background, does all the work for you. To specify particular fonts and ensure they are declared early enough so that everything is typeset as you intend, the header of your `.org` document should look something like this:

<script src="https://gist.github.com/795116.js"> </script>

Right now the only wrinkle is that you have to [download and install a current version of latexmk](http://www.phys.psu.edu/~collins/software/latexmk-jcc/) and move the old one out of the way, but I imagine in the near future TeXLive will come with version 4.20 or higher, and this step won't be needed.

I've pushed this to the `kjhealy.org` file in the [social sciences starter kit](https://github.com/kjhealy/emacs-starter-kit).

*Update*: A rewritten version of this post is now part of [the org-mode FAQ](http://orgmode.org/worg/org-faq.html#using-xelatex-for-pdf-export).
