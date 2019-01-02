---
title: "Dataviz Course Packet Quickstart"
date: 2019-01-02T15:20:31-05:00
categories: [R,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Chapter 2 of [Data Visualization](https://amzn.to/2vfAixM) walks you through setting up an R Project, and takes advantage of R Studio's support for RMarkdown templates. That is, once you've created your project in R Studio, can choose File > New File > R Markdown, like this:


{{% figure src="http://kieranhealy.org/files/misc/rstudio_rmarkdown.png" alt="R Studio menu" caption="Select R Markdown ..." %}}

And then choose "From Template" on the left side of the dialog box that pops up, and select the "Data Visualization Notes" option on the right: 

{{% figure src="http://kieranhealy.org/files/misc/rstudio_template_dialog.png" alt="R Studio menu" caption="Pick a Template" %}}

Unfortunately, this option isn't showing up for some users, due to a now-fixed error in the `socviz` library. If you run `install_github("kjhealy/socviz")` again from the console, you will get the newer version that fixes this issue.

There's also an alternative and very quick way to get a project and notes files up and running. From the console, first make sure the `socviz` package is loaded:

{{< highlight r >}}
library(socviz)
{{< /highlight >}}

Then, do this: 

{{< highlight r >}}
setup_course_notes()
{{< /highlight >}}

This will copy and unzip a folder to your Desktop containing an R project with a set of Rmarkdown files that are ready to be used to take notes with. You'll get a message that looks something like this: 

``` r
Copied dataviz_course_notes.zip to /Users/kjhealy/Desktop and expanded it into /Users/kjhealy/Desktop/dataviz_course_notes
```

Your user name will most likely be different, and the destination shown may be different also depending on what kind of computer you are using. 

Once it has been created, you can navigate to that `dataviz_course_notes` folder and open it. Inside will be a `dataviz` folder that looks like this:


{{% figure src="http://kieranhealy.org/files/misc/dataviz_notes_listing.png" alt="R Studio menu" caption="Contents of the course packet." %}}

Double-click on the `dataviz.Rproj` file and you should be good to go.
