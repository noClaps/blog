#import "../../pages/macros.typ": *

#let title = [A beginner's guide to Quantum and Particle Physics]
#let date = datetime(year: 2024, month: 2, day: 21)

#note[
  I should probably say that being a physics student, I do have some idea of what I'm talking about. However, this post covers a lot of the topics in a very high-level way and doesn't really dive into a lot of the _really_ confusing details of those topics. If you find quantum and particle physics interesting, you should look up how a lot of these things actually work, and read textbooks and research papers about it.

  Also, this post might require some basic ideas of how different things work in math and physics. A high school level _should_ be sufficient, though if you don't understand something you can ask your teacher, look it up, or contact me! I can't guarantee I'll be able to answer your question, but I can guarantee that I'll try!

  There's a lot of discoveries that happen all the time in this field because it's so new, and many times these discoveries will make us rethink a lot of the concepts we thought we knew. It's a new field, and it's very fun!
]

Quantum and particle physics are some of the newer, cooler and arguably more difficult parts of physics. The stuff that happens down in the quantum realm is so different to how we perceive things in our day-to-day lives, that it can be difficult to wrap your head around. Because of this, people often misunderstand many of the ideas in quantum and particle physics, or dismiss them, but many of these ideas and phenomenon have had major impacts on our lives, from advances in computing to literally existing.

I'm getting a little ahead of myself there. I suppose the best place to start would be the beginning.

== The beginning

From the dawn of time, people have wondered how to get food and shelter, and survive. After they figured those things out, they had a lot more free time to think about other things. One of those things was how the universe works.

Take a cake. Cut it in half. Then cut that half into half again. And again. Keep cutting into half until your cake gets smaller and smaller and smaller. Ignoring the logical solution of "the cake is no longer a cake but in fact a crumb on my knife", if we keep cutting this cake in half, how far can we go? Philosophers in ancient times figured that there must be a point at which the cake would no longer be cuttable, and so they described it as "uncuttable", or "_atomos_" in Ancient Greek. Sound familiar?

These atoms were important because they allowed us to make up pretty much anything we wanted to, just by combining the right set of them. Combine 2 hydrogen atoms with 1 oxygen atom, and we have a water molecule! Combine a water molecule with a hydrocarbon molecule like ethane, and we have a lot of fun! (For legal reasons, this is a joke. Don't drink, kids.)

Most philosophers agree that it was actually the ancient Indians who came up with the idea of these "uncuttable" particles, but the name (like the names of so many other concepts in science) came from the Greek word. Either way, we're not here to learn about the history, let's do the science!

== Quantum physics

=== Wave-particle duality

There's a lot of fancy words there, but I promise it's relatively simple. It's one of the earliest scientific discoveries that was made about something relating to quantum mechanics, and it'll help explain a lot of concepts down the road. The experiment that made this discovery is known as Young's double-slit experiment, and was performed by British physicist Thomas Young in 1801.

Here, let's look at a diagram:

#figure(
  image("quantum-and-particle/double-slit.png"),
  caption: [A diagram showing the double slit experiment using particles and waves.],
)

Okay, there's a lot to take in there. Let's break it down part by part

- In part (a), we see a series of parallel waves heading towards 2 slits in a wall. The waves then radiate outwards from the slits. This bending of waves is known as diffraction. You don't have to worry about what diffraction actually is and why it works the way it does, just that it *only happens in waves* and makes straight parallel waves into the circular ones, as long as the slit is much smaller than the distance between one wave peak and its neighbor (which is known as the wavelength).

  On the other side of the slits, we see the 2 circular waves intersecting. This is known as interference, and there's 2 types: constructive and destructive.

  #figure(
    image("quantum-and-particle/62907-004-A3A6351E.jpg"),
    caption: [A diagram showing constructive and destructive interference. It shows the basic idea, but real interference is a bit more complex than this, because the waves don't always cancel out. Source: #link("https://kids.britannica.com/students/assembly/view/53869")[Constructive and destructive interference - Britannica Kids].],
  )

  Constructive interference occurs when 2 waves add up to make an even bigger wave, and destructive interference happens when 2 waves cancel each other out, either fully or partially, to make a smaller wave than either starting wave. You can see this happening if you drop 2 rocks into still water and see their waves collide with each other. Anyway, the waves colliding create an interference pattern of light and dark, which correspond to high and low waves.

  Remember that this is something that *only happens in waves*.

- Part (b) is about shooting particles through the slits. If you imagine particles to be like tiny balls, it makes sense that they would pass through the slit in a straight line, and end up on the other side. Since there's 2 slits, we see 2 spots where there's a bunch of particles. All you need to really test this is a paintball gun, a small hole, and really good aim.

  The main takeaway here is that *particles travel in straight lines*.

- Part (c) is where things get a little confusing. We can see the particles from (b), but they end up in the interference pattern from (a)? Seems like someone, somewhere messed up real bad.

  The truth is, small particles (I mean _really_ small) like photons (light particles) have this exact behavior. If you shoot them through really tiny slits, you start getting this interference pattern. So light is a wave? Well, not exactly. If you have a laser pointer or a flashlight and you point it in a certain direction, you can see the light travelling in a straight line to get to wherever you're pointing it. Waves cannot do this, which means light is a particle.

  In reality, light behaves as both a particle _and_ a wave, hence the name wave-particle duality.

When Young discovered this, he changed the scientific world. A lot of old questions were answered, and a lot of new questions were raised.

=== Quantums

We'll come back to the double slit experiment and wave-particle duality in a bit, first let's talk about light and energy.

There's a rule in physics, known as the law of conservation of energy. It states that the total amount of energy in the universe is constant, and that energy cannot be created or destroyed, only transformed from one form to another. You've probably heard some or the other form of this law in science classes in school. Some of you may even know this as the first law of thermodynamics.

So this law tells us a few things: there's different forms of energy, and energy can be converted between those different forms.

This is pretty intuitive: if you put your hand near a lit lamp, you can see the light and feel some of the heat coming off of it. But at the same time, you know that the only input to that lamp is electricity, so clearly there's some conversion going on here from electrical energy to light and heat energy. Even though you might consider that heat to be a waste, or that leaving the light on all day is a "waste of energy", there's technically no energy lost here, just converted from one form to another.

This is important because we need a way to get energy from one place to another. Our survival on Earth depends on it, since we need energy from the Sun to survive.

We could send that energy as heat or sound, but those need particles to move through, since heat and sound are basically just oscillations of particles. This is why sound travels faster in solids, because there's more particles in solids than in gases so the energy can reach from one point to another much more quickly. Small problem: there's very, very, very few particles particles in space, not nearly enough to send enough energy to our planet.

Our other option is to send it in particles, which can travel through pretty much any medium and aren't nearly as fussy about it as waves. That's exactly what happens: the Sun sends light particles to the Earth. Some of those light particles have way too much energy to help us, so the Earth's magnetic field and ozone layer block those out, and let in the useful range of energies. (Fun fact, these high energy photons interacting with the magnetic field are why auroras happen!)

Now there's a question of how _much_ energy to send. This is determined by some of the properties of photos: namely their frequency and wavelength. These properties are related by this equation:

$
  c = f lambda
$

where $c$ is the speed of light, $f$ the frequency of the light wave (remember that light is both a wave and particle!), and $lambda$ is the wavelength (the distance between successive peaks in a wave).

Using the frequency, we can use this equation:

$
  E = h f
$

to determine the amount of energy that the light has, where $E$ is the energy and $h$ is a constant known as Planck's constant.

However, we're still talking about light as a whole, when we want to look at individual photons. Let's forget that photons are particles. We can instead consider them packets of energy, that, when combined together, make up $E$. These packets are called "quanta", and that's where "quantum" comes from!

Different wavelengths make up different types of light, from radio waves and microwaves being low frequency/high wavelength to visible light being somewhere in the middle, and x-rays and gamma rays being really high frequency/really low wavelength.

This is why x-ray machines have big warning symbols on them, and why areas like Chernobyl are so dangerous to go to, because there's all these high energy particles flying around.

#note[
  Keep in mind that x-rays in hospitals are pretty safe, since the amount of x-ray exposure that you get is really small, and the chance of something bad happening is really, really low. The reason doctors will step out of the room when they do the x-ray is because they have to do x-rays of people all day, and if they're not careful, over time, they can accumulate a dose of high-energy photons far higher than is recommended for the human body.

  Chernobyl and other irradiated areas are dangerous for this exact reason, because you get a much higher dose than your body can handle. When these high-energy photons interact with the atoms in your body, interesting things can happen which can lead to cancer or radiation poisoning. These things are not a joke and should be taken seriously.

  Also, for anyone claiming that your phones give off radiation, or that 5G towers cause [insert claim here], they're technically right in that both of those give off radio waves. However, radio waves are far too weak to actually cause you much harm, and you'd need a _lot_ of exposure to actually see effects of it. Also, the levels of radio wave radiation that these devices give off are generally checked extremely thoroughly and tested fairly regularly. Don't tell those people how radioactive bananas are, I guess.
]

Anyway, coming back to why this is important, we now have a way to get energy from the Sun to the Earth, but it's all just glorified light! This is where energy conversion comes in. Plants, for example, can use that light energy to activate chemical processes that turn carbon dioxide and water into carbohydrates, which are plant food. The energy is now stored in that food, and we can eat those plants, or animals that eat the plants, and transfer that energy to us. And so, life!

=== Wave-particle duality 2: Electric boogaloo

When scientists saw that light had properties of both particles and waves, they wondered what else could do cool stuff like that. When they repeated the experiment with electrons, they saw the same thing! This lead to a lot more questions than answers, since while light was a bit confusing with its behavior, people were pretty certain that electrons were definitely particles.

=== The wave function

Desperate to find answers, scientists tried something different. They figured, "well if we're shooting a bunch of particles it behaves like a wave. Maybe that's because a bunch of particles all together simply make a wave (like water). What happens if we only shoot one particle at a time?"

So they tried it, and discovered that only shooting one photon randomly through one slit at a time (only one photon through left, then right, then right, etc.) created the same interference pattern on the other side. There weren't even any other photons for it to interfere with! They tried the same thing with electrons, and again, saw the same result.

The equivalent to this would be seeing an ocean and a droplet behave the same way. Makes no sense, right?

Turns out, at the quantum scale, particles don't exactly exist as points in space, but more like a region in space where they _could_ be. They have clouds of probability, with each point within that cloud having a probability of the particle being at that position. So instead of a particle being exactly at x=50, it has a really high _probability_ of being at x=50, and a smaller probability of it being at x=51 or x=49, and so on. This probability is defined by something known as the *wave function*, denoted by the $Psi$ symbol.

#figure(
  image("quantum-and-particle/The_Sh1a.gif"),
  caption: [Graph of wave function against position along a single axis. Source: #link("https://labs.phys.utk.edu/mbreinig/phys222core/modules/m10/wave_functions.html")[Wave functions - University of Tennesse Knoxville].],
)

This wave function can be converted into a probability function, which can give the probability of a particle being somewhere depending on a bunch of different factors. The wave function is defined using the Schrödinger equation:

$
  i planck (partial Psi(x, t))/(partial t) = -planck/(2m) (partial^2 Psi(x, t))/(partial x^2) + V(x)Psi(x, t)
$

This looks very scary, and it's not nearly as bad as it might seem, but we're not gonna be using it either way so it doesn't matter (unless you're actually studying the field, in which case it matters a lot)! You might see different versions of this equation online, but all of them mean pretty much the same thing.

=== Quantum superposition

Let's go back to the double-slit experiment (told you it was gonna be useful!). After sending particles through one at a time, they figured that it must always behave as a wave of probability moving outwards from the source, so they tried to block off one of the holes, expecting to see a wave-like pattern behind with the number of photons decreasing going away from the center. If it were a wave, it should behave like one regardless of how many slits there are, right? Before I tell you what happened, scroll back up to the double-slit experiment diagram and try to imagine what would happen in each case if one of the holes was blocked off.

What the scientists actually saw was (b), the particles were accumulating in one spot as if they were going through in a straight line. This happened with photons, electrons, and pretty much every small particle they used. So when there was only one slit, the particle behaved as a particle and travelled in a straight line!

This happened because of something called *superposition*. You might have heard about it in a thought experiment called Schrödinger's cat. It goes something like this:

1. Place a cat into a box and close it. You cannot tell what's happening in the box.

2. When the cat is in the box, it has a 50% chance of dying. (Theoretically. No real cats were harmed in the making of this experiment!)

3. After some time, you come back to the box. Before you open the box, the cat can either be alive or dead, with a 50% chance of each.

That seems fairly logical, but superposition states that, instead of the cat being either alive _or_ dead, the cat is both alive _and_ dead at the same time. That is, it's in a superposition of both living and dead states.

How can a cat be in both states? Well, a cat can't. But since particles don't really exist as anything other than probabilities, they can. That's what was happening with the double-slit experiment: the particle was in a superposition of all the places that its wave function said it could be, which is why it was behaving like a wave. Essentially, it was behaving as a big wave travelling through the system.

So why did we only see a particle on the other side? Well, when you open the box, you "observe" what happens, and the superposition of the cat "collapses" into one of 2 states: alive or dead. This basically happens by the universe flipping a coin, and if it lands on heads the cat lives otherwise it dies. If you repeated the experiment a thousand times, you'd get 500 living cats and 500 dead ones.

Similarly, when the particle travels through the system, it has a probability of being somewhere on the screen, with the probability of it being in each place being defined by its wave function. The universe then randomly picks a spot based on that probability, and places the particle there when we "observe" it. When you look at the screen, you open the box, and find out what happened to the metaphorical cat.

So why does this not happen when we only have one open slit? Well, there's no probability of the particle going anywhere else other than the slit. There's no other slit for it to go through, so the superposition was collapsed the moment the particle left your source. It's as if you never even closed the box, and just watched what happened to the cat. Since the superposition was never there, there was no probability wave, and it just behaved like a particle with a known position and travelled straight through like you'd expect.

This is why laser pointers and flashlights don't spread out like waves, because there's no probability of the light being anywhere else other than where you've pointed it.

If you think this is a bit much, I don't blame you. It's a very different way of thinking about things than how we perceive them in our day-to-day lives. But the truth is, so much of our universe works on these phenomenon, that it might seem crazy that we didn't discover them until quite recently. Anyway, if you want to take a break, I don't blame you. Once you're ready, we can move on.

=== Quantum tunnelling

I keep talking about how important these things are to the universe and our existence, and you might be wondering why. In my opinion, one of the most important phenomenon displayed by these particles is quantum tunnelling.

Let's think about what tunnelling is. Fundamentally, it's a way of getting through a barrier of some sort. If we dig a tunnel through a mountain, it's because we need to get somewhere and the mountain is a barrier to that path. Quantum tunnelling works the same way, but for particles, where the particle encounters a barrier it shouldn't be able to get through, yet it does.

#note[
  The following explanation has been adapted from #link("https://phys.libretexts.org/Bookshelves/University_Physics/University_Physics_(OpenStax)/University_Physics_III_-_Optics_and_Modern_Physics_(OpenStax)/07%3A_Quantum_Mechanics/7.07%3A_Quantum_Tunneling_of_Particles_through_Potential_Barriers")[LibreTexts Physics].
]

Let's say we have a ball with some amount of energy, which means it's moving with some speed. If it encounters a small hill, it can roll over it, and down the other side, and continue on its journey. Now, let's say it encounters a really big hill. It can roll partway up the hill, but it won't be able to go over to the other side.

In the quantum realm, we can imagine the ball to be particles. The hills are now dependent on energy rather than physical height, and are known as "potential barriers". Basically, the particle would need a certain amount of energy to get past that barrier and to the other side. We can even feel some of these barriers, such as the repulsion when you bring the two similar poles of two magnets together (north-north or south-south).

However, do you remember how particles aren't particles, but waves of probability? If you look at the wave function graph above, you can see how that wave spreads over an area. That means, if the hill is thin enough and that graph is wide enough, there's a small chance that the particle can appear on the other side.

#figure(
  image("quantum-and-particle/316773.image0.jpg"),
  caption: [A graph showing the probability of a particle being on the other side of a barrier. This isn't exactly how the graph looks since the probability decreases exponentially inside the barrier, but it's good enough for a basic explanation. Source: #link("https://www.dummies.com/article/academics-the-arts/science/physics/string-theory-access-parallel-universes-with-quantum-tunneling-177689/")[Physics I for Dummies].],
)

From Schrödinger's cat, we know that if there's a probability of something happen, it will happen given enough attempts. So sometimes, the particle will get through the barrier, which is known as *quantum tunnelling*.

This happens all over the universe, but most importantly, it happens in stars like our Sun. Because stars have so many tiny atoms like hydrogen and helium, the nuclei (centers) of these atoms don't have that much of a barrier to cross. The barrier in question is the same repulsion that we feel with magnets, since the nuclei of both atoms are positive, while the outer shells are both negative. We'll look at the structure of atoms in a bit, and this will make more sense.

Once the nuclei cross this barrier, they fuse together (called nuclear fusion), and that releases a _lot_ of energy. When you have a lot of nuclear fusion happening, you get a lot of energy released, which makes it easier to make more nuclear fusion happen. An easy way to imagine this is that once a ball gets over a hill, it releases a bunch of energy. This extra energy speeds up other balls nearby, which means they make it further up the hill where the hill is smaller, which means a higher probability of the balls tunnelling across, which means even more energy is released, speeding up more balls, until most of the balls can make it over the hill.

And you get a star! Of course, we know that the Sun is a star, and we need the Sun to survive.

=== Conclusion

There's a lot more fun stuff that happens in quantum physics, like entanglement, which is how quantum computers work. However, a lot of those get complicated, and would probably make more sense once you have a better understanding of quantum mechanics. I'm still learning, and don't have that level of understanding just yet (skill issues, I know), so maybe I'll come back and update this post once I do.

Anyway, enough about quantum physics and particle's behaviors, let's actually look at what these particles even are. Time for particle physics (my favorite)!

== Particle physics

Particle physics differs from quantum physics in that it deals with the properties of the particles themselves and some of the interactions between them, instead of the mechanics and behaviors of the particles with the rest of the universe. I would argue it's sometimes even more complicated and confusing than quantum physics, and the answers to a lot of questions in this field are, "we don't know yet".

However, I do enjoy particle physics a lot more than quantum. It's an even newer field that looks at the absolute lowest level of the universe, and I believe that a lot of interactions and behaviors of objects and vaccums that we can see and interact with can be explained at this fundamental level.

=== Inside the atom

Most people probably assume atoms to be the smallest units of matter, kind of like the pixels of our universe. That's a fair assumption to make, considering we learn that relatively early on in science classes in school. However, there's a lot more that's going on inside atoms, including even smaller particles and interactions between them.

Let's talk about the structure of atoms. Most people have probably seen atoms that have a group of particles in the middle and a bunch of tinier particles orbiting around it. Some people who took chemistry or physics in high school (and actually paid attention) probably remember there being electron shells or levels, with specific numbers of electrons in each level.

All of this is pretty accurate, and this model of the atom was first discovered in a series of experiments known as the Geiger-Marsden experiments, or the Rutherford gold foil experiment. In the experiment, an alpha particle was shot at a piece of gold foil. An alpha particle is positively charged, which means it gets repelled by other positive charges.

One of the first things they discovered was that many of the alpha particles would pass straight through the foil without being deflected by anything. This showed that atoms were mostly made up of empty space, and weren't big solid balls of matter. However, they also knew that electrons existed and were negatively charged, and that atoms were neutral (no charge), which means there needed to be some positive charge somewhere to balance that negative charge.

They then saw that the alpha particle would get deflected sometimes. The amount it would get deflected would also vary, and sometimes it would come flying back in the direction it came from. This meant that there was a very strong positive charge somewhere, and the closer the alpha particle got to that positive charge, the more strongly it would get deflected. Again, you can imagine this using magnets, where the closer you bring the like poles of magnets together, the more strongly they push each other apart.

They figured out that there was a strong positive charge somewhere inside the atom, and decided it was somewhere in the middle and therefore called it the nucleus. They then put the electrons in orbits around the nucleus, and we have one of the earlier modern models of the atom. There's a lot of other fun stuff we've discovered since, about energy levels and electron clouds (the clouds of probability from before), but for most people this model works fine.

Of course, the electrons aren't actually orbiting around the nucleus, since the momentum and acceleration from that rotation would basically cause the atom to destroy itself immediately, but we don't really need to worry about that too much.

=== The Standard Model

Okay, let's dive a little bit deeper. Since the Geiger-Marsden experiments, we've found out that the nucleus contains positively charged particles called protons, as well as neutral particles called neutrons. We also have electrons hanging out outside the nucleus. But what exactly _are_ these?

Electrons are as fundamental particles. This means that, as far as we know, they're not made up of anything else. Neutrons and protons, on the other hand, are composite particles, which are made up of other fundamental particles called quarks.

Remember how I said protons have a positive charge? Let's call this a +1 charge. Electrons need to balance protons, so let's make those -1. Finally, neutrons, being neutral, can be 0 charge. Since electrons are fundamental, we can ignore those, so let's focus on the composites.

We need a way to break those down into smaller particles. What's the best way to break down whole numbers? Fractions! Okay, so let's create a quark with a fractional charge, say +2/3. That was fun! Let's do another one, with -1/3. Sure, these can technically be any number you want since we're making them up, but humor me for a bit here.

We can now combine these quarks simply by adding their charges. So 2/3 + 2/3 - 1/3 = 1, and 2/3 - 1/3 - 1/3 = 0. By using different combinations of these quarks, we've made our proton and neutron! This is exactly how the proton and neutron are made: using up (+2/3) and down (-1/3) quarks. We can use different combinations of these quarks, and as long as the result ends up being a whole number, we have a new particle!

The Standard Model of Particle Physics (the Standard Model for short) defines these fundamental particles. It technically exists as an equation, but most sources will lay it out in a table so that it's easier to understand. The Standard Model can generally be separated into 2 categories: fermions and bosons.

#figure(
  image("quantum-and-particle/SM1.png"),
  caption: [The Standard Model of Particle Physics. Source: #link("https://www.physik.uzh.ch/groups/serra/StandardModel.html")[Standard Model, Physik-Institut, Universität Zürich].],
)

=== Fermions

Named after Enrico Fermi, these are the particles that make up all of the matter in the universe. There are 3 generations of these matter particles, and fermions can be further split up into 2 categories: leptons and quarks.

==== Leptons

Each generation of lepton consists of a particle and its corresponding neutrino. First generation leptons are electrons and electron neutrinos. Second generation are muons and muon neutrinos. Third generation are tau and tau neutrinos.

The particles themselves aren't that interesting. Each particle similar properties, with -1 charge. The major difference between them is their mass, where the higher generations have much heavier particles. The tau, for example, weighs 3.5 times as much as an electron!

Neutrinos, on the other hand, are a bit more interesting. They have 0 charge, extremely low mass, and generally don't interact with most matter. In fact, there's trillions of them going through your hands every second! This is why they were, and still are, so difficult to detect. The only reason we know about them is because without having them there a bunch of our calculations weren't making sense.

==== Quarks

There are 6 quarks in total. The first generation consists of the quarks we've already encountered: up and down. The second generation is similar to the first, with the charm (+2/3) and strange (-1/3) quarks. The third generation is also similar, with top (+2/3) and bottom (-1/3). Like with the leptons, quarks get heavier the higher the generation. The top quark, for instance, weighs almost 100 000 times as much as an up quark!

=== Bosons

Bosons, named by Paul Dirac in honor of Indian physicist Satyendra Nath Bose, are the force carrier particles, which represent the forces we encounter in our daily lives. Remember, forces are just pushes and pulls, but things you might not think of as forces can be.

For example, you might think of pushing on a box as a force, and you'd be right. By pushing on a box, you are doing work on it to move it a certain distance. However, the repulsion and attraction of a magnet is also a force, since it is also doing work on the magnetic object to move it a certain distance, either away from or towards itself.

==== Electromagnetic interaction

This force is known as the electromagnetic force, or electromagnetic interaction, and its carrier is the photon. This doesn't mean that magnets don't work in dark rooms, it just means that whenever there's an electromagnetic interaction, a photon is involved in some way. For example, particles like electrons can absorb and emit photons to jump to higher or lower energy levels. The details of it are a bit complicated, but the gist of it is that this interaction only works with charged particles, so no neutrinos allowed.

==== Strong interaction

"Now wait a minute", you might be thinking, "if like charges repel each other, how are there so many positive charges all in one place in the nucleus?" Great question! The nucleus indeed has some pretty strong repulsion because of the electromagnetic interaction. In a universe where that was the only interaction, there wouldn't be nuclei, and there wouldn't be atoms, and cookies wouldn't exist and I'd be very sad. Luckily, we don't live in such a world, because the strong force, or strong interaction, exists!

This force is carried, or _mediated_, by gluons. If the name "gluons" sounds like it was derived from "glue", that's probably because it was! The strong force is extremely strong, orders of magnitude stronger than the electromagnetic force or gravity, and strong enough to keep the nucleus "glued" together. You can imagine it like a much stronger but fundamentally different version of gravity that only works within the nucleus of atoms.

The strong interaction, like the electromagnetic interaction, is a bit picky about what it'll work with. Specifically, the strong force only works with "colored" particles, which are pretty much just quarks. Yes, the naming of things in particle physics sucks, but the things that happen at this scale are so weird and abstract that I don't think any language has the words to really describe it, and any name we give it would sound just as weird.

==== Weak interaction

"Now wait another minute", you might be thinking again, "I've heard of atoms decaying and stuff. If this strong force is as strong as you claim, how does that happen?" Another excellent question. That happens, as you can probably guess from the title of this section, due to the weak force, which are mediated by the W and Z bosons.

The weak interaction isn't directly responsible for radioactivity, but it does cause it. This is because the weak force can change one type of quark into another, something no other interaction can do. Let's say we change the up quark in a proton into a down quark. The difference between their charges is -1 (since +2/3 - 1 = -1/3). Since the overall charge of an atom needs to be 0 for it to be stable, and it just lost a +1 charge, it now needs to lose a -1 charge. So the atom lets out an electron from its nucleus, and this is known as a beta particle, one of the products of radioactivity.

The reason it can do this is because, unlike the gluons and photons, the W and Z bosons have charge and mass. The W boson can have positive or negative charge, while the Z boson is neutral.

==== Higgs

The Higgs boson and Higgs field is far too complicated even for me. All I can really tell you is that the Higgs field is the reason that mass exists. It's also a fairly recent development in particle physics, and I'm quite excited to see where it goes.

=== Force fields

Before I move on, I figured I'd talk a little about what force fields are. While they sound cool, like something out of science fiction, they're pretty simple. A force field is basically just an area in space where a force can act. The force fields for the electromagnetic interaction or gravitational interaction are infinite, for example, while those for the strong and weak interactions are limited in range.

=== Gravity

You might have noticed that I didn't talk about gravity when going through the bosons. It's a fundamental force of the universe, surely it must have a particle, right? Well scientists thought the same, and so they tried adding a graviton to the list of bosons. However, when they did a lot of calculations started breaking down, and they realised they'd made a mistake.

You see, gravity isn't like the other forces. In fact, #link("https://www.youtube.com/watch?v=R3LjJeeae68")[gravity is not a force] at all! It's more of a consequence of the bending of space-time due to the mass of objects. Well that's the extremely simplified explanation, and the truth is we don't really understand how gravity really works. There's been some new developments on ideas of quantum gravity, but this is one of the biggest missing links between our world and the quantum realm. Figuring out how gravity fits in could massively help us get to a Theory of Everything™.

Gravity is far more complicated than most people realise, and definitely out of the scope of this post. If you want to learn more, I'd recommend checking out this #link("https://www.youtube.com/watch?v=XRr1kaXKBsU")[Veritasium video] and the Sabine Hossenfelder video I linked above.

== Conclusion

And that's it! You now have a basic starting point to get going on your journey through quantum and particle physics. It's a very fast and innovative field, and there's new developments and ideas being shared all the time! Pretty much everyone has their own idea of how the universe works, and as long as you can prove it mathematically and/or experimentally, you might even be right!

Some other resources to get you started:

- Quantum (#link("https://play.google.com/store/apps/details?id=brychta.stepan.quantum_en")[Google Play Store]) - This app taught me a lot of the basics of quantum mechanics, and really piqued my interest in the subject. I'm not sure how often it's been updated since I used it, but I'm fairly certain it's still a great resource.

- #link("https://paulskrzypczyk.github.io/qm-lecture-notes/")[Quantum Mechanics I lecture notes by Paul Skrzypczyk at the University of Bristol] - These notes are aimed at a 2nd year physics student, so if you've done 1st year physics these might be helpful. There's also short lecture videos to go alongside the written content, and problem sheets with questions to solve for practice. NOTE: I am not Paul Skrzypczyk.

- #link("https://home.cern")[CERN] - The experiments that scientists do at CERN are probably some of the coolest things ever, and a lot of the discoveries came from the Large Hadron collider in CERN. Fun fact: the World Wide Web was also founded by Tim Berners-Lee at CERN!

- The internet - Looking stuff up is probably the best way to learn in today's world. My parents keep telling me about how I have it easy with all the world's knowledge at my fingertips, and they're right. The internet is probably humanity's greatest invention so far, and with the crazy amount of information on here, you'd be a fool not to take advantage of it. Just be careful and verify any claims that you see, try to stick to reputable sources, and try not to get distrac- ooh, a squirrel!

I hope you have fun with this guide and with quantum and particle physics in general. A lot of the concepts here are things I wish I'd had an easier time finding and understanding when I was getting started. Unfortunately, I couldn't find any great explanations for these things, and so I've written this post so that hopefully others can get those resources that I didn't really get, and hopefully understand this incredibly exciting part of physics a little bit better.
