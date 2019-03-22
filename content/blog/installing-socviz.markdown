---
title: "Installing Socviz"
date: 2019-03-12T14:14:28-04:00
categories: [Visualization,R]
footnotes: false
htmlwidgets: false
mathjax: false
---

I've gotten a couple of reports from people having trouble installing the `socviz` library that's meant to be used with *[Data Visualization: A Practical Introduction](https://amzn.to/2vfAixM)*. As best as I can tell, the difficulties are being caused by GitHub's rate limits. The symptom is that, after installing the `tidyverse` and `devtools` libraries, you try `install_github("kjhealy/socviz")` and get an error something like this:

```{r}

Error in utils::download.file(url, path, 
method = download_method(), quiet = quiet():
cannot open URL https://api.github.com/repos/kjhealy/socviz/tarball/master

```

If this is the problem you have, this post explains what's happening and provides a solution. (In fact, several solutions.)


### Explanation

When you download and install a package from GitHub via R or RStudio, you use their "API", or application programming interface. This is just a term for how a website allows applications to interact with it. APIs standardize various requests that applications can make, for example, or provide a set of services in a form that can be easily integrated into an application's code. This is needed because apps are not like people clicking buttons on a web page, for example. One of the main things APIs do is impose rules about how much and how often applications can interact with them. Again, this is needed because apps can slurp up information much faster than people clicking links. This is called "rate limiting". By default, if you do not have a (free) GitHub account, your rate limit will be quite low and you will be temporarily cut off. 


### What you can do

You have three options. 

**Option 1** Wait until tomorrow and try again. The rate limit will reset, and it should work again. But you will likely keep having this sort of problem if you use GitHub regularly. You may also not want to wait. 


**Option 2** Download and install the package manually, from my website rather than GitHub. Click on this link: https://kieranhealy.org/files/misc/socviz_0.8.9000.tar.gz

This will download a .tar.gz file to your computer. Open R Studio and choose Tools > Install Packages … In the dialog box that comes up, select "Package Archive File" like this:

{{% figure src="https://kieranhealy.org/files/misc/package-select.png" alt="Package select" caption="Package selection dialog" %}}

Then navigate to the file, choose it, and select "Install". The `socviz` package should now be available via `library(socviz)`. The downside to this solution is that you won't be able to get updates to the package easily later on, and you'll still run into rate limits with other packages. 
  
  
**Option 3** The third option is a tiny bit more involved, but is the best one. [Create a user account](https://github.com/join) on GitHub, and then obtain a "Personal Access Token" (PAT) from them. This is a magic token that substantially boosts your rate limit for transfers to and from GitHub and will make your problem go away for this and any other package installations you have. Once you've opened an account, there are detailed instructions here about how to obtain and activate your PAT token in R Studio: https://happygitwithr.com/github-pat.html

You will only have to do this once, and the token will work for any and all package installations you do via GitHub. 

