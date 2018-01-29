---
layout: post
title: Enzymes, Thermodynamics, and Huddles
---

<img src='https://media.giphy.com/media/gEp3FbMTRTu1i/giphy.gif' width='100%'>

## What is even an enzyme cascade?

One of the primary function of our cells is to *make and transform stuff*. For example, one of the most important cellular functions is to transform food into energy. This is done by breaking down sugars (glucose) and making ATP (adenosine triphosphate). 

The way our cells break down sugars is through a series of ten chemical reactions. Unfortunately, these chemical reactions are, by themselves, way too slow to sustain life. This is where [enzymes](https://en.wikipedia.org/wiki/Enzyme) come into play. Enzymes, in a nutshell, increase the reaction rate of a chemical reaction. This is called *catalysis*. When there is a series of catalyzed reactions, we simply call it an enzyme cascade, as the product of the first catalyzed reaction cascades down to the second catalyzed reaction, etc...

## Enzymes move by themselves!
So, to recap, to transform food in energy, there are ten reactions. To make this transformation viable, all of these reactions are catalyzed by an enzyme. No big deal. Except that a pretty fertile line of research in the past few years have found enzymes to be more interesting than we thought:
- First, it seems that enzymes tend to move *faster* when they're catalyzing reactions. This was first shown in a [series of experiments by Muddana et al.](http://pubs.acs.org/doi/abs/10.1021/ja908773a). The physical reason why this happens has since then been the subject of much debate. Most notably, [this Nature paper](https://www.nature.com/articles/nature14043) made the claim that this happens because of the heat released when the catalysis happens - but this is still controversial and the subject of ongoing research.
- Second, and maybe more notably, Steve Benkovic's lab has shown that the enzymes in a cascade tend to aggregate when they're needed (!!). See for example [this Science paper from 2016](http://science.sciencemag.org/content/351/6274/733.short). 

I'm going to spend a little more time on this second point, because it's pretty remarkable. We're going to switch cascades and talk about the purine cascade, which is the enzyme cascade that makes purines. Purines are also really important: they're one of the building blocks of DNA.
If you look at the cell pictures below (from [Zhao et al.](http://pubs.rsc.org/en/Content/ArticleLanding/2013/CC/c3cc41437j#!divAbstract))

<img src='/assets/img/cells.png' width='100%'>

what you're seeing is an image of a cell, with one of the enzymes involved in the purine cascade colored in green. In the left image, the cell was purine deprived. It looks like the enzymes are huddled together. In the left image, there's enough purine in the medium, and the enzymes are uniformly distributed. What this could mean is that, when needed, the enzymes involved in a cascade tend to group together in *more efficient* structures called metabolons.

If you stop and think about it for a second, this behavior is amazing. Enzymes don't even have a way to move around by themselves; how could they 'decide' that they need to be more efficient and start to move towards their buddies? 

## The beginning of an explanation

Ok, so the stage is set. Enzymes who work together to make things seem to move towards each other when they're needed to form more efficient little groups. How could this happen? [Ayusman Sen's lab](http://research.chem.psu.edu/axsgroup/) has been working on experimental and theoretical ways to understand and quantify this behavior using [microfluidic devices](https://en.wikipedia.org/wiki/Microfluidics), which are essentially very small devices who manipulate fluids on sub-micrometer scales. 

One of these experiments essentially consisted in having a little channel with two side-by-side inputs. In one input, you flow in an enzyme solution. In the other input you flow in either
- the same thing (same enzyme solution)
- the enzyme solution plus the enzyme's substrate (the chemical species that that enzymes takes as an input)
Then, in that channel, you let reactions happen for a few seconds, and then see how the enzyme has moved. 

The result of that experiment was very interesting. In the control experiment, the enzyme concentration across the channel after a few seconds was flat (as it should be!). In the experiment where the substrate was added, the enzyme concentration was higher on the side of the channel were the substrate was added! 

This means essentially that the enzyme travelled up its gradient to go towards its substrate. To see why this is strange, think about a drop of ink in water. If you let the system sit, the ink will eventually diffuse in the water; the ink will never diffuse back to where you initially added the drop. This is essentially what the enzyme is doing: it 'senses' the presence of its substrate and 're-concentrates' in the areas where there is more substrate.

Writing down a physically plausible theory for why and how this happens was my main contribution to this [Nature Chemistry paper](https://www.nature.com/articles/nchem.2905) paper. I'll briefly try to explain the main idea, Cross-Diffusion, in a hand-wavy way.

## Cross-diffusion

So, going back to the ink in water example. You put a drop of ink in water, it eventually *diffuses* in the entire glass. The fundamental reason it does this is statistical. Simply put, there are exponantially more configurations of ink molecules in water where they're all around the glass than there are for them to stay in a the initial drop. Since the molecules are always moving around randomly, the most likely configuration ends up being the one settled in. 

This statistical 'force' - which seems self-evident! - is *entropy*, which you might have heard of in vastly more complicated terms. But at its core, that is what entropy is: systems with randomness will eventually settle in the more likely state, i.e. the state with the most configurations. 

The other, often more familiar, thermodynamic force, is energetic. Sometimes, molecules like to stick together - their energy is lower when they are next to each other. This is the same effect as more common forces, like gravity. You can reason about a ball rolling down a hill as being acted on by the force of gravity; but you can equally understand that the ball settles in the valley because its energy is lower there.

Getting back to our enzymes, they are, like the ink molecules, and the ball rolling down the hill, subject to two forces: entropic forces (which tell them to spread out evenly over the cell), and energetic forces. But what are the energetic forces acting on our enzymes? It turns out that the enzymes have lower energy when they are bound to their substrate. So, in the same way that the ball rolls down the hill, the enzymes tend to like to go tower higher concentrations of the substrate.

This is why we see the very counter-intuitive effect of the enzymes 'aggregating' in little huddles!

I hope this motivates you to read [our paper](/assets/pdf/nchem.2905.pdf) - and I apologize to purists and experts who cringe at some of the approximations I made :)