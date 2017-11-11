---
title: How Merkle trees enable the decentralized Web
date: 2017-05-31
tags: [decentralization, data structures, computer science]
---

Earlier this month, I spoke at [bangbangcon](http://bangbangcon.com/speakers.html#tara-vancil) about how Merkle trees are the backbone of nearly all decentralized technologies. Here is a summary of my presentation:

## The Web is centralized, but why?

There are two powerful centralizing forces that affect how the Web works today:

1. The server problem
2. Host-based addressing

We'll address them in turn.

### 1. The server problem

If you want to host files on the Web, you need a server. But running your
own server is both expensive and burdensome, so most people don't run their
own servers. They choose the more practical option: uploading content to a
service dedicated to providing reliable and affordable hosting.

Sure, these services are cheap and convenient, but since the barrier to entry
for self-hosting content is so high, a lot of content ends up being concentrated on the infrastructure of a handful of hosting providers.

### 2. Host-based addressing

The Web currently uses a host-based addressing model to provide unique names
for pieces on content, and it's imperfect at best. Consider a situation where
I've uploaded a video to YouTube. The URL for my video is tightly bound to the
`youtube.com` origin. And if I ever decide to move my video to another hosting
provider like Vimeo, I'll need to get an entirely new URL.

Because addresses for content are bound to where they're hosted, there's a lot
of friction involved in exercising choice between hosting providers. So in the above example, even if I decide Vimeo is a superior hosting platform, I may
choose to continue hosting my video on YouTube, simply because the burden of
distributing a new URL is too high.

## The solution

### Content addressing: a better way to address content

There's another way to address content that doesn't bind files the servers
where they're hosted — content addressing.

Content addressing is  the process of generating a unique address for a piece
of content based on its value, rather than its location. We can do this with
a hash function.

#### Hash functions

Hash functions are one-way functions that take an input (like a file), and
generate a fixed-length output. So even if your input is a 3GB file, the
result will be compressed to the hash functions output length (often 32
bytes).

It's important to note that a well-designed hash function guarantees with extremely high probability that no two inputs will ever generate the same
output. So this means that a hash digest of a piece of content acts as a unique identifier for that piece of content.

So imagine what it would be like if we used content-addressing instead of
host-based addressing on the Web. Now if I need to move a video from one
hosting provider to another, it's not such a big deal, because the link will
remain the same no matter where it's hosted.

### Peer-to-peer networks: reducing the cost of hosting content

But we still need to address the high cost of hosting content. We can do this
by distributing content across a network of peers who all share the
responsibility of contributing bandwidth and disk space.

While using a peer-to-peer network does help reduce the burden of hosting
files, there's something else that's very important to consider: *trust*.

#### Trust

Participants in a peer-to-peer network are anonymous and untrusted, so it would be irresponsible to download a file from a peer without first verifying
that it's the file you actually asked for, and not something malicious.

This is where Merkle trees come into play.

## Merkle trees

So what is a Merkle tree? It's a binary tree where the nodes store hashes of
data rather than the data itself.

<img src="/images/merkle-tree.jpg"/>

The leaf nodes in a Merkle tree store hashes of data, and parent
nodes are calculated by concatenating their children and then applying the
hash function to that result.

### Root hash

The root node in a Merkle tree is called a root hash, and as we'll see in a
moment, it plays an important role in peer-to-peer systems.

<img src="/images/root-hash.jpg"/>

### Examples

#### Checking for equality

Let's look at an example where we have two datasets, each represented by a
Merkle tree, and we want compare the trees to see if they're equal.

Right away, you can see that the root hashes are different, and maybe you can
see why.

<img src="/images/equality.jpg"/>

If you think about how a Merkle tree is constructed, because each node is dependent on its child's value, any change in the dataset bubbles up all the
way to the root hash. So the only thing you need to consider when comparing two
Merkle trees is the root hash.

This is great! Not only does it reduce the number of comparisons required to
determine inequality, but if we're doing the comparison across a network, then
the only thing you need to send over the network is the root hash (typically
32 bytes in size).

##### How is it useful?

In peer-to-peer protocols, the root hash serves as an address for a set of
files, not much unlike a Web address. If you have the link, you can download
the files that it addresses. And just like on the traditional Web, we need to
apply a similar level of caution to who we trust links from. We don't click
on links in our email from unknown senders, because they could contain malware.

In peer-to-peer protocols, it's important to get the root hash from someone we
trust. In this example, the root hash is `C`. Once we have the root hash, we
can start asking peers on the network to send us the files that correspond to
the root hash `C`.

Once we have all of the data, in this case `1`, `2`, `3`, and `4`, we can
reconstruct the tree in order to confirm that the root hash we calculate is the
same as the root hash we got from someone we trust.

In this example, we see that the two root hashes are the same, so we know with
100% certainty that the chunks of data haven't been accidentally corrupted or
intentionally tampered with. Because if they were, we would have calculated
an entirely different root hash.

<img src="/images/verification.jpg"/>

##### But wait...

If the root hash allows us to efficiently compare two datasets, why even bother
constructing a tree? Couldn't we just concatenate all the chunks of data then
apply the hash function that result? That *could* fulfill the same purpose, but
it turns out there's some extra utility afforded by constructing a tree.

#### Partial verification

In the last example, we needed to download all of the chunks of data before we
were able to do any verification over it. But what if we only want one file
from a dataset? Wouldn't it be convenient if we could verify data *as we
receive it*?

We can do exactly that. In this example, again, we'll get a root hash from a
trusted peer, and start asking peers on the network to send us the data that it
addresses.

<img src="/images/partial-verification1.jpg"/>

Once we get the first piece of data, we need to verify its integrity. Let's ask
ourselves: if we have the root hash and one chunk of data, what other
information do we need in order to verify the integrity?

It turns out it's not very much data at all!

We have `4`, so we can calculate the `h(4)`:

<img src="/images/partial-verification2.jpg"/>

We'll need `h(3)` so that we can determine `B`:

<img src="/images/partial-verification3.jpg"/>

And finally we need `A`, so that we can calculate the root hash `C`:

<img src="/images/partial-verification4.jpg"/>
<img src="/images/partial-verification5.jpg"/>

Once we have that data, we know with 100% certainty that `4` does indeed belong
in this dataset.

It's important to notice that the only thing that needed to be sent from a
trusted party was the root hash. The data **and** the proof required to verify
the data all came from an untrusted peer, which is a critical part of making
it possible to distribute the cost of contributing bandwidth across a network
of peers.


## Conclusion

Merkle trees are used in dozens of projects, and actually have some other cool
properties that I'll save for another time. But they're of critical importance
for decentralized and peer-to-peer technologies. Addressing content with a root hash provides consistent links that stay the same no matter where content is hosted, and being able to efficiently verify data makes across a network makes it possible to distribute the responsibility of contributing bandwidth
and disk space.

In summary, Merkle trees enable a Web built on small contributions of many rather than the concentrated resources of a few.
