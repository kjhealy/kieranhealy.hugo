---
title: "Plain Text, Papers, Pandoc"
date: "2014-01-23"
slug: plain-text
categories: [Sociology,IT,Nerdery,R]
---

Over the past few months, I've had several people ask me about the tools I use to put papers together. I maintain a page of [resources](http://kieranhealy.org/resources/) somewhat grandiosely headed "Writing and Presenting Social Science". Really it just makes public some configuration files and templates for my text editor and related tools. Things have changed a little recently---which led to people asking the questions---so I will try to lay out the current setup here. I will also try to avoid veering off into generalized noodling about the nature of writing or creativity. ([That's fine for Merlin](http://www.thatsfineformerlin.com).) This is mostly because although I am not a bad writer, I am an excellent procrastinator, and it is embarrassing to write about how to write papers when you could be actually writing papers. My excuse today is that I have a headcold.

So, first I will say a little bit about the general problem, and then I will tell you something  specific: how to take the draft of a scholarly paper, typically including bibliographical references, figures, and the results of some data analysis, and turn it into nice-looking PDF and HTML output. The hopefully redeeming thing about this discussion is that it will help you use the [various resources](http://kieranhealy.org/resources/) I make available for doing this. If you want to copy what I do, you should be able to.


## What's the problem?
The problem is that doing scholarly work is intrinsically a mess. There's the annoying business of getting ideas and writing them down, of course, but also everything before, during, and around it: data analysis and all that comes with it, and the tedious but unavoidable machinery of scholarly papers---especially citations and references. There is a lot of keep track of, a lot to get right, and a lot to draw together at the time of writing. Academic papers are by no means the only form of writing subject to constraints of this sort. Consider [this extremely sensible discussion](http://www.leancrew.com/all-this/2013/12/a-free-distraction/) by Dr Drang, a consulting engineer and blogger you should be reading:

> I don’t write fiction, but I can imagine that a lot of fiction writing can be done without any reference materials whatsoever. Similarly, a lot of editorials and opinion pieces are remarkably fact-free; these also can spring directly from the writer’s head. But the type of writing I typically do—mostly for work, but also here—is loaded with facts. I am constantly referring to photographs, drawings, experimental test results, calculations, reports written by others, textbooks, journal articles, and so on. These are not distractions; they are essential to the writing process.
> 
> And it’s not just reference material. Quite often I need to make my own graphs and drawings to include in a report. Because the text and the graphics are all part of a coherent whole, I need to go back and forth between the two; the words inform the pictures and the pictures inform the words. This is not the Platonic ideal of a clean writing environment—a cup of coffee on an empty desk in a white room—that you see in videos for distraction-free editors.
>
> Some of the popularity of these editors is part of the backlash against multitasking, but people are confusing themselves with their computers. When I’m writing a report, that is my single task, and I bring to bear whatever tools are necessary to complete it. That my computer is multitasking by running many programs simultaneously isn’t a source of confusion or distraction, it’s the natural and efficient way for me to get my one task done.

A lot of academic writing is just like this. It is difficult to manage. It's even worse when you have collaborators and other contributors. So, what to do?

## The Office Model and the Engineering Model 
Let me make a crude distinction. There are "Office Type" solutions to this problem, and there are "Engineering Type" solutions. Please don't get hung up on the distinction or the labels. Office solutions tend towards a cluster of tools where something like Microsoft Word is at the center of your work. A Word file or set of files is the most "real" thing in your project. Changes to your work are tracked inside that file or files. Citation and reference managers plug into them. The outputs of data analyses---tables, figures---get dropped into them or kept alongside them. The master document may be passed around from person to person or edited and updated in turn. The final output is exported from it, perhaps to PDF or to HTML, but maybe most often the final output just *is* the `.docx` file, cleaned up and with the track changes feature turned off.

In the Engineering model, meanwhile, plain text files are at the center of your work. The most "real" thing in your project will either be those files or, more likely, the Git, Mercurial, or SVN repository that controls the project. Changes are tracked outside the files. Data analysis is managed in code that produces outputs in (ideally) a known and reproducible manner. Citation and reference management will likely also be done in plain text, as with a BibTeX `.bib` file. Final outputs are assembled from the plain text and turned to `.tex`, `.html`, or `.pdf` using some kind of typesetting or conversion tool. Very often, because of some unavoidable facts about the world, the final output of this kind of solution is also a `.docx` file.

This distinction is meant to capture a tendency in organization, not a rigid divide---still less a sort of personality. Obviously it is possible organize things on the Office model. (Indeed, it's the dominant way.) Applications like [Scrivener](http://www.literatureandlatte.com), meanwhile, combine elements of the two approaches. Scrivener embraces the "bittyness" of large writing projects in an effective way, and can spit out clean copy in a variety of formats. Scrivener is built for people writing lengthy fiction (or qualitative non-fiction) rather than anything with quantitative data analysis, so I have never used it extensively. Microsoft Word, meanwhile, still rules large swathes of the Humanities and the Social Sciences, and the production process of many publishers. So even if you prefer plain text for other reasons---especially in connection with project management and data analysis---the routine need or obligation to provide a Word document to someone is one of the main reasons to want to be able to easily convert things. HTML is a great lingua franca.

I'm more or less stuck in the Engineering model. Yet, the two most recent papers I had a hand in were both co-authored. The [first](http://kieranhealy.org/files/papers/classification-situations.pdf) was written mostly in plain text. My [co-author](http://marionfourcade.org) was far away in either France or California for most of the process, and so we worked in [Editorially](https://editorially.com), a very nice service that allows people to humanely collaborate on documents written in [Markdown format](http://en.wikipedia.org/wiki/Markdown). The paper had to be converted to Word at the end, as per the demands of the Journal it appeared in. The [second paper](http://kieranhealy.org/files/papers/data-visualization.pdf) was written with a colleague whose office is upstairs from mine. It was a Word file from beginning to end, because that was just easier to manage given how my coauthor organizes his work. There's little to be gained from plain-text dogmatism in a `.docx` world.

When I write things by myself, or co-author with someone I can
imperiously boss around, I write everything in plain text. In the past---e.g. for my dissertation, and my [book](http://www.amazon.com/Last-Best-Gifts-Altruism-Market/dp/0226322378)---I wrote everything in LaTeX, which led to the early resources I posted. These were some [custom LaTeX templates and style files](https://github.com/kjhealy/latex-custom-kjh) meant to produce good-looking PDFs. These days I try to write in Markdown, because in principle it is simpler and more easily convertible to many different formats. Which brings me, finally, to the nominally useful part of this post.

## What I want to do
I write sociology papers. Those papers cite books and articles. They often incorporate tables and figures created in [R](http://www.r-project.org). What I want to do is quickly turn a markdown file containing things like that into a properly formatted scholarly paper, without giving up any of the typographical quality or necessary scholarly apparatus (on the output side) or the convenience and convertibilty of markdown (on the input side). Most directly, I want to easily produce good-looking output from the same source in both HTML and PDF formats. And I want to do that with an absolute minimum of---ideally, *no*---post-processing of the output beyond that basic conversion step.

For transforming a mixture of R code and text into a markdown file, where the code chunks are replaced by their output, the tool of choice is Yihui Xie's [knitr](http://yihui.name/knitr/). For converting markdown to HTML and PDF, the best thing available is John MacFarlane's superb [Pandoc](http://johnmacfarlane.net/pandoc/). Pandoc can convert plain text in several markup formats into many output formats. Now, managing citations and references---including internal references, such as Figure, Table, and Equation numbering---has long been the Achilles heel of workflows built around "lightweight" markup formats like markdown. It was one of the places where LaTeX really worked much better, especially in conjunction with the editing facilities of something like [AucTeX](https://www.gnu.org/software/auctex/) and [RefTeX](http://www.gnu.org/software/auctex/reftex.html). Markdown is simply not designed to manage the machinery of academic papers or scholarly books. That isn't what it was made to do. This fact has long kept me from being able to use it as extensively as I'd like. But thanks to John's (and other contibutors') continuing and stellar work on pandoc, the balance has begun to shift. 

Here is the document flow we want:

{{% figure src="https://kieranhealy.org/files/misc/workflow-rmd-md.png" alt="Workflow diagram" caption="I promise this is less insane than it appears" %}}


<!-- {{% img src="https://kieranhealy.org/files/misc/workflow-rmd-md.png" %}} -->
<!-- <h5>I promise this is less insane than it appears</h5> -->

There are still limitations to what markdown and pandoc can conveniently do. But being able to produce good HTML, LaTeX, and PDF in one step from the same source is a very attractive prospect.

## How I almost do it
Describing this all at once will probably make it sound a little crazy. But, at bottom, there are just two separable pieces: knitr converts `.Rmd` files to `.md` files, and pandoc converts `.md` files to HTML, .tex, and PDFs. In both cases we use a few switches, templates and configuration files to do that nicely. If you are like me, you probably have most or all of these tools installed anyway, and you are using them separately for different things. The thing is just to connect them a little. I assume you have you have a standard set of unix command-line tools available (e.g. Apple's developer tools), along with R, knitr, pandoc, and a TeX distribution. Note that the default set-ups for knitr and pandoc---the two key pieces of the process---will do most of what we want with no further tweaking. What I'm showing you here are just the relevant options to use and switches to set for these tools, together with some templates and document samples showing how nice-looking output can be produced in practice.

I write everything in Emacs, but that doesn't matter. Use whatever text editor you like and just learn the hell out of it. My [Emacs Starter Kit for the Social Sciences](http://kieranhealy.org/resources/emacs-starter-kit.html) sets up Emacs to be aware of the tools discussed here. For present purposes, one of its nice features is that it turns on RefTeX mode for markdown files, and lets you easily cite items from your `.bib` file in the format pandoc expects. But, again, the text editor doesn't matter.

The [custom LaTeX style files](https://github.com/kjhealy/latex-custom-kjh) were originally put together to let me write nice-looking `.tex` files directly, but now they just do their work in the background. Pandoc will use them when it converts things to PDF. The heavy lifting is done by the [org-preamble-pdflatex.sty](https://github.com/kjhealy/latex-custom-kjh/tree/master/needs-org-mode)  and [memoir-article-styles](https://github.com/kjhealy/latex-custom-kjh/tree/master/needs-memoir) files. If you install these files where LaTeX can find them---i.e., if you can compile a LaTeX document [based on this example](https://github.com/kjhealy/latex-custom-kjh/blob/master/templates/basic/article.tex)---then you are good to go. My [BibTeX master file](https://github.com/kjhealy/socbibs) is also available, but you will probably want to use your own, changing references to it in the templates as appropriate. Second, we have the custom pandoc stuff. [Here is the repository for that](https://github.com/kjhealy/pandoc-templates). Much of the material there is designed to go in the `~/.pandoc/` directory, which is where pandoc expects to find its configuration files.

Inside the pandoc-templates repository there's a [folder with some examples](https://github.com/kjhealy/pandoc-templates/tree/master/examples) of how these pieces go together. Let's start with a straightforward markdown file---no R code yet, so nothing above the `article.md` line in the picture above. The sample `article-markdown.md` file looks like this: 

{{< highlight yaml >}}

---
title: A Pandoc Markdown Article Starter
author:
- name: Kieran Healy
  affiliation: Duke University
  email: kjhealy@soc.duke.edu
- name: Joe Bloggs
  affiliation: University of North Carolina, Chapel Hill
  email: joebloggs@unc.edu
date: January 2014
abstract: Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
bibliography: <!-- \bibliography{/Users/kjhealy/Documents/bibs/socbib-pandoc.bib} This is a hack for Emacs users so that RefTeX knows where your bibfile is, and you can use RefTeX citation completion in your .md files. -->
...

# Introduction
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua [@fourcade13classsituat]. Notice that citation there [@healy02digittechnculturgoods]. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 

# Theory
Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enimad minim veniam, quis nostrud

{{< /highlight >}}

The bit at the top is YAML metadata, which pandoc understands. The HTML and latex templates [in the pandoc-templates repository](https://github.com/kjhealy/pandoc-templates/tree/master/templates) are set up to use this metadata properly. Pandoc will take care of the citations directly. There is more than one way to have pandoc manage citations, but here we just use the most self-contained route. (The `bibliography` line is not needed by pandoc at all: it is a hack to allow RefTeX to easily insert citations in the document while editing in Emacs.) The [Makefile](https://github.com/kjhealy/pandoc-templates/blob/master/examples/Makefile) in the examples directory will convert any markdown files in the working directory to HTML, .tex, and PDF output. Just type `make` at the terminal. If things go as they should, the HTML output from the example will look like this:

{{% figure src="https://kieranhealy.org/files/misc/pandoc-template-html-output-sample.png" caption="HTML output from Pandoc" %}}


The PDF output, meanwhile, [can be viewed here](http://kieranhealy.org/files/misc/article-markdown.pdf). Both look quite nice. The relevant sections of the Makefile show the pandoc commands that generate the output files from the markdown input. The Makefile section for producing PDF output looks like this:

{{< highlight bash >}}

pandoc -r markdown+simple_tables+table_captions+yaml_metadata_block -s -S --latex-engine=pdflatex --template=$(PREFIX)/templates/latex.template --filter pandoc-citeproc --csl=$(PREFIX)/csl/$(CSL).csl --bibliography=$(BIB)

{{< /highlight >}}

This contains some variables that are set at the top of the Makefile. On my computer, the command as actually executed looks like this:

{{< highlight bash >}}

pandoc -r markdown+simple_tables+table_captions+yaml_metadata_block -s -S --latex-engine=pdflatex --template=/Users/kjhealy/.pandoc/templates/latex.template --filter pandoc-citeproc --csl=/Users/kjhealy/.pandoc/csl/apsr.csl --bibliography=/Users/kjhealy/Documents/bibs/socbib-pandoc.bib

{{< /highlight >}}

Your version would vary depending on the location of the templates and bibliography files. This is what you would run from the command line if you wanted to take a markdown file and use pdflatex to turn it in to a PDF, using the [APSR](https://www.apsanet.org/utils/journal.cfm?Journal=APSR) reference style, my latex template, and a `.bib` file called `socbib-pandoc.bib`.

The pandoc `latex.template` and `xelatex.template` files differ mainly in the way they set up typefaces. The beginning of the `latex.template` file has the following lines:

{{< highlight latex >}}

\documentclass[11pt,article,oneside]{memoir}
\usepackage[minion]{org-preamble-pdflatex}
\input{vc}

{{< /highlight >}}

If you do not have the Minion Pro fonts installed and available to LaTeX, remove the `[minion]` option from the section line. (You can [read more about getting Minion Pro and installing it for LaTeX here](http://kieranhealy.org/blog/archives/2012/11/10/installing-minion-pro/).) If you do not use `vc.sty` then comment out or delete the third line. Similarly, if you use XeLaTeX rather than pdfLaTeX, tell pandoc to use `xelatex.template` and `--latex-engine=xelatex`. Inside [xelatex.template](https://github.com/kjhealy/pandoc-templates/blob/master/templates/xelatex.template) make sure the font selections after the `\begin{document}` declaration are for typefaces you have installed. 


The examples directory [also includes](https://github.com/kjhealy/pandoc-templates/blob/master/examples/article-knitr.Rmd) a sample `.Rmd` file. The code chunks in the file provide examples of how to generate tables and figures in the document. In particular they show some useful options that can be passed to knitr. [Consult the knitr project page](http://yihui.name/knitr/) for extensive documentation and many more examples. To produce output from the `article-knitr.Rmd` file, launch R in the working directory, load knitr, and process the file. You will also need the `ascii`, `memisc`, and `ggplot2` libraries to be available.

{{< highlight r >}}

library(knitr)
knit("article-knitr.Rmd")

{{< /highlight >}}

If things are working properly, then a markdown file called `article-knitr.md` will be produced, together with some graphics in the `figures/` subfolder and some working files in the `cache/` folder. We set things up in the `.Rmd` file so that knitr produces both PNG and PDF versions of whatever figures are generated by R. That prepares the way for easy conversion to HTML and LaTeX. Once the `article-knitr.md` file is produced, HTML, .tex, and PDF versions of it can be produced as before, by typing `make` at the command line. You can also run the pandoc commands manually, of course, or run pandoc from inside R via knitr's `pandoc()` helper function, or set your editor up to run `make` for you as needed, if it can do that.


{{% figure src="https://kieranhealy.org/files/misc/pandoc-template-rmd-output-sample.png" caption="Sample PDF output from an Rmd file, with figures and tables generated automatically. Click the image for a PDF version" link="http://kieranhealy.org/files/misc/article-knitr.pdf" %}}


## Using Marked
In everyday use,  I find Brett Terpstra's [Marked.app](http://marked2app.com) to be a very useful way of previewing text while writing. Marked shows you your markdown files as HTML, updating on the fly whenever the file is saved. It supports pandoc as a custom processor. Essentially, you tell it to run a pandoc command like the one above to generate its previews, instead of its built-in markdown processor. You do this in the "Behavior" tab of Marked's preferences.


{{% figure src="https://kieranhealy.org/files/misc/Marked2-preferences.png" caption="Marked's Preference dialog" %}}



The "Path" field contains the full path to pandoc, and the "Args" field contains all the relevant command switches---in my case, as above,

{{< highlight bash >}}

-r markdown+simple_tables+table_captions+yaml_metadata_block -w html -S --template=/Users/kjhealy/.pandoc/templates/html.template --filter pandoc-citeproc --bibliography=/Users/kjhealy/Documents/bibs/socbib-pandoc.bib 

{{< /highlight >}}

When editing your markdown file in your favorite text editor, you point Marked at the file and get a live preview. Like this:

{{% figure src="https://kieranhealy.org/files/misc/Marked2-Preview.png" caption="Previewing in HTML with Marked"%}}



You can add the [CSS files in the pandoc-templates repo](https://github.com/kjhealy/pandoc-templates/blob/master/marked/kultiad-serif.css) to the list of Custom CSS files Marked knows about, via the "Style" tab in the Preferences window. That way, Marked's preview will look the same as the HTML file that's produced. 

The upshot of all of this is powerful editing using Emacs, [ESS](http://ess.r-project.org), R, and other tools; flexible conversion using pandoc; quick and easy previewing via HTML and Marked; and high-quality PDF typesetting at the same time (or whenever needed)---all generated directly from plain text and including almost all of what most of the scholarly papers I write need to include. While this may seem quite complex when laid out in this way, from my point of view the result is very straightforward. I just live in my text editor, the various scripts and settings do their work quietly, as they should, and I get the formatted output I want. 

## Envoi
Writing academic papers is a pain. The tools for processing documents and integrating data, code, text, and reference material are by now extremely powerful. The main stumbling block is figuring out how to join these tools together while preserving the things academic papers need to have included. I am not the sort of person who codes tools like this. Rather, I'm the sort of user who gets a bee in his bonnet about getting the output to look just so. Hence the [resources page](http://kieranhealy.org/resources/). Now you, too, dear reader, are empowered to set up your writing environment in an excessively picky fashion, should you irrationally so desire.
