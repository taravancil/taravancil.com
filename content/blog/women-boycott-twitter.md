---
title: Towards a more democratic Web
date: 2017-10-13
tags: [beaker, democracy, decentralization, p2p, web, twitter, facebook]
---

In the aftermath of the recent Harvey Weinstein revelations,
[Rose McGowan was suspended from Twitter](https://twitter.com/TwitterSafety/status/918502629679939584) for breaching its Terms of Service. Twitter made an unusual move by commenting on the
status of a specific user’s account, which it normally publicly declares
it does not do.

<!--more-->

Twitter's moderation policies have always been flawed. It seems to apply its
policies inconsistently and often feigns helplessness when pressed.

Many people who have suffered harassment on Twitter (largely women),
are understandably fed up with Twitter's practices, and have staged
a [boycott of Twitter](https://twitter.com/search?q=%23WomenBoycottTwitter)
today October 13, 2017. Presumably the goal is to highlight the flaws in
Twitter's moderation policies, and to push the company to make meaningful
changes in their policies, but I'd like to argue that we shouldn't expect
Twitter's policies to change.

## Twitter: a neutral platform or a curated community?

No matter if you're a conservative, liberal, a woman, an apologist for a serial
rapist (fuck you), or a Nazi (fuck you too), chances are good that at some point
you'll:

1. Say something on Twitter that leads to your account being suspended, and/or
2. Be frustrated by Twitter's actions (or inaction) surrounding moderation

Twitter is a public space for conversation and community for millions of people,
so for Twitter to suspend an account is akin to banning someone from the public
center. That should not be taken lightly.

But we should also not take it lightly when when someone is harassed into
silence by speech that threatens violence. Threatening speech is
no longer just speech - we must consider how that speech impacts other peoples’ voices.

And here lies the problem. Twitter cannot be both neutral platform and arbiter
of good and bad speech. Nor do I want Twitter to be either of those
things!

 * If Twitter acts as a neutral platform, then unless Twitter can provide very powerful tools
to help users manage their feed and who they engage with, then the platform will be flooded
with bots, harassment, racism, libel, and all flavors of filth. A purely neutral
platform leads to a terrible experience for users.
* If Twitter acts as the decider of good/bad content, then we all have to worry
about whether or not our opinions align with what Twitter has deemed "appropriate".
Maybe they align right now, but what happens if Twitter gets
new executives, or if someday Twitter's leadership is pressured by powerful forces to silence
people with beliefs like mine?

Neither of those situations are ideal, and currently Twitter is dancing somewhere
between these two worlds, trying to be a neutral platform while selectively
enforcing bans and suspensions.

## Twitter’s stalemate

You may not agree with Twitter’s policies, but you can likely observe the
forces at play here, and understand why Twitter’s moderation policies have appeared
inconsistent, unfair, and sometimes downright wrong.

It’s because Twitter is not driven by doing the right thing. Twitter is
motivated to avoid upsetting users to the point that they leave Twitter.
Users leaving Twitter is bad for business.

For example, If Twitter suspends alt-right accounts that intentionally toe the line between American
pride and white supremacy, then they lose a not-insignificant number of users
who'll cry "free speech haters". If they don't suspend those users, they risk
losing the users who won't stand for Twitter being used as a platform for
harassment and racism.

It's not going to get better.

### Don't hold your breath

Twitter's executives likely think their moderation policies are driven by being
fair and judicious, but those policies can't escape the fact that Twitter's
bottom line depends almost entirely on engagement and ad revenue.

Unless we expect Twitter's business model to change, then we shouldn't expect
their moderation policies to change. No matter what decisions Twitter makes
regarding moderation, some large group of users will feel targeted, and will
swiftly exit the platform.

Moreover, what *could* Twitter do that would be a reasonable solution? I don't
see any way out of this.

## So what should we do?

Decentralize. Twitter is responsible for moderating who and what shows up in your
feed because Twitter's servers house the content that composes your feed. A
centralized service like Twitter or Facebook has the choice to act
as a neutral platform for speech, or set strict content guidelines and then
work to uphold those policies. I don't believe either option is a good choice.

### The dream of a decentralized Web

I want to decide what is good content *for me*. I want help making that decision
based on how people I trust have responded to that piece of content. I want to
be able to mark another user as a porn bot or a Nazi, and I want people who
follow me to be able to see that information, and to decide how to act on it.

And most importantly, I don't want any single person deciding if another
person has the right to speak. The fragility of expecting a "media monarch"
like Twitter to make good decisions is too risky. I want online media to work much
more like a democracy, where users are empowered to decide what their
experience is like.

### Moving forward

A lot of people feel the same way, and several decentralized social media apps have
bubbled up out of this mess.

You have many options if you're ready to give up on Twitter.

#### Mastodon

[Mastodon](https://mastodon.social/about) has been around for a while, but
since it operates on a federated network, it's not *quite* the flavor of
decentralized I think we deserve.

In order to participate, you have to sign up to an instance, whose servers are
run by somebody else. If you pick a good instance with a good administrator,
you shouldn't have any trouble, but you still have to depend on a single person
to decide what you should or should not be allowed on your feed.

Running an instance is also hard and expensive work. It would be great if
we could find a way to make social media apps both free and easy to use.

#### Patchwork

[Patchwork](https://github.com/ssbc/patchwork#install) is a peer-to-peer social
media application with a rich community. It's built on top of Secure Scuttlebutt, and acts as a standalone desktop application. It's a little rough around the edges in terms of
UI and performance, but the community is really great.

#### Build a peer-to-peer social media app on Beaker

I work on [Beaker](https://github.com/beakerbrowser/beaker), a peer-to-peer
browser, and we've built APIs that give developers the ability to publish
on the user's "profile" and "timeline".

[Profiles in Beaker](https://twitter.com/taravancil/status/902630313427394572)
are just datasets that live on the user's computer, and are transported over a
[peer-to-peer network](https://github.com/datproject/dat). With Beaker's APIs,
applications can ask the user for permission to read/write to a user's profile.

The best part is that because user data is separate from application
code, there's no one social media app we all have to agree upon. As long
as we all structure our data in the same format, we're each free to use any
compatible application.

I work on Beaker because I think it's the kind of Web we deserve. Keep your eyes
peeled for the upcoming 0.8 release, where we'll be releasing the Web APIs I
mentioned above. Or if you live on the bleeding edge, you can try building the
[development branch](https://github.com/beakerbrowser/beaker/tree/beaker-0.8).
If you do, be sure to check out `beaker://timeline` :).

![Screenshot of beaker://timeline in the Beaker browser](/images/beaker-timeline.png)