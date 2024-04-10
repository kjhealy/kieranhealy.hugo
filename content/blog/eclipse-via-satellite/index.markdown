---
title: "The Eclipse via Satellite"
date: 2024-04-09T07:53:58-04:00
categories: [misc,visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

Yesterday's eclipse as seen by the [GOES-East](https://www.star.nesdis.noaa.gov/GOES/) weather satellite. I just grabbed the full-disk geocolor JPGs with `wget` and stitched them together with `ffmpeg`. 

<video autoplay loop muted playsinline controls="true" width = "100%">
    <source src="./eclipse_sm.mp4" type="video/mp4">
    <source src="./eclipse_sm.mov" type="video/mov">
    <source src="./eclipse_sm.webm" type="video/webm">
</video>

BTW, If you're wondering why the clouds remain in view as night falls to the East, it's because the geocolor image is a composite of "true color" daytime (the RGB bands) and a Multispectral Infra-Red bands for the night part. GEOS-East and West capture I think sixteen basic wavelength bands that can then be composited into various combo images.

