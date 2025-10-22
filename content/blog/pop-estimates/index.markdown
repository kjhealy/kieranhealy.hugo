---
date: "2015-04-28"
title: Guessing the Population Composition of the US
categories: [Sociology,Visualization]
---

Following a conversation on Twitter this morning, here's a quick plot of some GSS data from 2000. Respondents were asked to estimate the percentage of people in the United States who fell into a range of (not necessarily exclusive) categories: White, Black, Hispanic, Asian, and Jewish. Here we show the median guesses of White respondents and Black respondents, together with the actual percentage of people in each category, based on the 2000 Census. 

{{% figure src="https://kieranhealy.org/files/misc/gss-group-pctby-race.png" alt="Estimates of racial and ethnic composition, by race." caption="Estimates of the percentage of Americans falling into various racial and ethnic categories, broken down by race of respondent (White or Black). Data: General Social Survey (2000) for guesses, and US Census (2000) for actual values." %}}

As you can see, people aren't very good at estimating these numbers. Both White and Black respondents underestimated the percentage of Whites in the US population by about the same amount, and substantially over-estimated the presence of various minority groups. Overestimates of the Hispanic population are about the same, while Black respondents overestimated the size of the Black, Asian, and Jewish US population to a greater degree than White respondents. Across the whole population (including an "Other" race category for respondents, not shown in the figure) the median guesses were 60 percent Whites, 30 percent Blacks, 20 percent Hispanics, 10 percent Asian, and 10 percent Jewish. (A notional US Jewish population of ten percent would be more than double the total actual worldwide Jewish population.)

Here's a boxplot of the distributions, with extreme outlying points removed.

{{% figure src="https://kieranhealy.org/files/misc/gss-group-pctby-race-box.png" alt="Estimates of racial and ethnic composition, by race." caption="Estimates of the percentage of Americans falling into various racial and ethnic categories, broken down by race of respondent (White or Black). Data: General Social Survey (2000)." %}}

Estimates like this are prone to be off-target for cognitive reasons, such as various heuristic biases (people tend not to guess small percentages); variation in education; and also more structural reasons, such as the racial composition of one's place of residence or the composition of media content. Figuring out which mattered more would take more time than I have now. But it's suggestive that, for example, Black respondents overestimated the size of the black population a bit more than White respondents did---one intuition would be that members of minority groups would be much more aware of these numerical differences than the majority group; but this might easily be offset by the consequences of high residential segregation.

The GSS hasn't asked this question since 2000, which is too bad. I'd be interested to see more recent estimates.

