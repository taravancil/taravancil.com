---
title: "Recurse Center Day 6: Raft's Safety Argument and Cryptopals
Round 2"
date: 2016-10-03
tags: [recurse center]
categories: [recurse center]
---

Today I read a lot. Per the recommendation of [Mike
Nielsen](https://github.com/franbulax), I'm working through [The TCP/IP
Guide](http://tcpipguide.com) and practicing working with Wireshark
along the way. I also re-read some parts of the [Raft
paper](https://www.usenix.org/system/files/conference/atc14/atc14-paper-ongaro.pdf),
specifically focusing on the the arguments that support Raft's safety
guarantee -- the guarantee that it if any server has applied a log
entry to its state machine, then no other server may apply a different
command at that same log index.

As I understand it, the guarantee hinges on these three requirements:

1. Instructions to commit a log move in one direction only: from
leaders to followers.
2. A Follower will never vote for a Candidate if its own log is more
up-to-date than the Candidate's, which, in conjunction with a few other
things, gives the guarantee that a Leader's log will *always* contain all
committed log entries.
3. Log entries must not be overwritten.

So if the Leader is the only participant that can commit
new log entries and the Leader must have an up-to-date log, then
there's no way that a new Leader's state machine can be out-of-date
or instruct other servers to overwrite old entries with invalid
entries. Cool!

I also started re-implementing [my cryptopals
solutions](https://github.com/taravancil/cryptopals) in Python. Last
time I wrote them in Go, but I don't write much Go nowadays and I
think it's worth my time to practice Python since it's a such a
widely-used language. I'm excited to revisit the challenges and
hopefully write some much prettier code. Looking at my old solutions
yesterday [had me like...](https://i.imgur.com/PDKLgSY.gif)
