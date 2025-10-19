---
title: "gssrdoc Updates"
date: 2025-10-19T10:50:04-04:00
categories: [sociology,r]
footnotes: false
htmlwidgets: false
mathjax: false
---

Regular readers know that I maintain [`gssr`](https://kjhealy.github.io/gssr/) and [`gssrdoc`](https://kjhealy.github.io/gssrdoc/), two packages for [R](https://www.r-project.org). The former makes the [General Social Survey](http://gss.norc.org/)'s annual, cumulative and panel datasets available in a way that's easy to use in R. The latter makes the survey's codebook available in R's integrated help system in a way that documents every GSS variable as if it were a function or object in R, so you can query them in exactly the same way as any function from the R console or in the IDE of your choice. As a bonus, because I use [`pkgdown`](https://pkgdown.r-lib.org) to document the packages, I get a website as a side-effect. In the case of `gssrdoc` this means [a browsable index of all the GSS variables](https://kjhealy.github.io/gssrdoc/reference/index.html). The GSS is the Hubble Space Telescope of American social science; our longest-running representative view of many aspects of the character and opinions of American households. The data is [freely available from NORC](https://gss.norc.org), but they distribute it in SPSS, SAS, and STATA formats. I wrote these packages in an effort to make it more easily available in [R](https://www.r-project.org). If you want to know the relationship between these various platforms, [I have you covered](https://kieranhealy.org/blog/archives/2019/02/07/statswars/). But the important thing is that R is a free and open-source project, and the others are not.

This week I spent a little time updating `gssrdoc` a bit to clean up how the help pages looked and make some other improvements. Inside R, you can say, e.g., `?govdook` at the console and have this pop up in the help:

{{% figure src="gssrdoc-rstudio.png" alt="RStudio with help page for govdook" caption="Yeah govdook is short for 'Gov Do OK', not 'Dook'." %}}

The package also includes `gss_doc`, a data frame containing all of the information that the help pages are built from. I included it because it can be useful to work with directly, as when you might want to extract summary information about a subset of variables.

{{< code r >}}
library(tibble)
library(gssrdoc)

gss_doc
#> # A tibble: 6,694 × 10
#>    variable description                           question         value_labels var_yrtab yrballot_df module_df subject_df norc_id norc_url
#>    <chr>    <chr>                                 <chr>            <chr>        <list>    <list>      <list>    <list>       <int> <chr>   
#>  1 year     GSS year for this respondent          "GSS year"       "[NA(d)] do… <chr [1]> <tibble>    <tibble>  <tibble>         1 https:/…
#>  2 id       Respondent id number                  "Respondent id … ""           <chr [1]> <tibble>    <tibble>  <tibble>         2 https:/…
#>  3 wrkstat  labor force status                    "Last week were… "[1] workin… <tibble>  <tibble>    <tibble>  <tibble>         3 https:/…
#>  4 hrs1     number of hours worked last week      "Last week were… "[89] 89+ h… <chr [1]> <tibble>    <tibble>  <tibble>         4 https:/…
#>  5 hrs2     number of hours usually work a week   "Last week were… "[89] 89+ h… <tibble>  <tibble>    <tibble>  <tibble>         5 https:/…
#>  6 evwork   ever work as long as one year         "Last week were… "[1] yes / … <tibble>  <tibble>    <tibble>  <tibble>         6 https:/…
#>  7 occ      R's census occupation code (1970)     "A. What kind o… "[NA(d)] do… <chr [1]> <tibble>    <tibble>  <tibble>         7 https:/…
#>  8 prestige r's occupational prestige score(1970) "A. What kind o… "[NA(d)] do… <tibble>  <tibble>    <tibble>  <tibble>         8 https:/…
#>  9 wrkslf   r self-emp or works for somebody      "A. What kind o… "[1] self-e… <tibble>  <tibble>    <tibble>  <tibble>         9 https:/…
#> 10 wrkgovt  govt or private employee              "A. What kind o… "[1] govern… <tibble>  <tibble>    <tibble>  <tibble>        10 https:/…
#> # ℹ 6,684 more rows


{{< /code >}}

The `gss_doc` object has regular columns but also a series of [list-columns](https://tidyr.tidyverse.org/articles/nest.html) to (insert meme here, you know the one) put data frames inside your data frames. (They're labeled as "[tibbles](https://tibble.tidyverse.org)" here; basically the same thing). 

Why a list-column? Why a list? Well, a list is one of the fundamental ways to store data of any sort. Lists are useful because they can contain heterogeneous elements:


{{< code r >}}
items <- list(
  todo_home = c("Laundry", "Clean bathroom", "Feed cat", "Bring out rubbish bins"),
  important_dates = as.Date(c("1776-07-04", "1788-06-21", "2025-01-18")),
  keycode = 8675309,
  storage_tiers = c(128, 256, 512, 1024)
)

items
#> $todo_home
#> [1] "Laundry"                "Clean bathroom"         "Feed cat"               "Bring out rubbish bins"
#> 
#> $important_dates
#> [1] "1776-07-04" "1788-06-21" "2025-01-18"
#> 
#> $keycode
#> [1] 8675309
#> 
#> $storage_tiers
#> [1]  128  256  512 1024
{{< /code >}}

One thing to notice about a list like this is that it doesn't really make sense to represent it as a table. This is partly because the elements of the list are of different lengths, but really it's because if we _did_ represent it as a table, it would not mean anything to read across the rows:

{{< code r >}}
items_df
#> # A tibble: 4 × 4
#>   todo_home              important_dates keycode storage_tiers
#>   <chr>                  <date>            <int>         <int>
#> 1 Laundry                1776-07-04      8675309           128
#> 2 Clean bathroom         1788-06-21           -            256
#> 3 Feed cat               2025-01-18           -            512
#> 4 Bring out rubbish bins -                    -           1024
{{< /code >}}

The rows don't form "cases" of anything. We just have four unrelated categories with various pieces of information in them.

Lists are also useful because they lend themselves easily to being nested:

{{< code r >}}

items <- list(
  todo_home = list(
    tasks = c("Laundry", "Clean bathroom", "Feed cat", "Bring out rubbish bins"),
    tobuy = c("Cat Food", "Burritos"), 
    wifi_password = "p@ssw0rd!"
  ),
  important_dates = as.Date(c("1776-07-04", "1788-06-21", "2025-01-18")),
  keycode = 8675309,
  storage_tiers = list(
    ssd = c(128, 256, 512, 1024),
    ram = c(1, 4, 8)
  )
)

items
#> $todo_home
#> $todo_home$tasks
#> [1] "Laundry"                "Clean bathroom"         "Feed cat"               "Bring out rubbish bins"
#> 
#> $todo_home$tobuy
#> [1] "Cat Food" "Burritos"
#> 
#> $todo_home$wifi_password
#> [1] "p@ssw0rd!"
#> 
#> 
#> $important_dates
#> [1] "1776-07-04" "1788-06-21" "2025-01-18"
#> 
#> $keycode
#> [1] 8675309
#> 
#> $storage_tiers
#> $storage_tiers$ssd
#> [1]  128  256  512 1024
#> 
#> $storage_tiers$ram
#> [1] 1 4 8

{{< /code >}}

In its bones, R is a LISP/Scheme-like list-processing language fused with features of classic [array languages](https://en.wikipedia.org/wiki/Array_programming) like APL. This is because, in the world of data analysis, what we deal with all the time are rectangular tables, or arrays, where rows are cases and columns are different sorts of variables. The wrinkle is that, unlike a beautiful array of pure numbers, each column might measure something (a date, a True/False answer, a location, a score, a nationality) that we'd prefer not to represent directly as a number. Sure, underneath in the computer everything is all just ones and zeros. (Or rather, electromagnetic patterns in some physical substrate that we can interpret as meaning ones and zeros.) And if we want to do any sort of data analysis that involves treating our table as a matrix then we'll want numeric representations of all the columns. But for many uses we'd just like to see "France" or "Strongly Agree" instead of "33" or "5". Just a table of rows and columns, where different things can be represented across columns, but any particular column is all the same kind of thing.

A rectangular table like that is called a data frame. One way to think of a data frame is just as a special case of a list. A data frame is a list where you can put all the list elements side by side and treat them as columns, and where all these elements are made of vectors of the same length. Beyond that, it's a list where the nth element of each vector refers to some property of the same underlying entity, i.e. the thing that's in the row, or case; the thing the columns are showing you measurements or properties of. You can have empty entries if needed, as when some bit of data is missing. The important thing is that each column has as many slots as there are cases, and you fill in the values for each case in the same slot in each column. Whenever you look at any table of data, one of your first questions should always be "What is a row in this table?" In this case, each row is a variable in the full GSS dataset, and each column describes some property of that variable. 

{{< code r >}}
library(tibble)
library(gssrdoc)

gss_doc
#> # A tibble: 6,694 × 10
#>    variable description                           question         value_labels var_yrtab yrballot_df module_df subject_df norc_id norc_url
#>    <chr>    <chr>                                 <chr>            <chr>        <list>    <list>      <list>    <list>       <int> <chr>   
#>  1 year     GSS year for this respondent          "GSS year"       "[NA(d)] do… <chr [1]> <tibble>    <tibble>  <tibble>         1 https:/…
#>  2 id       Respondent id number                  "Respondent id … ""           <chr [1]> <tibble>    <tibble>  <tibble>         2 https:/…
#>  3 wrkstat  labor force status                    "Last week were… "[1] workin… <tibble>  <tibble>    <tibble>  <tibble>         3 https:/…
#>  4 hrs1     number of hours worked last week      "Last week were… "[89] 89+ h… <chr [1]> <tibble>    <tibble>  <tibble>         4 https:/…
#>  5 hrs2     number of hours usually work a week   "Last week were… "[89] 89+ h… <tibble>  <tibble>    <tibble>  <tibble>         5 https:/…
#>  6 evwork   ever work as long as one year         "Last week were… "[1] yes / … <tibble>  <tibble>    <tibble>  <tibble>         6 https:/…
#>  7 occ      R's census occupation code (1970)     "A. What kind o… "[NA(d)] do… <chr [1]> <tibble>    <tibble>  <tibble>         7 https:/…
#>  8 prestige r's occupational prestige score(1970) "A. What kind o… "[NA(d)] do… <tibble>  <tibble>    <tibble>  <tibble>         8 https:/…
#>  9 wrkslf   r self-emp or works for somebody      "A. What kind o… "[1] self-e… <tibble>  <tibble>    <tibble>  <tibble>         9 https:/…
#> 10 wrkgovt  govt or private employee              "A. What kind o… "[1] govern… <tibble>  <tibble>    <tibble>  <tibble>        10 https:/…
#> # ℹ 6,684 more rows


{{< /code >}}


Because R was designed by statisticians---R is a descendant of [S](https://en.wikipedia.org/wiki/S_(programming_language)), which like everything else in computing traces its origins to [Bell Labs](https://en.wikipedia.org/wiki/S_(programming_language))---it has this concept of a data frame built-in to its core instead of being bolted-on afterwards, which is extremely handy. Normally data frames are just ordinary rectangles, but there's no reason why any particular column can't itself be thought of as a list of something else. That's what we have here. The `yr_vartab` column contains data frames of crosstabs of the answers to each question by year. Except where it doesn't (e.g. for `id`), and this is fine because lists don't have to be internally homogeneous. Similarly `yrballot_df` has a little table of which ballots, or internal portions of the survey, a question was asked on for each year it was asked.

The upshot is that having assembled the `gss_doc` object we can use it to emit, like, seven thousand pages of documentation on the GSS's many, many questions over the years. We can build them as standardized R help pages, as above. On the [website](https://kjhealy.github.io/gssrdoc/index.html) that `pgkdown` builds for us, we get this:

{{% figure src="gssrdoc-varpage.png" alt="" caption="Website view." %}}

The cross-referencing to other relevant variables in the "See Also" section is new in this version. It comes courtesy of the GSS's own information about survey modules and an ad hoc topic index they keep for the variables. I just use a subset of possible cross-references as we don't want, e.g., every single question in the GSS core to be cross-referenced to every other core question on any particular help page. On the website, I gather these into a [single page](https://kjhealy.github.io/gssrdoc/articles/topics.html):

{{% figure src="gssrdoc-topics.png" alt="" caption="Topic index page." %}}

The GSS has its own handy [data explorer](https://gssdataexplorer.norc.org) which is very useful for quickly checking on particular trends and getting a quick graph of what the data look like, or a summary view of the content of particular variables. Each help page in `gssrdoc` now links to the GSS Data Explorer page for that variable, in case you want to hop over and take a look there. Of course, the `gssrdoc` package doesn't and isn't meant to replace the Data Explorer; it's just a different view of the same information, with a different use-case in mind. 




