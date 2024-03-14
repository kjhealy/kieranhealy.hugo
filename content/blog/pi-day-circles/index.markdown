---
title: "Pi Day Circles"
date: 2024-03-14T07:30:03-04:00
categories: [visualization,R]
footnotes: false
htmlwidgets: false
mathjax: false
---

Some Lissajous animations for Pi Day. Made with R, ggplot, and gganimate.

<video autoplay loop muted playsinline controls="true" width = "100%">
    <source src="./lissajous-fixed-lg-2.mp4" type="video/mp4">
    <source src="./lissajous-fixed-lg-2.mov" type="video/mov">
    <source src="./lissajous-fixed-lg-2.webm" type="video/webm">
</video>


And the really not very efficient code that made them:

{{< code r >}}
library(tidyverse)
library(gganimate)
library(transformr)

df_base <- tibble(
  id = seq(1, 1000, 1),
  t_vals = seq(0, 2 * pi, length.out = 1000))


circles <- function(t) {
  x01 <- cos(t * 1)
  y01 <- sin(t * 1)

  x02 <- cos(t * 2)
  y02 <- sin(t * 2)

  x03 <- cos(t * 3)
  y03 <- sin(t * 3)

  x04 <- cos(t * 4)
  y04 <- sin(t * 4)

  x05 <- cos(t * 5)
  y05 <- sin(t * 5)

  x06 <- cos(t * 6)
  y06 <- sin(t * 6)

  x07 <- cos(t * 7)
  y07 <- sin(t * 7)

  x08 <- cos(t * 8)
  y08 <- sin(t * 8)

  x09 <- cos(t * 9)
  y09 <- sin(t * 9)

  x10 <- cos(t * 10)
  y10 <- sin(t * 10)


  tibble(
    tick = seq_along(t),
    x01, x02, x03, x04, x05, x06, x07, x08, x09, x10,
    y01, y02, y03, y04, y05, y06, y07, y08, y09, y10
    )
}

df_out <- circles(t = df_base$t_vals)

df <- bind_cols(df_base, df_out) |>
  select(id, tick, everything()) |>
  pivot_longer(x01:x10, names_to = "x_group", values_to = "x") |>
  pivot_longer(y01:y10, names_to = "y_group", values_to = "y") |>
  mutate(x_group = str_remove(x_group, "x"),
         y_group = str_remove(y_group, "y")) |>
  unite("group_id", x_group, y_group, remove = FALSE)

out <- df |>
  ggplot(aes(x = x, y = y, color = group_id, group = group_id)) +
  geom_point(size = 3) +
  geom_path() +
  facet_grid(x_group ~ y_group) +
  coord_equal() +
  guides(color = "none") +
  theme_void() +
  transition_reveal(tick) +
  ease_aes("linear")



animate(out, duration = 30, fps = 24, height = 1080, width = 1080,
        renderer = ffmpeg_renderer())

anim_save(filename = "lissajous-fixed-lg-2.webm",
          height = 1080, width = 1080)

{{< /code >}}
