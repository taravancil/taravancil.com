---
title: Cryptography in the Browser
date: 2015-04-22
---

Yesterday I spoke at [AustinJS](http://austinjavascript.com) about in-browser
cryptography, and the future of cryptographic protocols being executed by
JavaScript. I addressed some of the challenges of cryptography running in the
browser and how we might tackle them in the future. I'd like to expand on some
of the topics I discussed, and a few others I didn't have time to address.

## Current Tools Are Not Usable

If you use GPG to encrypt email, whether you use it on the command line, with
[GPGTools](https://gpgtools.org/), or an extension like
[Enigmail](https://www.enigmail.net/home/index.php), you understand that it can
be inconvenient to use, and leaves something to desire -- consider features
we're accustomed to in modern mail clients -- quickly reading messages, cc/ing
recipients, and searching message bodies. These are all basic functionalities
that users expect when sending and receiving unencrypted mail, but when using
something like GPG, those features are non-trivial, and in some cases, seemingly
infeasible, to implement. Though I'm fairly technically competent, and so are
most of the people with whom I communicate using GPG, I've encountered countless
hangups when trying to use it for encrypted mail: the sender includes extra
characters or line breaks that corrupt the message, someone sends their public
key rather than the encrypted message block, or you can't establish a secure
channel for verifying key fingerprints. The truth is, using GPG is at best, an
inconvenience for the few that can maneuver their way around the GPG ecosystem,
and impossible for most. This is fine; GPG has important use cases, like signing
software releases, encrypting files on your computer, or communicating with
whistleblowers like Edward Snowden, but it's just plain unreasonable to expect
untrained users to utilize current implementations.

## Concerns About Cryptography in the Browser

For those of us who care about providing safe and secure products at a large
scale, even for users who don't actively prioritize security (yes, I know some
people don't care about this; leave those of us who do alone), this is an area
ripe for improvement. We understand that we need to look to delivery platforms
outside of operating systems to deliver secure products, and we also recognize
that browsers are not the security black hole they were [once purported to
be](https://matasano.com/articles/javascript-cryptography/), but rather an open
opportunity for reaching millions of users.

In his talk, ["Appsec is Eating Security"](https://youtu.be/-1kZMn1RueI?t=2371),
Yahoo's CISO Alex Stamos suggests that we need to accept that the browser is the
new OS. He's not actually suggesting that the browser is replacing the role of
operating systems or native code, but he does communicate that it's a mistake to
discount the browser as a viable execution environment for cryptographic tools.
Why? Not only are browsers ubiquitous, but there are several features and
standards, either newly implemented or in the pipeline, that are poised to make
the browser a much more secure execution environment than it's ever been before.

But prior concerns about in-browser cryptography are not unwarranted, and are
important for understanding the threat model of running cryptographic
applications in the browser, so let's talk about them and address how we might
address them.

### Delivering Verified Code

One oft cited concern has to do with how code is delivered via the web: a user
visits a URL, the client connects to the server, and if all goes well, the
server returns the resource at that designated URL. But we've learned that we
can't count on things to go well. Not only is the metaphorical space between the
client and server ripe with opportunities for MITM attacks, but it's also
possible for the server to be compromised, and to deliver malicious scripts. For
example, while `www.cdn.com/somelibrary.js` may have at one point linked to a
legitimate copy of a library you need, if the server delivering that is ever
compromised, `www.cdn.com/somelibary.js` may actually deliver something more
malicous than you would expect. Enter subresource integrity.

#### Subresource Integrity

[Subresource integrity](http://www.w3.org/TR/SRI/) is a working draft of a
concept outlined by the W3C [Web Application Security Working
Group](http://www.w3.org/2011/webappsec/) that will allow a user agent(UA) to
verify that a resource it fetches has not been unexpectedly manipulated. While
properly implemented TLS, [HSTS](http://tools.ietf.org/html/rfc6797), and
[pinned public keys](http://tools.ietf.org/html/draft-ietf-websec-key-pinning)
can, with a fair level of confidence, authenticate the server, it doesn't
actually authenticate the content that the server delivers. An active attacker,
either external or internal could change the content of the resource that's
being delivered. This is especially problematic for companies whose value
proposition is delivering third-party JavaScript. I think back to [Rebecca
Murphey](http://rmurphey.com)'s [talk](http://rmurphey.com/wtf3pjs/#/) at Austin
JavaScript, where she recounted the process by which she and the security team
at [Bazaarvoice](http://www.bazaarvoice.com/) held a meeting to imagine all of
the possible ways Rebecca, as a senior software engineer with a lot of access to
a lot of code, could do serious damage to Bazaarvoice's clients. If she were to
go rogue and decide to replace their code, which normally provides ecommerce
websites the ability to collect ratings and reviews, with a malicious script,
this could potentially harm billions of people. This is a serious concern. And
while those who know Rebecca might not be worried about her doing something like
this, counting on someone's good will doesn't provide the level of validation we
hope for on the Internet. We should aim to come up with systems that provide
actual confirmation that the scripts delivered to us are verified to be the
scripts we expect. The proposed standards for subresource integrity can help us
do that.

##### The Integrity Attribute The subresource integrity standard introduces an
##### `integrity` attribute for `<script>` elements which holds a cryptographic
##### hash of the resource the UA expects to load.

###### Example

{% highlight html %} <script src="https://cdn.lib.js"
integrity="sha256-Sl0s0ljfwaef0...sjf9piWEjlafw"> </script> {% endhighlight %}

In this case the author specifies both the hash function (in this case,
[SHA-256](http://www.w3.org/TR/SRI/#dfn-sha-2) and the expected digest of the
valid resource. How would this work in practice? A developer would identify a
resource they need for a project, visit the resource itself, confirm to the best
of their ability that it's not malicious, and use something like OpenSSL to
create a digest of the resource, and then assign the algorithm they used and the
digest they calculated to the `integrity` attribute.

Wonderful! Now if Rebecca is bought out by some corrupt agency and convinced to
change `bazaarvoiceserver.com/bv.js` to a malicious script, the UA will be
alerted rather than just naively executing the code.

So what should happen when a UA downloads a resource that's flagged as
potentially corrupt? Should it be prevented from downloading entirely? Should it
simply flag the corruption, and alert the author? This still hasn't been
decided, but it is clear that there needs to be some sort of reporting
mechanism. The Webapp Security working group has proposed a flexible model
defined by the `integrity-policy` directive, which will allow a developer to
specify what their application should do in the case of integerity failure -- in
blocking mode, it would both block execution of the resource and report the
failure, in reporting mode, as you might expect, it will only report it.

All in all, subresource integrity is a welcome improvement.

### Securing a Proper Sandbox for Execution

It's probably a bad idea to try to build something like an encrypted messaging
system that would be delivered via a URL. In comparison to a Chrome extension
with a properly-configured Content Security Policy, a regular 'ol web page is
far more vulnerable to things like XSS and key storage compromise which could be
devestating to the application.

Both extensions and Chrome apps go to great lengths to isolate the application's
execution environment from other web pages and extensions/apps, and this
isolation is the crux of building in-browser cryptographic tools we can rely on.

#### Case Study

Consider Google's [end-to-end extension](https://github.com/google/end-to-end)
which aims to provide users the ability to easily use OpenPGP to encrypt and
decrypt their email in the browser. The user's private key is stored in
`localStorage`, and while it's recommended the users encrypt their private key
with a strong passphrase, it's entirely optional, so if the extension is not
sufficiently isolated from other web pages or extensions, then the user's
private key is not secure.

As you can see, the importance of executing within a sandboxed environment
should not be understated.

#### Does The WebCrypto API Address This?

In short, no. While the [WebCrypto API](http://www.w3.org/TR/WebCryptoAPI/)
provides objects like the `SubtleCrypto` object with methods for dealing with
low-level cryptographic primitives, and the `CryptoKey` object for referencing
keying material, it doesn't actually provide any new protocols or
recommendations for storing keys. The choice, and thus great responsibility, is
left to the developer.

### Cryptography is Hard

I consider myself a cryptography and security noob, and in all of the literature
and blogs I've studied, the message that cryptography is hard has been trumpeted
loudly and often. I heed this warning with reverence for the work of those who
have studied this subject for years, and respect for users, and I suspect that
if other developers do the same, we can work toward building cryptographic tools
that are safe to use in-browser. Surely, it will be difficult. We will probably
mess up. But that's part of the process. It would be a shame to miss out on an
opportunity to reach millions of users if we don't try.

Check out some folks who are stepping up to the challenge:

* Google's [end-to-end extension](https://github.com/google/end-to-end) Yahoo's
* [fork](https://github.com/yahoo/end-to-end) of end-to-end Open Whisper Systems
* [Signal extension](https://github.com/WhisperSystems/TextSecure-browser)

*[GPG]: Gnu Privacy Guard [CISO]: Chief Information Security Officer [TLS]:
*transport layer security [HSTS]: HTTP strict transport security [UA]: user
*agent [XSS]: cross-site scripting
