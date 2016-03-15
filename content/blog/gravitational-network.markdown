---
date: 2016-02-12T15:56:03-05:00
title: Gravitational Network
categories: [Visualization,R]
---

The [Gravitational Waves paper](http://iopscience.iop.org/article/10.3847/2041-8205/818/2/L22) that was in the news yesterday has almost a thousand authors. (Actually there's more than one paper---there's the "discovery" paper and the "implications" paper.) Out of interest, I fed the list of authors in the "implications" paper into R and constructed an affiliation network with ties based on the university or research institute listed. Then I colored the nodes by the country of the primary institutional affiliation. Some authors have up to three affiliations, and they act as bridges in the network of authors. The national structure comes out nicely, too, with a core network consisting of American, Italian, and German scientists, with the British and French in there, too. Interestingly there are some large US components that aren't connected to the main group. 

There are of course many ways scientists can be connected without sharing an institutional affiliation, and I'd be very hesitatant to make any strong inferences based simply on that kind of tie. But that's what you can get directly from the list of authors, so here's what it looks like. 

{{% figure src="https://kieranhealy.org/files/misc/person-bp-edit.png" alt="That's a lot of co-authors." caption="Affiliation Network." %}}

You can [click through](http://kieranhealy.org/files/misc/person-bp-edit.png) for the full-size PNG, and there's also a [PDF file](http://kieranhealy.org/files/misc/person-bp-edit.pdf) that's zoomable, if you want to see the names of the authors. I wrote this on the bus, so there might be some coding errors with the national affiliations of the multi-sited researchers. 

_Update:_ I also took a look at this aggregated to the University/Institute level. Here's the core component of that network, leaving out many singletons and dyads surrounding it:

{{% figure src="https://kieranhealy.org/files/misc/university-core-component.png" alt="That's a lot of co-authors." caption="University Core Component."  %}}   

As you can see it's fairly compact. 
