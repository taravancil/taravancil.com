---
title: "2017: Year in review"
date: 2018-01-01
tags: [year-in-review]
---

<style>
  .content p:first-of-type {
    font-size: 18px;
    border-left: 8px solid;
    padding-left: 10px;
  }
</style>

2017 was my most productive year yet. Not because I achieved superhuman levels of productivity, but because I made the transition between figuring out what to do with my life and doing something with my life. It feels damn good.

<!--more-->

The year began on a high note: I had just moved back to Texas after spending three months in New York while at the [Recurse Center](https://recurse.com). Even better, I started my first salaried job! I joined Cloudflare as a developer on their [Cloudflare Apps](https://cloudflare.com/apps) team. That was a big deal, because it was the first time in my life that I wouldn't be flat broke. Apparently I didn't like having money very much, because by April, I couldn't fight the urge to venture out on my own and work full-time on [Beaker](https://beakerbrowser.com). [Paul](https://twitter.com/pfrazee) and I have been working together on Beaker since April, and it's been one of the best experiences of my life.

Speaking of Paul, we started living together and adopted two wonderful cats. We intended to only adopt one cat, but it wasn't long after bringing [Sasha](https://sasha-taravancil.hashbase.io/) home that Kit (literally) walked into our lives, inviting herself into our apartment and claiming it as her home. She was a [Trap-Neuter-Release](http://www.austinhumanesociety.org/ferals/) kitten (notice her clipped ear), but decided she'd rather live with us than on the streets. Her affectionate and playful nature is almost cartoonish. She's amazing. Sasha is independent, spending most of her time outside, crawling under bushes and meowing at the neighbors. Despite her aloofness, she's a great cat, largely thanks to her fluffy coat and affinity for belly rubs.

<div class="img-grid center">
  <img src="/images/2017-in-review/sasha.jpg" />
  <img src="/images/2017-in-review/kit.jpg" />
</div>

## Speaking

I gave
[my first conference talk](http://bangbangcon.com/speakers.html#tara-vancil)!
Leading up to the event, I wasn't confident in my ability to give a well-executed presentation, so I practiced like mad. All total, I rehearsed at least twenty times, even practicing in the hallway minutes before going on stage. Possibly over-ambitious for a ten-minute talk at a friendly event like [!!Con](http://bangbangcon.com/), but being over-prepared paid off. By the time I stepped on stage, my legs were shaking and my body felt weightless, yet I got up there and was able to say exactly what I intended to say.

I eventually turned the presentation into a [blog post](/blog/how-merkle-trees-enable-decentralized-web/), and it made it to the front page of Hacker News! Not that I want that etched on my gravestone, but it was satisfying to know that people found it interesting and useful.

<figure>
  <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/wGB5AYvFjxE?rel=0&amp;showinfo=0&amp;start=15987" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>
  <figcaption>
    How Merkle Trees enable the decentralized Web: a talk about how one data structure enables an entire class of computer
    networks.
  </figcaption>
</figure>

After gaining some confidence at !!Con, I gave a total of eight presentations in 2017, all related in some fashion to the peer-to-peer Web or Beaker. A personal highlight was putting an impromptu presentation together at Strange Loop <a href="#footnote1"><sup>1</sup></a> and convincing a small group of attendees to listen to me ramble about Beaker.

<figure>
  <video src="https://peer-to-peer-web.com/assets/01-los-angeles/videos/01-jon-kyle.mp4" controls></video>
  <figcaption>
    My presentation at <a href="https://peer-to-peer-web.com">p2p Web day LA</a>: A brief history of the Web and how one architectural choice got us into a
    very big mess
  </figcaption>
</figure>

## Travel

In January, I visited Boston to spend some time with the team I was joining at Cloudflare. During some downtime, I walked the [Freedom trail](http://www.thefreedomtrail.org/), which eventually took me through the Boston Common, where thousands of people were [marching](https://en.wikipedia.org/wiki/2017_Women%27s_March) in response to the newly-elected orange president and his sideways policy initiatives. Having just walked the Freedom Trail, seeing that many people come together to celebrate what's amazing about America overwhelmed me with pride. I'll never forget that moment.

<figure>
  <img src="/images/2017-in-review/boston.jpg"/>
  <figcaption>America</figcaption>
</figure>

In July, my mom and stepdad finally got married! They'd been together for fifteen years, so it was about time. It gave me an excuse to go home to Michigan, which means I got to see my brothers, my dad, and my amazing nieces. The ceremony was held on Burt Lake and it was a thoroughly redneck affair: we parked a fleet of boats in a shallow part of the lake, and most guests watched the ceremony from the water with a beer in hand.

<div class="img-grid center">
  <img src="/images/2017-in-review/wedding1.jpg"/>
  <img src="/images/2017-in-review/wedding2.jpg"/>
</div>

<img style="margin-top: 5px" src="/images/2017-in-review/wedding3.jpg"/>

Paul and I attended the [Microsoft Edge Web Summit](https://summit.microsoftedge.com/), which was a real treat. We spend *a lot* of time thinking and talking about Web browsers, so it was a blast to spend a whole day in a room with folks who care about browsers as much as we do.

<figure>
  <img src="/images/2017-in-review/seattle.jpg"/>
</figure>

In October I visited London to attend [MozFest](https://mozfest.org). Not only was it my first time visiting Europe, but I had the chance to present Beaker and the peer-to-peer Web to a rapt audience. Best of all, I finally got to meet a bunch of folks from the Dat/Beaker-verse!

<div class="img-grid">
  <img src="/images/2017-in-review/mozfest1.jpg"/>
  <img src="/images/2017-in-review/mozfest2.jpg"/>
</div>

## Work: Beaker, Hashbase, and the peer-to-peer Web

My work on Beaker and the peer-to-peer Web consumed my life in 2017, so it deserves a section of its own.

In summary, working on Beaker was an exercise in getting shit done. As a team of two, Paul and I often needed to do tasks we simply didn't have the skills or experience to do. My mantra eventually became "I have no idea what I'm doing, but I'll figure it out."

A few things I'm especially proud of:

### beakerbrowser.com

I rebuilt [beakerbrowser.com](https://beakerbrowser.com) from top to bottom
early in the year. It's not a particularly striking website but it was a
massive undertaking and I'm proud of the improvements I made. I'll be rebuilding the whole thing again in 2018.

### beaker://start

Beaker's start page is one of its most important UIs; it's the first thing you see when you open Beaker, and you see it each time you open a new tab. It needs to be useful, it needs to render quickly, and it needs to look nice. It went through several iterations this year, none of which met those criteria. I'm happy to say I finally built something I'm satisfied with.

<div class="img-grid center wide">
  <img src="/images/2017-in-review/start-page1.jpg" />
  <img src="/images/2017-in-review/start-page2.jpg" />
</div>

### Hashbase

Mid-year, we launched [hashbase.io](https://hashbase.io), a service that acts as a "super peer" for archives published with the `dat://` protocol. It was our first time offering a paid product, so it felt like a big moment for us. On top of that, I'm still fairly early in my career as a developer, so anytime I help build a product that Real Life People will use it's an exhilirating experience. I look forward to giving Hashbase the love and attention it deserves in 2018. There's so much we wanted to do with it this year, but just didn't have the bandwidth for.

## Closing out 2017

2017 ended with a lovely holiday break. Paul and I took some time off from working on Beaker, and it was blissful. Having the chance to indulge in cooking, reading, and writing was exactly what I needed to feel ready for 2018.

Let's go, y'all.

<div class="img-grid center">
  <img src="/images/2017-in-review/holiday1.jpg" />
  <img src="/images/2017-in-review/holiday2.jpg" />
</div>

## Footnotes

<div class="footnotes">
  <ol>
    <li id="footnote1">
      Shout out to <a href="https://www.projectalloy.org">Project Alloy</a>. They sponsored my trip Strange Loop, and without their financial support I wouldn't have been able to attend. When I'm no longer living on a startup budget, they're one of the first organazitions I'll look to when I considering how to support important work and good people.
    </li>
  </ol>
</div>