---
title: "Asa Section Demographics"
date: 2018-09-12T15:06:59-04:00
categories: [Sociology,Gender,Visualization]
footnotes: false
htmlwidgets: false
mathjax: false
---

The American Sociological Association [released some data](http://www.asanet.org/research-and-publications/research-sociology/trends-sociology/asa-membership) on its special-interest sections, including some demographic breakdowns. [Dan Hirschman wrote a post](https://scatter.wordpress.com/2018/09/10/asa-section-memberships-by-race/) on Scatterplot looking at some of the breakdowns. Here are some more. I was interested in two things: first, the relative prevalence of Student and Retired members across sections, and second the distribution of women across sections. About 53% of all ASA members are women, substantially higher than some other social sciences and many other academic disciplines. Membership in sections is entirely voluntary and driven mostly by substantive research interests. It's interesting to ask how people sort themselves across areas. (A tiny number of members do not belong to any sections.)

First, students and retirees.

{{% figure src="files/misc/asa17-student-spread.png" alt="Concentrations of Student Members." caption="Concentrations of Student Members." %}}

{{% figure src="files/misc/asa17-retired-spread.png" alt="Concentrations of Retired Members." caption="Concentrations of Retired Members." %}}

{{% figure src="files/misc/asa17-student-hilo.png" alt="Student concentrations with sections ordered from high to low membership." caption="Student concentrations with sections ordered from high to low membership." %}}

Next, some data on gender.

{{% figure src="files/misc/asa17-female-spread.png" alt="Percent women in each section, centered on average percent across all sections." caption="Percent women in each section, centered on average percent across all sections. The overall average is about 52 percent." %}}

The gender composition of sections is somewhat related to how large they are. 

{{% figure src="files/misc/asa17-scatter.png" alt="Percent female vs Total section membership." caption="Percent female vs total section membership." %}}

We can look at all these together, if we like, using a ternary plot. However, we are cheating somewhat, because the three variables are constrained to sum to 1 on the plot but not in reality. 

{{% figure src="files/misc/asa17-ternary.png" alt="" caption="Ternary plot of percent female, percent student, and percent retired." %}}

Code and data to reproduce these figures [is available on GitHub](https://github.com/kjhealy/asa_sections17).
