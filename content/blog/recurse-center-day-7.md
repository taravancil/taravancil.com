---
title: "Recurse Center Day 7: I Moved Fast and Broke Things"
date: 2016-10-04
tags: [recurse center]
---

Today I moved fast and broke things -- this site to be specific -- but it's all
OK because I know what went wrong and (I think) I know how to fix it!

Here's the short story: I currently host this site on Amazon
EC2, but since it's just a static site, it's hard
to justify the cost of EC2, especially since there are much cheaper options
that still allow me to manage my TLS certificates (which is a
non-negotiable requirement for me). While I thoroughly enjoyed
running my own server and [tweaking my Nginx
configuration](https://www.ssllabs.com/ssltest/analyze.html?d=taravancil.com&latest),
to be juuuust right, there are cheaper options that are better suited
for my needs.

My new plan is to host this site's files on Amazon S3, and set up a
CloudFront distribution that points to my S3 bucket, and upload a
Let's Encrypt certificate to AWS' certificate management system. It
seems like not much could go wrong right? Wrong. So many things went
wrong, but I had a lot of fun troubleshooting and I learned *a lot*
about A records and CNAMEs and DNS caching a whole host of other
things yesterday.

I also spent some time rewriting [my cryptopals solutions in
Python](https://github.com/taravancil/cryptopals/blob/master/python/challenges.py)
and I'm much happier with the quality of my code compared to the
solutions I wrote over a year ago. I also learned about Moore's voting algorithm
and [implemented it in
Python](https://gist.github.com/taravancil/1a2e54e2e1d8ec59285d99938dbed65d)
and read more of [The TCP/IP guide](http://tcpipguide.com). Despite
bringing down my site, it was a very productive day and I'm content
with what I learned.
