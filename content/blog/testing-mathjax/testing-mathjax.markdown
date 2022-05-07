---
author: kjhealy
date: "2011-01-04"
#layout: post
slug: testing-mathjax
status: publish
title: Testing MathJax
wordpress_id: '1763'
mathjax: true
categories:
- IT
- Misc
---

Suppose the true relationship is

$$y=f(x_1,...,x_k),$$

with $(x_1,...,x_k)$ factors explaining the $y.$ Then the first order Taylor approximation of $f$ around zero is:

<div>$$f(x_1,...,x_k)=f(0, ... ,0) + \sum_{i=1}^{k}\frac{\partial f(0)}{\partial x_k}x_k + \varepsilon,$$</div>

where $\varepsilon$ is the approximation error. Now denote $\alpha_0 = f(0,...,0)$ and $\alpha_k = \frac{\partial{f}(0)}{\partial x_k})$ and you have a regression:

<div>$$y=\alpha_0+\alpha_1 x_1 + ... + \alpha_k x_k + \varepsilon$$</div>
