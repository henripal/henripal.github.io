---
layout: post
title: A look at SGD from a physicists's perspective - Part 2, Bayesian Deep Learning
---

This is part 2 of a series of introductory posts on the connections between physics and machine learning. In [part 1]({% post_url 2018-01-29-stochasticdynamics %}), we ran through a quick introduction to the basic notions of thermodynamics. We made the fundamental point that a physical system relaxing to equilibrium by minimizing its energy was analogous to a machine learning model minimizing its loss. In other words, shaking a bottle of water then putting it on your table and waiting for it to settle is the same as training a model. The water molecules settle in the state that minimizes the energy of the system, while the weights of your model settle into the state that minimizes your loss function. 

<img src='https://media.giphy.com/media/suvvLHUB335Je/giphy.gif' width='100%'>

In this post, we'll take some steps towards making this explanation more precise. The very first hurdle we run into is that there is a fundamental difference between your neural network after training and the molecules sitting at the bottom of the bottle: the water appears still, but the individual water molecules are constantly moving around; by contrast, the neural network's weights are fixed.

Another way of saying this is that the water molecule's positions are characterized by *probability distributions*. We need to change the outcome of our algorithms so that instead of a point estimate, we also get probability distributions for the parameters. Beyond making our neural network look more like a physical system, there are many advantages to doing that: 
- we now have a way to *quantify uncertainty* around our predictions
- the probability distribution for the weights lessens the variability in outcomes for learning algorithms
- we get regularization for free

These advantages are so significant that probabilistic (or Bayesian) deep learning is currently one of the most active areas of research in machine learning. In this post, we'll start with some of the developments in the field, pioneered by Radford Neal and David MacKay in the early nineties. But first, we need to talk a little bit more about statistical mechanics - stick with me; it's well worth it to grasp the basics.

# Statistical Mechanics in 3 minutes

Ok, so we've seen in [part 1]({% post_url 2018-01-29-stochasticdynamics %}) that thermodynamics expresses a fundamental tradeoff between energy minimization (water molecules like to be next to each other) and a combinatorial 'force' which pushes random systems to the configurations there are the most instances of (entropy maximization). The 'knob' between these two forces is temperature, or the amount of randomness in the dynamics of the physical system under consideration.

To mathematically solve this minimization/maximization problem, we have to specify more constraints. In statistical physics, the constraints come from the specific problem under study: Can my system exchange particles with another system? Is the total energy of my system constant? Is the entropy of my system constant?

Looking at all these would require an entire chapter in a physics textbook, but it turns out that in many of these constrained systems, the probability distributions maximizing entropy or minimizing energy look the same, and probably are very familiar to most of you as the *softmax* distribution:

$$\begin{eqnarray}
p(\mathbf{w})  \propto  e^{-\beta E(w)}
\end{eqnarray}$$

In physics, this is called the *Boltzmann* distribution. The probability of a given weight configuration is inversely proportional to the exponential of the energy $$E$$ of that configuration multiplied by a constant $$\beta$$.  The proof is relatively straightforward, especially in the case of a system with fixed total energy, but let's just walk with it for now. It looks like the expression above does what we want: lower probabilities for configurations with higher energies. 

What about the 'spread' of this distribution? It will depend on $$\beta$$: for very high values of $$\beta$$, even small deviations of the energy from its minimum will cause the probabilities to drop massively. It turns out that $$\beta=1/T$$, where $$T$$ is the temperature, which matches what we had said earlier: the higher the temperature, the more 'spread out' the distribution will be.

This is where one of the major gaps in the statistical mechanics and machine learning bridges occurs. As much as the Boltzmann distribution is rigorously justified in many settings (or *ensembles*) in statistical mechanics, the adoption of this probability distribution in Bayesian ML is an assumption. Let's see why, and try to find out what that assumption entails.

# Making Neural Networks Probabilistic

Let's put everything together: we've seen that energy functions and loss functions are analogous. We've shown what probability distribution is implied by a given energy function in statistical mechanics. Let's now specify our loss, or energy function to be the mean squared error:

$$\begin{eqnarray}
E(\mathbf{w}) = \frac{1}{n}\sum_i \left( f \left( \mathbf{x_i}; \mathbf{w} \right) - y_i \right)^2
\end{eqnarray}$$

The probability distribution of our weights instantly becomes:

$$\begin{eqnarray}
p(\mathbf{w}) \propto \exp{\left[ -\beta\frac{1}{n}\sum_i \left( f \left( \mathbf{x_i}; \mathbf{w} \right) - y_i \right)^2\right]}
\end{eqnarray}$$

Wow! So, what we're really doing when we make the assumptions that 1) our loss is the MSE and 2) our weight probability distribution is Boltzmann, is choosing the weights are such that the distribution of errors is a *multivariate Gaussian*! In reality, the way this came about historically is actually the opposite, so we certainly took the long way there.

It's easy to calculate this loss function for any data point. Does it mean computing this probability distribution is trivial? Not really. Consider getting a new example $$\mathbf{x_j}$$. What is our network's prediction? It wouldn't make sense to use one set of weights; what we really want is the *expectation* of the prediction under our probability distribution:

$$\begin{eqnarray}
\hat{y} = \int p(\mathbf{w}) f(\mathbf{x_j}; \mathbf{w}) d\mathbf{w}
\end{eqnarray}$$

Hmmm. It looked like our probabilities were easy to evaluate, but instead, we're left to evaluate an integral *everywhere* in a space of $$n$$ dimensions, where $$n$$ is the number of weights in our neural network. For ResNet, that would be an integral in a 60M dimensional space please. That's just never going to happen.

<img src='/assets/img/yahtzee.png' align='middle' width='100%'>

## Evaluating difficult integrals, first try: Traditional Monte Carlo methods.

So, here's our first approach. We'll pick out a grid of weights, evaluate $$p(w)$$ at these points, and we're done. There are two reasons why this doesn't work as planned:

- We only know what $$p(w)$$ is *proportional* to. The normalizing constant is another intractable integral.
- Probability distributions in high dimensional space tend to be very concentrated. Imagine you're asked to find the average depth of the Mississipi River, and you have a way of telling, at each point in the U.S., whether you're actually in the river and at what depth; but you don't have any info on where the river is. Would evaluating your function at a grid of points across the U.S. work well?

## Second Try: Markov Chain Monte Carlo

The river analogy brings up another idea. What if we started walking (randomly) across the U.S., and when we reached the Mississipi, we kept exploring the area without straying too far away?

Let's describe this approach more formally. We start out in a random position $$x$$ on the map. Then we pick a nearby candidate next position $$y$$. To judge if $$y$$ is an acceptable candidate, we compute $$\alpha = p(y)/p(x)$$. If this ratio is greater than 1, then $$y$$ is more likely than $$x$$, and we head there. If the ratio is less than 1, this might not be a good move, but we need to keep exploring, so we flip a biased coin with probability $$\alpha$$ of landing on heads, and we move if the coin lands on heads.

It turns out this is going to solve both our problems:
- when we're in the river, and we're thinking about our next sample, all we need is a ratio of probabilities; we don't need to evaluate the costly normalizing constant
- we're going to waste a lot of time at first trying to find the Mississipi, but when we've found it, our sampling should be reasonably efficient

This algorithm is the [Metropolis-Hastings](https://en.wikipedia.org/wiki/Metropolis%E2%80%93Hastings_algorithm) algorithm, and it's a decent algorithm to evaluate difficult integrals.

The issue is, what if you're asked to evaluate the depth of both the Mississippi and Yukon rivers? With the Metropolis-Hastings algorithm, you'll get stuck in the first river you come across. 

This issue, *multi-modality*, is going to be prevalent in neural networks weight probability distributions. To see why, think about two nodes, A and B, in a neural net you've trained. You'll get the exact same result if A and B are reversed along with their connected nodes; that's two identical solutions and a clear indication that the weight probability distribution will be multimodal.

So, still no good. We need a way to make big steps, even when we're in the right place.

## Third Try: Hamiltonian Monte Carlo

A brief recap of how we got here: we're trying to make neural networks probabilistic, because there's a *lot* of advantages to doing that. One of them is that it enables us to understand training as a thermodynamic process, which is what I'm trying to do in this series of posts. If we want to do that, there's no way but to evaluate some nasty million-dimensional integral. We've tried a couple of variants of Monte-Carlo to do this so far, to no avail. Enter [Radford Neal](https://en.wikipedia.org/wiki/Radford_M._Neal), who, in  [this paper](https://papers.nips.cc/paper/613-bayesian-learning-via-stochastic-dynamics), discretely came up with one of the most used MC methods to this day, Hamiltonian Monte Carlo (note that in the paper, this isn't called Hamiltonian MC yet!).

So, how does HMC work? Physics to the rescue, again. Remember we made the analogy between each individual weight and the position and velocity of individual water molecules? This is a little different. We're imagining a system where the weights only represent the *positions* of the molecules, and the loss function is still our MSE. What we're adding on top of that is that the molecules have *momenta* $$p$$. Then, we can, by analogy with physics, define our new total energy function, or Hamiltonian, as the sum of the MSE and kinetic energy $$1/2\vert p \vert^2$$. The *joint* distribution for $$w$$ and $$p$$ becomes:

$$\begin{eqnarray}
p(\mathbf{w}, \mathbf{p}) \propto \exp{\left[ -\beta\frac{1}{n}\sum_i \left( f \left( \mathbf{x_i}; \mathbf{w} \right) - y_i \right)^2 + \frac{1}{2}\vert \mathbf{p}\vert^2\right]}
\end{eqnarray}$$

The plan is then to sample from this distribution, then to simply ignore the values for the momenta; they're only here to help us sample this high dimensional space efficiently. The intuition for why this helps us is similar to that behind adding Nesterov momentum to SGD updates: we now have a basis to make bigger jumps and explore the space more efficiently. We won't go into the details here, but having this momentum term allows us to choose the next update using *Hamiltonian dynamics* (really a fancier way of writing $$F = ma$$), and to make a more informed decision on *where* to jump next than to just jump nearby.

## So, are we there yet?

We can definitely train neural networks using HMC. The issue is that, if you're thinking about modern datasets and architectures, with millions of weights, and millions of examples, HMC is still not going to cut it. No mini-batches - so all your GPU acceleration is going to go to waste. No backprop - so it'll take longer to get to acceptable error rates. No SGD - so no magic self-regularizing effect that works for everything.

We need something that can deal with modern architectures and datasets. We'll talk about one of the possible proposed ways to circumvent these limitations. It turns out it'll also help us continue exploring the relationship between statistical mechanics and machine learning: [Bayesian Learning via Stochastic Gradient Langevin Dynamics](https://www.ics.uci.edu/~welling/publications/papers/stoclangevin_v6.pdf).

# Some more references!

Ok, if you're curious about the subjects we've brushed on here, I can't recommend enough Michael Betancourt's  [Conceptual Introduction to Hamiltonian Monte Carlo](https://arxiv.org/abs/1701.02434) - it's a fantastic 60 page introduction with a *lot* of visuals.

Something we haven't mentioned at all is the variational approach; instead of computing the probability distribution exactly, we approximate it using another familty of simpler probability distributions. Check out Jaan Altosaar's [blog post](https://jaan.io/how-does-physics-connect-machine-learning/) covering the similarities between ML and physics from a variational point of view.

And if you'd like a good refresher or intro to statistical mechanics, this is the book whose approach made me love the field: [Molecular Driving Forces](https://www.amazon.com/Molecular-Driving-Forces-Statistical-Thermodynamics/dp/0815344309)

Also remember to check out the references in [part 1]({% post_url 2018-01-29-stochasticdynamics %}) of this series!