---
title: "Recurse Center Day 8: Hamming Weight: I Am So Confused"
date: 2016-10-05
tags: [recurse center, cryptography, python]
---

I'm reimplementing [my cryptopals
solutions](https://github.com/taravancil/cryptopals/tree/master/python)
in Python, and today I worked a challenge that required me to
calculate the Hamming distance between two equal-length
strings. Hamming distance is a measure of difference - it indicates
how many corresponding characters in the input strings are
different. For example, the Hamming distance between `TARA` and
`TART` is 1. Well, that's not entirely true. More often it's more
relevant to determine the specific number of differing *bits*.
As you can see below, in this case, the strings differ by 3 bits.

| ASCII | Binary   |
| ----- | -------- |
| A     | 01000001 |
| T     | 01010100 |

## Calculating Hamming Distance

Given two bytes, we can calculate their Hamming distance in two steps:

1. XOR (exclusive or) the bytes
2. Determine the Hamming weight of the XORed bytes


### XOR the Bytes
Remember that Hamming distance is a measure of how many bits differ
between two equal-length strings. XOR is relevant because when
XORing two bytes, by the nature of the exclusive or operation, the
only time a `1` bit will appear in the resulting byte is when the two
input bits are different, and that's exactly what we're trying to
determine here!

So for the above example: `01000001 ⨁ 01010100 = 00010101`

Now all we need to do is count the number of occurrences of `1` in
the resulting bit string.

### Enter Hamming Weight

Hamming weight is formally defined as the count of the
symbols in a string different than the zero-symbol of the given alphabet,
Hamming weight is especially useful for evaluating bit strings, which
are represented by an alphabet with two symbols, `0` and `1`. So to
find the Hamming weight of a bit string is to simply count the number
of `1`s in the string.

#### I Am So Confused

While I was able to implement [a function for calculating the Hamming
weight of a given
byte](https://github.com/taravancil/cryptopals/blob/master/python/utils.py#L120)
, despite several attempts to understand how and why it works, I still
don't and I am very confused. I think the main issue is that I don't
entirely understand bitwise operations so I need to focus on
addressing that before I delve into understanding Hamming
weight implementations. If you know of any good resources for learning
and practicing bitwise operations, will you [tweet them at
me](https://twitter.com/taravancil) please and thank you?