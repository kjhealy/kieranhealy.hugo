---
title: Resources
description: Some useful tools and bits of software
type: page
---

<p><em>This page has links to configuration files, R packages, templates, and a few other things that might be of use to people who want to write (and give talks about) well-formatted social science papers using plain text tools.</em></p> 

<figure><img src="https://kieranhealy.org/files/misc/workflow-wide-v2.png"><figcaption>The Sausage Factory</figcaption></figure>


<div> <div> <h2><a href="http://plain-text.co">The Plain Person's
  Guide to Plain Text Social Science</a> &rarr;</h2> <p class = "clearfix"><a
  href="http://plain-text.co"><img src =
  "https://kieranhealy.org/files/misc/plaintext_cover_tiny.png"
  style="float: left; padding: 5px 10px 5px 3px;"></a> Available
  either as <a href =
  "http://kieranhealy.org/files/papers/plain-person-text.pdf">booklet</a>
  or as a <a href="http://plain-text.co">website</a>. As a beginning
  graduate student in the social sciences, what sort of software
  should you use to do your work? More importantly, what principles
  should guide your choices? This article offers some answers. The
  short version is: you should use tools that give you more control
  over the process of data analysis and writing. I recommend you write
  prose and code using a good text editor; analyze quantitative data
  with R or Stata; minimize error by storing your work in a simple
  format (plain text is best), and make a habit of documenting what
  you've done. For data analysis, consider using a format like
  Rmarkdown and tools like Knitr to make your work more easily
  reproducible for your future self. Use Pandoc to turn your
  plain-text documents into PDF, HTML, or Word files to share with
  others. Keep your projects in a version control system. Back
  everything up regularly. Make your computer work for you by
  automating as many of these steps as you can. To help you get
  started, I briefly discuss a drop-in set of useful defaults to get
  started with Emacs (a powerful, free text-editor), though I
  emphasize that there are many other alternatives. I share some
  templates and style files that can get you quickly from plain text
  to various output formats. And I point to several alternatives,
  because no humane person should recommend Emacs without presenting
  some other options as well.</p>

<h2>R Packages</h2>

<p class = "clearfix"><a href="http://kjhealy.github.io/socviz"><img src = "/files/misc/hex-socviz.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/socviz">socviz package</a> supports the <a href="https://www.amazon.com/Data-Visualization-Introduction-Kieran-Healy/dp/0691181624"><em>Data Visualization</em></a> book with a collection of datasets and utility functions to help you draw good graphs in R and ggplot. </p>

<p class = "clearfix"><a href="http://kjhealy.github.io/gssr"><img src = "/files/misc/hex-gssr.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/gssr">gssr package</a> provides the complete General Social Survey cumulative data file (1972-2018) and Three Wave Panel data files in an R-friendly format, together with their codebooks. </p>

<p class = "clearfix"><a href="http://kjhealy.github.io/nycdogs"><img src = "/files/misc/hex-nycdogs.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/nycdogs">nycdogs package</a> is a fun dataset (actually three separate tibbles: licenses, bites, and zip codes) taken from New York City's Open Data initiative, cleaned up and packaged for R. It's useful for teaching <a href ="http://dplyr.tidyverse.org">dplyr</a>, for drawing maps, and for seeing where dogs with particular names live. </p>


<p class = "clearfix"><a href="http://kjhealy.github.io/uscenpops"><img src = "/files/misc/hex-uscenpops.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/uscenpops">uscenpops package</a> contains a table of birth counts for the United States by year-of-age and sex for every year from 1900 to 2018.</p>


<p class = "clearfix"><a href="http://kjhealy.github.io/covdata"><img src = "/files/misc/hex-covdata.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/covdata">covdata package</a> contains data on reported cases of and deaths from COVID-19 from from a variety of sources. Amongst other things, the package provides (1) National-level case and mortality data from the ECDC, U.S. state-level case and morality data from the CDC and the New York Times, patient-level data from the CDC's public use dataset. (2) All-cause mortality and excess mortality data from the Human Mortality Database. (3) Mobility data from Apple. (4) Policy data from the <a href = "https://coronanet-project.org">CoronaNet Project</a>.

<p class = "clearfix"><a href="http://kjhealy.github.io/covmobility"><img src = "/files/misc/hex-covmobility.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/covmobility">covmobility package</a> is a companion to covdata and contains COVID-related mobility data released by Apple and Google.

<h2><a href="https://github.com/kjhealy/pandoc-templates">Pandoc Templates</a> &rarr;</h2>
<p>Some Pandoc templates meant to go in <code>~/.pandoc/templates</code>. Point to them directly from the command line, use them with what's provided in <a 
href="http://github.com/kjhealy/latex-custom-kjh"><code>latex-custom-kjh</code></a>, or use them as part of a Markdown or RMarkdown workflow. </p>

<h2><a href="http://github.com/kjhealy/latex-custom-kjh">LaTeX Templates and Styles</a> &rarr;</h2>
<p>A collection of LaTeX style files, templates, and org-mode documents providing some nice layouts for typesetting articles using pdfLaTeX or XeLaTeX. They make a pipeline that, for example, lets you begin with an 
<code>.org</code> file in Emacs (as set up in the <a href="http://kjhealy.github.com/emacs-starter-kit/">Starter Kit</a>), and go from there to a nice, fully-processed PDF in one step. Or the pieces can be used separately 
to set up a <code>.tex</code> file with a nice Article layout. However, these days I almost never write anything directly in LaTeX. Instead, these templates form part of a pipeline that stars with a Markdown or RMarkdown file and ends up as a HTML, Word, or PDF document.</p> 

<h2><a href="/resources/emacs-starter-kit"
    title="kjhealy/emacs-starter-kit @ GitHub">An Emacs Starter Kit
    for the Social Sciences</a></h2> <p>This is a much-changed fork of Eric
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
    can clone the repository</a>. I don't particularly recommend that anyone just starting out in the social sciences actively choose Emacs these days as their one and only text editor. There are many alternatives and the most important thing, in general, is that you get used to using a good text editor and then just learn the hell out of it. I've been using Emacs for decades and frankly I'm still not very good at it. But this is the setup I use myself, so it's available here. Caveat emptor.</p>


<h2><a href="http://github.com/kjhealy/kieranhealy.hugo/">So You Like My Website</a> &rarr;</h2>
<p>This site is produced using <a href="http://gohugo.io">Hugo</a>, a very fast static site generator, which you can <a href="http://gohugo.io/overview/introduction/">read more about here</a>. I've written about <a 
href="http://kieranhealy.org/blog/archives/2014/02/24/powered-by-hugo/">my own experience setting it up</a>, too, though the discussion there is now quite old. If you want to look 
under the bonnet, <a href="http://kjhealy.github.com/kieranhealy.hugo/" title="This website's source">the code for the entire site is on GitHub</a>, along with a fork of the <a href="https://github.com/kjhealy/hugo-theme-even">theme</a> the site uses. Fair warning: if you just want to set up a website with your research interests, contact information, and links to your publications, then there are <a href = "http://squarespace.com">many simpler and more straightforward options</a> you should seriously consider instead.</p>
        
  </div>

<div>
<div class = "clearfix">
<h2><a href="https://www.amazon.com/Data-Visualization-Introduction-Kieran-Healy/dp/0691181624">Data Visualization: A Practical Introduction</a> &rarr;</h2>
    <p><a href="https://www.amazon.com/Data-Visualization-Introduction-Kieran-Healy/dp/0691181624"><img src = "https://kieranhealy.org/files/misc/dv_cover_tiny.png" style="float: left; padding: 5px 10px 5px 3px;"></a> <em>Data Visualization: A Practical Introduction</em> is published by Princeton University Press. It introduces you to both the ideas and the methods of data visualization in a clear, sensible, and reproducible way, using R and ggplot2. It is accompanied by an <a href="http://kjhealy.github.io/socviz">R package</a> containing supporting materials for teaching and learning, including a variety of datasets, convenience functions, and an R Studio project file containing all the code for each of the book's chapters.
    </p>

</div>
<br />

<div class = "clearfix">
<h2 style="clear:right"><a href="https://kieranhealy.org/blog/archives/2018/03/24/making-slides/">Making Slides</a></h2>

<p><a href="https://kieranhealy.org/blog/archives/2018/03/24/making-slides/"><img src = "https://kieranhealy.org/files/misc/sampletalk_tiny.png" style="float: left; padding: 5px 10px 5px 3px;"></a> This is a short talk, originally given in my Departmental Proseminar, on the topic of giving presentations. I discuss how to think about your talk in general (and how to distinguish it from the paper you're taking about, on the one hand, and the slides you're showing people, on the other.) I then say some things about how to use slides to best get your point across.</p> 

<p> &nbsp; </p>
</div>

<h2><a href="http://kjhealy.github.com/kjh-vita/">So You Like My Vita</a> &rarr;</h2>
<p>Every few months I get an email asking to see the LaTeX markup that I use to generate my <a href="http://kieranhealy.org/vita.pdf">Curriculum Vitae</a>. So, <a href="http://kjhealy.github.com/kjh-vita/" 
title="kjhealy's kjh-vita @ GitHub">here it is</a>. Feel free to adapt it yourself. If you make stylistic modifications, I encourage you to fork the project on GitHub and make them available to others in the same way.</p>

<h2><a href="/resources/github/">All GitHub Projects</a></h2>
    <p>Here is a <a href="/resources/github/">full list of the various public code and data repositories</a> that I have put on GitHub. They range from the configuration and templating tools listed above to data 
visualization exercises and other bits of data analysis, mostly written in R. 
  </div>
</div>
</div>
</div>
</div>

