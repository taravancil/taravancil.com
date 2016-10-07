---
title: "Recurse Center Day 9: A Peer-To-Peer Chat System"
date: 2016-10-06
tags: [recurse center, p2p, distributed systems, node]
categories: [recurse center]
---

Today I worked on a fun 'lil set of p2p exercises
written by [mafintosh](https://twitter.com/mafintosh). I wrote a very
basic p2p chat tool, which at the moment requires that the network be
fully connected, or rather that each node in the system is connected
to every other node.

The [code is on
GitHub](https://github.com/taravancil/p2p-workshop/blob/master/6-simple-p2p-chat/peer.js),
so you can try it out for yourself!

In 3 separate terminals run these commands, which will connect three
peers and allow them to chat on your local network.

`node peer.js your-name localhost:3000 localhost:3001 localhost:3002`

`node peer.js friend1 localhost:3001 localhost:3002 localhost:3000`

`node peer.js friend2 localhost:3002 localhost:3000 localhost:3001`

and then you can start chatting with your imaginary friends. How
fun. Next I'll implement a gossip protocol so that the network doesn't
need to be fully connected, and a node will receive messages as long as
it is connected to a peer who is also connected to the sender.