// subway-network-odr.js
// Network view with OD-based net flow coloring.
// Nodes colored by net flow direction: blue = net inflow, red = net outflow.
// Size reflects absolute volume (departures + arrivals).

function createSubwayNetworkODR(d3, networkData, boroughs, options = {}) {
  const width = options.width || 1000;
  const height = options.height || 700;
  const duration = options.duration || 1200;

  const nodes = networkData.nodes.map(d => ({...d}));
  const edges = networkData.edges.map(d => ({
    ...d,
    source: d.source,
    target: d.target
  }));

  // --- Size scale (ridership → radius) ---
  const maxRidership = Math.max(...nodes.map(d => d.avg_daily));
  // Max across all hours for a fixed scale
  const maxHourly = Math.max(...nodes.map(d =>
    d.hourly ? Math.max(...d.hourly) : d.avg_daily));
  const rScale = d3.scaleSqrt()
    .domain([0, maxHourly])
    .range([4, 30]);
  const baseRadius = 2.5;  // uniform small size for initial geo view
  let currentHour = -1;  // -1 = full day avg

  // --- Geographic projection (fit to station points, shifted left) ---
  const pad = 30;
  const allCoords = nodes.map(d => [d.lon, d.lat]);
  const geojsonExtent = { type: "MultiPoint", coordinates: allCoords };
  const projection = d3.geoMercator().fitExtent(
    [[pad, pad], [width - pad, height - pad]],
    geojsonExtent
  );
  // fitExtent centers horizontally; shift left to reduce blank space
  const [[bx0], [bx1]] = d3.geoPath().projection(projection).bounds(geojsonExtent);
  const contentWidth = bx1 - bx0;
  const leftShift = (width - contentWidth) / 2 - pad;
  if (leftShift > 10) {
    projection.translate([projection.translate()[0] - leftShift + 210, projection.translate()[1]]);
  }
  const pathGen = d3.geoPath().projection(projection);

  // Compute the visual center of the map content for network layout alignment
  const [[mapX0], [mapX1]] = pathGen.bounds(geojsonExtent);
  const mapCenterX = (mapX0 + mapX1) / 2;

  // Compute geographic positions
  nodes.forEach(d => {
    const [gx, gy] = projection([d.lon, d.lat]);
    d.geoX = gx;
    d.geoY = gy;
    // Initialize force positions at geographic positions
    d.x = gx;
    d.y = gy;
    d.netX = gx;
    d.netY = gy;
  });

  // --- Build node lookup ---
  const nodeById = {};
  nodes.forEach(d => { nodeById[d.id] = d; });

  // Resolve edge source/target to node objects
  const links = edges.map(d => ({
    source: nodeById[d.source],
    target: nodeById[d.target],
    routes: d.routes,
    colors: d.colors,
    n_lines: d.n_lines
  })).filter(d => d.source && d.target);

  // --- Force simulation ---
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).distance(15).strength(0.4))
    .force("charge", d3.forceManyBody()
      .strength(d => -rScale(d.avg_daily) * 8))
    .force("center", d3.forceCenter(mapCenterX, height / 2))
    .force("collision", d3.forceCollide()
      .radius(d => rScale(d.avg_daily) + 2))
    .force("x", d3.forceX(mapCenterX).strength(0.03))
    .force("y", d3.forceY(height / 2).strength(0.03))
    .stop();

  // Run simulation to get initial positions
  for (let i = 0; i < 400; i++) simulation.tick();

  // Rescale network positions to fit within the map's bounding area
  const netPad = 60;
  const xs = nodes.map(d => d.x);
  const ys = nodes.map(d => d.y);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const xRange = xMax - xMin || 1;
  const yRange = yMax - yMin || 1;
  // Scale to fit within the same region as the map content
  const netScaleX = (mapX1 - mapX0) / xRange;
  const netScaleY = (height - 2 * netPad) / yRange;
  const netScale = Math.min(netScaleX, netScaleY) * 0.85;
  const xCenter = (xMin + xMax) / 2;
  const yCenter = (yMin + yMax) / 2;

  nodes.forEach(d => {
    d.netX = (d.x - xCenter) * netScale + mapCenterX;
    d.netY = (d.y - yCenter) * netScale + height / 2;
    d.x = d.netX;
    d.y = d.netY;
  });

  // Reconfigure simulation for interactive use (stays stopped until network view)
  simulation
    .force("center", d3.forceCenter(mapCenterX, height / 2).strength(0.02))
    .force("x", d3.forceX(mapCenterX).strength(0.01))
    .force("y", d3.forceY(height / 2).strength(0.01))
    .alphaDecay(0.02)
    .velocityDecay(0.4)
    .on("tick", () => {
      if (currentView !== "network") return;
      nodeEls
        .attr("transform", d => `translate(${d.x},${d.y})`);
      edgeEls
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
    });

  // --- Build SVG ---
  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", `0 0 ${width} ${height}`)
    .style("background", "#ffffff");

  const contentGroup = svg.append("g");

  // --- Zoom ---
  const zoom = d3.zoom()
    .scaleExtent([0.3, 8])
    .filter(event => {
      // Don't zoom when interacting with nodes (circles in network view)
      if (event.target.closest && event.target.closest(".nodes") && currentView === "network") return false;
      return true;
    })
    .on("zoom", (event) => contentGroup.attr("transform", event.transform));
  svg.call(zoom);

  // --- Zoom controls ---
  const zoomControls = svg.append("g")
    .attr("transform", `translate(12, ${height - 100})`);

  function addZoomBtn(label, xOff, fontSize, onClick) {
    const g = zoomControls.append("g")
      .attr("transform", `translate(${xOff}, 0)`)
      .style("cursor", "pointer")
      .on("click", onClick);
    g.append("rect")
      .attr("width", 28).attr("height", 28).attr("rx", 4)
      .attr("fill", "#f0f0f0").attr("stroke", "#999");
    g.append("text")
      .attr("x", 14).attr("y", 14)
      .attr("text-anchor", "middle").attr("dominant-baseline", "central")
      .attr("font-family", "Broadway, 'Helvetica LT Pro', 'Helvetica Neue', Helvetica, 'Segoe UI', sans-serif")
      .attr("font-size", fontSize).attr("fill", "#333").text(label);
  }

  addZoomBtn("+", 0, "16px", () => svg.transition().duration(300).call(zoom.scaleBy, 1.5));
  addZoomBtn("\u2212", 32, "16px", () => svg.transition().duration(300).call(zoom.scaleBy, 1 / 1.5));
  addZoomBtn("\u21ba", 64, "12px", () => {
    svg.transition().duration(300).call(zoom.transform, d3.zoomIdentity);
    if (currentView === "network") {
      // Reset nodes to initial network positions
      simulation.stop();
      nodes.forEach(d => { d.x = d.netX; d.y = d.netY; d.fx = null; d.fy = null; });
      const t = svg.transition().duration(500).ease(d3.easeCubicInOut);
      nodeEls.transition(t)
        .attr("transform", d => `translate(${d.netX},${d.netY})`);
      edgeEls.transition(t)
        .attr("x1", d => d.source.netX)
        .attr("y1", d => d.source.netY)
        .attr("x2", d => d.target.netX)
        .attr("y2", d => d.target.netY);
    }
  });

  // --- Borough outlines (geographic view only) ---
  const boroGroup = contentGroup.append("g").attr("class", "borough-outlines");
  if (boroughs && boroughs.features) {
    boroGroup.selectAll("path")
      .data(boroughs.features)
      .join("path")
      .attr("d", d => pathGen(d))
      .attr("fill", "none")
      .attr("stroke", "#ddd")
      .attr("stroke-width", 1);
  }

  // --- Edges ---
  const edgeEls = contentGroup.append("g").attr("class", "edges")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("x1", d => d.source.geoX)
    .attr("y1", d => d.source.geoY)
    .attr("x2", d => d.target.geoX)
    .attr("y2", d => d.target.geoY)
    .attr("stroke", d => d.colors ? (Array.isArray(d.colors) ? d.colors[0] : d.colors) : "#999")
    .attr("stroke-width", d => Math.min(3, 0.8 + d.n_lines * 0.4))
    .attr("opacity", 0.4);

  // --- Nodes ---
  function nodeFillBase(d) {
    if (d.is_transfer) return "#444";
    return d.trunk_color || "#4a90d9";
  }

  // Arc generator for pie slices
  const arcGen = d3.arc().innerRadius(0);

  // Colors for departures and arrivals — light and dark variants
  const depColorLight = "#fde725";  // viridis yellow
  const arrColorLight = "#440154";  // viridis purple
  const depColorDark = "#f0f921";   // inferno yellow
  const arrColorDark = "#f89540";   // inferno orange
  let depColor = depColorLight;
  let arrColor = arrColorLight;

  // Node groups
  const nodeGroups = contentGroup.append("g").attr("class", "nodes")
    .selectAll("g")
    .data(nodes)
    .join("g")
    .attr("transform", d => `translate(${d.geoX},${d.geoY})`)
    .style("cursor", "pointer");

  // Base circle (visible in map view)
  const nodeCircles = nodeGroups.append("circle")
    .attr("r", baseRadius)
    .attr("fill", nodeFillBase)
    .attr("fill-opacity", 0.75)
    .attr("stroke", d => d.is_transfer ? "#222" : (d.trunk_color || "#2a6099"))
    .attr("stroke-width", 0.5);

  // Departure slice (red)
  const depArcs = nodeGroups.append("path")
    .attr("class", "dep-arc")
    .attr("fill", depColor)
    .attr("fill-opacity", 0)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.5)
    .attr("stroke-opacity", 0);

  // Arrival slice (blue)
  const arrArcs = nodeGroups.append("path")
    .attr("class", "arr-arc")
    .attr("fill", arrColor)
    .attr("fill-opacity", 0)
    .attr("stroke", "#000")
    .attr("stroke-width", 0.5)
    .attr("stroke-opacity", 0);

  // Compute pie angles: departures share from top clockwise, arrivals the rest
  function pieAngles(d) {
    const dep = getDepartures(d);
    const arr = getArrivals(d);
    const total = dep + arr;
    if (total === 0) return { depEnd: Math.PI, arrEnd: 2 * Math.PI };
    const depAngle = (dep / total) * 2 * Math.PI;
    return { depEnd: depAngle, arrEnd: 2 * Math.PI };
  }

  // Store previous arc params per node for interpolation
  nodes.forEach(d => {
    d._depAngle = Math.PI;  // start at half
    d._arrAngle = 2 * Math.PI;
    d._pieR = 0;
  });

  // Update arc paths and sizes for current hour
  function updateArcs(useTransition) {
    const vis = currentView === "geo" ? 0 : 0.95;
    const strokeVis = currentView === "geo" ? 0 : 0.6;

    if (useTransition) {
      depArcs.transition("arcs").duration(400).ease(d3.easeCubicInOut)
        .attrTween("d", function(d) {
          const r1 = d._pieR;
          const a1 = d._depAngle;
          const r2 = rScale(Math.max(getDepartures(d), getArrivals(d)));
          const a2 = pieAngles(d).depEnd;
          const iR = d3.interpolate(r1, r2);
          const iA = d3.interpolate(a1, a2);
          return t => {
            d._pieR = iR(t);
            d._depAngle = iA(t);
            return arcGen({ outerRadius: iR(t), startAngle: 0, endAngle: iA(t) });
          };
        })
        .attr("fill-opacity", vis)
        .attr("stroke-opacity", strokeVis);

      arrArcs.transition("arcs").duration(400).ease(d3.easeCubicInOut)
        .attrTween("d", function(d) {
          const r1 = d._pieR;
          const a1 = d._depAngle;
          const r2 = rScale(Math.max(getDepartures(d), getArrivals(d)));
          const a2 = pieAngles(d).depEnd;
          const iR = d3.interpolate(r1, r2);
          const iA = d3.interpolate(a1, a2);
          return t => arcGen({ outerRadius: iR(t), startAngle: iA(t), endAngle: 2 * Math.PI });
        })
        .attr("fill-opacity", vis)
        .attr("stroke-opacity", strokeVis);
    } else {
      nodes.forEach(d => {
        const r = rScale(Math.max(getDepartures(d), getArrivals(d)));
        const angles = pieAngles(d);
        d._pieR = r;
        d._depAngle = angles.depEnd;
      });

      depArcs
        .attr("d", d => arcGen({ outerRadius: d._pieR, startAngle: 0, endAngle: d._depAngle }))
        .attr("fill-opacity", vis)
        .attr("stroke-opacity", strokeVis);

      arrArcs
        .attr("d", d => arcGen({ outerRadius: d._pieR, startAngle: d._depAngle, endAngle: 2 * Math.PI }))
        .attr("fill-opacity", vis)
        .attr("stroke-opacity", strokeVis);
    }
  }

  // For backward compatibility, keep nodeEls pointing to the groups
  const nodeEls = nodeGroups;

  // --- Tooltip ---
  const tooltip = d3.select(document.createElement("div"))
    .style("position", "absolute")
    .style("background", "rgba(0,0,0,0.85)")
    .style("color", "#fff")
    .style("padding", "5px 10px")
    .style("border-radius", "4px")
    .style("font-size", "12px")
    .style("font-family", "'Helvetica Neue', Helvetica, sans-serif")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("white-space", "nowrap")
    .style("max-width", "300px");

  // --- Drag behavior (network view only) ---
  const drag = d3.drag()
    .filter(event => currentView === "network")
    .on("start", function(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", function(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", function(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });

  nodeEls.call(drag);

  nodeEls
    .on("mouseenter", function(event, d) {
      const parent = svg.node().parentNode;
      if (tooltip.node().parentNode !== parent) {
        parent.style.position = "relative";
        parent.appendChild(tooltip.node());
      }
      const parentRect = parent.getBoundingClientRect();
      const xInParent = event.clientX - parentRect.left;
      tooltip
        .html(() => {
          let text = `<strong>${d.name}</strong><br>`;
          if (currentHour >= 0) {
            const dep = Math.round(getDepartures(d));
            const arr = Math.round(getArrivals(d));
            const net = Math.round(getNetFlow(d));
            const dir = net > 0 ? "net inflow" : net < 0 ? "net outflow" : "balanced";
            text += `${getRidershipLabel()}<br>`;
            text += `Dep: ${dep.toLocaleString()} · Arr: ${arr.toLocaleString()}<br>`;
            text += `<strong>${net > 0 ? "+" : ""}${net.toLocaleString()}</strong> (${dir})`;
          } else {
            text += `${Math.round(getRidership(d)).toLocaleString()} riders (${getRidershipLabel()})`;
          }
          return text;
        })
        .style("opacity", 1)
        .style("left", (xInParent + 12) + "px")
        .style("right", null)
        .style("top", (event.clientY - parentRect.top - 30) + "px");

      d3.select(this).select("circle")
        .attr("fill-opacity", 1)
        .attr("stroke-width", 2);

      // Highlight connected edges
      edgeEls
        .attr("opacity", e =>
          (e.source === d || e.target === d) ? 0.9 : 0.1)
        .attr("stroke-width", e =>
          (e.source === d || e.target === d) ? 3 : 0.5);
    })
    .on("mouseleave", function() {
      tooltip.style("opacity", 0);
      d3.select(this).select("circle")
        .attr("fill-opacity", 0.75)
        .attr("stroke-width", 0.5);
      edgeEls
        .attr("opacity", 0.4)
        .attr("stroke-width", d => Math.min(3, 0.8 + d.n_lines * 0.4));
    });

  // --- Ridership / net flow helpers ---
  function getRidership(d) {
    if (currentHour >= 0 && d.hourly) return d.hourly[currentHour] || 0;
    return d.avg_daily;
  }

  function getNetFlow(d) {
    if (currentHour >= 0 && d.net_flow) return d.net_flow[currentHour] || 0;
    return 0;
  }

  function getDepartures(d) {
    if (currentHour >= 0 && d.departures) return d.departures[currentHour] || 0;
    return d.avg_daily / 2;
  }

  function getArrivals(d) {
    if (currentHour >= 0 && d.arrivals) return d.arrivals[currentHour] || 0;
    return d.avg_daily / 2;
  }

  function getRidershipLabel() {
    if (currentHour >= 0) {
      const ampm = currentHour < 12 ? "am" : "pm";
      const h = currentHour === 0 ? 12 : currentHour > 12 ? currentHour - 12 : currentHour;
      return `${h}${ampm} Mon avg`;
    }
    return "Mon daily avg";
  }

  // --- Net flow color scale ---
  // Max absolute net flow across all stations and hours (for fixed scale)
  const maxAbsNetFlow = Math.max(...nodes.map(d =>
    d.net_flow ? Math.max(...d.net_flow.map(Math.abs)) : 0));

  const flowColorScale = d3.scaleDiverging()
    .domain([-maxAbsNetFlow, 0, maxAbsNetFlow])
    .interpolator(d3.interpolateRdBu);

  function getFlowColor(d) {
    if (currentHour < 0) return nodeFillBase(d);
    const net = getNetFlow(d);
    return flowColorScale(net);
  }

  // --- Slider element management ---
  let sliderEl = null;
  function setSliderElement(el) { sliderEl = el; el.style.display = "none"; }
  function getSlider() { return sliderEl || document.getElementById("odr-hour-slider-wrap"); }
  function showSlider() {
    const el = getSlider(); if (el) el.style.display = "flex";
    const leg = document.getElementById("odr-legend"); if (leg) leg.style.display = "flex";
  }
  function hideSlider() {
    const el = getSlider(); if (el) el.style.display = "none";
    const leg = document.getElementById("odr-legend"); if (leg) leg.style.display = "none";
  }

  // --- View state ---
  let currentView = "geo";

  function update(view) {
    currentView = view;
    const t = svg.transition("view").duration(duration).ease(d3.easeCubicInOut);

    // Reset zoom on view change
    svg.transition(t).call(zoom.transform, d3.zoomIdentity);

    if (view === "network") {
      simulation.stop();
      boroGroup.transition(t).attr("opacity", 0);
      showSlider();

      nodeEls.transition(t)
        .attr("transform", d => `translate(${d.netX},${d.netY})`);
      nodeCircles.transition(t)
        .attr("r", 0.5).attr("fill-opacity", 0.3);
      updateArcs(true);
      edgeEls.transition(t)
        .attr("x1", d => d.source.netX)
        .attr("y1", d => d.source.netY)
        .attr("x2", d => d.target.netX)
        .attr("y2", d => d.target.netY);

      t.end().then(() => {
        nodes.forEach(d => { d.x = d.netX; d.y = d.netY; });
        simulation.alpha(0.01).restart();
      }).catch(() => {});

    } else if (view === "volume") {
      simulation.stop();
      boroGroup.transition(t).attr("opacity", 1);
      showSlider();

      nodeEls.transition(t)
        .attr("transform", d => `translate(${d.geoX},${d.geoY})`);
      nodeCircles.transition(t)
        .attr("r", 0.5).attr("fill-opacity", 0.3);
      updateArcs(true);
      edgeEls.transition(t)
        .attr("x1", d => d.source.geoX)
        .attr("y1", d => d.source.geoY)
        .attr("x2", d => d.target.geoX)
        .attr("y2", d => d.target.geoY);

    } else {
      simulation.stop();
      boroGroup.transition(t).attr("opacity", 1);
      hideSlider();

      nodeEls.transition(t)
        .attr("transform", d => `translate(${d.geoX},${d.geoY})`);
      nodeCircles.transition(t)
        .attr("r", baseRadius)
        .attr("fill", d => nodeFillBase(d))
        .attr("fill-opacity", 0.75);
      depArcs.transition(t).attr("fill-opacity", 0).attr("stroke-opacity", 0);
      arrArcs.transition(t).attr("fill-opacity", 0).attr("stroke-opacity", 0);
      edgeEls.transition(t)
        .attr("x1", d => d.source.geoX)
        .attr("y1", d => d.source.geoY)
        .attr("x2", d => d.target.geoX)
        .attr("y2", d => d.target.geoY);
    }
  }

  // --- Update hour (resize arcs and update colors) ---
  function updateHour(hour) {
    currentHour = hour;
    if (currentView === "geo") return;

    // Hide the base circle in volume/network views
    nodeCircles.transition("hour").duration(400)
      .attr("r", 0.5)
      .attr("fill-opacity", 0.3);

    updateArcs(true);

    // Update collision force radius for dragging (based on total volume)
    simulation.force("collision", d3.forceCollide()
      .radius(d => rScale((getDepartures(d) + getArrivals(d)) / 2) + 2));
  }

  // --- Theme ---
  let isDark = false;
  function setTheme(th) {
    isDark = th === "dark";
    svg.transition().duration(300)
      .style("background", isDark ? "#1a1a2e" : "#ffffff");
    boroGroup.selectAll("path")
      .transition().duration(300)
      .attr("stroke", isDark ? "#333" : "#ddd");
    nodeCircles.transition().duration(300)
      .attr("fill", d => {
        if (d.is_transfer) return isDark ? "#ddd" : "#444";
        return d.trunk_color || "#4a90d9";
      })
      .attr("stroke", d => {
        if (d.is_transfer) return isDark ? "#fff" : "#222";
        return d.trunk_color || "#2a6099";
      });
    // Swap pie colors for theme
    depColor = isDark ? depColorDark : depColorLight;
    arrColor = isDark ? arrColorDark : arrColorLight;
    depArcs.transition().duration(300).attr("fill", depColor);
    arrArcs.transition().duration(300).attr("fill", arrColor);

    // Update legend colors
    const leg = document.getElementById("odr-legend");
    if (leg) {
      const spans = leg.querySelectorAll("span");
      if (spans[0]) spans[0].style.color = isDark ? depColorDark : "#c8b900";
      if (spans[1]) spans[1].style.color = isDark ? arrColorDark : "#440154";
      const paths = leg.querySelectorAll("path");
      if (paths[0]) paths[0].setAttribute("fill", depColor);
      if (paths[1]) paths[1].setAttribute("fill", arrColor);
    }

    // Update mode button text color (only when theming page body)
    if (themePageBody) {
      const modeBtn = document.getElementById("mode-btn");
      if (modeBtn) modeBtn.style.color = isDark ? "#eee" : "#333";
    }
    // Update page background and text (opt-in)
    if (themePageBody) {
      document.body.style.background = isDark ? "#1a1a2e" : "";
      document.body.style.color = isDark ? "#eee" : "";
    }
  }

  let themePageBody = true;
  function setThemePageBody(val) { themePageBody = val; }

  return { node: svg.node(), update, setTheme, updateHour, setSliderElement, setThemePageBody };
}
