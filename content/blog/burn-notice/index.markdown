---
title: "Burn Notice"
date: 2025-02-16T15:18:04-05:00
categories: [R,nerdery,Apple]
footnotes: false
htmlwidgets: false
mathjax: false
---

Your Phone and Watch have a lot of data about you. I mean, like, a _lot_. Someone should really write [a book all about the general issues for society that this raises](https://theordinalsociety.com). Yesterday I decided I wanted to take a look specifically at the health data on my iPhone. I'm not a huge user of the iPhone's or the Apple Watch's health features. I don't use or subscribe to Apple Fitness+, for example. I'm not in any studies. But I do have a bathroom scale that records data and I allow the Watch to keep an eye on my activity. This means that, like so many people, I have grown to heartily despise the blandly affirming Californian inside those devices who periodically encourages me to take a walk, or stand up, or be mindful, and so forth. 

I went to the Health app and selected my ID photo up in the top right corner, then scrolled down to "Export All Health Data". When I did, it asked me was I sure I wanted to do this, as it might take a while. Very stupidly, my first thought was "Eh, how much data can there be?" Again, I should make time to [read a good book on this topic](https://theordinalsociety.com). I think I vaguely had in mind a CSV with a few thousand rows of Withings Scale Meaurements. After a minute or two, what I got was a zip file that expanded to a folder with about four or five gigabytes of stuff inside. 


{{% figure src="health-download.png" alt="Inside the export folder." caption="Inside the export folder." %}}

As I say, I'm not a big direct user of Apple's own health offerings. So there were a few files in the ECG folder, each about 120KB in size. And there were just a few [GPX](https://en.wikipedia.org/wiki/GPS_Exchange_Format) files in the workout-routes folder, each about half a megabyte in size. Everything else was in `export_cda.xml` and `export.xml`. 

[XML](https://en.wikipedia.org/wiki/XML) is, amongst other things, a way of specifying the contents of arbitrary data structures in a flat file while also providing that data in the file. It's a real pain in the neck to deal with, too. The `export_cda.xml` file is a specific kind of XML spec, a [Clinical Document Architecture](https://en.wikipedia.org/wiki/Clinical_Document_Architecture) file that in principle allows for medical records to be written and transported in a standard format. This is what allows, for example, your doctor's or dentist office to seamlessly accept medical records from other providers and smoothly integrate them into their own record system, just prior to asking you to fill it all out again on paper each time you visit them. Like your doctor's office, I decided to keep away from this file because it is very complicated and no-one knows how it works.

Instead I took a look at the larger file, `export.xml`. It is structurally simpler. It consists of some number of blobs of data, delimited by `Record` nodes. My goal was to get R to parse that file and work with the various pieces of data in there. Starting out I did not know how many distinct pieces of data were in there. 

Working with XML is, as I say, a pain. Professional programmers no doubt have more efficient tools for dealing with this stuff (such as, for example, better ways to extract the file's schema and apply it directly to reconstruct the data). I just went ahead and had R ingest the whole thing, stacking all the `Record` pieces up in a single large table.

{{< code r >}}
library(tidyverse)
library(xml2)
library(here)

raw <- read_xml(here("raw", "export.xml"))
apple_health_all <- raw |>
  xml_find_all("//Record") |>
  xml_attrs() |>
  bind_rows()
{{< /code >}}

This took about three minutes, which is a long time. Unfortunately there's no straightforward way to make it go faster, because the xml file is stored with pointers and you can't parallelize the reading-in easily with those. I'd have had to split it up first, which is the thing I'm trying to do to begin with. As I say, there is definitely a better way to do this. However, I only had to do it once. What did we end up with?

{{< code r >}}
> apple_health_all
# A tibble: 7,808,311 × 9
   type                                  sourceName sourceVersion device                                                                              unit  creationDate startDate 
   <chr>                                 <chr>      <chr>         <chr>                                                                               <chr> <chr>        <chr>     
 1 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 2 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 3 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 4 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 5 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 6 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 7 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 8 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
 9 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
10 HKQuantityTypeIdentifierBodyMassIndex Withings   6050301       <<HKDevice: 0x301fb1cc0>, name:Body+, manufacturer:Withings, model:Withings Scale,… count 2024-08-31 … 2024-05-… 
# ℹ 7,808,301 more rows
# ℹ Use `print(n = ...)` to see more rows
{{< /code >}}

Nearly _eight million_ rows of data! Entirely about myself! I am not that interesting. At this point I just saved the file out to disk:

{{< code r >}}
write_tsv(apple_health_all, here("data", "apple_health_all.tsv"))
{{< /code >}}

I wrote it out as a tab-delimited rather than a comma-delimited file just because that `device` column is full of comma-separated information (about my bathroom scale) and I didn't want to make trouble for myself later. 

Originally what I wanted to do at this point was to read the whole TSV file back into memory via R's interface with [DuckDB](https://duckdb.org). DuckDB is a very fast in-memory database with many attractive features for data analysis. Big databases out in the world are optimized for things like very rapidly adding and deleting records (i.e. rows), and are carefully designed to be indexed on just the required number of keys. But when we're working with data, we're generally never adding or subtracting rows to the main dataset. We just want to summarize it really fast and that is hard when it's large with respect to memory. DuckDB reads in large amounts of data very quickly and by default indexes all the columns. It plays [very nicely](https://duckplyr.tidyverse.org) with [dplyr](https://dplyr.tidyverse.org) and other R data tabulation engines. 

Annoyingly, getting the data re-ingested via DuckDB was tricky because the `export.xml` file is essentially a bunch of different datasets stacked one on top of the other. They _nearly_ all have the same structure but _not quite_. I could have gone down the road of figuring out (via the XML) what these fields all were and how they differed across sections of the data. But I was impatient and instead I decided to just split the data frame into its component parts. 

First we read it back in, with `read_tsv()`. This is extremely fast, as behind the scenes it uses [`vroom`](https://vroom.r-lib.org) to get everything. 

{{< code r >}}
df <- read_tsv(here("data", "apple_health_all.tsv"),
               col_types = cols(
                 type = col_character(),
                 sourceName = col_character(),
                 sourceVersion = col_character(),
                 device = col_character(),
                 unit = col_character(),
                 creationDate = col_character(),
                 startDate = col_character(),
                 endDate = col_character(),
                 value = col_character()
               )) |>
  rowid_to_column()
{{< /code >}}

Here I specifically make every column of type `character` because we're not going to be computing on this data frame. I also add an explicit row id. 

Next, we extract the group names of the `type` column. We're going to use this information in a moment to name the new data files we'll be making. 

{{< code r >}}

grp_keys <- df |>
  group_by(type) |>
  group_keys()

grp_keys
#> # A tibble: 48 × 1
#>    type                                                      
#>    <chr>                                                     
#>  1 HKCategoryTypeIdentifierAppleStandHour                    
#>  2 HKCategoryTypeIdentifierAudioExposureEvent                
#>  3 HKCategoryTypeIdentifierLowHeartRateEvent                 
#>  4 HKCategoryTypeIdentifierMindfulSession                    
#>  5 HKCategoryTypeIdentifierSleepAnalysis                     
#>  6 HKDataTypeSleepDurationGoal                               
#>  7 HKQuantityTypeIdentifierActiveEnergyBurned                
#>  8 HKQuantityTypeIdentifierAppleExerciseTime                 
#>  9 HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances
#> 10 HKQuantityTypeIdentifierAppleSleepingWristTemperature     
#> # ℹ 38 more rows

{{< /code >}}

We have forty eight individual datasets. Let's convert these to a vector of strings we can use as filenames:

{{< code r >}}
fnames <- grp_keys |>
  pull(type) |>
  paste0(".csv")

fnames[1:5]
#> [1] "HKCategoryTypeIdentifierAppleStandHour.csv"     "HKCategoryTypeIdentifierAudioExposureEvent.csv" "HKCategoryTypeIdentifierLowHeartRateEvent.csv" 
#> [4] "HKCategoryTypeIdentifierMindfulSession.csv"     "HKCategoryTypeIdentifierSleepAnalysis.csv"
{{< /code >}}

Next comes the elegant bit. We have a vector of names that's the same length as the number of unique elements in our dataframe's `type` column. So we split the big dataframe into a list of dataframes by `type` and name the list elements with the corresponding file name. Then we walk the list and write out each element of it as its own CSV file, using the name as the file name. The call to `iwalk()` lets us write an anonymous function that refers to the list element `x` and its name `idx` and applies `write_csv()` to each element in turn. Nice.

{{< code r >}}
df |>
  group_split(type) |>
  set_names(fnames) |>
  iwalk(\(x, idx) write_csv(x, here::here("data", idx)))
{{< /code >}}

Now we can look in the `data/` folder:

{{< code r >}}
fs::dir_ls(here("data"))
#> data/HKCategoryTypeIdentifierAppleStandHour.csv
#> data/HKCategoryTypeIdentifierAudioExposureEvent.csv
#> data/HKCategoryTypeIdentifierLowHeartRateEvent.csv
#> data/HKCategoryTypeIdentifierMindfulSession.csv
#> data/HKCategoryTypeIdentifierSleepAnalysis.csv
#> data/HKDataTypeSleepDurationGoal.csv
#> data/HKQuantityTypeIdentifierActiveEnergyBurned.csv
#> data/HKQuantityTypeIdentifierAppleExerciseTime.csv
#> data/HKQuantityTypeIdentifierAppleSleepingBreathingDisturbances.csv
#> data/HKQuantityTypeIdentifierAppleSleepingWristTemperature.csv
#> data/HKQuantityTypeIdentifierAppleStandTime.csv
#> data/HKQuantityTypeIdentifierAppleWalkingSteadiness.csv
#> data/HKQuantityTypeIdentifierBasalEnergyBurned.csv
#> data/HKQuantityTypeIdentifierBodyFatPercentage.csv
#> data/HKQuantityTypeIdentifierBodyMass.csv
#> data/HKQuantityTypeIdentifierBodyMassIndex.csv
#> data/HKQuantityTypeIdentifierDistanceCycling.csv
#> data/HKQuantityTypeIdentifierDistanceRowing.csv
#> data/HKQuantityTypeIdentifierDistanceWalkingRunning.csv
#> data/HKQuantityTypeIdentifierEnvironmentalAudioExposure.csv
#> data/HKQuantityTypeIdentifierEnvironmentalSoundReduction.csv
#> data/HKQuantityTypeIdentifierFlightsClimbed.csv
#> data/HKQuantityTypeIdentifierHeadphoneAudioExposure.csv
#> data/HKQuantityTypeIdentifierHeartRate.csv
#> data/HKQuantityTypeIdentifierHeartRateRecoveryOneMinute.csv
#> data/HKQuantityTypeIdentifierHeartRateVariabilitySDNN.csv
#> data/HKQuantityTypeIdentifierHeight.csv
#> data/HKQuantityTypeIdentifierLeanBodyMass.csv
#> data/HKQuantityTypeIdentifierPhysicalEffort.csv
#> data/HKQuantityTypeIdentifierRespiratoryRate.csv
#> data/HKQuantityTypeIdentifierRestingHeartRate.csv
#> data/HKQuantityTypeIdentifierRowingSpeed.csv
#> data/HKQuantityTypeIdentifierRunningGroundContactTime.csv
#> data/HKQuantityTypeIdentifierRunningPower.csv
#> data/HKQuantityTypeIdentifierRunningSpeed.csv
#> data/HKQuantityTypeIdentifierRunningStrideLength.csv
#> data/HKQuantityTypeIdentifierRunningVerticalOscillation.csv
#> data/HKQuantityTypeIdentifierSixMinuteWalkTestDistance.csv
#> data/HKQuantityTypeIdentifierStairAscentSpeed.csv
#> data/HKQuantityTypeIdentifierStairDescentSpeed.csv
#> data/HKQuantityTypeIdentifierStepCount.csv
#> data/HKQuantityTypeIdentifierTimeInDaylight.csv
#> data/HKQuantityTypeIdentifierVO2Max.csv
#> data/HKQuantityTypeIdentifierWalkingAsymmetryPercentage.csv
#> data/HKQuantityTypeIdentifierWalkingDoubleSupportPercentage.csv
#> data/HKQuantityTypeIdentifierWalkingHeartRateAverage.csv
#> data/HKQuantityTypeIdentifierWalkingSpeed.csv
#> data/HKQuantityTypeIdentifierWalkingStepLength.csv
#> data/apple_health_all.tsv
{{< /code >}}

You can see that some of these files are prefixed with `HKQuantityTypeIdentifier` and others with `HKCategoryTypeIdentifier`. One, a 221 byte file, is prefixed with `HKDataType` and is my `SleepDurationGoal`. It consists a single row with the frankly delusional value of "8". Small differences between the Quantity and Category type files were, I think, responsible for DuckDB complaining. The named columns are the same across all the records but I think they vary just enough in terms of what the read engine wants that when it got to one of them it choked. 

The largest of these files is 829.8MB file measuring `ActiveEnergyBurned`. Records for this quantity are generated when you start doing something long enough for either your iPhone or your Watch to notice. Here's what it looks like when read in by itself:

{{< code r >}}
burn_df
#> # A tibble: 2,658,839 × 10
#>      rowid type                                  sourceName sourceVersion device unit  creationDate        startDate           endDate             value
#>      <int> <chr>                                 <chr>      <chr>         <chr>  <chr> <dttm>              <dttm>              <dttm>              <dbl>
#>  1 3910445 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:43:01 2024-09-17 12:41:01 2024-09-17 12:42:02 0.389
#>  2 3910446 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:44:23 2024-09-17 12:42:02 2024-09-17 12:42:54 1.10 
#>  3 3910447 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:44:26 2024-09-17 12:42:54 2024-09-17 12:43:34 1.83 
#>  4 3910448 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:47:55 2024-09-17 12:43:55 2024-09-17 12:44:46 1.62 
#>  5 3910449 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:47:55 2024-09-17 12:44:56 2024-09-17 12:45:16 0.659
#>  6 3910450 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:47:55 2024-09-17 12:45:16 2024-09-17 12:46:07 1.15 
#>  7 3910451 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:47:57 2024-09-17 12:46:07 2024-09-17 12:47:08 0.432
#>  8 3910452 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:49:42 2024-09-17 12:47:08 2024-09-17 12:48:10 2.91 
#>  9 3910453 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:49:42 2024-09-17 12:48:10 2024-09-17 12:48:40 3.09 
#> 10 3910454 HKQuantityTypeIdentifierActiveEnergy… Kieran’s … 10.6.1        <<HKD… Cal   2024-09-17 12:50:03 2024-09-17 12:48:40 2024-09-17 12:49:21 0.74 
#> # ℹ 2,658,829 more rows
{{< /code >}}

The `startDate` and `endDate` periods on each row were almost all between thirty and ninety seconds, though there was a long, sparse tail of outliers. I haven't looked yet to see if these artifacts are errors or if they were created in some recognizable way. It's not that a workout gets recorded as 60 minutes in a single row or anything---once you're doing something the phone or watch will create a new row every 30 to 90 seconds for as long as you are doing something. While the first rows of the table here begin in September 2024, the rows are not ordered by date. I think it's by date within device, or `sourceName`. My data go back to 2018. Again, if you were the sort of person who worked out once or twice a day, and took full advantage of Apple's market offerings with health, and had had an iPhone or Watch for a long time, you would end up with a _lot_ of information about yourself.

Is it useful information? It's certainly extremely fine-grained. Whether all that monitoring amounts to anything particularly insightful is a harder question, particularly at the level of individuals. One of the many ironies of all broadly person-centric or social data over the past fifty years is that the people doing work on everything from social networks to epidemiology to personal health and beyond prayed for more and more fine-grained data ... and then they got it. 

In the case of the ActiveEnergyBurned table, 2.5 million moment-to-moment estimates of the calories I'm burning might or might not be useful. We can aggregate it a bit by grouping the values by hour and summing them up for every hour, day, month, and year we have. Like this:

{{< code r >}}
burn_df <- read_csv(here("data", "HKQuantityTypeIdentifierActiveEnergyBurned.csv"),
                    col_types = colspec) |>
  arrange(startDate) |>
  select(rowid, sourceName, startDate:value) |>
  mutate(startDate = with_tz(startDate, tzone = "US/Eastern"),
         endDate = with_tz(startDate, tzone = "US/Eastern")) |>
  mutate(
    start_year = year(startDate),
    start_month = month(startDate),
    start_day = day(startDate),
    start_hour = hour(startDate),
    start_minute = minute(startDate),
    end_year = year(endDate),
    end_month = month(endDate),
    end_day = day(endDate),
    end_hour = hour(endDate),
    end_minute = minute(endDate),
    length = endDate - startDate)

hourly_burn <- burn_df |>
  group_by(start_year, start_month, start_day, start_hour) |>
  summarize(burned = sum(value),
            time = first(startDate)) |>
  mutate(index = as.integer(as.factor(time)))

hourly_burn
#> # A tibble: 36,338 × 7
#> # Groups:   start_year, start_month, start_day [2,333]
#>    start_year start_month start_day start_hour burned time                index
#>         <dbl>       <dbl>     <int>      <int>  <dbl> <dttm>              <int>
#>  1       2018           7        14          9  73.2  2018-07-14 09:51:54     1
#>  2       2018           7        14         10 525.   2018-07-14 10:00:13     2
#>  3       2018           7        14         11   4.84 2018-07-14 11:37:34     3
#>  4       2018           7        14         12  27.4  2018-07-14 12:12:27     4
#>  5       2018           7        14         13  72.5  2018-07-14 13:00:03     5
#>  6       2018           7        14         14  93.1  2018-07-14 14:00:51     6
#>  7       2018           7        14         15  68.0  2018-07-14 15:00:55     7
#>  8       2018           7        14         16  18.9  2018-07-14 16:00:08     8
#>  9       2018           7        14         17  29.1  2018-07-14 17:00:23     9
#> 10       2018           7        14         18  30.4  2018-07-14 18:00:19    10
#> # ℹ 36,328 more rows

{{< /code >}}


From there, we can make a kind of grid of every single hour of my life since July 2018, with each box of the grid showing---if there's data---an estimate of calories burned in that hour. Notice above how I used `with_tz()` to adjust the start and end dates before going the other calculations. If I didn't do that most of the data would be off by five hours (the difference between US/Eastern and UTC). This correction will still leave some data points off, as I do sometimes leave not just the house but the time zone, but for now it's good enough. 

To get a nice picture we should fold this data into a grid of all the days and hourse since July 2018, taking care to drop dates that don't exist, like June 31st or February 29th 2019.

{{< code r >}}
time_grid <- expand_grid(
  start_year = c(2018L:2025L),
  start_month = c(1L:12L),
  start_day = c(1L:31L),
  start_hour = c(0:23)) |>
  filter(!(start_month == 2 & start_day > 29)) |>
  filter(!(start_month %in% c(4, 6, 9, 11) & start_day > 30)) |>
  filter(!(start_year %nin% c(2020, 2024) & start_month == 2 & start_day > 28)) # careful here


burned_grid <- time_grid |>
  left_join(hourly_burn, by = c("start_year", "start_month",
                                "start_day", "start_hour")) |>
  mutate(hour_rc = factor(start_hour, levels = c(6:23, 0:5),
                          ordered = TRUE),
         month_rc = month(ymd(paste(start_year, start_month, start_day, sep = "-")),
                          label = TRUE, abbr = TRUE))

{{< /code >}}


Then we can draw a plot:

{{< code r >}}
out <- burned_grid |>
  ggplot(aes(x = factor(start_day - 5),
             y = factor(start_hour),
             fill = burned)) +
  geom_tile(color = "gray10", linewidth = 0.01) +
  coord_fixed() +
  facet_grid(start_year ~ month_rc) +
  scale_fill_binned_sequential(palette = "Inferno",
                               na.value = "white") +
  scale_x_discrete(breaks = c(5, 15, 25), labels = c(5, 15, 25)) +
  scale_y_discrete(breaks = c(6, 12, 18, 0), labels = c("6am", "Noon", "6pm", "Midnight")) +
  guides(fill = guide_legend(theme = theme(legend.title.position = "top",
                                           legend.text.position = "bottom"))) +
  labs(x = "Day of the Month",
       y = "Hour of the Day",
       fill = "Energy (Cal)",
       title = "iPhone/Watch Health Data Dump",
       subtitle = "Hourly sums of all ‘Active Energy Burned’ measurements, by day and year") +
  theme(strip.text = element_text(size = rel(1.2)),
        axis.text.y = element_text(size = rel(0.8)),
        plot.title = element_text(size = rel(2)))
{{< /code >}}


I'm not going to show you the whole thing, all eight years of hourly data, because that would make me---and indeed perhaps you---feel a little queasy.  But here's a typical recent month:

{{% figure src="burn-detail.png" alt="A detail from the plot." caption="A detail from the big graph." %}}

Days of the month are on the x-axis, hours of the day on the y-axis. Where a cell is filled in, there's at least one activity measure for that hour. Where the grid cell is white, there's no data. You can see two things from this detail. The first thing is that on most weekday mornings I go for a run. It's not like I'm sedentary for the rest of the day, but given that this is a detail from a graph covering eight years of hourly data, the only reliable signal that jumps out from the background is running for a while. The second thing is that recently I have been experimenting with wearing my Watch while sleeping, but more often than not I forget to put it back on after taking it off to charge in the evenings. While I'm sure there are other things to be found in this data, and while, in fairness, some of the features of this sort of monitoring---like fall detection, and AFib triggering---are properly important, I am not entirely convinced that collecting this much data about me personally is going to be of much use to anyone. 
