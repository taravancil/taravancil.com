---
title: "Recurse Center Day 2: Pairing Is Great "
date: 2016-09-27
tags: [recurse center, pair programming, algorithms, zsh]
---

Today was the first "regular day" of RC, wherein the schedule was
structured as it will be for the remainder of the batch. I started the
day with two goals:

1. Make the process of publishing new posts to this blog as
  frictionless as possible.
2. Work on the [password
  manager](https://github.com/taravancil/passkeeper) that I wrote in
  Rust.

I didn't complete either of these tasks, but I made progress on #1
and was really productive in some other ways.

The first half of the day was a total drag. I thought the the last
iteration of this site's design was pretty ugly (unfortunately I am
not blessed with a good eye for design), and I knew if I
didn't make changes immediately, it would hang over my head and make
me not want to share my blog posts. So I bit the bullet, spent a few
grueling hours revamping things, and came up with a simple and
minimalistic design that I'm content with. It's not the prettiest
thing, but it works. And it's faster too! There's way less CSS and it
no longer makes a request to `fonts.google.com`.

I also made progress on making it easier to publish posts on this
site. [V](http://vaibhavsagar.com) suggested that I could use Travis
CI to push to my server, but I wanted to learn more about git hooks,
so I opted for a different approach. I set up a bare git repository on
my server. I added a `post-receive` script to that repository so that
when I push to it from my local repository, it cleans up the necessary
files and moves them to where they need to be. But I'm dealing with a
blocker that's driving me mad. I switched from bash to zsh a few weeks ago,
and I think something weird is happening with variable
expansion and is mucking up everything I do that involves my ssh
keys. I'm _over_ it so I don't feel like writing about it now,
but I'll say more about it tomorrow if I can't find an RCer to help
me troubleshoot it.

The best part of today was an accident! I happened to be sitting in
the room where a weekly event called Code Dojo was scheduled, and
decided to jump in. Basically V picks a small programming challenge,
then people pair up to work on the problem for about an hour, then we
reconvene to share our code. I paired with
[Harold](https://github.com/haroldtreen), who was a most excellent
navigator. We worked on this [HackerRank
challenge](https://www.hackerrank.com/challenges/pairs) and came up
with an O(n^2) solution. A couple of other groups came up with
something much more clever, but I didn't fully understand it until I
came home and implemented it myself and my roommate Lyn helped me
intuit why it's a much more elegant solution. I love living with
RCers! Here's a
[gist](https://gist.github.com/taravancil/d740b51f6ee0ba658a3fe47217dcf3b6)
with both solutions.

Other cool things that happened today:

* [Fenimore] shared that he found out about
[Cryptopals](https://cryptopals.com) because of the
[solutions](https://github.com/taravancil/cryptopals) I posted on
GitHub. He's already solved a few of them, and we're planning to keep
chatting about them tomorrow. It's been a while since I wrote the solutions,
but I'm glad for the chance to revisit them and check my understanding.
* I met *another* person who's into weightlifing. Is there some common
personality trait between programmers and weightlifters? Because I've
met at least 10 people at RC who are into lifting. It's awesome.

Tomorrow I'm going to figure out this weird problem I'm having with
ssh, work on my password manager, and try to pair with someone on a
small programming challenge.