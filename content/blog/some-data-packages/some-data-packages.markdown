---
title: "Some Data Packages"
date: 2020-08-25T09:01:43-04:00
categories: [sociology,visualization,data,R]
footnotes: false
htmlwidgets: false
mathjax: false
---

If you're teaching statistics, data analysis, or data visualization with R this semester, especially in the social sciences, I've pulled together various bits of data into packages that I use in my own teaching. You might find them useful once you're sick of Gapminder. They cover a variety of topics and range from single tables of data to whole longitudinal and panel surveys.

<p class = "clearfix"><a href="http://kjhealy.github.io/uscenpops"><img src = "/files/misc/hex-cavax.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/cavax">cavax package</a> contains a school-level table of rates of Personal Belief Exemptions (PBEs) in California kindergartens for the 2014-15 school year. At that time (the rules have since changed), a PBE allowed a child to enter kindergarten without having received the usual complement of vaccinations. Information on the school's name, district, city, county, and type is included, along with the size of the kindergarten class.</p>

<p class = "clearfix"><a href="http://kjhealy.github.io/ukelection2019"><img src = "/files/misc/hex-uk2019.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/ukelection2019">ukelection2019 package</a> contains candidate-level vote data by constituency on the UK general election of 2019, scraped from the BBC's election website.</p>

<p class = "clearfix"><a href="http://kjhealy.github.io/uscenpops"><img src = "/files/misc/hex-uscenpops.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/uscenpops">uscenpops package</a> contains a table of birth counts for the United States by year-of-age and sex for every year from 1900 to 2018.</p>

<p class = "clearfix"><a href="http://kjhealy.github.io/nycdogs"><img src = "/files/misc/hex-nycdogs.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/nycdogs">nycdogs package</a> is a fun dataset (actually three separate tibbles: licenses, bites, and zip codes) taken from New York City's Open Data initiative, cleaned up and packaged for R. It's useful for teaching <a href ="http://dplyr.tidyverse.org">dplyr</a>, for drawing maps, and for seeing where dogs with particular names live. </p>

<p class = "clearfix"><a href="http://kjhealy.github.io/covdata"><img src = "/files/misc/hex-covdata.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/covdata">covdata package</a> contains data on reported cases of and deaths from COVID-19 from from a variety of sources. Amongst other things, the package provides (1) National-level case and mortality data from the ECDC, U.S. state-level case and morality data from the CDC and the New York Times, patient-level data from the CDC's public use dataset. (2) All-cause mortality and excess mortality data from the Human Mortality Database. (3) Mobility and activity data from Apple and Google. (4) Policy data from the <a href = "https://coronanet-project.org">CoronaNet Project</a>.

<p class = "clearfix"><a href="http://kjhealy.github.io/gssr"><img src = "/files/misc/hex-gssr.png" width = "140" align = "left"></a> The <a href="http://kjhealy.github.io/gssr">gssr package</a> provides the complete General Social Survey cumulative data file (1972-2018) and Three Wave Panel data files in an R-friendly format, together with their codebooks. </p>

<p class = "clearfix"><a href="http://kjhealy.github.io/socviz"><img src = "/files/misc/hex-socviz.png" width = "140" align = "left"></a> All of these packages work well with  the <a href="http://kjhealy.github.io/socviz">socviz package</a> which supports my <a href="https://www.amazon.com/Data-Visualization-Introduction-Kieran-Healy/dp/0691181624"><em>Data Visualization</em></a> book with a collection of datasets and utility functions to help you draw good graphs in R and ggplot. </p>

