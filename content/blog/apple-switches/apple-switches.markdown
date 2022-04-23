---
author: kjhealy
date: "2005-06-07"
#layout: post
slug: apple-switches
status: publish
title: Apple Switches
wordpress_id: '804'
categories:
- Misc
- Apple
---

Steve Jobs [announced](http://www.apple.com/pr/library/2005/jun/06intel.html) that Apple will ditch the IBM PowerPC processor and begin using Intel chips in its computers as of next year.

We pause for a moment to allow Mac users to digest that sentence.

It looks like IBM was unable or unwilling to make the kind of investment in the G5 chip that Apple needs. IBM is moving out of the commodity PC market anyway, and supplying Apple with chips accounts for only a tiny percentage (I think about 2 percent) of its total chip sales, most of which are in embedded systems and the like. So Apple has, it seems, been forced to jump to Intel. It's been rumored for years that Apple have maintained an x86 build of OS X for years, and today Steve Jobs confirmed this was true. Note that—as far as I can tell—there is no prospect of you being able to buy OS X and install it on your Dell: Apple will still use proprietary hardware and while hackers might be able to get a system running, regular users will not. The company suffered too much in the "clone wars" of the 1990s, when it was possible to buy computers that ran Mac OS from companies other than Apple. Still, this is an enormous shift, one that Apple will have to work hard to sell to developers and users alike.

For developers, the question is how easy it will be to recompile code written for one architecture in order for it to run on the other. (The platforms differ in their [endianness](http://en.wikipedia.org/wiki/Endianness), the convention about byte-ordering in code which is part of the reason applications compiled for x86 architectures will not run on PowerPC systems, and vice versa.) Apple says that stuff developed in their X-Code framework should be easy to recompile. Other developers may have to work harder. Apple's goal is to have developers release their applications as [fat binaries](http://en.wikipedia.org/wiki/Fat_binary), which will run on both kinds of chip. This way, end-users won't be confused by having to choose which version of an application to download based on the chipset inside their computer—this is precisely the sort of decision that people buy Macs in order to avoid having to make. Apple says it also has a piece of software called "Rosetta" that allows applications written for the PowerPC to be emulated on Intel chips.

It seems the next version of Mac OS X (v10.5) will be called "Leopard," so I am sure the marketers are already gearing up with change-your-spots slogans as I write. Personally, I hope Apple negotiates the transition successfully: Mac OS X is a very civilized operating system that's simply a joy to use and doesn't get in the way of your work. But it could be a tough road, as the incentive to buy an Apple computer in the next year (before the transition) is now very much reduced, and the likelihood of a wave of [FUD](http://en.wikipedia.org/wiki/FUD) very much increased. (I'm not sure that it's rational to think that the incentive to buy has gone down: after all, most computer hardware is "obsolete" in six months anyway, if all you care about is the bleeding-edge of perfomance.) I imagine the key will be to find a way to make the transition as contained as possible, with the result that Apple keeps the same niche in the market that it presently occupies. It's a smallish company that sells computer hardware on the strength of elegant industrial and software design. It's not going to become Microsoft (why even try?), and the path-dependence in the marketplace means that it's just a fantasy to believe that there are millions of irritated Windows users just waiting for the right moment to jump to Apple. People can stay irritated their whole lives, in my experience, and not change anything much about their situation.

Apple is a cash-rich company at the moment (thanks to the iPod), so perhaps this will help them over the hump. They've done something like this twice before, and brought most of their users along with them. I really, really don't want to go back to using Windows, so I suppose I'll be following along with Intel—er, I mean, interest.
