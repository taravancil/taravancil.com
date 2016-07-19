---
title: Learning Rust
date: 2016-06-03
categories: [technology]
tags: [rust]
---

Lately I've been spending my time learning and
[practicing](https://github.com/taravancil/advent) Rust, in part because I want
to learn more about systems programming, but also because I'm interested in
financial cryptography, and I suspect that when Rust is mature enough, many
blockchain, Bitcoin, Ethereum, etc. applications will be built in Rust.

From the outset, I knew that learning systems programming was going to be a huge undertaking - I learned to program by writing JavaScript, so memory management and type systems have been hidden behind a smoke screen.

I chose Rust because my read of the systems programming landscape is that C and C++ are a necessary evil, that even in robust projects like Chromium (a C++ project), use-after-frees and buffer overflows still happen and with major consequences. I've also heard several people whose opinions I trust recommend Rust for systems programming newbies.

## What I've Done So Far

* Read the [Rust book](https://), a guided journey into the language, ripe with examples.
* Read a bunch of the API docs
* Written solutions to some of the challenges on [adventofcode.com](http://adventofcode.com)
* Started working through [intermezzOS](intermezzos.github.io) an interactive book written by Steve Klabnik, wherein as a reader, you implement an operating system in Rust.

## How It's Going

Splendidly! There's so much more to learn, but I'm enjoying the process. More than any other software community I've observed, the Rust community exhibits kindness and helpfulness which has made it really easy to jump in, start poking around, and ask questions when I need help.

### Things That Recently Clicked

#### Iterators

When I first started writing Rust, my brain was accustomed to writing for loops in Python, Go, and JavaScript like this:

```javascript
let sum = 0
let nums = [0,1, 2, 3]
for (let i = 0; i < nums.length; i++) {
    sums += nums[i]
}
```

So much so, that even after reading the documentation and several examples, I did not understand `fold`, `filter`, and `map` iterator functions worked and certainly couldn't piece together *when* I should use them.

I was writing a lot of C-style loops instead of writing one-line like this:

```rust
let nums = [0, 1, 2, 3];

let sum = nums.iter().fold(0, |sum, x|, sum + x);
```

But after doing some exercises on [exercism](https://exercism.io) and seeing how other people were using iterators, it finally clicked, and I feel like I have a handle on most of Rust's iterator methods.

#### Borrowing

Well, sort of. Like the Rust book warns, the concept of borrowing is notoriously tricky to grasp, but it's also a foundational component of the language that's important to understand backwards, forwards, and inside-out.

At the beginning I felt like I was banging my head against the wall trying to understand compiler errors about borrowing, but I feel like I for the most part can tackle them when they come up, and about half of the time I feel like I *actually* understand why the compiler won't let me borrow something and whether I should try to own the binding or use a reference instead.

I still need to read and practice more.

### Things I'm Struggling With

#### Lifetimes

I don't understand lifetimes. Not even a little bit. Whenever the compiler tells me that `foo doesn't live long enough`, I can usually bumble my way to finding a solution, but not because I understand what I'm doing.

If you can point me to something, anything that you think explains lifetimes well, [hit me up](https://twitter.com/tbvancil).

#### `Result`s and `Option`s

While I grok what a `Result` and an `Option` and their applications, I've been lazy about using them. In situations I know I should return a `Result` I haven't been, and when I do I've been using `unwrap()` because it's easy and I control the data.

I think this approach is not wise. I'm practicing writing code in a form that is totally not shippable, which seems like I'm doing myself a disservice.

## Next Steps

I've written a fair amount of [code](https://github.com/taravancil/advent) for the [adventofcode.com](http://adventofcode.com) challenges, but it's ugly in some places. I'm not doing any more challenges until I fix up the ones I've completed by using `Option`s and `Result`s where appropriate and finding other ways to make it more idiomatic.

I plan to read the borrowing section of the Rust book again, and as much other content about borrowing I can get my hands on.
