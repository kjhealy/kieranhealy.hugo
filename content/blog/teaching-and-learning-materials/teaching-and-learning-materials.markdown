---
title: "Teaching and Learning Materials for Data Visualization"
date: 2018-12-12T13:12:25-05:00
categories: [R,data,visualization,Sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


{{% figure src="https://kieranhealy.org/files/misc/dv-cover-pupress.jpg" alt="Data Visualization cover" caption="" %}}

[Data Visualization: A Practical Introduction](https://www.amazon.com/Data-Visualization-Introduction-Kieran-Healy/dp/0691181624) will begin shipping next week. I've written an R package that contains datasets, functions, and a course packet to go along with the book. The `socviz` package contains about twenty five datasets and a number of utility and convenience functions. The datasets range in size from things with just a few rows (used for purely illustrative purproses) to datasets with over 120,000 observations, for practicing with and exploring. 

A course packet is also included the package. This is a zipped file containing an [R Studio](http://rstudio.com) project consisting of nine [R Markdown](http://rmarkdown.rstudio.com) documents that parallel the chapters in the book. They contain the code for almost all the figures in the book (and a few more besides). There are also some additional support files, to help demonstrate things like reading in your own data locally in R.

## Installing the package

To install the package, you can follow the instructions in the Preface to the book. Alternatively, first download and install R for [MacOS](https://cran.r-project.org/bin/macosx/), [Windows](https://cran.r-project.org/bin/windows/) or [Linux](https://cran.r-project.org/bin/linux/), as appropriate. Then download and install [RStudio](http://rstudio.com/download/). Launch RStudio and then type the following code at the Console prompt (`> `), hitting return at the end of each line:

{{< code r >}}
my_packages <- c("tidyverse", "fs", "devtools")
install.packages(my_packages)
{{< /code >}}

Then install the `socviz` library, either from CRAN, the main R repository (this is the recommended way):

{{< code r >}}
install.packages("socviz")
{{< /code >}}

Or, if you want the development version, from GitHub:

{{< code r >}}
devtools::install_github("kjhealy/socviz")
{{< /code >}}

Once everything has downloaded and been installed, load the `socviz` package: 

{{< code r >}}
library(socviz)
{{< /code >}}

## The Course Packet

The supporting materials are contained in a compressed `.zip` file. To extract them to your Desktop, make sure the `socviz` package is loaded as described above. Then do something like this:

{{< code r >}}
setup_course_notes(folder = "~/Desktop")
{{< /code >}}

If you're using a Mac, this will copy the `dataviz_course_notes.zip` file to your Desktop, and uncompress it into a folder called `dataviz_course_notes`. Double-click the file named `dataviz.Rproj` to launch the project as a new RStudio session. If you want to uncompress the file somewhere other than your Desktop, e.g. your Documents folder, you can do this:

{{< code r >}}
setup_course_notes(folder = "~/Documents")
{{< /code >}}



The source code for `socviz` is [available on GitHub](https://github.com/kjhealy/socviz). I plan on continuing to update and improve it as I use it myself in my own classes and workshops.
