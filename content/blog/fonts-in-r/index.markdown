---
title: "Fonts in R"
date: 2025-02-06T20:32:42-05:00
categories: [R,nerdery]
footnotes: false
htmlwidgets: false
mathjax: false
---


{{% figure src="dr-manhattan-fonts.jpg" alt="Dr Manhattan can't believe it either." caption="Dr Manhattan, the original overfull hbox." %}}

## Draw a Picture

This post will be a brief summary of an extended period of annoyance. I have tried to solve the problem it describes more than once before and *not quite* done it. This has, in fact, happened again. But this time I know *why* I can't solve it to my satisfaction. My goal is to produce identical plots in both PNG and PDF formats. PNG is a raster format. PDFs are a vector format and also the Devil Incarnate. Sometimes you want one format, sometimes the other. Raster formats color in pixels on a grid of some fixed resolution. They are efficient when you need to plot a lot of elements but you can't zoom in on them without loss. Vector formats can be easily resized up or down without loss of fidelity, but they get big real fast when you have a lot of objects to show, because each one is drawn separately. 

When I make the PDF, I want the fonts in the PDF versions to be *embedded* in the file. That way, they can be addressed directly and changed later if necessary when it comes to printing. If font's aren't embedded in your PDF and the file is opened or printed on a system that doesn't have access to the fonts you used, they will be replaced with one of a small number of default fonts that every system or printer knows. This is bad.

I said earlier that PDF is the Devil Incarnate. This is not really true. Font rendering in general is the Devil Incarnate. PDF is a Demon of the Font World, descended from greater demons and tracing its lineage through an immense tangle of string back to the earliest days of high-fidelity computer displays and printers.

I make my plots in R. By default, R's PDF graphics device does not embed fonts, presumably on the grounds that the more you reject the Devil and all his works, the better off you are. Over the years, many people with fallen natures (i.e. everyone) has devised ways to truck with Satan and get fonts properly embedded in PDFs. Think of it as a process of building one's house on the giant tangle of string I mentioned earlier. 

Here's a plot made with ggplot in R. 

{{% figure src="01-fontpost-01-png-desired.png" alt = "The output we want." caption = "The output we want. Produced as a PNG directly."}}

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

I want a PDF where the specific fonts I use; fonts which very definitely exist on my computer, are embedded in the PDF produced by R. They should appear just like in the PNG above. Let's give it a shot. 

{{< code r >}}
ggsave("figures/fontpost-01-pdf-fail-1.pdf", out, width = 8, height = 8)
{{< /code >}}

{{% figure src="02-fontpost-01-pdf-fail-1.png" alt = "First effort." caption = "This is a PNG representation of the PDF output."}}

Well, shit. That's not right. "But Kieran", you say, "Surely you are aware that ggplot _can_ embed PDF fonts in PDF files in just the way that you want. Have you not read for example [this helpful post by Andrew Heiss, a prince amongst men](https://www.andrewheiss.com/blog/2017/09/27/working-with-r-cairo-graphics-custom-fonts-and-ggplot/), showing you how to do it with the Cairo graphics device that comes with R and that ggplot can take advantage of?" I am of course well-aware of this. All we have to do is tell our `ggsave()` call to specifically use `device = cairo_pdf` and our problems are over. Like this:

{{< code r >}}
ggsave("figures/fontpost-01-pdf-fail-cairo.pdf", out, 
        device = cairo_pdf, width = 8, height = 8)
{{< /code >}}

This is what we get:

{{% figure src="03-fontpost-01-pdf-fail-cairo.png" alt = "Bugger." caption = "Again, a PNG conversion of what the PDF file looks like."}}

Two things are going on here. First, most of the text is clearly not in Myriad Pro SemiCondensed. It is in Bitstream Vera Sans, one of the fallback fonts handed down from X11 or somewhere. Second, and this will turn out to be a hint, the colored text (the stuff `geom_text_repel()` controls) *is* in Myriad, but it's just Myriad Pro Regular. Not the SemiCondensed variant we want. 

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


{{% figure src="04-fontpost-01-pdf-papyrus-cairo.png" alt = "Everyone's favorite off-brand herbal tea font" caption = "Oh so you'll embed Papyrus but not Myriad is that it?"}}

For some reason, though, R cannot see the variants of Myriad I want to embed _even though_ it sees them when making PNG files. This, friends, is where in the past I have halted and turned away to the alternative some of you are about to recommend. 

## Showtext

The Showtext package solves this problem by routing around it. Instead of embedding the fonts we use, it inserts itself into the font rendering process and converts all the font glyphs --- the letters --- to vector outlines. It works! You will get the font shapes you want in the PDFs you create, for any font that you can access when making a PNG. You do it like this. 

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



{{% figure src="05-fontpost-01-pdf-showtext.png" alt = " " caption = "Showtext works. But at what price?"}}

Yes! This is it. But we have paid a terrible price. First, notice how we explicitly had to add the fonts there using the `sysfonts` package. Showtext does not see the fonts that Thomas Lin Pedersen's `systemfonts` package makes generally available to R. That is annoying and, I believe, fights between them has caused my RStudio session to segfault more than once. Second, and more importantly, while the PDF looks good, there are no longer any fonts in it. There are only outline shapes of every individual glyph. If you want to e.g. edit the PDF later in Illustrator or something, you will not be able to adjust the fonts as fonts. They are just shapes. That's bad.

Showtext will also make it harder to create, in one go, PDFs and PNGs where text and graphic elements are both the same size. 

## Back to Cairo 

I. Just. Want. To. Embed. The. Fonts. In. The. PDF. File. Eventually I figured out what was happening. The problem is that while the Cairo PDF device can see and properly embed fonts, it can only see the Regular, Bold, Italic and Bold Italic variants of named Font Families on your system. On a Mac, for instance, you can look at FontBook and see all your fonts:

{{% figure src="fontbook-view-1.jpg" alt = " " caption = "Many typefaces."}}

Some of these will just be a single font. But others, like Myriad, will be an entire _family_ of fonts, with many individual variants and styles. The version of Myriad I own has forty of them.

{{% figure src="fontbook-view-2.jpg" alt = " " caption = "Styles inside the Myriad family."}}

The Cairo device is great but it _cannot see inside families like this_. It can see the main variants, but that's it. The _only way_ I have found to get the `cairo_pdf` device to see a font is to have it installed as a _separately named family_. Older fonts were installed like this more often, and some contemporary font families still are. For example I have loads of variants of Input:

{{% figure src="fontbook-view-3.jpg" alt = " " caption = "Input Mono, Sans, and Serif, in various Regular, Condensed, and Compressed varities."}}

These are all addressable by Cairo and the methods described by Andrew will work just fine for them and similar fonts. But this is not true of superfamilies like Myriad and others. 

Unfortunately, right now the only way I know to solve this (beyond just forgetting about it and using Papyrus, I mean) is to rewrite the font file's metadata such that it can be installed as a separate font, perhaps with a different name. For many fonts, this will break the terms of the license you bought it under. Applications like [TransType](https://www.fontlab.com/font-converter/transtype/) and others can do this, though they are careful to tell you, as I am telling you, that this may well be against licensing terms. You could also, possibly, only buy the specific font faces you want and install those.


## But like, just hypothetically

If you can make the variants available as separate faces, then things will work as you expect. You can write, for example, 

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

{{% figure src="07-fontpost-01-pdf-cairo-sepface-ggsave.png" alt = "Finally. We're done right? RIGHT?" caption = "Again, this is a snapshot of the PDF."}}

In the PDF version the fonts will be properly embedded. Just like you wanted. So we're done, right? That's it? We finally it? We're finished?

## No of course we're not finished

No of course we're not finished. Did I not say unto you earlier that we have built our HOUSE on a giant TANGLE of STRING stretching back yea even unto the Middle Ages slash 1982? Look at this picture:

{{% figure src="08-kerning-lotus-europa-shit.jpg" alt = "" caption = "The Kerning is Bad, Bob."}}

For reasons above my pay grade, the `cairo_pdf` device option to `ggsave()` cannot kern to save its life. Maybe you don't see the problem at all. Like, literally you don't see it, in the same way that you are one of those people who is happy to walk around all day with toilet paper stuck to your shoe, or your shirt on inside out, or with no pants. Perhaps your objections are more moral in nature. You see it, you insist, but you don't care about kerning. You shrug. What is kerning, you say, in the grand scheme of things? Who can be concerned with kerning when the world is berning? I mean, burning? Well, 'm afraid I can. Because a man needs a code. Specifically a code governing aesthetically pleasing and properly flexible spacing between letters and other letters, with due regard to capitalization, ligatures, punctuation, text size, and the specific function of the glyphs being typeset. 

If we use the Cario device directly, like an animal, the problem does not arise:

{{< code r >}}

library(Cairo)

CairoPDF(file = "figures/fontpost-01-pdf-cairodirect.pdf",
         width = 8, height = 8)
         
    print(out)

dev.off()


{{< /code >}}

We have to turn the device off once we're done with it, like it's 1997. If you forget, you won't notice for a while but eventually it's like your Dad is gonna yell at you because you forgot to turn the lights off downstairs before you went to bed or you left the fridge door open after you went to get a drink of milk or you opened the window while the air conditioning is running in the house what the hell kind of child have I raised. 

{{% figure src="08-kerning-lotus-europa-good.jpg" alt = " " caption = "Kerning is better now."}}

And so now we have at last returned to where we began. A PDF with embedded fonts that is comparable to the PNG we made at the beginning.

{{% figure src="08-fontpost-01-pdf-cairo-sepface-devdirect.png" alt = " " caption = "Finally finally finally."}}

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
