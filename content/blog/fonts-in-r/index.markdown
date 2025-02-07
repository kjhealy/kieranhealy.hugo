---
title: "Kerning and Kerning in a Widening Gyre"
date: 2025-02-06T20:32:42-05:00
categories: [R,nerdery]
footnotes: false
htmlwidgets: false
mathjax: false
---


This post summarizes an extended period of deep annoyance. I have tried to solve the problem it describes more than once before and *not quite* done it. This has, in fact, happened again. I have still not satisfactorily solved the problem. But this time I know *why* I can't solve it in a civilized manner. My goal is simple, and reasonable. I want  to produce more or less identical plots in both PNG and PDF formats. PNG is a raster format. PDF is a vector format and also the Devil Incarnate. Sometimes you want one format, sometimes the other. Raster formats color in pixels on a grid of some fixed resolution. They are efficient when you need to plot a lot of elements, but you can't zoom in on them without loss. Vector formats can be easily resized up or down without loss of fidelity, but they get big real fast when you have a lot of objects to show, because each one is drawn separately. Also they are the Devil Incarnate. Especially when it comes to fonts.

{{< figure src="dr-manhattan-fonts.jpg" caption="Dr Manhattan, whose main destructive power is the original overfull hbox." >}}

When I make the PDF, I want the fonts in the PDF versions to be *embedded* in the file. That way, they can be addressed directly and changed later if necessary when it comes to printing or other production. If the fonts used in your file aren't embedded in your PDF and the file is opened or printed on a system that doesn't have access to the fonts you used, they will be replaced with one of a small number of default fonts that every system or printer knows. This is bad.

I said earlier (twice) that PDF is the Devil Incarnate. This is not really true. Font rendering in general is the Devil Incarnate. PDF is merely a Major Demon of the Font World. It is descended from yet greater demons. It traces its foul lineage through an immense tangle of filthy string, glue, and pins back to the earliest days of high-fidelity computer displays and printers.

I make my plots in R, with ggplot usually. (And sometimes [tinyplot](https://grantmcdermott.com/tinyplot/vignettes/introduction.html). It's good. You Base R snobs can bite me; I've been using R since it was a [different letter](https://en.wikipedia.org/wiki/S_(programming_language)).) Anyway, by default, R's PDF graphics device does not embed fonts, presumably on the sensible grounds that the more you reject the Devil and all his Works, the better off you are. However, over the years, many people with fallen natures have devised various ways to truck with Satan and specifically to get fonts properly embedded in PDFs. Think of it as a process of building one's house on a combination of other people's houses, piles of sand, a variety of leftover construction paper, and ultimately the giant tangle of string mentioned before. 

Here's a plot made with ggplot in R. 

{{< figure src="01-fontpost-01-png-desired.png" caption="The output we want. Produced as a PNG directly." >}}

This is the output I want. If all you want to do in life is produce PNGs or JPEGs of ggplot graphs then you are in luck. It works perfectly. Any typeface, any specific font on your system can be used. You live in a paradise created by people like [Thomas Lin Pedersen](https://ragg.r-lib.org/index.html). You do not know how good you have it. You write a bit of code like this:

{{< code r >}}

df <- mtcars |>
  mutate(car = rownames(mtcars)) |>
  as_tibble()

out <- df |>
  ggplot(aes(x = wt, y = mpg, label = car)) +
  geom_point() +
  geom_text_repel(family = "Myriad Pro Condensed") +
  annotate("text", x = 3.5, y = 30, label = "This is some text in Myriad Pro Condensed",
           family = "Myriad Pro Condensed", color = "darkred", size = 8) +
  annotate("text", x = 3.5, y = 29, label = "This is some text in Myriad Pro SemiCondensed",
           family = "Myriad Pro SemiCondensed", color = "cornflowerblue", size = 8) +
  labs(title = "This is the Title, in Myriad Semibold SemiCondensed",
       subtitle = "This is the Subtitle. It is in Myriad SemiCondensed",
       caption = "This is the Caption") +
  theme_myriad_semi()

ggsave("figures/fontpost-01-png-desired.png", out, width = 8, height = 8, dpi = 300)

{{< /code >}}


And you get the plot above. You are done. Please, I beg you, leave now. Go on your way. Walk outside. Read a book. Observe the Fall of the Republic at your leisure. Whatever you wish.

## Not a PNG, a PDF

I want a PDF where the specific fonts I use---fonts which very definitely exist on my computer---are embedded in the PDF produced by R. They should appear just like in the PNG above. Let's give it a shot. 

{{< code r >}}
ggsave("figures/fontpost-01-pdf-fail-1.pdf", out, width = 8, height = 8)
{{< /code >}}

{{< figure src="02-fontpost-01-pdf-fail-1.png" caption= "This is a PNG representation of the PDF output. At least it has a very, very high data-to-ink ratio, I suppose." >}}

Well, shit. That's not right. "But Kieran", you say, "Surely you are aware that ggplot _can_ embed PDF fonts in PDF files in just the way that you want. Have you not read for example [this helpful post by Andrew Heiss, a prince amongst men](https://www.andrewheiss.com/blog/2017/09/27/working-with-r-cairo-graphics-custom-fonts-and-ggplot/), showing you how to do it with the Cairo graphics device that comes with R and that ggplot can take advantage of?" I am of course well-aware of this. All we have to do is tell our `ggsave()` call to specifically use `device = cairo_pdf` and our problems are over. Like this:

{{< code r >}}
ggsave("figures/fontpost-01-pdf-fail-cairo.pdf", out, 
        device = cairo_pdf, width = 8, height = 8)
{{< /code >}}

This is what we get:

{{< figure src="03-fontpost-01-pdf-fail-cairo.png" caption="Again, a PNG conversion of what the PDF file looks like." >}}

Two things are going on here. First, most of the text is clearly not in Myriad Pro. It is in Bitstream Vera Sans, one of the fallback fonts handed down from X11 or somewhere. Second, and this will turn out to be a hint, the colored text---the stuff put there by `annotate()`---*is* in Myriad, but it's just Myriad Pro Regular. Not the SemiCondensed variant we want. 

Again, Andrew's post is essentially correct. The `cairo_pdf` device argument to `ggsave()` will embed fonts in the PDF. We can for example make it do this:

{{< code r >}}
out <- df |>
  ggplot(aes(x = wt, y = mpg, label = car)) +
  geom_point() +
  geom_text_repel(family = "Papyrus") +
  annotate("text", x = 3.5, y = 30, label = "This is some text in Myriad Pro Condensed",
           family = "Papyrus", color = "darkred", size = 8) +
  annotate("text", x = 3.5, y = 29, label = "This is some text in Myriad Pro SemiCondensed",
           family = "Papyrus", color = "cornflowerblue", size = 8) +
  labs(title = "This is the Title, in Myriad Semibold SemiCondensed",
       subtitle = "This is the Subtitle. It is in Myriad SemiCondensed",
       caption = "This is the Caption") +
  theme_bw(base_family = "Papyrus")

ggsave("figures/fontpost-01-pdf-papyrus-cairo.pdf",
         out, device = cairo_pdf, width = 8, height = 8)
{{< /code >}}


{{< figure src="04-fontpost-01-pdf-papyrus-cairo.png" caption="Oh so you'll embed Papyrus but not Myriad is that it?" >}}

For some reason, though, R cannot see the variants of Myriad I want to embed _even though_ it sees them when making PNG files. This, friends, is where in the past I have halted and turned away to the alternative some of you are about to recommend; yes I see you with your hands up; settle down please. 

## Showtext

The [showtext](https://cran.rstudio.com/web/packages/showtext/vignettes/introduction.html) package solves this problem by routing around it. Instead of embedding the fonts we use, it inserts itself into the font rendering process and converts all the font glyphs --- the letters --- to vector outlines. It works! You will get the font shapes you want in the PDFs you create, for any font that you can access when making a PNG. You do it like this. 

{{< code r >}}

library(showtext)

myriad_font_dir <- system.file("fonts", "myriad-pro", package = "myriad")

sysfonts::font_add("Myriad Pro SemiCondensed",
                   regular = paste0(myriad_font_dir, "/", "MyriadPro-SemiCn.otf"),
                   bold = paste0(myriad_font_dir, "/", "MyriadPro-BoldSemiCn.otf"),
                   italic = paste0(myriad_font_dir, "/", "MyriadPro-SemiboldSemiCnIt.otf"),
                   bolditalic = paste0(myriad_font_dir, "/", "MyriadPro-SemiboldCondIt.otf"))

sysfonts::font_add("Myriad Pro Condensed",
                   regular = paste0(myriad_font_dir, "/", "MyriadPro-Cond.otf"),
                   bold = paste0(myriad_font_dir, "/", "MyriadPro-BoldCond.otf"),
                   italic = paste0(myriad_font_dir, "/", "MyriadPro-CondIt.otf"),
                   bolditalic = paste0(myriad_font_dir, "/", "MyriadPro-BoldCondIt.otf"))

showtext_auto()


out <- df |>
  mutate(car = rownames(mtcars)) |>
  as_tibble() |>
  ggplot(aes(x = wt, y = mpg, label = car)) +
  geom_point() +
  geom_text_repel(family = "Myriad Pro Condensed") +
  annotate("text", x = 3.5, y = 30, label = "This is some text in Myriad Pro Condensed",
           family = "Myriad Pro Condensed", color = "darkred", size = 8) +
  annotate("text", x = 3.5, y = 29, label = "This is some text in Myriad Pro SemiCondensed",
           family = "Myriad Pro SemiCondensed", color = "cornflowerblue", size = 8) +
  labs(title = "This is the Title, in Myriad Semibold SemiCondensed",
       subtitle = "This is the Subtitle. It is in Myriad SemiCondensed",
       caption = "This is the Caption") +
  theme_myriad_semi(title_family = "Myriad Pro SemiCondensed")

ggsave("figures/fontpost-01-pdf-showtext.pdf", out, width = 8, height = 8)

{{< /code >}}



{{< figure src="05-fontpost-01-pdf-showtext.png" caption="Showtext works. But at what price?" >}}

This *seems* like what we wanted, doesn't it? Superficially. But what do I sacrifice?  Calm. Kindness. Kinship. Love.  I've given up all chance at inner peace. I've made my mind a sunless space. I share my dreams with ghosts. I wake up every day to an equation I wrote 15 years ago from which there's only one conclusion: I'm damned for what I do. My anger, my ego, my unwillingness to yield, my eagerness to fight, they've set me on a path from which there is no escape. I yearned to be a savior against injustice without contemplating the cost and by the time I looked down there was no longer any ground beneath my feet. What is my sacrifice? I'm condemned to use the tools of my enemy to defeat them. I burn my decency for someone else's future. I burn my life to make a sunrise that I know I'll never see. And the ego that started this fight will never have a mirror or an audience or the light of gratitude. So what do I sacrifice? Everything! There are no longer any fonts in the PDF! There are only outline shapes of every individual glyph. If you want to e.g. edit the PDF later in Illustrator or something, you will not be able to adjust the fonts as fonts. They are just shapes. That's bad.

Also notice how we explicitly had to add the fonts there using the `sysfonts` package. Showtext does not see the fonts that Thomas Lin Pedersen's `systemfonts` package makes generally available to R. That is annoying and, I believe, fights between them have caused my RStudio session to segfault more than once.

Showtext will also make it harder to create, in one go, PDFs and PNGs where text and graphic elements are both the same size. Without further futzing around, you may find yourself getting PNG output like this for the same `ggsave()` height and width parameters:

{{< figure src="06-fontpost-01-png-showtext.png" caption="Another barrel-can of monkey-worms." >}}

## Back to Cairo 

I. Just. Want. To. Embed. The. Fonts. In. The. P. D. F. File. 

Eventually, I figured out what was happening, after many a dead-end trying to persuade `systemfonts` to register the existence of the variants---something it in fact was already doing just fine for PNG files and the display devices on screen. For example you could write a function containing some code like this, which is adapted from [this very helpful post by June Choe](https://yjunechoe.github.io/posts/2021-06-24-setting-up-and-debugging-custom-fonts/). It forces `systemfonts` to register every single Myriad font file it can find as its own font family:

{{< code r >}}

font_family <- "Myriad Pro"

font_specs <- systemfonts::system_fonts() |>
    dplyr::filter(family == font_family) |>
    dplyr::mutate(family = paste(font_family, style)) |>
    dplyr::select(plain = path, name = family)

purrr::pwalk(as.list(font_specs), systemfonts::register_font)

{{< /code >}}

But this is not our problem. The `ggplot()` graphics system can already see all those variants through `systemfonts` when it comes to making PNGs. The real problem is that while the Cairo PDF device can see and properly embed fonts that are installed on your system, it can only see the Regular, Bold, Italic and Bold Italic variants of named Font Families that are, as it were, physically installed as such on your system. `Cairo` neither knows nor cares about the infrastructure provided by `systemfonts` to register new font family names and variants. 

On a Mac, for instance, you can look at FontBook and see all your fonts:

{{< figure src="fontbook-view-1.jpg" caption="Many typefaces." >}}

Some of these will just be a single font. But others, like Myriad, will be an entire _family_ of fonts, with many individual variants and styles. The version of Myriad I own has forty of them.

{{< figure src="fontbook-view-2.jpg" caption="Styles inside the Myriad family." >}}

The `CairoPDF` device is great but it _cannot see inside families like this_. It can see the main variants, but that's it. The _only way_ I have found to get the `cairo_pdf` device to see a font like Myriad Semibold SemiCondensed is to have it installed as a _separately named family_ with appropriate regular, bold, italic, and bold italic faces named as such. Older fonts were installed like this more often, and some contemporary font families still are. For example I have loads of variants of Input:

{{< figure src="fontbook-view-3.jpg" caption="Input Mono, Sans, and Serif, in various Regular, Condensed, and Compressed varities." >}}

These are all addressable by Cairo and the methods described by Andrew will work just fine for them and similar fonts. But this is not true of superfamilies like Myriad and others. 

Unfortunately, right now the only way I know to solve this (beyond just forgetting about it and using Papyrus, I mean) is to rewrite the metadata of individual OTF or TTF font files such that they can be installed as a separate font, perhaps with a different name. For many fonts, this will break the terms of the license you bought it under. Applications like [TransType](https://www.fontlab.com/font-converter/transtype/) and others can do this, though they are careful to tell you, as I am telling you, that this may well be against licensing terms. You could also, possibly, only buy the specific font faces you want and install those.


## But like, just hypothetically

If you can make the variants available as separate named faces that show up as such in your FontBook or equivalent font manager, then things will work as you expect with PDFs. I mean, they will work as you _desire_. PDFs working as you _expect_ means they are broken and just make your life miserable. You can write, for example, 

{{< code r >}}

out <- df |>
  mutate(car = rownames(mtcars)) |>
  as_tibble() |>
  ggplot(aes(x = wt, y = mpg, label = car)) +
  geom_point() +
  geom_text_repel(family = "Socviz Condensed") +
  annotate("text", x = 3.5, y = 30, label = "This is some text in Myriad Pro Condensed",
           family = "Socviz Condensed", color = "darkred", size = 8) +
  annotate("text", x = 3.5, y = 29, label = "This is some text in Myriad Pro SemiCondensed",
           family = "Socviz SemiCondensed", color = "cornflowerblue", size = 8) +
  labs(title = "This is the Title, in Myriad Semibold SemiCondensed",
       subtitle = "This is the Subtitle. It is in Myriad SemiCondensed",
       caption = "This is the Caption") +
  theme_socviz_semi()

ggsave("figures/fontpost-01-pdf-sepface.pdf", out, device = cairo_pdf, width = 8, height = 8)

{{< /code >}}

And get this:

{{< figure src="07-fontpost-01-pdf-cairo-sepface-ggsave.png" caption="Again, this is a snapshot of the PDF." >}}

In the PDF version the fonts will be properly embedded. Just like you wanted. So we're done, right? That's it? We finally did it? We're finished?

## No of course we're not finished

No of course we're not finished. Did I not say unto you earlier that we have built our HOUSE on a giant TANGLE of STRING stretching back yea even unto the Middle Ages slash 1982? Look at this picture:

{{< figure src="08-kerning-lotus-europa-shit.jpg" caption="The Kerning is Bad, Bob. Look at that gross 'ur' separated from its neighbors by some vast gulf, for example." >}}

For reasons above my pay grade, the `cairo_pdf` device option to `ggsave()` cannot kern to save its life. Now, maybe you don't see the problem at all. Like, literally you don't see it, in the same way that you do not see the toilet paper that has been stuck to your shoe all day, or the piece of food that's still on your chin from this morning. You are one of those people who is happy to walk around with your shirt on inside out, or without pants. Or perhaps your objections are more moral in nature. You see it, you insist, but you don't care about kerning. You shrug. What is kerning, you say, in the grand scheme of things? Who can be concerned with kerning when the world is berning? I mean, burning? Well, I'm afraid I can. Because a man needs a code. Specifically a code governing aesthetically pleasing and properly flexible spacing between letters and other letters, with due regard to capitalization, ligatures, punctuation, text size, and the specific function of the glyphs being typeset. 

If we use the Cairo device directly, like an animal, the problem does not arise:

{{< code r >}}

library(Cairo)

CairoPDF(file = "figures/fontpost-01-pdf-cairodirect.png",
         width = 8, height = 8)
         
    print(out)

dev.off()


{{< /code >}}

We have to turn the device off once we're done with it, like it's 1997. If you forget, you won't notice for a while but eventually it's like your Dad is gonna yell at you because you forgot to turn the lights off downstairs before you went to bed or you left the fridge door open after you went to get a drink of milk or you opened the window while the air conditioning is running in the house what the hell kind of child have I raised. 

{{< figure src="08-kerning-lotus-europa-good.jpg" caption="Kerning is better now." >}}

And so now we have at last returned to where we began. A PDF with embedded fonts that is comparable to the PNG we made at the beginning.

{{< figure src="08-fontpost-01-pdf-cairo-sepface-devdirect.png"  caption="Finally finally finally." >}}

If we want to forget about this for a while we could write a convenience function and put it in our utility package so that it makes one of each kind---a PNG, a Showtext PDF, and a Cairo PDF with embedded fonts---every time. Something like this:

{{< code r >}}

#' Use ggsave, showtext, and Cairo to make a PNG, an outline PDF, and an embedded PDF at once
#'
#' @param basename Desired filename, without extension
#' @param plot Same as ggsave
#' @param device Not used
#' @param path Same as ggsave
#' @param scale Same as ggsave
#' @param width Same as ggsave
#' @param height Same as ggsave
#' @param units Same as ggsave
#' @param dpi Same as ggsave
#' @param limitsize Same as ggsave
#' @param bg Same as ggsave
#' @param create.dir Same as ggsave
#' @param ... Other args to ggsave
#'
#' @returns A PNG, a Cairo PDF, and a showtext PDF of the plot
#' @export
#'
#' @examples \dontrun{
#' }
save_figure <- function(basename,
                        plot = last_plot(),
                        device = NULL,
                        path = NULL,
                        scale = 1,
                        width = NA,
                        height = NA,
                        units = "in",
                        dpi = 300,
                        limitsize = TRUE,
                        bg = "white",
                        create.dir = FALSE, ...) {

  require(Cairo)

  png_name <- paste0(basename, ".png")
  pdf_name <- paste0(basename, ".pdf")
  showtext_name <- paste0(basename, "_sho.pdf")


  ggplot2::ggsave(png_name, plot = plot, device = device, width = width, height = height,
                  units = units, dpi = dpi, limitsize = limitsize, bg = bg, create.dir = create.dir, ...)


  CairoPDF(file = pdf_name,
           width = width, height = height,
           title = "", fonts = NULL, ...)

    print(plot)

  invisible(dev.off())

  pdf(file = showtext_name,
           width = width, height = height,
           title = "", fonts = NULL, ...)
  showtext::showtext_auto(enable = TRUE)
  print(plot)
  showtext::showtext_auto(enable = FALSE)
  invisible(dev.off())


}

{{< /code >}}


## In Summary

Just don't go down this path. Learn to love your PNGs.
