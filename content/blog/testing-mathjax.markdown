---
author: kjhealy
date: "2011-01-04"
#layout: post
slug: testing-mathjax
status: publish
title: Testing MathJax
wordpress_id: '1763'
categories:
- IT
- Misc
---

Suppose the true relationship is

[y=f(x\_1,...,x\_k)]

with (x\_1,...,x\_k) factors explaining the (y). Then the first order Taylor approximation of (f) around zero is:

[f(x\_1,...,x\_k)=f(0,...,0)+sum\_{i=1}^{k}frac{partial f(0)}{partial x\_k}x\_k+varepsilon,]

where (varepsilon) is the approximation error. Now denote (alpha\_0=f(0,...,0)) and (alpha\_k=frac{partial{f}(0)}{partial x\_k}) and you have a regression:

[y=alpha\_0+alpha\_1 x\_1+...+alpha\_k x\_k + varepsilon]
