---
title: "Flipbookr for Quarto"
date: 2023-08-10T11:13:02-04:00
categories: [R]
footnotes: false
htmlwidgets: false
mathjax: false
---


[{{flipbookr}}](https://evamaerey.github.io/flipbookr/) is an R package written by [Gina Reynolds](https://github.com/EvaMaeRey). It's very useful for teaching. It was developed for use with `.Rmd` files [Xaringan](https://slides.yihui.org/xaringan/#1) and presently does not work with [Quarto](https://quarto.org). I hacked-up a version of Flipbookr that does work with Quarto. Using it with Xaringan should be exactly the same as before. Right now it's incomplete. I've just focused on getting the main user-facing function, `chunk_reveal()` to work. But this is also most of what the package does. Here's a proof-of-concept Quarto presentation showing what's working right now. You can [go directly to the slides](https://kjhealy.github.io/flipbookr-quarto) if you prefer.


<script type="application/javascript">

function resizeIFrameToFitContent( iFrame ) {

   iFrame.width  = document.getElementById("content").clientWidth;
   iFrame.height  = (document.getElementById("content").clientWidth * 0.5625)
}

window.addEventListener('DOMContentLoaded', function(e) {

    var iFrame = document.getElementById( 'quartoframe' );
    resizeIFrameToFitContent( iFrame );
    } );

</script>

<a href="https://kjhealy.github.io/flipbookr-quarto"><iframe src="https://kjhealy.github.io/flipbookr-quarto" id="quartoframe"></iframe></a>