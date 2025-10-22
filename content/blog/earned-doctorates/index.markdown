---
title: "Earned Doctorates"
date: 2019-06-23T10:07:25-04:00
categories: [R,sociology]
footnotes: false
htmlwidgets: false
mathjax: false
---


{{% figure src="https://kieranhealy.org/files/misc/socsci_phd_trends.png" alt="PhD Trends in the Social Sciences" caption="PhDs awarded in selected disciplines, 2006-2016." %}}

[Thierry Rossier asked me](https://twitter.com/ThierryRossier/status/1142696462989611009?s=20) for the code to produce plots like the one above. The data come from the Survey of Earned Doctorates, a very useful resource for tracking trends in PhDs awarded in the United States. The plot is made with `geom_line()` and `geom_label_repel()`. The trick, if it can be dignified with that term, is to use `geom_label_repel()` on a subset of the data that contains the last year of observations only. That way we can label the endpoints in a nice way, which I think is often preferable to a key or legend that the reader has to refer to in order to decode the graph. The `gghighlight` package (<https://github.com/yutannihilation/gghighlight>) will do this for you in a single step. But this works, too.

Here's the code for the plot shown here. Code and data for it and several others is available on GitHub at <https://github.com/kjhealy/earned_doctorates>.


{{< code r >}}

library(tidyverse)
library(janitor)
library(socviz)
library(ggrepel)

## --------------------------------------------------------------------
## Custom font and theme, omit if you don't have the myriad library
## (https://github.com/kjhealy/myriad) and associated Adobe fonts.
## --------------------------------------------------------------------
library(showtext)
showtext_auto()
library(myriad)
import_myriad_semi()

theme_set(theme_myriad_semi())

phds <- read_csv("data/earned_doctorates_table.csv")

phds <- clean_names(gather(phds, year, n, `2006`:`2016`))
phds$year <- as.numeric(phds$year)

phds_all <- phds %>% group_by(discipline, year) %>% 
  tally(n) 
  
p <- ggplot(phds_all, aes(x = int_to_year(year), y = n, color = discipline)) + 
  geom_line(size = 1.1) + 
  geom_label_repel(data = subset(phds_all, year == 2016),  
                  aes(x = int_to_year(year), y = n, 
                      label = discipline, 
                      color = discipline), 
                  size = rel(2.1),
                  nudge_x = 1,
                  label.padding = 0.2,
                  box.padding = 0.1,
                  segment.color = NA,
                  inherit.aes = FALSE) + 
  scale_y_continuous(labels = scales::comma) + 
  scale_x_date(breaks = int_to_year(seq(2006, 2016, by = 2)), 
               date_labels = "%Y") + 
  coord_cartesian(xlim = c(int_to_year(2006), int_to_year(2018))) + 
  guides(color = FALSE, label = FALSE) + 
  labs(x = "Year", y = "Count", 
       title = "Doctorates Awarded in the U.S., 2006-2016", 
       subtitle = "Selected Disciplines", 
       caption = "Source: Survey of Earned Doctorates") 
  
ggsave("figures/socsci_phd_trends.png", p, width = 8, height = 6) 

{{< /code >}}

