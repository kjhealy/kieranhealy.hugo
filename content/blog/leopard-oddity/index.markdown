---
author: kjhealy
date: "2007-10-30"
#layout: post
slug: leopard-oddity
status: publish
title: Leopard Oddity
wordpress_id: '1089'
categories:
- IT
---

So naturally I upgraded to Leopard a few days ago. Generally a smooth process, with the occasional headache (reinstalling stupid HP printer drivers, grr) balanced out with the occasional pleasant discovery not hyped beforehand (Terminal now aware of the Keychain, hurray). But here's something that looks like ~~a bug~~ a slightly counterintuitive feature in OS X's otherwise very nice PDF-handling abilities.

Open a PDF file in Preview. Select a section of it and copy it to the clipboard. Create a new file from the selection, and save it. (I do this a lot when putting presentations together, for instance.) Now drop that new file into a Keynote presentation or Pages document—the only two I've tried so far—and … see what happens? The *original* image appears, not the cropped one. Remember, folks, as a wise blogger once said, [Don't upgrade](http://crookedtimber.org/2004/06/04/dont-upgrade).

*Update*: Not a bug. Just a consequence of Preview being aware of bounding-box information and Keynote not.
