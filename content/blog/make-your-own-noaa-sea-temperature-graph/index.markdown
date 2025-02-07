---
title: "Make Your Own NOAA Sea Temperature Graph"
date: 2024-04-04T08:06:14-04:00
categories: [R,data]
footnotes: false
htmlwidgets: false
mathjax: false
---

Sea-surface temperatures in the North Atlantic have been in the news recently as they continue to break records. While there are already a number of excellent summaries and graphs of the data, I thought I'd have a go at making some myself. The starting point is the detailed data made available by the [National Centers for Environmental Information](https://www.ncei.noaa.gov), part of [NOAA](https://www.noaa.gov). As always, the sheer volume of high-quality data agencies like this make available to the public is astonishing. 

### Getting the Data

The specific dataset is the [NOAA 0.25-degree Daily Optimum Interpolation Sea Surface Temperature (OISST), Version 2.1](https://www.ncei.noaa.gov/access/metadata/landing-page/bin/iso?id=gov.noaa.ncdc:C01606), which takes a global network of daily temperature observations (from things like buoys and platforms, but also satellites), and then interpolates and aggregates them to a regular spatial grid of observations at 0.25 degrees resolution. 

The data is available as daily global observations doing back to September 1st, 1981. Each day's data is available as a single file in subdirectories organized by year-month. [It's all here](https://www.ncei.noaa.gov/data/sea-surface-temperature-optimum-interpolation/v2.1/access/avhrr/). Each file is about 1.6MB in size. There are more than fifteen thousand of them. 

To do it by hand, we can make a folder called `raw` in our project and then get all the data, preserving its subdirectory structure, with a `wget` command like this:

{{< code bash >}}
wget --no-parent -r -l inf --wait 5 --random-wait 'https://www.ncei.noaa.gov/data/sea-surface-temperature-optimum-interpolation/v2.1/access/avhrr/'
{{< /code >}}

This tries to be polite with the NOAA. (I think its webserver is also lightly throttled in any case, but it never hurts to be nice.) The switches `--no-parent -r -l inf` tell `wget` not to move upwards in the folder hierarchy, but to recurse downwards indefinitely. The `--wait 5 --random-wait` jointly enforce a five-second wait time between requests, randomly varying between 0.5 and 1.5 times the `wait` period. Downloading the files this way will take several *days* of real time downloading, though of course much less in actual file transfer time.


## The netCDF data format

The data are netCDF files, an interesting and in fact quite nice self-documenting binary file format. These files have regular arrays of data of some n-dimensional size, e.g. latitude by longitude, with measures that can be thought of as being stacked on the array. (E.g. a grid of points with a measure at each point for surface temperature, sea ice extent, etc, etc). So you have the potential to have big slabs of data that you can then summarize by aggregating on some dimension or other.
 
The `ncdf4` package can read them in R, though as it turns out we won't use this package for the analysis. Here's what one file looks like: 


{{< code r >}}
ncdf4::nc_open(all_fnames[1000])

File /Users/kjhealy/Documents/data/misc/noaa_ncei/raw/www.ncei.noaa.gov/data/sea-surface-temperature-optimum-interpolation/v2.1/access/avhrr/198405/oisst-avhrr-v02r01.19840527.nc (NC_FORMAT_NETCDF4):

     4 variables (excluding dimension variables):
        short anom[lon,lat,zlev,time]   (Chunking: [1440,720,1,1])  (Compression: shuffle,level 4)
            long_name: Daily sea surface temperature anomalies
            _FillValue: -999
            add_offset: 0
            scale_factor: 0.00999999977648258
            valid_min: -1200
            valid_max: 1200
            units: Celsius
        short err[lon,lat,zlev,time]   (Chunking: [1440,720,1,1])  (Compression: shuffle,level 4)
            long_name: Estimated error standard deviation of analysed_sst
            units: Celsius
            _FillValue: -999
            add_offset: 0
            scale_factor: 0.00999999977648258
            valid_min: 0
            valid_max: 1000
        short ice[lon,lat,zlev,time]   (Chunking: [1440,720,1,1])  (Compression: shuffle,level 4)
            long_name: Sea ice concentration
            units: %
            _FillValue: -999
            add_offset: 0
            scale_factor: 0.00999999977648258
            valid_min: 0
            valid_max: 100
        short sst[lon,lat,zlev,time]   (Chunking: [1440,720,1,1])  (Compression: shuffle,level 4)
            long_name: Daily sea surface temperature
            units: Celsius
            _FillValue: -999
            add_offset: 0
            scale_factor: 0.00999999977648258
            valid_min: -300
            valid_max: 4500

     4 dimensions:
        time  Size:1   *** is unlimited *** 
            long_name: Center time of the day
            units: days since 1978-01-01 12:00:00
        zlev  Size:1 
            long_name: Sea surface height
            units: meters
            actual_range: 0, 0
            positive: down
        lat  Size:720 
            long_name: Latitude
            units: degrees_north
            grids: Uniform grid from -89.875 to 89.875 by 0.25
        lon  Size:1440 
            long_name: Longitude
            units: degrees_east
            grids: Uniform grid from 0.125 to 359.875 by 0.25

    37 global attributes:
        title: NOAA/NCEI 1/4 Degree Daily Optimum Interpolation Sea Surface Temperature (OISST) Analysis, Version 2.1 - Final
        source: ICOADS, NCEP_GTS, GSFC_ICE, NCEP_ICE, Pathfinder_AVHRR, Navy_AVHRR
        id: oisst-avhrr-v02r01.19840527.nc
        naming_authority: gov.noaa.ncei
        summary: NOAAs 1/4-degree Daily Optimum Interpolation Sea Surface Temperature (OISST) (sometimes referred to as Reynolds SST, which however also refers to earlier products at different resolution), currently available as version v02r01, is created by interpolating and extrapolating SST observations from different sources, resulting in a smoothed complete field. The sources of data are satellite (AVHRR) and in situ platforms (i.e., ships and buoys), and the specific datasets employed may change over time. At the marginal ice zone, sea ice concentrations are used to generate proxy SSTs.  A preliminary version of this file is produced in near-real time (1-day latency), and then replaced with a final version after 2 weeks. Note that this is the AVHRR-ONLY DOISST, available from Oct 1981, but there is a companion DOISST product that includes microwave satellite data, available from June 2002
        cdm_data_type: Grid
        history: Final file created using preliminary as first guess, and 3 days of AVHRR data. Preliminary uses only 1 day of AVHRR data.
        date_modified: 2020-05-08T19:05:13Z
        date_created: 2020-05-08T19:05:13Z
        product_version: Version v02r01
        processing_level: NOAA Level 4
        institution: NOAA/National Centers for Environmental Information
        creator_url: https://www.ncei.noaa.gov/
        creator_email: oisst-help@noaa.gov
        keywords: Earth Science > Oceans > Ocean Temperature > Sea Surface Temperature
        keywords_vocabulary: Global Change Master Directory (GCMD) Earth Science Keywords
        platform: Ships, buoys, Argo floats, MetOp-A, MetOp-B
        platform_vocabulary: Global Change Master Directory (GCMD) Platform Keywords
        instrument: Earth Remote Sensing Instruments > Passive Remote Sensing > Spectrometers/Radiometers > Imaging Spectrometers/Radiometers > AVHRR > Advanced Very High Resolution Radiometer
        instrument_vocabulary: Global Change Master Directory (GCMD) Instrument Keywords
        standard_name_vocabulary: CF Standard Name Table (v40, 25 January 2017)
        geospatial_lat_min: -90
        geospatial_lat_max: 90
        geospatial_lon_min: 0
        geospatial_lon_max: 360
        geospatial_lat_units: degrees_north
        geospatial_lat_resolution: 0.25
        geospatial_lon_units: degrees_east
        geospatial_lon_resolution: 0.25
        time_coverage_start: 1984-05-27T00:00:00Z
        time_coverage_end: 1984-05-27T23:59:59Z
        metadata_link: https://doi.org/10.25921/RE9P-PT57
        ncei_template_version: NCEI_NetCDF_Grid_Template_v2.0
        comment: Data was converted from NetCDF-3 to NetCDF-4 format with metadata updates in November 2017.
        sensor: Thermometer, AVHRR
        Conventions: CF-1.6, ACDD-1.3
        references: Reynolds, et al.(2007) Daily High-Resolution-Blended Analyses for Sea Surface Temperature (available at https://doi.org/10.1175/2007JCLI1824.1). Banzon, et al.(2016) A long-term record of blended satellite and in situ sea-surface temperature for climate monitoring, modeling and environmental studies (available at https://doi.org/10.5194/essd-8-165-2016). Huang et al. (2020) Improvements of the Daily Optimum Interpolation Sea Surface Temperature (DOISST) Version v02r01, submitted.Climatology is based on 1971-2000 OI.v2 SST. Satellite data: Pathfinder AVHRR SST and Navy AVHRR SST. Ice data: NCEP Ice and GSFC Ice.
{{< /code >}}


This is the file for May 27th, 1984. As you can see, there's a _lot_ of metadata. Each variable is admirably well-documented. The key information for our purposes is that we have a grid of 1440 by 720 lat-lon points. There are two additional dimensions---time and elevation (zlev)---but these are both just 1 for each particular file, because every file is observations at elevation zero on a particular day. There are four measures at each point: sea surface temperature anomalies, the standard deviation of the sea surface temperature estimate, sea ice concentration (as a percentage), and sea surface temperature (in degrees Celsius). So we have four bits of data for each grid point on our 1440 * 720 grid, which makes for just over 4.1 million data points _per day_ since 1981. 


### Processing the Data

We read in the filenames and see how many we have:

{{< code r >}}
all_fnames <- fs::dir_ls(here("raw"), recurse = TRUE, glob = "*.nc")
length(all_fnames)
#> [1] 15549
{{< /code >}}

What we want to do is read in all this data and aggregate it so that we can take, for instance, the global average for each day and plot that trend for each year. Or perhaps we want to do that for specific regions of the globe, either defined directly by us in terms of some  latitude and longitude polygon, or taken from the coordinates of some conventional division of the world's oceans and seas into named areas.

Our tool of choice is the [Terra package](https://rspatial.github.io/terra/), which is designed specifically for this kind of data. It has a number of methods for conveniently aggregating and cutting into arrays of geospatial data. The netCDF4 package has a lot of useful features, too, but for the specific things we want to do Terra's toolkit is quicker. One thing it can do, for example, is naturally aggregate over-time layers into single "bricks" of data, and then quickly slice, summarize, or calculate on these arrays.

So, let's chunk our filenames into units of 25 days or so. This will make the multi-file operation we're about to perform run faster, because we can read in and operate on a raster of 25 days at once instead of doing the same thing on 25 separate rasters. There's probably an optimal chunk size, but I didn't search too hard for it.

{{< code r >}}
## This one gives you an unknown number of chunks each with approx n elements
chunk <- function(x, n) split(x, ceiling(seq_along(x)/n))
chunked_fnames <- chunk(all_fnames, 25)
{{< /code >}}

Next, we write a function to process a raster file that terra creates. It calculates the area-weighted means of the layer variables. We have to weight our mean temperature calculation by area (instead of just directly taking the average of all the points) because the area of the degree-denominated grids gets smaller the closer you get to the poles. (This is because, some current views notwithstanding, the Earth is round.)

{{< code r >}}
layerinfo <- tibble(
  num = c(1:4),
  raw_name = c("anom_zlev=0", "err_zlev=0",
               "ice_zlev=0", "sst_zlev=0"),
  name = c("anom", "err",
           "ice", "sst"))

process_raster <- function(fnames, crop_area = c(-80, 0, 0, 60), layerinfo = layerinfo) {

  tdf <- terra::rast(fnames) |>
    terra::rotate() |>   # Convert 0 to 360 lon to -180 to +180 lon
    terra::crop(crop_area) # Manually crop to a defined box.  Default is roughly N. Atlantic lat/lon box

  wts <- terra::cellSize(tdf, unit = "km") # For scaling. Because the Earth is round.

  # global() calculates a quantity for the whole grid on a particular SpatRaster
  # so we get one weighted mean per file that comes in
  out <- data.frame(date = terra::time(tdf),
                    means = terra::global(tdf, "mean", weights = wts, na.rm=TRUE))
  out$var <- rownames(out)
  out$var <- gsub("_.*", "", out$var)
  out <- reshape(out, idvar = "date",
                 timevar = "var",
                 direction = "wide")

  colnames(out) <- gsub("weighted_mean\\.", "", colnames(out))
  out
}

{{< /code >}}

For a single file, this gives us one number for each variable:

{{< code r >}}
# World box (60S to 60N)
world_crop_bb <- c(-180, 180, -60, 60)

process_raster(all_fnames[10000], crop_area = world_crop_bb)
#>                   date       anom       err       ice      sst
#> anom_zlev=0 2009-01-20 0.01397327 0.1873972 0.6823713 20.26344
{{< /code >}}

For 25 filenames, 25 rows:

{{< code r >}}
process_raster(chunked_fnames[[1]], crop_area = world_crop_bb)
#>                      date       anom       err       ice      sst
#> anom_zlev=0    1981-09-01 -0.1312008 0.2412722 0.4672954 20.12524
#> anom_zlev=0.1  1981-09-02 -0.1383695 0.2483428 0.4933853 20.11629
#> anom_zlev=0.2  1981-09-03 -0.1419441 0.2583364 0.4807980 20.11095
#> anom_zlev=0.3  1981-09-04 -0.1434012 0.2627574 0.5125643 20.10772
#> anom_zlev=0.4  1981-09-05 -0.1527941 0.2520100 0.4889709 20.09655
#> anom_zlev=0.5  1981-09-06 -0.1590382 0.2421610 0.5253917 20.08851
#> anom_zlev=0.6  1981-09-07 -0.1603969 0.2406726 0.4959906 20.08539
#> anom_zlev=0.7  1981-09-08 -0.1530743 0.2437756 0.5203092 20.09094
#> anom_zlev=0.8  1981-09-09 -0.1503720 0.2483605 0.5062930 20.09187
#> anom_zlev=0.9  1981-09-10 -0.1532902 0.2574440 0.5275545 20.08718
#> anom_zlev=0.10 1981-09-11 -0.1409007 0.2548919 0.5111582 20.09779
#> anom_zlev=0.11 1981-09-12 -0.1459493 0.2438222 0.5395167 20.09097
#> anom_zlev=0.12 1981-09-13 -0.1540702 0.2341866 0.5259677 20.08107
#> anom_zlev=0.13 1981-09-14 -0.1719063 0.2322755 0.5650545 20.06144
#> anom_zlev=0.14 1981-09-15 -0.1879679 0.2319289 0.5357815 20.04363
#> anom_zlev=0.15 1981-09-16 -0.2021128 0.2330142 0.5718586 20.02638
#> anom_zlev=0.16 1981-09-17 -0.2163771 0.2371551 0.5434053 20.00766
#> anom_zlev=0.17 1981-09-18 -0.2317916 0.2366315 0.5757664 19.98781
#> anom_zlev=0.18 1981-09-19 -0.2321086 0.2388878 0.5458579 19.98307
#> anom_zlev=0.19 1981-09-20 -0.2478310 0.2388981 0.5682817 19.96289
#> anom_zlev=0.20 1981-09-21 -0.2477164 0.2366739 0.5428888 19.95858
#> anom_zlev=0.21 1981-09-22 -0.2315305 0.2369557 0.5636612 19.97033
#> anom_zlev=0.22 1981-09-23 -0.2079270 0.2401278 0.5423280 19.98950
#> anom_zlev=0.23 1981-09-24 -0.1803567 0.2397868 0.5666913 20.01262
#> anom_zlev=0.24 1981-09-25 -0.1704838 0.2376401 0.5437584 20.01805
{{< /code >}}

We need to do this for all the files so we get complete dataset. We take advantage of the [futureverse](https://www.futureverse.org) to parallelize the operation, because doing this with 15,000 files is going to take a bit of time. Then at the end we clean it up a little bit. 

{{< code r >}}
season <-  function(in_date){
  br = yday(as.Date(c("2019-03-01",
                      "2019-06-01",
                      "2019-09-01",
                      "2019-12-01")))
  x = yday(in_date)
  x = cut(x, breaks = c(0, br, 366))
  levels(x) = c("Winter", "Spring", "Summer", "Autumn", "Winter")
  x
}

world_df <- future_map(chunked_fnames, process_raster,
                       crop_area = world_crop_bb) |>
  list_rbind() |>
  as_tibble() |>
  mutate(date = ymd(date),
         year = lubridate::year(date),
         month = lubridate::month(date),
         day = lubridate::day(date),
         yrday = lubridate::yday(date),
         season = season(date))

world_df
#> # A tibble: 15,549 × 10
#>    date         anom   err   ice   sst  year month   day yrday season
#>    <date>      <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <chr> 
#>  1 1981-09-01 -0.131 0.241 0.467  20.1  1981     9     1   244 Summer
#>  2 1981-09-02 -0.138 0.248 0.493  20.1  1981     9     2   245 Autumn
#>  3 1981-09-03 -0.142 0.258 0.481  20.1  1981     9     3   246 Autumn
#>  4 1981-09-04 -0.143 0.263 0.513  20.1  1981     9     4   247 Autumn
#>  5 1981-09-05 -0.153 0.252 0.489  20.1  1981     9     5   248 Autumn
#>  6 1981-09-06 -0.159 0.242 0.525  20.1  1981     9     6   249 Autumn
#>  7 1981-09-07 -0.160 0.241 0.496  20.1  1981     9     7   250 Autumn
#>  8 1981-09-08 -0.153 0.244 0.520  20.1  1981     9     8   251 Autumn
#>  9 1981-09-09 -0.150 0.248 0.506  20.1  1981     9     9   252 Autumn
#> 10 1981-09-10 -0.153 0.257 0.528  20.1  1981     9    10   253 Autumn
#> # ℹ 15,539 more rows
{{< /code >}}

Now we have a time series for each of the variables daily from 1981 to yesterday.

### Calculating values for all the world's seas and oceans

We can do a little better though. What if we wanted to get these average values for the seas and oceans of the world? For that we'd need a map defining the conventional boundaries of those areas of water, which we'd then need to covert to raster format. After that, we'd slice up our global raster by the ocean and sea boundaries, and calculate averages for those areas. 

I took the maritime boundaries from the [IHO Sea Areas Shapefile](https://www.marineregions.org/downloads.php).


{{< code r >}}

seas <- sf::read_sf(here("raw", "World_Seas_IHO_v3"))

seas
#> Simple feature collection with 101 features and 10 fields
#> Geometry type: MULTIPOLYGON
#> Dimension:     XY
#> Bounding box:  xmin: -180 ymin: -85.5625 xmax: 180 ymax: 90
#> Geodetic CRS:  WGS 84
#> # A tibble: 101 × 11
#>    NAME                   ID    Longitude Latitude min_X  min_Y max_X  max_Y   area MRGID                  geometry
#>    <chr>                  <chr>     <dbl>    <dbl> <dbl>  <dbl> <dbl>  <dbl>  <dbl> <dbl>        <MULTIPOLYGON [°]>
#>  1 Rio de La Plata        33        -56.8   -35.1  -59.8 -36.4  -54.9 -31.5  3.18e4  4325 (((-54.94302 -34.94791, …
#>  2 Bass Strait            62A       146.    -39.5  144.  -41.4  150.  -37.5  1.13e5  4366 (((149.9046 -37.54325, 1…
#>  3 Great Australian Bight 62        133.    -36.7  118.  -43.6  146.  -31.5  1.33e6  4276 (((143.5325 -38.85535, 1…
#>  4 Tasman Sea             63        161.    -39.7  147.  -50.9  175.  -30    3.34e6  4365 (((159.0333 -30, 159.039…
#>  5 Mozambique Channel     45A        40.9   -19.3   32.4 -26.8   49.2 -10.5  1.39e6  4261 (((43.38218 -11.37021, 4…
#>  6 Savu Sea               48o       122.     -9.48 119.  -10.9  125.   -8.21 1.06e5  4343 (((124.5562 -8.223565, 1…
#>  7 Timor Sea              48i       128.    -11.2  123.  -15.8  133.   -8.18 4.34e5  4344 (((127.8623 -8.214911, 1…
#>  8 Bali Sea               48l       116.     -7.93 114.   -9.00 117.   -7.01 3.99e4  4340 (((115.7522 -7.143594, 1…
#>  9 Coral Sea              64        157.    -18.2  141.  -30.0  170.   -6.79 4.13e6  4364 (((168.4912 -16.79469, 1…
#> 10 Flores Sea             48j       120.     -7.51 117.   -8.74 123.   -5.51 1.03e5  4341 (((120.328 -5.510677, 12…
#> # ℹ 91 more rows
{{< /code >}}

Then we rasterize the polygons with a function from terra:

{{< code r >}}
## Rasterize the seas polygons using one of the nc files
## as a reference grid for the rasterization process
one_raster <- all_fnames[1]
seas_vect <- terra::vect(seas)
tmp_tdf_seas <- terra::rast(one_raster)["sst"] |>
  rotate()
seas_zonal <- rasterize(seas_vect, tmp_tdf_seas, "NAME")
{{< /code >}}

Now we can use this data as the grid to do zonal calculations on our data raster. To use it in a parallelized calculation we need to wrap it, so that it can be found by the processes that `future_map()` will spawn. We write a new function to do the zonal calculation. It's basically the same as the global one above. 

{{< code r >}}
seas_zonal_wrapped <- wrap(seas_zonal)

process_raster_zonal <- function(fnames) {

  d <- terra::rast(fnames)
  wts <- terra::cellSize(d, unit = "km") # For scaling

  layer_varnames <- terra::varnames(d) # vector of layers
  date_seq <- rep(terra::time(d)) # vector of dates

  # New colnames for use post zonal calculation below
  new_colnames <- c("sea", paste(layer_varnames, date_seq, sep = "_"))

  # Better colnames
  tdf_seas <- d |>
    terra::rotate() |>   # Convert 0 to 360 lon to -180 to +180 lon
    terra::zonal(unwrap(seas_zonal_wrapped), mean, na.rm = TRUE)
  colnames(tdf_seas) <- new_colnames

  # Reshape to long
  tdf_seas |>
    tidyr::pivot_longer(-sea,
                        names_to = c("measure", "date"),
                        values_to = "value",
                        names_pattern ="(.*)_(.*)") |>
    tidyr::pivot_wider(names_from = measure, values_from = value)

}

{{< /code >}}

And we feed our chunked vector of filenames to it:

{{< code r >}}
## Be patient
seameans_df <- future_map(chunked_fnames, process_raster_zonal) |>
  list_rbind() |>
  mutate(date = ymd(date),
         year = lubridate::year(date),
         month = lubridate::month(date),
         day = lubridate::day(date),
         yrday = lubridate::yday(date),
         season = season(date))

write_csv(seameans_df, file = here("data", "oceans_means_zonal.csv"))
save(seameans_df, file = here("data", "seameans_df.Rdata"), compress = "xz")

seameans_df
#> # A tibble: 1,570,449 × 11
#>    sea          date         anom   err   ice   sst  year month   day yrday season
#>    <chr>        <date>      <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <dbl> <chr> 
#>  1 Adriatic Sea 1981-09-01 -0.737 0.167    NA  23.0  1981     9     1   244 Summer
#>  2 Adriatic Sea 1981-09-02 -0.645 0.176    NA  23.1  1981     9     2   245 Autumn
#>  3 Adriatic Sea 1981-09-03 -0.698 0.176    NA  22.9  1981     9     3   246 Autumn
#>  4 Adriatic Sea 1981-09-04 -0.708 0.248    NA  22.9  1981     9     4   247 Autumn
#>  5 Adriatic Sea 1981-09-05 -1.05  0.189    NA  22.5  1981     9     5   248 Autumn
#>  6 Adriatic Sea 1981-09-06 -1.02  0.147    NA  22.4  1981     9     6   249 Autumn
#>  7 Adriatic Sea 1981-09-07 -0.920 0.141    NA  22.4  1981     9     7   250 Autumn
#>  8 Adriatic Sea 1981-09-08 -0.832 0.140    NA  22.5  1981     9     8   251 Autumn
#>  9 Adriatic Sea 1981-09-09 -0.665 0.162    NA  22.6  1981     9     9   252 Autumn
#> 10 Adriatic Sea 1981-09-10 -0.637 0.268    NA  22.5  1981     9    10   253 Autumn
#> # ℹ 1,570,439 more rows
{{< /code >}}

Now we have properly-weighted daily averages for every sea and ocean since September 1981. Time to make some pictures.


### Global Sea Surface Mean Temperature Graph

To make a graph of the global daily mean sea surface temperature we can use the `world_df` object we made. The idea is to put the temperature on the y-axis, the day of the year on the x-axis, and then draw a separate line for each year. We highlight 2023 and (the data to date for) 2024. And we also draw a ribbon underlay showing plus or minus two standard deviations of the global mean.

{{< code r >}}
colors <- ggokabeito::palette_okabe_ito()

## Labels for the x-axis
month_labs <- seameans_df |>
  filter(sea == "North Atlantic Ocean",
         year == 2023,
         day == 15) |>
  select(date, year, yrday, month, day) |>
  mutate(month_lab = month(date, label = TRUE, abbr = TRUE))


## Average and sd ribbon data
world_avg <- world_df |>
  filter(year > 1981 & year < 2012) |>
  group_by(yrday) |>
  filter(yrday != 366) |>
  summarize(mean_8211 = mean(sst, na.rm = TRUE),
            sd_8211 = sd(sst, na.rm = TRUE)) |>
  mutate(fill = colors[2],
         color = colors[2])

## Flag years of interest
out_world <- world_df |>
  mutate(year_flag = case_when(
    year == 2023 ~ "2023",
    year == 2024 ~ "2024",
    .default = "All other years"))


out_world_plot <- ggplot() +
  geom_ribbon(data = world_avg,
              mapping = aes(x = yrday,
                            ymin = mean_8211 - 2*sd_8211,
                            ymax = mean_8211 + 2*sd_8211,
                            fill = fill),
              alpha = 0.3,
              inherit.aes = FALSE) +
  geom_line(data = world_avg,
            mapping = aes(x = yrday,
                          y = mean_8211,
                          color = color),
            linewidth = 2,
            inherit.aes = FALSE) +
  scale_color_identity(name = "Mean Temp. 1982-2011, ±2SD", guide = "legend",
                       breaks = unique(world_avg$color), labels = "") +
  scale_fill_identity(name = "Mean Temp. 1982-2011, ±2SD", guide = "legend",
                      breaks = unique(world_avg$fill), labels = "") +
  ggnewscale::new_scale_color() +
  geom_line(data = out_world,
            mapping = aes(x = yrday, y = sst, group = year, color = year_flag),
            inherit.aes = FALSE) +
  scale_color_manual(values = colors[c(1,6,8)]) +
  scale_x_continuous(breaks = month_labs$yrday, labels = month_labs$month_lab) +
  scale_y_continuous(breaks = seq(19.5, 21.5, 0.5),
                     limits = c(19.5, 21.5),
                     expand = expansion(mult = c(-0.05, 0.05))) +
  geom_line(linewidth = rel(0.7)) +
  guides(
    x = guide_axis(cap = "both"),
    y = guide_axis(minor.ticks = TRUE, cap = "both"),
    color = guide_legend(override.aes = list(linewidth = 2))
  ) +
  labs(x = "Month", y = "Mean Temperature (°Celsius)",
       color = "Year",
       title = "Mean Daily Global Sea Surface Temperature, 1981-2024",
       subtitle = "Latitudes 60°N to 60°S; Area-weighted NOAA OISST v2.1 estimates",
       caption = "Kieran Healy / @kjhealy") +
  theme(axis.line = element_line(color = "gray30", linewidth = rel(1)),
        plot.title = element_text(size = rel(1.9)))

ggsave(here("figures", "global_mean.png"), out_world_plot, height = 7, width = 10, dpi = 300)

{{< /code >}}

{{% figure src="global_mean.png" alt="We're fucked" caption="Global mean sea surface temperature 1981-2024" %}}


### The North Atlantic

We can slice out the North Atlantic by name from `seameans_df` and make its graph in much the same way. For variety we can color most of the years blue, to lean into the "Great Wave off Kanagawa" (or [Rockall](https://en.wikipedia.org/wiki/Rockall)?) vibe.

{{< code r >}}
out_atlantic <- seameans_df |>
  filter(sea == "North Atlantic Ocean") |>
  mutate(year_flag = case_when(
    year == 2023 ~ "2023",
    year == 2024 ~ "2024",
    .default = "All other years"
  )) |>
  ggplot(aes(x = yrday, y = sst, group = year, color = year_flag)) +
  geom_line(linewidth = rel(1.1)) +
  scale_x_continuous(breaks = month_labs$yrday, labels = month_labs$month_lab) +
  scale_color_manual(values = colors[c(1,6,2)]) +
  guides(
    x = guide_axis(cap = "both"),
    y = guide_axis(minor.ticks = TRUE, cap = "both"),
    color = guide_legend(override.aes = list(linewidth = 2))
  ) +
  labs(x = "Month", y = "Mean Temperature (Celsius)",
       color = "Year",
       title = "Mean Daily Sea Surface Temperature, North Atlantic Ocean, 1981-2024",
       subtitle = "Gridded and weighted NOAA OISST v2.1 estimates",
       caption = "Kieran Healy / @kjhealy") +
  theme(axis.line = element_line(color = "gray30", linewidth = rel(1)))

ggsave(here("figures", "north_atlantic.png"), out_atlantic, height = 7, width = 10, dpi = 300)
{{< /code >}}


{{% figure src="north_atlantic.png" alt="Not looking too good tbh" caption="The North Atlantic." %}}

### All the Seas

Finally we can of course go crazy with facets and just draw everything. 

{{< code r >}}
## All the world's oceans and seas
out <- seameans_df |>
  mutate(year_flag = case_when(
    year == 2023 ~ "2023",
    year == 2024 ~ "2024",
    .default = "All other years")) |>
  ggplot(aes(x = yrday, y = sst, group = year, color = year_flag)) +
  geom_line(linewidth = rel(0.5)) +
  scale_x_continuous(breaks = month_labs$yrday, labels = month_labs$month_lab) +
  scale_color_manual(values = colors[c(1,6,2)]) +
  guides(
    x = guide_axis(cap = "both"),
    y = guide_axis(minor.ticks = TRUE, cap = "both"),
    color = guide_legend(override.aes = list(linewidth = 1.4))
  ) +
  facet_wrap(~ reorder(sea, sst), axes = "all_x", axis.labels = "all_y") +
  labs(x = "Month of the Year", y = "Mean Temperature (Celsius)",
       color = "Year",
       title = "Mean Daily Sea Surface Temperatures, 1981-2024",
       subtitle = "Area-weighted 0.25° grid estimates; NOAA OISST v2.1; IHO Sea Boundaries",
       caption = "Data processed with R; Figure made with ggplot by Kieran Healy / @kjhealy") +
  theme(axis.line = element_line(color = "gray30", linewidth = rel(1)),
        strip.text = element_text(face = "bold", size = rel(1.4)),
        plot.title = element_text(size = rel(1.525)),
        plot.subtitle = element_text(size = rel(1.1)))

ggsave(here("figures", "all_seas.png"), out, width = 40, height = 40, dpi = 300)

{{< /code >}}

{{% figure src="all_seas.png" alt="Everything" caption="All the world's oceans and seas, because why not." %}}


The full code for the data processing and the graphs is [available on GitHub](https://github.com/kjhealy/noaa_ncei).

