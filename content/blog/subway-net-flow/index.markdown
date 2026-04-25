---
title: "Hourly Subway Station Flows"
date: 2026-04-25T11:12:39-04:00
categories: [visualization,R]
mathjax: false
image: net-flow-thumb.png
---

[Pie charts are bad](https://socviz.co/08-polishing.html#saying-no-to-pie), as
any fule kno. We're not as good at judging relative differences between angles
and areas as we are at judging relative differences in lengths on a common
baseline. This is especially true when we have more than two things to compare
at the same time. So, as a rule, you shouldn't use them. You should figure out
some other way of viewing your data instead. On the other hand, I just made 424
animated pie charts because if you're going to break a rule you should break
it good and hard.

{{% figure src="subway-map.png" alt="A view of the New York City Subway System (excluding the SIR). We'll animate this in a minute." caption="A view of the New York City Subway System (excluding the SIR). We'll animate this in just a minute." %}}


The New York City Subway system is very large and carries [a *lot* of passengers
every day](https://kieranhealy.org/blog/archives/2025/02/19/mta-ridership/). The
[MTA](https://www.mta.info) makes quite a bit of data available about the
subway, including data on hourly flow through the system. Now, the MTA can't
track individual pathways people take through the subway. If you use an [OMNY
card](https://omny.info) (or before that, a Metrocard) to enter the system, this
signals the start of a trip from some specific station or station complex. But
unlike some systems, you don't need to "tag out" of the subway, you just exit
through a turnstile. So the system doesn't know where you exit it. In addition,
while many stations are just on a single line, some (like 34 St/Penn Station, or
Fulton Street) are station complexes that serve many lines and allow transfers
between them.

However, the MTA does publish hourly [Origin-Destination
estimates](https://data.ny.gov/Transportation/MTA-Subway-Origin-Destination-Ridership-Estimate-2/y2qv-fytt/about_data)
for all pairs of stations. These are their [best
guess](https://data.ny.gov/api/views/y2qv-fytt/files/c912f0c9-7371-44c9-a7a3-95c5389b82fe?download=true&filename=MTA_SubwayOriginDestinationRidershipEstimate_Overview.pdf)
about the flow of traffic from any particular station to any other. Because
there are so many combinations, visualizing that sort of data is quite tricky.
Even then, you don't get information about _routes_ through the system, just
start and end points. Transit analysts and planners can go further by
introducing some further assumptions about Subway users. For example we might assume that commuters take the most efficient route between any given pair of entry and exit stations, and build from there to a picture of flow through the system.

I do something rather more simple here. I use the MTA's hourly
origin-destination estimates and aggregate them on a station-by-station basis to
calculate in-and-out flows across 424 subway stations or station
complexes. These specific numbers are averaged over all Mondays in 2025. For
each hour of the we calculate the total passenger volume at the station, and the
share of that volume that are estimated arrivals and departures. Then we draw a
pie chart for each station, coloring it yellow for departures,
purple for arrivals. The circle size reflects total volume and the pie slice
proportions show the flow balance. 

The flow data is pretty bulky. The original dataset has about 121 million rows. But working with it is pretty straightforward, thanks to the magic of parquet files, [duckdb](https://duckdb.org), and [duckplyr](https://duckplyr.tidyverse.org). Having patiently downloaded the data via its API, I put it in a parquet file. The CSV is about 17GB but the parquet file boils it down to 1.5GB. Then I made a small R package that bundled that data with a few convenience functions. This lets me use the data without copying it into any single project. So I can write, e.g., 

{{< code r >}}

nycsubwayodr::nyc_subway_odr()
#> # A duckplyr data frame: 15 variables
#>     year month day_of_week hour_of_day timestamp           day_of_month origin_station_complex_id
#>    <int> <int> <chr>             <int> <dttm>                     <int>                     <int>
#>  1  2025     1 Monday                1 2025-01-06 01:00:00            6                       189
#>  2  2025     1 Monday                1 2025-01-06 01:00:00            6                       313
#>  3  2025     1 Monday                1 2025-01-06 01:00:00            6                       611
#>  4  2025     1 Monday                1 2025-01-06 01:00:00            6                       125
#>  5  2025     1 Monday                1 2025-01-06 01:00:00            6                       313
#>  6  2025     1 Monday                1 2025-01-06 01:00:00            6                       154
#>  7  2025     1 Monday                1 2025-01-06 01:00:00            6                       167
#>  8  2025     1 Monday                1 2025-01-06 01:00:00            6                       612
#>  9  2025     1 Monday                1 2025-01-06 01:00:00            6                       272
#> 10  2025     1 Monday                1 2025-01-06 01:00:00            6                       167
#> # ℹ more rows
#> # ℹ 8 more variables: origin_station_complex_name <chr>, origin_latitude <dbl>, origin_longitude <dbl>,
#> #   destination_station_complex_id <int>, destination_station_complex_name <chr>,
#> #   destination_latitude <dbl>, destination_longitude <dbl>, estimated_average_ridership <dbl>

{{< /code >}}

From there, we lazily query the data and duckdb does the work of doing the calculations. The whole table is never loaded into your R session, and duckdb is very fast. From there, we take our hourly flow summaries, join them to a tibble of station and line data, and export the result to some JSON files that [D3js](https://d3js.org) animates for us. Here's the result. There are three views. Initially, you see just the schematic subway map. If you click the "Map" button in the top left, it will switch to the ticking pie-chart view, which puts a pie on every station complex, with each tick being an hour of the day. The pies pile up on one another in the geographic view (in a not wholly uninformative way), but click again to have them expand to a somewhat more abstracted, force-directed network view of the system. Then click again to go back to the map. You can hover over or tap on nodes to get information about the bit of data it's currently showing.


<link rel="stylesheet" href="subway-transition.css">

<div id="odr-controls" style="display:flex;gap:8px;align-items:center;margin-bottom:8px;font-family:'Helvetica Neue',Helvetica,sans-serif">
  <button id="mode-btn" title="Cycle: Map → Net Flow → Network"
    style="background:var(--bs-btn-bg,#f8f9fa);border:1px solid var(--bs-btn-border-color,#dee2e6);border-radius:4px;padding:4px 10px;cursor:pointer;font-size:12px">Map</button>
  <button id="theme-btn" title="Toggle light/dark theme"
    style="background:var(--bs-btn-bg,#f8f9fa);border:1px solid var(--bs-btn-border-color,#dee2e6);border-radius:4px;padding:4px 8px;cursor:pointer;font-size:14px">
    <svg width="14" height="14" viewBox="0 0 384 512" fill="currentColor" style="vertical-align:-2px"><path d="M223.5 32C100 32 0 132.3 0 256S100 480 223.5 480c60.6 0 115.5-24.2 155.8-63.4c5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6c-96.9 0-175.5-78.8-175.5-176c0-65.8 36-123.1 89.3-153.3c6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"/></svg> /
    <svg width="14" height="14" viewBox="0 0 512 512" fill="currentColor" style="vertical-align:-2px"><path d="M361.5 1.2c5 2.1 8.6 6.6 9.6 11.9L391 121l107.9 19.8c5.3 1 9.8 4.6 11.9 9.6s1.5 10.7-1.6 15.2L446.9 256l62.3 90.3c3.1 4.5 3.7 10.2 1.6 15.2s-6.6 8.6-11.9 9.6L391 391 371.1 498.9c-1 5.3-4.6 9.8-9.6 11.9s-10.7 1.5-15.2-1.6L256 446.9l-90.3 62.3c-4.5 3.1-10.2 3.7-15.2 1.6s-8.6-6.6-9.6-11.9L121 391 13.1 371.1c-5.3-1-9.8-4.6-11.9-9.6s-1.5-10.7 1.6-15.2L65.1 256 2.8 165.7c-3.1-4.5-3.7-10.2-1.6-15.2s6.6-8.6 11.9-9.6L121 121 140.9 13.1c1-5.3 4.6-9.8 9.6-11.9s10.7-1.5 15.2 1.6L256 65.1 346.3 2.8c4.5-3.1 10.2-3.7 15.2-1.6zM256 160a96 96 0 1 0 0 192 96 96 0 1 0 0-192z"/></svg>
  </button>
  <div id="odr-hour-slider-wrap" style="display:none;flex-direction:column;gap:2px">
    <div style="display:flex;align-items:center;gap:4px">
      <button id="play-btn" title="Play/pause" style="background:#f0f0f0;border:1px solid #999;border-radius:4px;padding:5px 8px;cursor:pointer;line-height:1;display:flex;align-items:center">
        <svg id="play-icon" width="12" height="12" viewBox="0 0 320 512" fill="#333"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>
      </button>
      <input id="hour-slider" type="range" min="0" max="23" step="1" value="8" style="width:340px">
    </div>
    <div id="tick-labels" style="display:flex;justify-content:space-between;font-size:10px;color:#666;margin-left:24px;width:340px"></div>
  </div>
  <div id="odr-legend" style="display:none;align-items:center;gap:6px;font-size:11px;color:#666;margin-left:8px">
    <svg width="24" height="24" viewBox="-12 -12 24 24">
      <path id="legend-dep" d="M0,0 L0,-10 A10,10 0 1,1 -5.88,8.09 Z" fill="#fde725" stroke="#000" stroke-width="0.5" opacity="0.95"/>
      <path id="legend-arr" d="M0,0 L-5.88,8.09 A10,10 0 0,1 0,-10 Z" fill="#440154" stroke="#000" stroke-width="0.5" opacity="0.95"/>
    </svg>
    <div style="display:flex;flex-direction:column;line-height:1.2">
      <span id="legend-dep-label" style="color:#c8b900">Departures</span>
      <span id="legend-arr-label" style="color:#440154">Arrivals</span>
    </div>
  </div>
</div>

<div id="odr-chart"></div>

<script src="https://d3js.org/d3.v7.min.js"></script>
<script src="subway-network-odr.js"></script>
<script>
(async function() {
  const [networkData, boroughs] = await Promise.all([
    fetch("network_odr_monday.json").then(r => r.json()),
    fetch("boroughs.geojson").then(r => r.json())
  ]);

  const chart = createSubwayNetworkODR(d3, networkData, boroughs, {
    width: Math.min(window.innerWidth - 40, 1800),
    height: Math.min(900, Math.max(500, window.innerHeight - 100))
  });

  document.getElementById("odr-chart").appendChild(chart.node);
  chart.setThemePageBody(false);

  const states = ["geo", "volume", "network"];
  const labels = ["Map", "Net Flow", "Network"];
  let stateIdx = 0;
  let theme = "light";
  let animating = true;
  let animInterval = null;

  const modeBtn = document.getElementById("mode-btn");
  modeBtn.addEventListener("click", () => {
    stateIdx = (stateIdx + 1) % states.length;
    modeBtn.textContent = labels[stateIdx];
    chart.update(states[stateIdx]);
  });

  const themeBtn = document.getElementById("theme-btn");
  themeBtn.addEventListener("click", () => {
    theme = theme === "light" ? "dark" : "light";
    chart.setTheme(theme);
  });

  const slider = document.getElementById("hour-slider");
  slider.addEventListener("input", () => chart.updateHour(+slider.value));

  const tickLabels = ["12am","","","","4am","","","","8am","","","","12pm","","","","4pm","","","","8pm","","","11pm"];
  const tickContainer = document.getElementById("tick-labels");
  tickLabels.forEach(t => {
    const span = document.createElement("span");
    span.textContent = t;
    span.style.width = "0";
    span.style.textAlign = "center";
    span.style.overflow = "visible";
    span.style.whiteSpace = "nowrap";
    tickContainer.appendChild(span);
  });

  const playBtn = document.getElementById("play-btn");
  const playIconSvg = '<svg width="12" height="12" viewBox="0 0 384 512" fill="#333"><path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80V432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/></svg>';
  const pauseIconSvg = '<svg width="12" height="12" viewBox="0 0 320 512" fill="#333"><path d="M48 64C21.5 64 0 85.5 0 112V400c0 26.5 21.5 48 48 48H80c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H48zm192 0c-26.5 0-48 21.5-48 48V400c0 26.5 21.5 48 48 48h32c26.5 0 48-21.5 48-48V112c0-26.5-21.5-48-48-48H240z"/></svg>';

  function startAnimation() {
    animating = true;
    playBtn.innerHTML = pauseIconSvg;
    animInterval = setInterval(() => {
      const next = (+slider.value + 1) % 24;
      slider.value = next;
      chart.updateHour(next);
    }, 1000);
  }

  function stopAnimation() {
    animating = false;
    playBtn.innerHTML = playIconSvg;
    if (animInterval) { clearInterval(animInterval); animInterval = null; }
  }

  playBtn.addEventListener("click", () => {
    if (animating) stopAnimation(); else startAnimation();
  });

  chart.setSliderElement(document.getElementById("odr-hour-slider-wrap"));
  chart.updateHour(8);
  startAnimation();
})();
</script>

Now, you might reasonably say, Kieran, that's a lot of data to show that people go to work in the morning and come home in the evening. I'm not saying there's nothing to that criticism. But there are quite a few interesting details in there as the data pick up traffic to different parts of town. The big interchanges naturally dominate the view, but even here there are things of interest about the balance of flow, as e.g. Penn Station has people coming in on New Jersey Transit during morning rush hour and then entering the subway, which does a lot to balance its net flow during rush-hour and even tip it towards net departures. But more importantly, who doesn't want to sit back and contemplate more than 400 pie charts, each one pulsing with life as another hour ticks by?
