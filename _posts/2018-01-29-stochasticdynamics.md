---
layout: post
title: A look at SGD from a physicist's perspective - Part 1
---
As a biophysics PhD student with a background in Applied Math and statistics, it's hard not to be interested in Machine Learning. I'm currently working on drawing some (recent!) ideas from non-equilibrium statistcal physics and applying the to stochastic gradient descent, so I decided it would be a good idea to organize my thoughts by writing a couple of blog posts.
The plan (yikes!) is to chronologically cover one or more important articles in the field, in an synthetic and not-too-technical way. This post will mainly be about Radford Neal's seminal '92 paper, [Bayesian Learning via Stochastic Dynamics](https://papers.nips.cc/paper/613-bayesian-learning-via-stochastic-dynamics), and the goal is to progressively make our way to modern approaches to stochastic gradient langevin dynamics. 
Of course, this line of research is not new at all, so I'll start by outlining some of my favorite references. Let me know if you think I need to add anything.

# Preliminary: Some Cool References
There's a swath of litterature (starting in the early nineties) making connections between physics and machine learning. Some example articles from the nineties that I like:
- [Statistical mechanics of learning from examples](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.45.6056), '92, Seung, Sompolinsky, and Tishby
- [Statistical mechanics of learning a rule](https://journals.aps.org/rmp/abstract/10.1103/RevModPhys.65.499), '93, Watkin et al.
- [Relationship between PAC, the Statistical Physics framework, the Bayesian framework, and the VC framework](http://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.17.2855), '94,  Wolpert
- [Rigorous learning curve bounds from statistical mechanics](https://link.springer.com/article/10.1023/A:1026499208981), '96, Haussler et al.

There's even a couple of books that cover the subject more or less directly:
- [Statistical Physics of Learning](https://www.amazon.com/Statistical-Mechanics-Learning-Engel/dp/0521773075), '01, Engel and Van den Broeck
- [Information theory, inference, and learning algorithms](https://books.google.com/books?hl=en&lr=&id=AKuMj4PN_EMC&oi=fnd&pg=PR7&dq=mackay&ots=EMipf98yHi&sig=fu2OcHeDw0QQIbfDi-4Gf-DnplA), '03, MacKay
- [Information, Physics, and computation](https://global.oup.com/academic/product/information-physics-and-computation-9780198570837?cc=us&lang=en&), '09, Mezard and Montanari

This line of research is still actively being conducted - here are some more recent interesting articles:
- [Bayesian learning via stochastic gradient Langevin dynamics](https://www.ics.uci.edu/~welling/publications/papers/stoclangevin_v6.pdf), '11, Wellling and Teh
- [Statistical Mechanics of High-Dimensional Inference](https://arxiv.org/abs/1601.04650), '16, Advani and Ganguli

Finally, some really good blog posts about these connections:
- [Jaan Altosaar's blog post](https://jaan.io/how-does-physics-connect-machine-learning/) covering the similarities between variational approaches in physics and variational inference
- Shakir Mohamed's posts, for example [this one](http://blog.shakirm.com/2015/07/machine-learning-trick-of-the-day-1-replica-trick/) covering the replica trick.

# Thermodynamics in 3 minutes

Before we even get started, let's cover a couple of concepts in thermodynamics.

## Classical Thermodynamics / Statistical Mechanics

Imagine a pot of water sitting on your (still unlit) gas stove. Why does the water sit nicely at the bottom of the pot? This is the result of the balance of two forces: 
- the force resulting from the fact that water molecules *like* being next to each other; in other words, two molecules sitting next to each other will have lower *energy* than two molecules far apart. 
- the force resulting from the statistical fact that the water molecules are more likely to be found in configurations that are occur the most. This is a simple combinatorial fact: there are many more ways for the molecules to be evenly distributed at the bottom of the pot than to have a higher density on the right side of the pot. There are a lot of molecules, so a 'law of large numbers - like' argument tells you that you're very unlikely to see big departures from the uniform distribution.
The former, energetic force is very familiar to us. The latter only holds for microscopic systems with randomness, and is the *entropic* force.

The 'knob' that adjusts the balance of forces between the energetic and entropic forces is the *temperature*. The higher the temperature, the higher the randomness, and the more the entropic force will dominate. This is exactly what happens when you turn on your stove and the water starts to boil: the molecules start being more random, and explore more configurations, at the expense of the energetic force that makes them want to stick together. When the entire pot has been turned to steam, the energetic force is zero, but the number of ways the molecules can be uniformly distributed around the room is exponentially larger than the number of ways they can be distributed in the pot. 

At this point you may already ask - how is this even linked to machine learning? Let's think of each particle as being similar to each element of some parameter vector $$\mathbf{w}$$, like the coefficients in your linear regression, or the weights in your deep learning network. In the same way that the particles settle into an energetic minimum, the weights will settle into a configuration that minimizes a loss function. So, here we have our first bridge between thermodynamics and machine learning:

> Energy equals Function
>
