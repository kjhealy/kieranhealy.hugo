---
title: "Parsing Sda Pages"
date: 2019-10-15T09:29:36-04:00
categories: [R,visualization,Sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


[SDA](https://sda.berkeley.edu/) is a suite of software developed at Berkeley for the web-based analysis of survey data. The Berkeley SDA archive (<http://sda.berkeley.edu>) lets you run various kinds of analyses on a number of public datasets, such as the General Social Survey. It also provides consistently-formatted HTML versions of the codebooks for the surveys it hosts. This is very convenient! For the [gssr package](http://kjhealy.github.io/gssr), I wanted to include material from the codebooks as tibbles or data frames that would be accessible inside an R session. Processing the official codebook from its native PDF state into a data frame is, though technically possible, a rather off-putting prospect. But SDA has done most of the work already by making the pages available in HTML. I scraped the codebook pages from them instead. This post contains the code I used to do that. 

Although I haven't looked in detail, it seems that SDA has almost identical codebooks for the other surveys it hosts. so this code could be adapted for use with them. There will be some differences---e.g. the GSS has a "Text of this Question" field along with marginal summaries of the variable for each question in the survey, while the ANES seems to lack that field. But it seems clear that the HTML/CSS structure that SDA output is basically the same across datasets. 

Here's the code for the GSS documentation. There's a [GitHub repository](https://kjhealy.github.io/sda_parser/) that will allow you to reproduce what you see here. I've included the html files in the repository so you don't have to scrape the SDA site. Do not try to slurp up the content of the SDA site in a way that is rude to their server.


## Libraries

{{< code r >}}
library(tidyverse)
library(rvest)
{{< /code >}}

## Scrape the GSS codebook from SDA

This next code chunk shows how we got the codebook data, but it is not evaluated (we set `eval = FALSE`), because we only need to do it once. We use `sprintf()` to generate a series of numbers with leading zeros, of the form `001`, `002`, `003`, and so on. The `261` is hard-coded for this particular directory, but we should really grab the directory listing, evaluate how many files it lists (of the sort we want), and then use that number instead. 

{{< code r >}}
## Generate vector of doc page urls
urls <- paste0("https://sda.berkeley.edu/D3/GSS18/Doc/", 
               "hcbk", sprintf('%0.4d', 1:261), ".htm")


## Grab the codebook pages one at a time
doc_pages <- urls %>% 
  map(~ {
    message(glue::glue("* parsing: {.x}"))
    Sys.sleep(5) # try to be polite
    safely(read_html)(.x)
  })
{{< /code >}}

## Save the scraped webpages locally

There's a gotcha with objects like `doc_pages`: they cannot be straightforwardly saved to R's native data format with `save()`. The XML files are stored with external pointers to their content and cannot be "serialized" in a way that saves their content properly. If you try, when you `load()` the saved object you will get complaints about missing pointers. So instead, we'll unspool our list and save each page individually. Then if we want to rerun this analysis without crawling everything again, we will load them in from our local saved versions using `read_html()`.

Again, this code chunk is shown but not run, as we only do it once. 


{{< code r >}}
## Get a list containing every codebook webpage, 
## Drop the safely() error codes from the initial scrape (after we've checked them), 
## and also drop any NULL entries
page_list <- pluck(doc_pages, "result") %>% 
  compact()

## Make a vector of clean file names of the form "raw/001.htm"
## One for every page we grabbed. Same order as the page_list.
## We use sprintf to get numbers of the form 001, 002, 003 etc.
fnames <-paste0("raw/", 
                sprintf('%0.4d', 1:length(doc_pages)),
                ".htm") 

## Walk the elements of the page list and the file names to 
## save each HTML file under is respective local file name
walk2(page_list, fnames, ~ write_xml(.x, file = .y))
{{< /code >}}

The `walk()` and `walk2()` functions are very handy for processing batches of items when you want to produce a "side-effect" of the function you're mapping, such as a plot or (in this case) a saved file.

## Read in the pages from the local directory

Using the local data we've saved, we read in a list of all the web pages. Our goal is to get them into a tractable format (a tibble or data frame). From there we can write some functions to, e.g., query the codebook directly from the console, or alterantively produce the codebook in a format suitable for integrating into the R help system via a package.


{{< code r >}}
## The names of all the files we just created
local_urls <- fs::dir_ls("raw/")

## Read all the pages back in, from local storage 
doc_pages <- local_urls %>% 
  map(~ {
    safely(read_html)(.x)
  })

## Are there any errors?
doc_pages %>% pluck("error") %>% 
  flatten_dfr()
{{< /code >}}

{{< code r >}}
## # A tibble: 0 x 0
{{< /code >}}

{{< code r >}}
## quick look at first five items in the list
summary(doc_pages)[1:5,]
{{< /code >}}

{{< code r >}}
##              Length Class  Mode
## raw/0001.htm 2      -none- list
## raw/0002.htm 2      -none- list
## raw/0003.htm 2      -none- list
## raw/0004.htm 2      -none- list
## raw/0005.htm 2      -none- list
{{< /code >}}

{{< code r >}}
## Quick look inside the first record
doc_pages[[1]]
{{< /code >}}

{{< code r >}}
## $result
## {html_document}
## <html>
## [1] <head>\n<meta http-equiv="Content-Type" content="text/html; charset= ...
## [2] <body>\n<ul></ul>\n<hr>\n<h1> General Social Survey 1972-2018 Cumula ...
## 
## $error
## NULL
{{< /code >}}

## Parse the pages

Next, we parse every webpage to extract a row for every variable. There are multiple variables per page.

### Functions


{{< code r >}}
## Page of variables to list of variables and their info, 
parse_page <- function(x){
  html_nodes(x, ".dflt") %>%
    map(~ html_nodes(.x, ".noborder")) %>%
    map(~ html_table(.x))
}

## Length of each list element
## Standard GSS Qs will have 4 elements
## Ids recodes and other things will have 3
get_lengths <- function(x){
  map(x, length)
}

get_names <- function(x){
  map(x, names)
}

## Variable short names and descriptions
get_var_ids <- function(x){
  x %>% map_dfr(1) %>%
    select(id = X1, description = X3) %>%
    as_tibble()
}


## Question Text
get_text <- function(x, y){
  if(y[[1]] == 3) {
    return(NA_character_)
  } else {
    stringr::str_trim(x[[2]])
  }
}

## Question Marginals
get_marginals <- function(x, y){
  if(y[[1]] == 3) {
    tmp <- x[[2]]
  } else {
    tmp <- x[[3]]
  }
  
  if(ncol(tmp) == 2) {
    as_tibble(tmp) %>%
      select(cases = X1, range = X2)
  } else {
    tmp <- as_tibble(tmp[, colSums(is.na(tmp)) != nrow(tmp)]) %>%
      janitor::clean_names()
    tmp$value <- as.character(tmp$value)
    tmp
  }
}

## Add an id column
add_id <- function(x, y){
  x %>% add_column(id = y)
}

## Question Properties
get_props <- function(x, y){
  if(y[[1]] == 3) {
    tmp <- x[[3]]
    colnames(tmp) <- c("property", "value")
    tmp <- as_tibble(tmp)
    tmp$property <- stringr::str_remove(tmp$property, ":")
    tmp
  } else {
    tmp <- x[[4]]
    colnames(tmp) <- c("property", "value")
    tmp <- as_tibble(tmp)
    tmp$property <- stringr::str_remove(tmp$property, ":")
    tmp
  }
}

## Take the functions above and process a page to a tibble of cleaned records

process_page <- function(x){
  page <- parse_page(x)
  q_vars <- get_var_ids(page)
  lens <- get_lengths(page)
  keys <- q_vars$id
  
  q_text <- map2_chr(page, lens, ~ get_text(.x, .y))
  q_text <- stringr::str_trim(q_text)
  q_text <- stringr::str_remove_all(q_text, "\n")
  q_text <- tibble(id = keys, q_text = q_text)
  q_text <- q_text %>%
    mutate(q_text = replace_na(q_text, "None"))
  q_marginals <- map2(page, lens, ~ get_marginals(.x, .y)) %>%
    set_names(keys) 
  q_marginals <- map2(q_marginals, keys, ~ add_id(.x, .y))
  
  q_props <- map2(page, lens, ~ get_props(.x, .y)) %>%
    set_names(keys) 
  q_props <- map2(q_props, keys, ~ add_id(.x, .y))
  
  q_tbl <- q_vars %>% 
    add_column(properties = q_props) %>% 
    add_column(marginals = q_marginals) %>%
    left_join(q_text) %>%
    rename(text = q_text)
  
  q_tbl

  }
{{< /code >}}

## Make the tibble

Parse the GSS variables into a tibble, with list columns for the marginals and the variable properties.

{{< code r >}}
gss_doc <-  doc_pages %>% 
  pluck("result") %>% # Get just the webpages
  compact() %>%
  map(process_page) %>%
  bind_rows()
{{< /code >}}


## Look at the outcome


{{< code r >}}
gss_doc
{{< /code >}}

{{< code r >}}
## # A tibble: 6,144 x 5
##    id     description      properties   marginals   text                   
##    <chr>  <chr>            <list>       <list>      <chr>                  
##  1 CASEID YEAR + Responde… <tibble [2 … <tibble [1… None                   
##  2 YEAR   GSS year for th… <tibble [2 … <tibble [3… None                   
##  3 ID     Respondent ID n… <tibble [2 … <tibble [1… None                   
##  4 AGE    Age of responde… <tibble [3 … <tibble [1… 13. Respondent's age   
##  5 SEX    Respondents sex  <tibble [3 … <tibble [3… 23. Code respondent's …
##  6 RACE   Race of respond… <tibble [3 … <tibble [4… 24. What race do you c…
##  7 RACEC… What Is R's rac… <tibble [3 … <tibble [2… 1602. What is your rac…
##  8 RACEC… What Is R's rac… <tibble [3 … <tibble [2… 1602. What is your rac…
##  9 RACEC… What Is R's rac… <tibble [3 … <tibble [2… 1602. What is your rac…
## 10 HISPA… Hispanic specif… <tibble [3 … <tibble [3… 1601. IF R IS FEMALE, …
## # … with 6,134 more rows
{{< /code >}}

{{< code r >}}
gss_doc$id <- tolower(gss_doc$id)
{{< /code >}}

{{< code r >}}
gss_doc %>% filter(id == "race") %>% 
  select(text)
{{< /code >}}

{{< code r >}}
## # A tibble: 1 x 1
##   text                                   
##   <chr>                                  
## 1 24. What race do you consider yourself?
{{< /code >}}

{{< code r >}}
gss_doc %>% filter(id == "race") %>% 
  select(marginals) %>% 
  unnest(cols = c(marginals))
{{< /code >}}

{{< code r >}}
## # A tibble: 4 x 5
##   percent n      value label id   
##     <dbl> <chr>  <chr> <chr> <chr>
## 1    80.3 52,033 1     WHITE RACE 
## 2    14.2 9,187  2     BLACK RACE 
## 3     5.5 3,594  3     OTHER RACE 
## 4   100   64,814 <NA>  Total RACE
{{< /code >}}


{{< code r >}}
gss_doc %>% filter(id == "sex") %>% 
  select(text)
{{< /code >}}

{{< code r >}}
## # A tibble: 1 x 1
##   text                     
##   <chr>                    
## 1 23. Code respondent's sex
{{< /code >}}

{{< code r >}}
gss_doc %>% filter(id == "sex") %>% 
  select(marginals) %>% 
  unnest(cols = c(marginals))
{{< /code >}}

{{< code r >}}
## # A tibble: 3 x 5
##   percent n      value label  id   
##     <dbl> <chr>  <chr> <chr>  <chr>
## 1    44.1 28,614 1     MALE   SEX  
## 2    55.9 36,200 2     FEMALE SEX  
## 3   100   64,814 <NA>  Total  SEX
{{< /code >}}


{{< code r >}}
gss_doc %>% filter(id == "fefam") %>% 
  select(text)
{{< /code >}}

{{< code r >}}
## # A tibble: 1 x 1
##   text                                                                     
##   <chr>                                                                    
## 1 252. Now I'm going to read several more statements. As I read each one, …
{{< /code >}}

{{< code r >}}
gss_doc %>% filter(id == "fefam") %>% 
  select(properties) %>% 
  unnest(cols = c(properties))
{{< /code >}}

{{< code r >}}
## # A tibble: 3 x 3
##   property           value   id   
##   <chr>              <chr>   <chr>
## 1 Data type          numeric FEFAM
## 2 Missing-data codes 0,8,9   FEFAM
## 3 Record/column      1/1114  FEFAM
{{< /code >}}

## Save the data object as efficiently as we can

Shown here but not run.

{{< code r >}}
save(gss_doc, file = "data/gss_doc.rda", 
     compress = "xz") 

# tools::checkRdaFiles("data")
{{< /code >}}

