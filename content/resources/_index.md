---
type: page
title: "Resources"
---

<p><em>This page has links to configuration files, templates, and a few other things that might be of use to people who want to write (and give talks about) well-formatted social science papers using plain text tools.</em></p> 

<figure><img src="https://kieranhealy.org/files/misc/workflow-wide-tx.png"><figcaption>The Sausage Factory</figcaption></figure>


<div class="units-row"> <div class="unit-50"> <h4><a
  href="http://plain-text.co">The Plain Person's Guide to Plain Text
  Social Science</a> &rarr;</h4> <p><a
  href="http://plain-text.co"><img src = "https://kieranhealy.org/files/misc/plaintext_cover_tiny.png" style="float: left; padding: 5px 10px 5px 3px;"></a> Available either as <a href = "http://kieranhealy.org/files/papers/plain-person-text.pdf">booklet</a> or as a <a href="http://plain-text.co">website</a>. As a
  beginning graduate student in the social sciences, what sort of
  software should you use to do your work? More importantly, what
  principles should guide your choices? This article offers some
  answers. The short version is: you should use tools that give you
  more control over the process of data analysis and writing. I
  recommend you write prose and code using a good text editor; analyze
  quantitative data with R or Stata; minimize error by storing your
  work in a simple format (plain text is best), and make a habit of
  documenting what you've done. For data analysis, consider using a
  format like Rmarkdown and tools like Knitr to make your work more
  easily reproducible for your future self. Use Pandoc to turn your
  plain-text documents into PDF, HTML, or Word files to share with
  others. Keep your projects in a version control system. Back
  everything up regularly. Make your computer work for you by
  automating as many of these steps as you can. To help you get
  started, I briefly discuss a drop-in set of useful defaults to get
  started with Emacs (a powerful, free text-editor). I share some
  templates and style files that can get you quickly from plain text
  to various output formats. And I point to several alternatives,
  because no humane person should recommend Emacs without presenting
  some other options as well.</p>


<h4><a href="/resources/emacs-starter-kit"
    title="kjhealy/emacs-starter-kit @ GitHub">An Emacs Starter Kit
    for the Social Sciences</a></h4> <p>This is a fork of Eric
    Schulte's <a
    href="http://github.com/eschulte/emacs-starter-kit/tree">Emacs
    Starter Kit</a> (itself an offshoot of <a
    href="http://github.com/eschulte/emacs-starter-kit/tree">Phil
    Hagelberg's original</a>) with additional tools included for
    social scientists, mostly related to writing books or papers in
    LaTeX and analyzing quantitative data using <a
    href="http://ess.r-project.org/">ESS</a> and <a
    href="http://www.r-project.org/">R</a>. The goal is to provide a
    drop-in configuration for Emacs that makes it easier to use right
    from the get-go. If you know about <a href="http://git-scm.com/"
    title="Git - Fast Version Control System">Git</a>, <a
    href="http://github.com/kjhealy/emacs-starter-kit/tree/master"
    title="kjhealy's emacs-starter-kit at master &mdash; GitHub">you
    can clone the repository</a>.</p>
    
<h4><a href="https://amzn.to/2vfAixM">Data Visualization: A Practical Introduction</a> &rarr;</h4>
    <p><a href="https://amzn.to/2vfAixM"><img src = "https://kieranhealy.org/files/misc/dv_cover_tiny.png" style="float: left; padding: 5px 10px 5px 3px;"></a> <em>Data Visualization: A Practical Introduction</em> is published by Princeton University Press. It introduces you to both the ideas and the methods of data visualization in a clear, sensible, and reproducible way, using R and ggplot2. It is accompanied by an <a href="http://kjhealy.github.io/socviz">R package</a> containing supporting materials for teaching and learning, including a variety of datasets, convenience functions, and an R Studio project file containing all the code for each of the book's chapters.
    </p>
    
  </div>

<div class="unit-50">
<h4><a href="http://github.com/kjhealy/latex-custom-kjh">LaTeX Templates and Styles</a> &rarr;</h4>
<p>A collection of LaTeX style files, templates, and org-mode documents providing some nice layouts for typesetting articles using pdfLaTeX or XeLaTeX. They make a pipeline that lets you begin with an 
<code>.org</code> file in Emacs (as set up in the <a href="http://kjhealy.github.com/emacs-starter-kit/">Starter Kit</a>), and go from there to a nice, fully-processed PDF in one step. Or the pieces can be used separately 
to set up a <code>.tex</code> file with a nice Article layout.</p>  

<h4><a href="https://github.com/kjhealy/pandoc-templates">Pandoc Templates</a> &rarr;</h4>
<p>Some Pandoc templates meant to go in <code>~/.pandoc/templates</code>. Point to them directly with the <code>--template</code> or <code>--css</code> switches as appropriate, and use them with what's provided in <a 
href="http://github.com/kjhealy/latex-custom-kjh"><code>latex-custom-kjh</code></a>. Includes a shell script for setting pandoc up to work with the <a href="http://marked2app.com">Marked</a> app, a handy HTML live 
previewer for <code>.md</code> files.
</p>

<h4><a href="https://kieranhealy.org/blog/archives/2018/03/24/making-slides/">Making Slides</a></h4>

<p><a href="https://kieranhealy.org/blog/archives/2018/03/24/making-slides/"><img src = "https://kieranhealy.org/files/misc/sampletalk_tiny.png" style="float: left; padding: 5px 10px 5px 3px;"></a> This is a short talk, originally given in my Departmental Proseminar, on the topic of giving presentations. I discuss how to think about your talk in general (and how to distinguish it from the paper you're taking about, on the one hand, and the slides you're showing people, on the other.) I then say some things about how to use slides to best get your point across.</p> 

<h4><a href="http://kjhealy.github.com/kjh-vita/">So You Like My Vita</a> &rarr;</h4>
<p>Every few months I get an email asking to see the LaTeX markup that I use to generate my <a href="http://kieranhealy.org/vita.pdf">Curriculum Vitae</a>. So, <a href="http://kjhealy.github.com/kjh-vita/" 
title="kjhealy's kjh-vita @ GitHub">here it is</a>. Feel free to adapt it yourself. If you make stylistic modifications, I encourage you to fork the project on GitHub and make them available to others in the same way.</p>

<h4><a href="http://github.com/kjhealy/kieranhealy.hugo/">So You Like My Website</a> &rarr;</h4>
<p>This site is produced using <a href="http://gohugo.io">Hugo</a>, a very fast static site generator, which you can <a href="http://gohugo.io/overview/introduction/">read more about here</a>. I've written about <a 
href="http://kieranhealy.org/blog/archives/2014/02/24/powered-by-hugo/">my own experience setting it up</a>, too. The design is borrowed mostly from <a href="http://consequently.org/">Greg Restall</a>. If you want to look 
under the bonnet, <a href="http://kjhealy.github.com/kieranhealy.hugo/" title="This website's source">the entire site is on GitHub</a>. Feel free to adapt it yourself. If you make stylistic modifications, I encourage you 
to fork the project on GitHub and make them available to others in the same way. You should also change the Google Analytics information in the footer partial, or I will receive analytics information about your site.</p>

    
    <h4><a href="/resources/github/">All GitHub Projects</a></h4>
    <p>Here is a <a href="/resources/github/">full list of the various public code and data repositories</a> that I have put on GitHub. They range from the configuration and templating tools listed above to data 
visualization exercises and other bits of data analysis, mostly written in R. 
  </div>
</div>
</div>
</div>
</div>
