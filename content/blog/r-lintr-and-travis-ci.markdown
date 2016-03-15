---
date: 2015-10-16T10:52:02-04:00
title: Using Containerized Travis-CI to check R in RMarkdown files
categories: [Data, Sociology, Nerdery, R]
---

I'm teaching a short graduate seminar on [Data Visualization with R](http://socviz.github.io/soc880/) this semester. Following [Matt Salganik](https://msalganik.wordpress.com/2015/06/09/rapid-feedback-on-code-with-lintr/), I wanted students to be able to submit homework or other assignments as [R Markdown](http://rmarkdown.rstudio.com) files, but to have a way to make sure their R code passed [some basic stylistic checks](http://en.wikipedia.org/wiki/Lint_%28software%29) provided by [lintr](https://github.com/jimhester/lintr) before they submitted it to me. Students write `.Rnw` files containing discussion or notes interspersed with chunks of R code. We just want to check the code meets some minimal level of syntactical and stylistic correctness. This makes it easier to read at the time and also easier to return to later. This is a useful habit to have beyond the context of homework assignments for a particular course, too.

When I write things in R locally I usually have `lintr` running in the background of my text editor. It's supported in RStudio, Emacs, Vim, and other editors, as detailed on the [lintr development page](https://github.com/jimhester/lintr) But the idea of linting via GitHub and Travis-CI is also appealing, especially when students are submitting assignments or code snippets on GitHub anyway. [Travis CI](https://travis-ci.org/) is a "continuous integration" service designed for much heavier lifting than I'm doing here. It's for software developers who want to check their code as they go, making sure it compiles and passes various tests. But we can use it to quickly check our code.

Two things have changed since Matt's helpful  [writeup](https://msalganik.wordpress.com/2015/06/09/rapid-feedback-on-code-with-lintr/) of the process, both of which make life easier. First, `lintr` can now check `.Rnw` files natively, so we don't have to write a script to manually extract the R code before linting it. Second, Travis can containerize builds so that they run faster. Containerization on Travis-CI means some aspects of the development environment are a more restrictive than they would otherwise be. But this doesn't matter to us right now.

Here's an example. We create a GitHub repository called [lintscreen](https://github.com/kjhealy/lintscreen) and set it up [so that Travis-CI will see it](https://travis-ci.org/getting_started). Travis's build environment is controlled by a configuration file called `.travis.yml` that lives in our repository. [Jan Tilly](http://jtilly.io/) has done all the hard work of configuring a [container-based R on Travis](https://github.com/jtilly/R-travis-container-example), so I just follow his example here. His configuration is intended for people writing R packages. We're just linting code, not running it, so things are more straightforward. Here's what `.travis.yml` looks like:

{{< highlight yaml >}}

# .travis.yml using container-based infrastructure
# travis configuration file courtesy of Jan Tilly:
# https://github.com/jtilly/R-travis-container-example

# use c as catch-all language
language: c

# use containers
sudo: false

# only run for pushes to master branch
branches:
  only:
   - master

# install R: use r-packages-precise (https://cran.r-project.org/bin/linux/ubuntu/precise/) 
# as source which is white listed (https://github.com/travis-ci/apt-source-whitelist/)
addons:
  apt:
    sources:
    - r-packages-precise
    packages:
    - r-base-dev	
    - r-recommended
    - pandoc

# cache local R libraries directory:
cache:
  directories:
    - ~/Rlib

# install the package and dependencies:
# - create directory for R libraries (if not already exists)
# - create .Renviron with location of R libraries
# - define R repository in .Rprofile
# - add .travis.yml to .Rbuildignore
# - install devtools if not already installed
# - install covr if not already installed
# - update all installed packages

install:
  - mkdir -p ~/Rlib
  - echo 'R_LIBS=~/Rlib' > .Renviron
  - echo 'options(repos = "http://cran.rstudio.com")' > .Rprofile
  - echo '.travis.yml' > .Rbuildignore
  - Rscript -e 'if(!"devtools" %in% rownames(installed.packages())) { install.packages("devtools", dependencies = TRUE) }'
  - Rscript -e 'if(!"covr" %in% rownames(installed.packages())) { install.packages("covr", dependencies = TRUE) }'
  - Rscript -e 'update.packages(ask = FALSE, instlib = "~/Rlib")'


# Lint
script:
  - ./travis-linter.sh

{{< /highlight >}}

As you can see in the "addons" and "install" segments, we get a whole R setup here, including all of `devtools` and the `covr` testing suite. We don't really need these for what we're doing, and so this configuration file could be simplified even more than I've already done. I've left them there partly to remind you that you can use this environment for more challenging coding tasks. In any event, once R is setup and the additional packages compiled in our container's local directory, we tell Travis (in the `script:`) section, to run a very simple shell script. It takes any `.Rmd` files in the top-level directory and puts them through `lintr`, returning a non-zero exit status if anything goes wrong. It looks like this:

{{< highlight bash >}}

#!/bin/bash
set -e

exitstatus=0

for file in *.Rmd
do
    Rscript -e "lintr::lint(\"$file\")"
    outputbytes=`Rscript -e "lintr::lint(\"$file\")" | grep ^ | wc -c`
    if [ $outputbytes -gt 0 ]
    then
        exitstatus=1
    fi
done

exit $exitstatus

{{< /highlight >}}

It's very straightforward, but a script like this can easily be extended to perform much more complicated tasks. Rscript is called twice so that you can see the output (if any) in your Travis log (the first call) and to generate the exit status that lets Travis decide whether your build has failed (the second call). (There's certainly got to be a more efficient way to do this than effectively linting the file twice. Probably I should just pipe the first to a file and `cat` the output if there is any, while setting the exit status at the same time.)

Over at Travis, you get the results of all of this activity on the log screen for your repository. The first time it runs it takes about ten minutes, because the local R packages have to be built. But then those packages get cached, so subsequent runs take less than a minute. When `lintr` finds something to complain about, the script exits with a status code of 1 so Travis says it failed. It looks like this:

{{% img src="https://www.kieranhealy.org/files/misc/lintscreen-fail.png" caption="A file fails to pass the lint check." alt="A file fails to pass the lint check." %}}

In this case, `lintr` is complaining that I've used `=` as an assignment operator in R instead of `<-`, in violation of the style rules. If we fix the errors in our text editor, commit the change in git, and push them to the repo, then Travis notices, reruns everything, and then gives you the good news.

{{% img src="https://www.kieranhealy.org/files/misc/lintscreen-pass.png" caption="Successfully passed." alt="Lint check successfully passed." %}}

The upshot is that if people are working with `.Rmd` files and using GitHub, they can set up Travis, drop the `.travis.yml` configuration and `travis-linter.sh` script into their repo,  and have Travis-CI automatically and quickly check their code before they submit it.
