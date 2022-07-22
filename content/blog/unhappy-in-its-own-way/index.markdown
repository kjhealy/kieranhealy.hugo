---
title: "Unhappy in its Own Way"
date: 2022-07-22T13:54:58-04:00
categories: [data,R,wrangling]
footnotes: false
htmlwidgets: false
mathjax: false
---


“Happy families are all alike; every unhappy family is unhappy in its
own way” runs the opening sentence of *Anna Karenina*. Hadley Wickham
[echoes the sentiment](https://r4ds.had.co.nz/tidy-data.html) in a
somewhat different context: “Tidy datasets are all alike, but every
messy dataset is messy in its own way”. Data analysis is mostly data
wrangling. That is, before you can do anything at all with your data, you
need to get it into a format that your software can read. More often
than not, the stage between having collected (or found) some data and
being able to analyze it is frustrating, awkward, and filled with
difficulties particular to the data you are working with. Things are
encoded this way rather than that; every fifth line has an extra column;
the data file contains subtotals and running headers; the tables are
only available as PDFs; the source website has no API, and so on.

This makes teaching data wrangling a little awkward, too. On the one
hand, R’s [`tidyr`](https://tidyr.tidyverse.org) package has a
bomb-disposal squad of functions designed to defuse these problems. But
looking at them piecemeal might make any particular one seem highly
specialized and hard to motivate in general. On the other hand, any
dataset in need of wrangling will likely have all kinds of idiosyncratic
problems, so a worked example may end up seeming far too specific.

In practice we bridge the two extremes by repeatedly showing tools in
use, moving back and forth between some specific data issue and more
general heuristics for diagnosing and solving problems; or between some
particular function and the more general theory of data that it is trying
to help you apply.

Here’s a real life case that I had fun with this week. I learned more
about a general idea in the process of trying to solve a particular
problem that had come up in the middle of trying to transform a PDF of
more-or-less formatted tables into a tidy dataset.

## Run-Length Encoding

The general idea I learned more about was the notion of [run-length
encoding](https://en.wikipedia.org/wiki/Run-length_encoding). This is

> a form of lossless data compression in which runs of data (sequences
> in which the same data value occurs in many consecutive data elements)
> are stored as a single data value and count, rather than as the
> original run.

Wikipedia’s example comes from the transmission of TV signals:

> Consider a screen containing plain black text on a solid white
> background, over hypothetical scan line, it can be rendered as
> follows: `12W1B12W3B24W1B14W`. This can be interpreted as a sequence
> of twelve Ws, one B, twelve Ws, three Bs, etc., and represents the
> original 67 characters in only 18. While the actual format used for
> the storage of images is generally binary rather than ASCII characters
> like this, the principle remains the same.

Though primarily a way of compressing data, we can use a run-length
encoding to keep track of how a sequence unfolds. For example, here’s a
vector of `TRUE` and `FALSE` values:

{{< code r >}}
x <- c(TRUE, TRUE, FALSE, TRUE, FALSE, FALSE, FALSE, TRUE, 
   FALSE, TRUE, FALSE, FALSE, TRUE, FALSE)

length(x)

## [1] 14
{{< /code >}}

In R we can get a run-length encoding of this vector with the `rle()`
function. It returns an object with two pieces, the lengths and the
values.

{{< code r >}}
rle(x)

## Run Length Encoding
##   lengths: int [1:10] 2 1 1 3 1 1 1 2 1 1
##   values : logi [1:10] TRUE FALSE TRUE FALSE TRUE FALSE ...
{{< /code >}}

So here we have ten runs. `TRUE` twice, then `FALSE` once, then `TRUE`
once, then `FALSE` three times, and so on. We can get the run lengths
alone with

{{< code r >}}
rle(x)$lengths

##  [1] 2 1 1 3 1 1 1 2 1 1
{{< /code >}}

If we use `sequence()` to count the runs back out, the result will be
equal to the length of the original vector:

{{< code r >}}
sequence(rle(x)$lengths)

##  [1] 1 2 1 1 1 2 3 1 1 1 1 2 1 1
{{< /code >}}

This makes a sequence that starts counting at 1 and resets to 1 whenever
a new value is seen. Because the values are `TRUE` and `FALSE` only,
once we know the start value we can reconstitute the sequence knowing
just it and the runs. We can take advantage of the binary
`TRUE`/`FALSE` data (implicitly 1/0 numerically) in a different way,
too. With the original vector and the sequenced run, we can get
different ways of counting the sequence depending on how we multiply it
by the values of `x`, or negate those values before multiplying them.

{{< code r >}}
tibble(x = x, 
   seq1 = sequence(rle(x)$lengths), 
   seq2 = sequence(rle(!x)$lengths) * x, 
   seq3 = sequence(rle(!x)$lengths) * !x)

## # A tibble: 14 × 4
##    x      seq1  seq2  seq3
##    <lgl> <int> <int> <int>
##  1 TRUE      1     1     0
##  2 TRUE      2     2     0
##  3 FALSE     1     0     1
##  4 TRUE      1     1     0
##  5 FALSE     1     0     1
##  6 FALSE     2     0     2
##  7 FALSE     3     0     3
##  8 TRUE      1     1     0
##  9 FALSE     1     0     1
## 10 TRUE      1     1     0
## 11 FALSE     1     0     1
## 12 FALSE     2     0     2
## 13 TRUE      1     1     0
## 14 FALSE     1     0     1
{{< /code >}}

So for logical vectors we can make it so that our counter starts at
either 1 or 0 for `TRUE`, and counts up from there. We can also have
`FALSE` always coded as 0 (no matter how many times it’s repeated) but
`TRUE` always coded as 1 and then counted up from there. Different
indexes for the sequence can be more or less convenient depending on
what we might need to keep track of in some vector.

## A PDF of almost-regular tables

That’s the general bit. Now for the idiosyncratic one. This week I was working with
about a hundred pages of legal billing data. Every page of the PDF had
information about the date, rate, and hours of service billed, with a
description of the service that could be anywhere from one to ten or so
lines long. I wanted to get this PDF into R to do look at the records more systematically. 

Now, In many cases, the most straightforward way to get a PDF
table into some sort of plain-text format will be not to write any code at all.
Instead you can use Excel, for instance, [to read PDF
tables](https://www.howtogeek.com/770474/how-to-import-data-from-a-pdf-to-microsoft-excel/)
a page at a time, or try Adobe’s [PDF to Excel
service](https://www.adobe.com/acrobat/online/pdf-to-excel.html) if
you’re a subscriber. These are useful tools, and if your job is straightforward you should consider starting with them.

We’re going to use R, because that’s how we roll around here. Even
within R there are some decisions to make. For example, I might have
used [tabula](https://tabula.technology), the Java-driven PDF-to-text
engine, via the [tabulizer](https://docs.ropensci.org/tabulizer/)
package. But I didn’t have tabula installed, so instead to get the PDF
file into R we’ll use [pdftools](https://docs.ropensci.org/pdftools/),
which depends on the [poppler](https://poppler.freedesktop.org)
rendering library, which I did have installed. From there we use some
standard [tidyverse](https://tidyverse.org) packages, notably `dplyr`
and `tidyr`.

One thing to bear in mind is that, as often happens, the wrangling and
cleaning sequence I’m about to show here developed fairly organically.
That is, I was trying to get the hang of the data and this is how I
proceeded. Some steps were driven partly by a desire to keep seeing the
data in a way that was immediately comprehensible, just so that I could
get a quick sense of whether I was making any big mistakes. If this were
the sort of problem where doing it as efficiently as possible really
mattered, the next step would be to investigate various “roads not
taken” a bit more thoroughly. I guarantee you that there are better ways
to do this. But for my purposes, this way was good enough.

Ultimately we're going to end up with a table containing columns with these names:

{{< code r >}}
varnames <- c("date", "timekeeper", "description", 
  "hours", "rate", "fees", "notes")
{{< /code >}}

Getting there will take a little while. A PDF file is an unfriendly thing to try to extract plain-text data
from. (Turning typeset tables or text back into plain-text is sometimes
likened to trying to reconstitute a pig from a packet of sausages.) In
this case, the data *is* all in there, which is to say that the numbers
and the text is all there in a way we can get to, but when we import it
into R we will lose all the tabular formatting. All we will have left is
a stream of text with lines designated by the special `\n` character.

{{< code r >}}
pgs <- pdftools::pdf_text("data/appendix_a.pdf")

pgs <- set_names(pgs, nm = 1:length(pgs)) 

length(pgs)

## [1] 92
{{< /code >}}

In this next part, we’ll use some regular expressions inside `stringr`
functions to strip some lines we don’t need (such as the “Page n of 92”
header lines); trim the strings of excess whitespace at the start and
end; and finally anonymize the data for the purposes of this post. I do
this last bit by looking for every word and replacing it with a random
word. The words come from `stringr`’s built-in vector `words`, which it
uses for examples. It has about a thousand miscellaneous words. The
regular expression `\p{L}` will match any single unicode character that
is a letter. Writing `\p{L}+` will make the expression keep matching
until a non-letter is encountered (e.g. a punctuation mark or a space).
Finally, because we are inside R, we need to double-escape the special
`\p` code so that it is `\\p`, in order for the backslash to be
preserved.

{{< code r >}}
eg <- pgs |> 
  str_remove_all("Page \\d{1,2} of 92") |> 
  str_trim() |>
  str_replace_all("\\p{L}+", function(x) sample(stringr::words, 1)) 
{{< /code >}}

OK, so now we can look at what we have. It’s a vector with 92 elements:

{{< code r >}}
length(eg)

## [1] 92
{{< /code >}}

Each of these elements is a single long, messy string that contains all
the characters from one page, including special ones like `\n` for
newline. The newline characters are represented by the text `\n` rather
than being interpreted as actual new lines. Here, for example, is page
four:

{{< code r >}}
eg[4]

## [1] "4/22/14   brief    way politic go feed warm job (.3); wrong odd‐down respect, early     1.2    635    762.00\n                test miss milk simple, body bill feel key chap small, compare\n                group mother list law (.9)\n4/22/14   percent   lot bed‐settle state language associate parent'start tea (.2); waste wife accept street     0.4    749    299.60\n                five cross turn\n4/27/14   fact    wash drive as road open specific' apart‐beauty learn                 1.3    635     825.50\n4/28/14   heart    lady due exact keep claim receive' last‐clean brilliant                 5.4    635   3,429.00\n4/29/14   true    middle air evening visit business cake' presume‐obvious class                 9.1    635   5,778.50\n5/2/14    centre   stupid double same brother' thirteen programme station; man control warm       0.4    749     299.60 0.8 wednesday night work/ look pension\n                in ready\n5/9/14    regard    consider down shop sit Christmas wish                                0.1    635     63.50\n5/15/14   grant    number free as late prepare address individual (.5); guess walk trade still notice          0.4    635    254.00 0.9 process business total/ hot concern\n                receive sex then (.4)\n5/15/14   achieve   feel part pair structure tuesday plan work continue busy share join           0.2    749    149.80 0.5 set report flat/ decision university\n\n5/20/14   less   thursday paint show favour (1); miss clean fund (1.5); wife         3.1    749   2,321.90 6.2 old month recognize/ go evidence\n                push safe control (3.7)\n5/23/14   finance    measure understand strategy                                                   0.1    635      63.50\n5/23/14   score   danger girl quite no it. happen                                   0.1    749      74.90\n6/9/14    pence   god especial colour sex honest'front begin rate site (answer encourage            2.7    749   2,022.30 5.5 news speak benefit/ arm begin\n                danger necessary); raise month'clock bottle win project, group brief only\n                represent arm function; south push, in apart care business\n\n6/10/14   traffic    hate still for heat except                                                  0.3    635    190.50\n6/11/14   short   presume yes imagine hold mean eat fill allow manage forget            0.2    749    149.80\n6/16/14   book   point sunday last eat wednesday worry argue; remember bother          4.2    749   3,145.80 8.5 account check each/ recent each\n                ten same one link (.4); give 2raise income last apply eight bus size 2look far\n                tape glass standard (1.7); only shall can brief expect short;\n                identify sister only home live bad own 2to at positive\n                (2.1); please over experience hullo heat stupid practise price english late\n                live (2.5); brother good south exercise worry sit (1.8)\n\n6/17/14   knock   but please income trouble why cent                              0.6    749     449.40 1.3 recommend to region/ clean little\n6/22/14   any   period count fish wear, sick involve knock ago either         3.2    749   2,396.80 6.5 hope fight rest/ enjoy point\n                choose girl equal happen\n6/23/14   part    large boy score count unite                                            2.9    635   1,841.50 5.8 cook sorry apparent/ jesus war"

{{< /code >}}

It goes on for a long way off to the right there.

## Breaking up the lines

The first thing we will do is take each element in the vector (i.e. the long, long string that is each
page), and break it on every newline character. That is, we’ll split the
string so that every time we encounter the sequence `\n` we will make it
an actual new line. 

{{< code r >}}
eg <- str_split(eg, pattern = "\\n") 
{{< /code >}}

Because we have split each `\n` character into an actual newline, the
structure of our `eg` data object has changed. It used to be a vector.
But now it is a list:

{{< code r >}}
class(eg)

## [1] "list"

length(eg)

## [1] 92
{{< /code >}}

It’s a list of the same length the vector was, but now each list element
contains a bunch of lines. Here is page 4 again:

{{< code r >}}
eg[4]  

## [[1]]
##  [1] "4/22/14   brief    way politic go feed warm job (.3); wrong odd‐down respect, early     1.2    635    762.00"                                                               
##  [2] "                test miss milk simple, body bill feel key chap small, compare"                                                                                              
##  [3] "                group mother list law (.9)"                                                                                                                                 
##  [4] "4/22/14   percent   lot bed‐settle state language associate parent'start tea (.2); waste wife accept street     0.4    749    299.60"                                       
##  [5] "                five cross turn"                                                                                                                                            
##  [6] "4/27/14   fact    wash drive as road open specific' apart‐beauty learn                 1.3    635     825.50"                                                               
##  [7] "4/28/14   heart    lady due exact keep claim receive' last‐clean brilliant                 5.4    635   3,429.00"                                                           
##  [8] "4/29/14   true    middle air evening visit business cake' presume‐obvious class                 9.1    635   5,778.50"                                                      
##  [9] "5/2/14    centre   stupid double same brother' thirteen programme station; man control warm       0.4    749     299.60 0.8 wednesday night work/ look pension"             
## [10] "                in ready"                                                                                                                                                   
## [11] "5/9/14    regard    consider down shop sit Christmas wish                                0.1    635     63.50"                                                              
## [12] "5/15/14   grant    number free as late prepare address individual (.5); guess walk trade still notice          0.4    635    254.00 0.9 process business total/ hot concern"
## [13] "                receive sex then (.4)"                                                                                                                                      
## [14] "5/15/14   achieve   feel part pair structure tuesday plan work continue busy share join           0.2    749    149.80 0.5 set report flat/ decision university"            
## [15] ""                                                                                                                                                                           
## [16] "5/20/14   less   thursday paint show favour (1); miss clean fund (1.5); wife         3.1    749   2,321.90 6.2 old month recognize/ go evidence"                            
## [17] "                push safe control (3.7)"                                                                                                                                    
## [18] "5/23/14   finance    measure understand strategy                                                   0.1    635      63.50"                                                   
## [19] "5/23/14   score   danger girl quite no it. happen                                   0.1    749      74.90"                                                                  
## [20] "6/9/14    pence   god especial colour sex honest'front begin rate site (answer encourage            2.7    749   2,022.30 5.5 news speak benefit/ arm begin"                
## [21] "                danger necessary); raise month'clock bottle win project, group brief only"                                                                                  
## [22] "                represent arm function; south push, in apart care business"                                                                                                 
## [23] ""                                                                                                                                                                           
## [24] "6/10/14   traffic    hate still for heat except                                                  0.3    635    190.50"                                                      
## [25] "6/11/14   short   presume yes imagine hold mean eat fill allow manage forget            0.2    749    149.80"                                                               
## [26] "6/16/14   book   point sunday last eat wednesday worry argue; remember bother          4.2    749   3,145.80 8.5 account check each/ recent each"                           
## [27] "                ten same one link (.4); give 2raise income last apply eight bus size 2look far"                                                                             
## [28] "                tape glass standard (1.7); only shall can brief expect short;"                                                                                              
## [29] "                identify sister only home live bad own 2to at positive"                                                                                                     
## [30] "                (2.1); please over experience hullo heat stupid practise price english late"                                                                                
## [31] "                live (2.5); brother good south exercise worry sit (1.8)"                                                                                                    
## [32] ""                                                                                                                                                                           
## [33] "6/17/14   knock   but please income trouble why cent                              0.6    749     449.40 1.3 recommend to region/ clean little"                              
## [34] "6/22/14   any   period count fish wear, sick involve knock ago either         3.2    749   2,396.80 6.5 hope fight rest/ enjoy point"                                       
## [35] "                choose girl equal happen"                                                                                                                                   
## [36] "6/23/14   part    large boy score count unite                                            2.9    635   1,841.50 5.8 cook sorry apparent/ jesus war"

{{< /code >}}

You can see from that double-bracketed `[[1]]` at the top (“The first
element you asked for”) that we’re looking at a list. Inside is a series
of vectors, numbering however many lines we got on that particular page.

We could keep working with this list just as a list. But to make things
a little more convenient—really just to make it easier to look at its
contents as we go—we’re going to convert the series of lines inside each
list element to a tibble (i.e. a nice data table). To begin with, it
will have just three columns: `text`, which will contain each line of
text on the page; `line`, which numbers the line, and `page` for the
page. We’re doing the same thing to each element of this vector, so that
is a kind of iteration. But rather than write a loop, the way we do this
in a pipeline is to *apply* or *map* a function or series of actions to
each element of the list. This lets us keep things in a pipeline. To
generate the `page` variable we use `imap()`, which can access the name
of the current list element. In this case that's just a number corresponding to the page.

If you’re not used to reading a pipeline like this, read `|>` as “and
then”. Imagine starting with the data, `eg`, *and then* doing a series
of things to it. Each line hands on the result to the next line, which
takes it as input.

{{< code r >}}
eg <- eg |>   
  map(~ tibble(text = unlist(.x), 
   line = 1:length(text))) |> 
  imap(~ .x |>  mutate(page = .y)) 
{{< /code >}}

So what did that do? Here’s page 4 again:

{{< code r >}}
eg[4]  

## [[1]]
## # A tibble: 36 × 3
##    text                                                               line  page
##    <chr>                                                             <int> <int>
##  1 "4/22/14   brief    way politic go feed warm job (.3); wrong odd…     1     4
##  2 "                test miss milk simple, body bill feel key chap …     2     4
##  3 "                group mother list law (.9)"                          3     4
##  4 "4/22/14   percent   lot bed‐settle state language associate par…     4     4
##  5 "                five cross turn"                                     5     4
##  6 "4/27/14   fact    wash drive as road open specific' apart‐beaut…     6     4
##  7 "4/28/14   heart    lady due exact keep claim receive' last‐clea…     7     4
##  8 "4/29/14   true    middle air evening visit business cake' presu…     8     4
##  9 "5/2/14    centre   stupid double same brother' thirteen program…     9     4
## 10 "                in ready"                                           10     4
## # … with 26 more rows
{{< /code >}}

As you can see, page 4 has 36 lines of text. All our data is in that
`text` column. We’re beginning to see what it’s going to look like as a
table with proper columns.

Let’s do a little preliminary cleaning and reorganization before we try
splitting up `text` into separate columns. Again we are using `map()`
because we have to do this to each page individually. Some of these
lines (e.g. removing section headers) deal with things that I know are
in the data but which I don’t need, because I looked at the PDF. At the
end of this process we bind all the list elements together by row, so
that they become a single big tibble.

{{< code r >}}
eg <- eg |>   
  map(~ .x |> relocate(page, line) |> # move page and line to the left
        filter(!str_detect(text, '^$')) |>         # Remove any blank lines
        filter(!str_detect(text, "^\\d{1,2}\\. ")) # Remove section headers
      ) |>  
  bind_rows() |> # Convert to single tibble
  tail(-2) # Strip very first two lines (from page 1), they're not needed
{{< /code >}}

Now we have a single tibble, rather than a list of tibbles.

{{< code r >}}
eg

## # A tibble: 3,158 × 3
##     page  line text                                                             
##    <int> <int> <chr>                                                            
##  1     1     4 "6/25/13      difficult        law: wide few fall brief         …
##  2     1     5 "6/26/13      week        and upon describe cent kind special kn…
##  3     1     6 "6/27/13      exact        electric afford wide radio what why  …
##  4     1     7 "6/28/13      four        this quarter decide increase end      …
##  5     1     8 "7/1/13       become        we with include offer wear          …
##  6     1     9 "7/2/13       stupid        piece expect rate too environment (1…
##  7     1    10 "7/2/13       lead       at today available land at left britain…
##  8     1    11 "                       police cook appoint (.3)"                
##  9     1    12 "7/3/13       pass       tell young age strategy call sense prac…
## 10     1    13 "                       if point party follow figure"            
## # … with 3,148 more rows
{{< /code >}}

This means that if we want to see page 4 now, we filter on the `page`
column:

{{< code r >}}

eg |> 
  filter(page == 4)

## # A tibble: 33 × 3
##     page  line text                                                             
##    <int> <int> <chr>                                                            
##  1     4     1 "4/22/14   brief    way politic go feed warm job (.3); wrong odd…
##  2     4     2 "                test miss milk simple, body bill feel key chap …
##  3     4     3 "                group mother list law (.9)"                     
##  4     4     4 "4/22/14   percent   lot bed‐settle state language associate par…
##  5     4     5 "                five cross turn"                                
##  6     4     6 "4/27/14   fact    wash drive as road open specific' apart‐beaut…
##  7     4     7 "4/28/14   heart    lady due exact keep claim receive' last‐clea…
##  8     4     8 "4/29/14   true    middle air evening visit business cake' presu…
##  9     4     9 "5/2/14    centre   stupid double same brother' thirteen program…
## 10     4    10 "                in ready"                                       
## # … with 23 more rows
{{< /code >}}

At this point we can see that we are in for a little trouble. The shape
of `text` suggests the data splits up into columns in this order: date,
timekeeper, description, hours, rate, fees, notes. (They may be out of
view here but the ends of the lines of `text` have numbers
corresponding to fees and so on.) Unfortunately, we can see that,
e.g. on lines 2 and 3 on page 4, some rows are blank except for
text and also do not start with anything that looks like a date. What
has happened is that the “description” column in the original PDF
document often has descriptions that run to several lines rather than
just one. When that happens, either the original data entry person or
(more likely) the PDF-generating software has inserted newlines so that
the full description will display on the page in its table cell. That’s
annoying, because the effect—after we have split our file on `\n`
characters—is that *some* records have part of their “description”
content moved to a new line, or series of lines. If the description had
been the *last* column in the original PDF then rejoining these
description-fragments to their correct row would have been easier. But
because it’s in the *middle* of the table things are more difficult. The
number of added description-fragments varies irregularly, too, anywhere
from one to eight or nine additional lines.

As noted earlier, if this were the sort of problem where I knew I’d be
encountering data in just this form often (a new PDF of a hundred-odd
pages of billing data coming in every week, or something) then this
would be the ideal spot to stop and ask, “How can I avoid getting myself
into this situation in the first place?” I’d go back to the initial
reading-in stage and try to see if there was something I could do to
immediately distinguish the description-fragment lines from “proper”
lines. I did think about it briefly, but no obvious (to me) solution
immediately presented itself. So, instead, I’m just going to keep going
and solve the problem as it stands.

As a first move, we can create a new column
that flags whether a line of text begins with something that looks like
a date. I know from the original records that every distinct billing
entry does in fact begin with a date, so this will be helpful.

{{< code r >}}
eg <- eg |> 
  mutate(has_date = str_detect(text, "^\\d{1,2}/\\d{1,2}/\\d{1,2}")) 

eg

## # A tibble: 3,158 × 4
##     page  line text                                                     has_date
##    <int> <int> <chr>                                                    <lgl>   
##  1     1     4 "6/25/13      difficult        law: wide few fall brief… TRUE    
##  2     1     5 "6/26/13      week        and upon describe cent kind s… TRUE    
##  3     1     6 "6/27/13      exact        electric afford wide radio w… TRUE    
##  4     1     7 "6/28/13      four        this quarter decide increase … TRUE    
##  5     1     8 "7/1/13       become        we with include offer wear … TRUE    
##  6     1     9 "7/2/13       stupid        piece expect rate too envir… TRUE    
##  7     1    10 "7/2/13       lead       at today available land at lef… TRUE    
##  8     1    11 "                       police cook appoint (.3)"        FALSE   
##  9     1    12 "7/3/13       pass       tell young age strategy call s… TRUE    
## 10     1    13 "                       if point party follow figure"    FALSE   
## # … with 3,148 more rows

{{< /code >}}


## Separating out the columns

So, cursed with the foreknowledge that this is not going to work properly, we
trim the front and end of each line of text. Then we separate out all
the columns into what *ought* to be the correct series of variable names
(which we wrote down above as `varnames`). We tell the `separate()`
function to split wherever it encounters more than two spaces in a row,
and to name the new columns. (Because I checked in advance, I know that there
aren’t any sentences where a period is followed by two spaces.
Two-spacers are moral monsters, by the way.) If there’s any extra
material we haven’t seen it will get filled to the right. In this step
we also add an explicit row id, just to help us keep track of things.

{{< code r >}}
eg <- eg |> 
  mutate(text = str_trim(text)) |> 
  separate(text, sep = "\\s{2,}", into = varnames, 
   fill = "right",
   extra = "merge") |> 
  rowid_to_column()
{{< /code >}}

Now what we have is at last starting to look more like a dataset:

{{< code r >}}
eg |> 
  filter(page == 4)

## # A tibble: 33 × 11
##    rowid  page  line date         timekeeper description hours rate  fees  notes
##    <int> <int> <int> <chr>        <chr>      <chr>       <chr> <chr> <chr> <chr>
##  1   100     4     1 4/22/14      brief      way politi… 1.2   635   762.… <NA> 
##  2   101     4     2 test miss m… <NA>       <NA>        <NA>  <NA>  <NA>  <NA> 
##  3   102     4     3 group mothe… <NA>       <NA>        <NA>  <NA>  <NA>  <NA> 
##  4   103     4     4 4/22/14      percent    lot bed‐se… 0.4   749   299.… <NA> 
##  5   104     4     5 five cross … <NA>       <NA>        <NA>  <NA>  <NA>  <NA> 
##  6   105     4     6 4/27/14      fact       wash drive… 1.3   635   825.… <NA> 
##  7   106     4     7 4/28/14      heart      lady due e… 5.4   635   3,42… <NA> 
##  8   107     4     8 4/29/14      true       middle air… 9.1   635   5,77… <NA> 
##  9   108     4     9 5/2/14       centre     stupid dou… 0.4   749   299.… <NA> 
## 10   109     4    10 in ready     <NA>       <NA>        <NA>  <NA>  <NA>  <NA> 
## # … with 23 more rows, and 1 more variable: has_date <lgl>
{{< /code >}}

You can see that, as expected, things did not go exactly as we would
have liked, thanks to the line fragments from the `description` column.
Each time we hit one of those we get a new line where the description
content ends up in the `date` column and all the other columns are
empty, hence the `<NA>` missing value designation. We need to fix this.

## Dealing with the description-fragments

Our goal is to get each description fragment re-attached to the
`description` field in the correct row, in the right order. How to do
this? The answer is always “Well there’s more than one way to do it.”
But here’s what I did. I know that if I can reliably *group* lines with
an identifier that says “These lines are all really from the same
billing record” I can solve my problem. So the problem becomes how to do
that. To begin with, I know that every row that starts with a date—where
`has_date` is `TRUE`—is the first line of a valid record. Many records
have only one line. But many others are followed by some number of
description-fragments, which continue for however long as they do. Then
we move on to the next record. So we need to distinguish the boundaries.
This is what led me to mess around with run-length encoding. In the end,
I didn’t actually need it to solve the problem, but I am going to keep
it here anyway. First I’ll show the simpler way to get the group id we
need. I’ll pick out just a few columns to make things easier to read. To
get a `groupid`, we make a variable that gets the value of `rowid` if that row that has a
date, and nothing (`NA`) otherwise:

{{< code r >}}
eg |> 
  select(page, rowid, has_date, description) |> 
  mutate(groupid = ifelse(has_date == TRUE, rowid, NA), 
         .after = has_date) |> 
  filter(page == 4)

## # A tibble: 33 × 5
##     page rowid has_date groupid description                                     
##    <int> <int> <lgl>      <int> <chr>                                           
##  1     4   100 TRUE         100 way politic go feed warm job (.3); wrong odd‐do…
##  2     4   101 FALSE         NA <NA>                                            
##  3     4   102 FALSE         NA <NA>                                            
##  4     4   103 TRUE         103 lot bed‐settle state language associate parent'…
##  5     4   104 FALSE         NA <NA>                                            
##  6     4   105 TRUE         105 wash drive as road open specific' apart‐beauty …
##  7     4   106 TRUE         106 lady due exact keep claim receive' last‐clean b…
##  8     4   107 TRUE         107 middle air evening visit business cake' presume…
##  9     4   108 TRUE         108 stupid double same brother' thirteen programme …
## 10     4   109 FALSE         NA <NA>                                            
## # … with 23 more rows
{{< /code >}}

Now, for every `NA` value of `groupid` we encounter, we use `fill()` to
copy down the nearest valid `groupid` above it. And those are our
groups. Here's the code with the `fill()` step:

{{< code r >}}
eg |> 
  select(page, rowid, has_date, description) |> 
  mutate(groupid = ifelse(has_date == TRUE, rowid, NA), 
         .after = has_date) |> 
  fill(groupid) |> 
  filter(page == 4)

## # A tibble: 33 × 5
##     page rowid has_date groupid description                                     
##    <int> <int> <lgl>      <int> <chr>                                           
##  1     4   100 TRUE         100 way politic go feed warm job (.3); wrong odd‐do…
##  2     4   101 FALSE        100 <NA>                                            
##  3     4   102 FALSE        100 <NA>                                            
##  4     4   103 TRUE         103 lot bed‐settle state language associate parent'…
##  5     4   104 FALSE        103 <NA>                                            
##  6     4   105 TRUE         105 wash drive as road open specific' apart‐beauty …
##  7     4   106 TRUE         106 lady due exact keep claim receive' last‐clean b…
##  8     4   107 TRUE         107 middle air evening visit business cake' presume…
##  9     4   108 TRUE         108 stupid double same brother' thirteen programme …
## 10     4   109 FALSE        108 <NA>                                            
## # … with 23 more rows
{{< /code >}}

That’s all we need to proceed. But because I experimented with it first,
here are two other variables that might be useful under other
circumstances. The first is the run-length sequence, written in a way
where every row that’s the start of a record has a value of zero, and
every description-fragment has a counter starting from one. The second,
calculated from that, is a variable that flags whether a line is a
single-line record or part of a multi-line record. We get this by
flagging it as “Multi” if either the current row’s run-length counter is
greater than zero *or* the run-length counter of the row below it is
greater than zero.

{{< code r >}}
eg |> 
  mutate(groupid = ifelse(has_date == TRUE, rowid, NA),
         rlecount = sequence(rle(!has_date)$lengths) * !has_date, 
         one_or_multi = if_else(rlecount > 0 | lead(rlecount > 0), "Multi", "One")) |> 
  fill(groupid) |> 
  relocate(has_date, one_or_multi, 
           rlecount, groupid, 
           .after = line) |> 
  filter(page == 4)

## # A tibble: 33 × 14
##    rowid  page  line has_date one_or_multi rlecount groupid date      timekeeper
##    <int> <int> <int> <lgl>    <chr>           <int>   <int> <chr>     <chr>     
##  1   100     4     1 TRUE     Multi               0     100 4/22/14   brief     
##  2   101     4     2 FALSE    Multi               1     100 test mis… <NA>      
##  3   102     4     3 FALSE    Multi               2     100 group mo… <NA>      
##  4   103     4     4 TRUE     Multi               0     103 4/22/14   percent   
##  5   104     4     5 FALSE    Multi               1     103 five cro… <NA>      
##  6   105     4     6 TRUE     One                 0     105 4/27/14   fact      
##  7   106     4     7 TRUE     One                 0     106 4/28/14   heart     
##  8   107     4     8 TRUE     One                 0     107 4/29/14   true      
##  9   108     4     9 TRUE     Multi               0     108 5/2/14    centre    
## 10   109     4    10 FALSE    Multi               1     108 in ready  <NA>      
## # … with 23 more rows, and 5 more variables: description <chr>, hours <chr>,
## #   rate <chr>, fees <chr>, notes <chr>
{{< /code >}}

Let’s put all that into an object called `eg_gid` for the whole data
set.

{{< code r >}}
eg_gid <- eg |> 
  mutate(groupid = ifelse(has_date == TRUE, rowid, NA),
         rlecount = sequence(rle(!has_date)$lengths) * !has_date, 
         one_or_multi = if_else(rlecount > 0 | lead(rlecount > 0), "Multi", "One")) |> 
  fill(groupid) |> 
  relocate(has_date, one_or_multi, 
           rlecount, groupid, 
           .after = line) 
{{< /code >}}

Next, we extract all the “true” first rows and put them in an object called `eg_first`. We can do this by filtering
on `has_date` …

{{< code r >}}
eg_first <- eg_gid |> 
  filter(has_date == TRUE) 
{{< /code >}}

… or, for the same effect, group by `groupid` and slice out the first
row of each group:

{{< code r >}}
eg_first <- eg_gid |> 
  group_by(groupid) |> 
  slice_head(n = 1) 

eg_first |> 
  filter(page == 4)

## # A tibble: 19 × 14
## # Groups:   groupid [19]
##    rowid  page  line has_date one_or_multi rlecount groupid date    timekeeper
##    <int> <int> <int> <lgl>    <chr>           <int>   <int> <chr>   <chr>     
##  1   100     4     1 TRUE     Multi               0     100 4/22/14 brief     
##  2   103     4     4 TRUE     Multi               0     103 4/22/14 percent   
##  3   105     4     6 TRUE     One                 0     105 4/27/14 fact      
##  4   106     4     7 TRUE     One                 0     106 4/28/14 heart     
##  5   107     4     8 TRUE     One                 0     107 4/29/14 true      
##  6   108     4     9 TRUE     Multi               0     108 5/2/14  centre    
##  7   110     4    11 TRUE     One                 0     110 5/9/14  regard    
##  8   111     4    12 TRUE     Multi               0     111 5/15/14 grant     
##  9   113     4    14 TRUE     One                 0     113 5/15/14 achieve   
## 10   114     4    16 TRUE     Multi               0     114 5/20/14 less      
## 11   116     4    18 TRUE     One                 0     116 5/23/14 finance   
## 12   117     4    19 TRUE     One                 0     117 5/23/14 score     
## 13   118     4    20 TRUE     Multi               0     118 6/9/14  pence     
## 14   121     4    24 TRUE     One                 0     121 6/10/14 traffic   
## 15   122     4    25 TRUE     One                 0     122 6/11/14 short     
## 16   123     4    26 TRUE     Multi               0     123 6/16/14 book      
## 17   129     4    33 TRUE     One                 0     129 6/17/14 knock     
## 18   130     4    34 TRUE     Multi               0     130 6/22/14 any       
## 19   132     4    36 TRUE     One                 0     132 6/23/14 part      
## # … with 5 more variables: description <chr>, hours <chr>, rate <chr>,
## #   fees <chr>, notes <chr>
{{< /code >}}

Bear in mind that `eg_first` contains the first rows of *all* the
records in the data. It includes both the records that are just one row
in length *and* the first line only of any record that also has
description-fragments on subsequent lines.

With this table in hand, we can take advantage of `dplyr`’s core
competence of summarizing tables. We start with all the data, but this
time we use `filter` to get all those rows where `rlecount` is not zero.
Then we group those rows by `groupid` and summarize their `date` field
(which is where all the decription-fragments are, remember). How do we
summarize this text? In this case, by creating a new column called
`extra_text` and pasting all the `date` text from any rows within the
group into a single string:

{{< code r >}}
eg_gid |> 
  filter(rlecount != 0) |> 
  group_by(groupid) |> 
  summarize(extra_text = paste0(date, collapse = ""))

## # A tibble: 891 × 2
##    groupid extra_text                                                           
##      <int> <chr>                                                                
##  1       7 police cook appoint (.3)                                             
##  2       9 if point party follow figure                                         
##  3      20 recognize occasion number                                            
##  4      22 (.3); sit knock think along (.3)                                     
##  5      24 experience build window. note hospital land                          
##  6      28 deep gas behind nation; major organize wage express week; shootseven…
##  7      31 land closes they operate (.7); word argue ring wind previous station…
##  8      35 chairman will mother; encourage sir body than pair finance; likely   
##  9      44 story; close set wee period fire bar honest spend shoe form; quarter 
## 10      46 miss manage kind; away express recommend start now (1.1); social sid…
## # … with 881 more rows
{{< /code >}}


Now we now we can get all the description-fragments down to one-row per
record, and have them identified by their `groupid`. This means we can
join them to `eg_first`, the table of all record first-rows. So we go
back to `eg_gid`, do our summarizing, then right-join this result to the
true first row table, `eg_first`, joining by `groupid`. Then we make a
new column called `full_description` and paste the `description` and
`extra_text` fields together.

{{< code r >}}
eg_clean <- eg_gid |> 
  filter(rlecount != 0) |> 
  group_by(groupid) |> 
  summarize(extra_text = paste0(date, collapse = "")) |> 
  right_join(eg_first, by = "groupid") |> 
  mutate(full_description = paste(description, extra_text)) |> 
  select(rowid, groupid, page:timekeeper, hours:fees, 
         full_description) 
{{< /code >}}

We’re nearly finished. How is page 4 doing?

{{< code r >}}
eg_clean |> 
  select(page, line, groupid, one_or_multi, full_description) |> 
  filter(page == 4)

## # A tibble: 19 × 5
##     page  line groupid one_or_multi full_description                            
##    <int> <int>   <int> <chr>        <chr>                                       
##  1     4     1     100 Multi        way politic go feed warm job (.3); wrong od…
##  2     4     4     103 Multi        lot bed‐settle state language associate par…
##  3     4     9     108 Multi        stupid double same brother' thirteen progra…
##  4     4    12     111 Multi        number free as late prepare address individ…
##  5     4    16     114 Multi        thursday paint show favour (1); miss clean …
##  6     4    20     118 Multi        god especial colour sex honest'front begin …
##  7     4    26     123 Multi        point sunday last eat wednesday worry argue…
##  8     4    34     130 Multi        period count fish wear, sick involve knock …
##  9     4     6     105 One          wash drive as road open specific' apart‐bea…
## 10     4     7     106 One          lady due exact keep claim receive' last‐cle…
## 11     4     8     107 One          middle air evening visit business cake' pre…
## 12     4    11     110 One          consider down shop sit Christmas wish NA    
## 13     4    14     113 One          feel part pair structure tuesday plan work …
## 14     4    18     116 One          measure understand strategy NA              
## 15     4    19     117 One          danger girl quite no it. happen NA          
## 16     4    24     121 One          hate still for heat except NA               
## 17     4    25     122 One          presume yes imagine hold mean eat fill allo…
## 18     4    33     129 One          but please income trouble why cent NA       
## 19     4    36     132 One          large boy score count unite NA
{{< /code >}}


Looking good. You can see that all the `Multi` rows are in one bloc and
followed by all the `One` rows, after the join. Now all that remains is
for us to clean up the remaining columns. For example, some entries in
the `rate` and `fee` columns have additional notes after their numbers,
so we `separate` those out on the space character. We strip unnecessary
commas from the numeric columns. And then we fix their types, turning
the `rate` and `fee` columns from character to numeric and making the
`date` column a proper date. At the end we use `arrange()` to restore
the row-ordering that got reshuffled when we joined the full lines in
to the main table.

{{< code r >}}
eg_clean <- eg_clean |> 
  separate(fees, sep = "\\s{1}", 
           into = c("fees", "fee_note"), 
           extra = "merge", fill = "right") |> 
  separate(rate, sep = "\\s{1}", 
           into = c("rate", "rate_note"), 
           extra = "merge", 
           fill = "right") |> 
  mutate(fees = str_remove_all(fees, ","), # strip commas from numbers
         rate = str_remove_all(rate, ","),
         fees = as.numeric(fees),
         rate = as.numeric(rate),
         hours = as.numeric(hours), 
         date = lubridate::mdy(date), 
         full_description = str_remove(full_description, " NA$")) |> 
  arrange(rowid)

{{< /code >}}

And we’re done:

{{< code r >}}
eg_clean |> 
  filter(page == 4) |> 
  select(date, hours, rate, full_description)


## # A tibble: 19 × 4
##    date       hours  rate full_description                                      
##    <date>     <dbl> <dbl> <chr>                                                 
##  1 2014-04-22   1.2   635 way politic go feed warm job (.3); wrong odd‐down res…
##  2 2014-04-22   0.4   749 lot bed‐settle state language associate parent'start …
##  3 2014-04-27   1.3   635 wash drive as road open specific' apart‐beauty learn  
##  4 2014-04-28   5.4   635 lady due exact keep claim receive' last‐clean brillia…
##  5 2014-04-29   9.1   635 middle air evening visit business cake' presume‐obvio…
##  6 2014-05-02   0.4   749 stupid double same brother' thirteen programme statio…
##  7 2014-05-09   0.1   635 consider down shop sit Christmas wish                 
##  8 2014-05-15   0.4   635 number free as late prepare address individual (.5); …
##  9 2014-05-15   0.2   749 feel part pair structure tuesday plan work continue b…
## 10 2014-05-20   3.1   749 thursday paint show favour (1); miss clean fund (1.5)…
## 11 2014-05-23   0.1   635 measure understand strategy                           
## 12 2014-05-23   0.1   749 danger girl quite no it. happen                       
## 13 2014-06-09   2.7   749 god especial colour sex honest'front begin rate site …
## 14 2014-06-10   0.3   635 hate still for heat except                            
## 15 2014-06-11   0.2   749 presume yes imagine hold mean eat fill allow manage f…
## 16 2014-06-16   4.2   749 point sunday last eat wednesday worry argue; remember…
## 17 2014-06-17   0.6   749 but please income trouble why cent                    
## 18 2014-06-22   3.2   749 period count fish wear, sick involve knock ago either…
## 19 2014-06-23   2.9   635 large boy score count unite
{{< /code >}}


A clean and tidy dataset ready to be investigated properly. Unhappy in its own way, but now at least in a form where we can ask it some questions. 
