---
title: "Reading Remote Data Files"
date: 2023-03-25T19:44:56-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---


Sometimes data arrives as a series of individual files each of which is organized in the same way---which is to say, each of which has the same variables, features, or columns. Imagine a series of tables reporting mandated information about every school in the state, or a hundred spreadsheets each with information about a different country, or thirty seven CSVs each with the same columns of information about representatives in each U.S. Congressional Session since 1945. Seeing as these data were not provided to us as a single big table we generally want to make it into one. If the files are CSVs on our local computer, R has some nice functions that allow us to iterate over a vector of filenames and produce a tidy table of data. 

### Case 1: Lots of local CSV files

For example, our Congressional project might have a `data` folder with a subfolder called `congress`. We can get a listing of the CSV files inside it like this:

{{< code r >}}

filenames <- dir(path = here("files", "data", "congress"),
                 pattern = "*.csv",
                 full.names = TRUE)

filenames[1:15] # Just displaying the first 15

##  [1] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/01_79_congress.csv"
##  [2] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/02_80_congress.csv"
##  [3] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/03_81_congress.csv"
##  [4] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/04_82_congress.csv"
##  [5] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/05_83_congress.csv"
##  [6] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/06_84_congress.csv"
##  [7] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/07_85_congress.csv"
##  [8] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/08_86_congress.csv"
##  [9] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/09_87_congress.csv"
## [10] "/Users/kjhealy/Documents/courses/vsd/files/data/congress/10_88_congress.csv"


{{< /code >}}


We can feed that vector to `read_csv()` and it will be quite happy. It reads each file and binds them all together by row, in a big stack. (Again, remember we know _ex ante_ that the files all have the same column structure. We'll get errors or warnings if this isn't true.)


{{< code r >}}
df <- read_csv(filenames, id = "path",
                name_repair = janitor::make_clean_names)

df |> 
  mutate(congress = str_extract(path, "_\\d{2,3}_congress"), 
         congress = str_extract(congress, "\\d{2,3}")) |> 
  relocate(congress)

## # A tibble: 20,580 × 27
##    congress path   last  first middle suffix nickname born  death sex   position
##    <chr>    <chr>  <chr> <chr> <chr>  <chr>  <chr>    <chr> <chr> <chr> <chr>   
##  1 79       /User… Aber… Thom… Gerst… <NA>   <NA>     05/1… 01/2… M     U.S. Re…
##  2 79       /User… Adams Sher… <NA>   <NA>   <NA>     01/0… 10/2… M     U.S. Re…
##  3 79       /User… Aiken Geor… David  <NA>   <NA>     08/2… 11/1… M     U.S. Se…
##  4 79       /User… Allen Asa   Leona… <NA>   <NA>     01/0… 01/0… M     U.S. Re…
##  5 79       /User… Allen Leo   Elwood <NA>   <NA>     10/0… 01/1… M     U.S. Re…
##  6 79       /User… Almo… J.    Linds… Jr.    <NA>     06/1… 04/1… M     U.S. Re…
##  7 79       /User… Ande… Herm… Carl   <NA>   <NA>     01/2… 07/2… M     U.S. Re…
##  8 79       /User… Ande… Clin… Presba <NA>   <NA>     10/2… 11/1… M     U.S. Re…
##  9 79       /User… Ande… John  Zuing… <NA>   <NA>     03/2… 02/0… M     U.S. Re…
## 10 79       /User… Andr… Augu… Herman <NA>   <NA>     10/1… 01/1… M     U.S. Re…
## # ℹ 20,570 more rows
## # ℹ 16 more variables: party <chr>, state <chr>, district <chr>, start <chr>,
## #   end <chr>, religion <chr>, race <chr>, educational_attainment <chr>,
## #   job_type1 <chr>, job_type2 <chr>, job_type3 <chr>, job_type4 <chr>,
## #   job_type5 <chr>, mil1 <chr>, mil2 <chr>, mil3 <chr>

{{< /code >}}

You can see how `path` is created as an id column, to help us keep track of which file each row of data came from. We create the `congress` column after we read in the data by extracting the congressional session from the filename with a regular expression. But you can see how nice it is to have this facility to read data in like this. 


### Case 2: Lots of local Excel files

What if the data is in a file format whose read-in function doesn't know this trick about accepting a vector of file paths? In that case we can do what `read_csv()` is doing behind the scenes and _map_ the vector of file names to the read-in function, and explicitly bind the results together. The default `map()` function binds by making a list of whatever you did.  So for example, if our Congressional data were all Excel files in `.xlsx` format, and they all had the same structure with a header row of column names, we could write this:

{{< code r >}}

df <- filenames |> 
  set_names() |> 
  map(\(x) readxl::read_xlsx(x)) |> 
  list_rbind(names_to = "path")
{{< /code >}}


And we would get (almost) the same result. Here we start with the vector of filenames and pass it down a pipe to `set_names()`, which usefully labels the elements of the filename vector with their values (in this case, the file paths). Then we pass it along to `map()`, which goes ahead and maps, or applies, the `read_xlsx()` function to each element of the filenames vector---i.e. to each file. The `\(x)` notation there is a the shorthand for an anonymous function. Each element of the `filenames` vector becomes the `x` that is read in turn. Mapping a function like this is just a kind of iteration where you don't have to explicitly write a loop. This makes it easier to cleanly compose sequences or chains of functions without having to create a bunch of placeholder objects, declare counters, and so on. 

### Case 3: Lots of remote CSV or Excel files in a bare directory

Now, what if the files we want are stored remotely on a server? These days there's often an API for such things. But quite often, even now, you may find yourself dealing (as I did yesterday) with a bare directory of files that looks like this:

{{% figure src="ftp-listing.png" alt="A listing of CDC life-table spreadsheets" caption="A listing of state-level life-tables from the National Center for Health Statistics" %}}


This is a directory of state-by-state [life tables](https://en.wikipedia.org/wiki/Life_table) associated with a CDC report. Again, we want them (or, as we'll see, some of them) as a single table. 

Now, if these were provided as CSVs our task would be a little easier because in addition to being able to deal with a vector of filenames at once, `read_csv()`, and indeed all the read-in functions in  `readr` in general, will happily read URLs as well as local file paths. However, the `read_xlsx()` function in the `readxl` package can't do this yet. It only wants file paths. A second issue is that the Excel files themselves are not entirely tidy. At the top they look like this:

{{% figure src="excel-lifetable.png" alt="Excel lifetable." caption="The top of a state-level life table Excel file." %}}

Those first two rows are a mild violation of one of the rules of thumb for entering data in spreadsheets, helpfully outlined by [Karl Broman and Kara Woo](https://www.tandfonline.com/doi/full/10.1080/00031305.2017.1375989). The first row is metadata; the second is a more verbose description of the standard lifetable headers in the third row. Except for Age, which is not labeled in the _third_ row. That big box labeled "Age (years)" is actually an super-sized _second_ row. That means the first element of row three, our actual column headers, is blank! This is annoying. Fortunately these are easily dealt with, as we can just tell our read function to skip those two lines. There's also a `Source` row at the bottom (not shown here) that we'll have to strip out. 

But the first order of business is getting a vector of the actual file URLs to download. You could just copy and paste the listing, like an animal, but we are not going to do that. Instead, we'll look at two ways to get the file listing programmatically. First, we'll take advantage of the old-school ftp-style directory listing to get the file names. We'll do this using R's implementation of `curl`.

{{< code r >}}
## The directory location
url_loc <- "ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/NVSR/71-02/"

## Prepare the connection
list_files <- curl::new_handle()
curl::handle_setopt(list_files, ftp_use_epsv = TRUE, dirlistonly = TRUE)

## Open the connection as an FTP listing
con <- curl::curl(url = paste0("ftp://", url_loc), open = "r", handle = list_files)

## Get the file names
files <- readLines(con)

## Close the connection 
close(con)

files[1:10] # Just show the first ten
  
## [1] "AK1.xlsx" "AK2.xlsx" "AK3.xlsx" "AK4.xlsx" "AL1.xlsx" "AL2.xlsx" "AL3.xlsx" "AL4.xlsx" "AR1.xlsx" "AR2.xlsx"

{{< /code >}}

We open a connection to the remote folder and use `ftp_use_epsv` and `dirlistonly` flags to restrict what we get back. Then we read the lines recieved from the FTP server into the `files` object. This gives us the bare file names of everything in this remote folder. 

The spreadsheets are named according to a scheme with a two-letter state abbreviation followed by a number. The number signifies the kind of life-table it is. The files ending in `1` have the life-table for the population as a whole, which is what we are interested in. 


Literally the _day after_ I wrote this example, the CDC turned off FTP access to these pages. Now they are HTTPS only. So the code above no-longer works. However, alternatively and a little more straightforwardly we can use `rvest` to get the filenames, extract all the link elements, and get the text from inside of them. The `rvest` package handles the business of opening and closing web connections for us. It also provides handy functions to get and extract the text of pages based on there position in a CSS selection hierarchy (which isn't relevant here) or based on particular HTML elements. First we get the page, then we grab all the link elements in it, and then convert their content to a character vector: 

{{< code r >}}

files <- rvest::read_html("https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/NVSR/71-02/") |> 
  rvest::html_elements("a") |> 
  rvest::html_text2()

files 

## [1] "[To Parent Directory]" "AK1.xlsx"              "AK2.xlsx"              "AK3.xlsx"             
##   [5] "AK4.xlsx"              "AL1.xlsx"              "AL2.xlsx"              "AL3.xlsx"             
##   [9] "AL4.xlsx"              "AR1.xlsx"              "AR2.xlsx"              "AR3.xlsx"             
##  [13] "AR4.xlsx"              "AZ1.xlsx"              "AZ2.xlsx"              "AZ3.xlsx"

{{< /code >}}

In this case we'd need to clean up the resulting vector (to remove navigation links to the parent directory and so on) but would end up in the same place.

Now that we have a vector of the file names (but just the file _names_ at this point) we can do a bit of prep. As you can see we use `set_names()` again. It's very handy. This time we make each element's name attribute be the state abbreviation rather than the full URL.

{{< code r >}}
## Just take files containing a `1``
fname_stubs <- files[str_detect(files, "1")]

## State abbreviations
fname_labs <- substr(fname_stubs, start = 1, stop = 2)

## Construct the filenames and give them a name attribute of the 2-letter state
## abbreviation, so they are trackable in the data frame we're about to make.
fnames <- paste0("https://", url_loc, fname_stubs)
fnames <- set_names(fnames, fname_labs)


fnames[1:4]

##                                                                               AK 
## "https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/NVSR/71-02/AK1.xlsx" 
##                                                                               AL 
## "https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/NVSR/71-02/AL1.xlsx" 
##                                                                               AR 
## "https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/NVSR/71-02/AR1.xlsx" 
##                                                                               AZ 
## "https://ftp.cdc.gov/pub/Health_Statistics/NCHS/Publications/NVSR/71-02/AZ1.xlsx" 

{{< /code >}}


The label makes it much easier to create a `state` id column, because after we `map()`, `list_rbind()` can use the label as its index counter. 

The last step is to get `read_xlsx()` to get all the remote files, which it does not have the capacity to do directly. It won't even accept a single URL, it only wants file paths. So we will have to write a one-off function that gets the file and puts it in a temporary location that `read_xlsx()` _can_ see.

{{< code r >}}
# Feed this an http URL from the CDC directory
get_lifetable <- function(x) {
  httr::GET(x, httr::write_disk(tf <- tempfile(fileext = ".xlsx")))
  readxl::read_xlsx(tf, skip = 2, .name_repair = "unique_quiet") |>
    rename("age" = `...1`) |>
    filter(!str_detect(age, "SOURCE")) # remove trailing source line
}

{{< /code >}}

The first line inside the function uses `httr` to `GET` the file, and immediately save it locally using `write_disk()`, taking care to specify that the temporary file we save should have an `.xlsx` extension. (Otherwise `read_xlsx()` will complain.) The second line actually reads in the file that's been downloaded. We take the opportunity to suppress chatter about the name repair that has to happen on that blank first column header in the third row, rename that location `age`, and strip the trailing line about the source of the data that I mentioned above. 

This function reads _one_ given URL. Now we just need to map a vector of URLs to it and bind the results by row:

{{< code r >}}
life_tabs <- fnames |>
  map(\(x) get_lifetable(x)) |>
  list_rbind(names_to = "state")
{{< /code >}}


The `map()` function makes a list of all the data frames and `list_rbind()` binds them. As I said, a nice thing is that will use the name attribute of `fnames` to create its id column, which we can therefore name `state`, because the name of each URL element is the abbreviation for the state it is providing data about. 

And we're done:

{{< code r >}}

life_tabs

## # A tibble: 5,151 × 8
##    state age          qx      lx     dx     Lx       Tx    ex
##    <chr> <chr>     <dbl>   <dbl>  <dbl>  <dbl>    <dbl> <dbl>
##  1 AK    0–1   0.00513   100000  513.   99623. 7661992   76.6
##  2 AK    1–2   0.000308   99487.  30.6  99472. 7562368.  76.0
##  3 AK    2–3   0.0000992  99457.   9.87 99452. 7462896.  75.0
##  4 AK    3–4   0.000194   99447.  19.3  99437. 7363444.  74.0
##  5 AK    4–5   0.000192   99428.  19.1  99418. 7264007   73.1
##  6 AK    5–6   0.000288   99408.  28.6  99394. 7164589   72.1
##  7 AK    6–7   0.000328   99380.  32.6  99364. 7065195   71.1
##  8 AK    7–8   0.000348   99347.  34.6  99330. 6965832.  70.1
##  9 AK    8–9   0.000349   99313.  34.6  99295. 6866502.  69.1
## 10 AK    9–10  0.000333   99278.  33.1  99261. 6767206   68.2
## # ℹ 5,141 more rows
## # ℹ Use `print(n = ...)` to see more rows

{{< /code >}}

A few thousand rows of data programmatically extracted from fifty spreadsheets, now ready for a bit more cleaning and any amount of confusion about what it is that life-tables actually show.
