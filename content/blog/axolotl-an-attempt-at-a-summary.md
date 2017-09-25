---
title: Axolotol, an attempt at a summary
date: 2015-04-22
tags: [encryption, cryptography, privacy, signal, axolotl]
---

After [Zooko](https://www.twitter.com/zooko) introduced me to TextSecure/Signal
a few months ago, I started using Signal for all of my encrypted asynchronous
messaging. The app is terrifically usable, and most of my friends use it, so I
was excited to start using the app. But I wasn't satisfied with just using the
app; I wanted to understand what was going on behind the scenes, so I dove in
and tried to understand as much as I could about the cryptography that powers
millions of people's secure communications.

Along the way, I discovered that a number of people are also interested in
understanding how TextSecure/Signal works --  perhaps so they can implement a
similar protocol themselves, or maybe they prefer to audit the code they install
on their mobile device. It also became clear that a lot of people just didn't
understand it, and rightfully so. It's an advanced protocol that requires a
strong background in cryptography. Inspired by
[this](https://crypto.stackexchange.com/questions/24914/axolotl-ratchet-crypto-protocol-in-plain-english)
StackOverflow post, I thought it might be helpful (for me and potential readers)
to rehash what I've learned about the [Axolotl
protocol](https://github.com/WhisperSystems/TextSecure/wiki/ProtocolV2),
utilized by TextSecure/Signal and WhatsApp, and originally conceived by [Trevor
Perrin](https://github.com/trevp) and [Moxie
Marlinspike](https://github.com/moxie0).

While I'm typically an advocate of RTFM, I think there's value in reading an
alternative explanation of a complex topic like this. That said, if you've tried
understanding the Axolotl protocol before to no avail, this might be a good
start, but please don't stop here. I'll reference a few articles and documents
directly from Open Whisper Systems that I recommend you read (in the following
order) after you finish this piece. There's no substitute from learning from the
people who invented the protocol. Additionally, it's possible that I've made
mistakes in the process of understanding the protocol and conveying it here.

### Recommended Reading

1. [Simplifying OTR
Deniability](https://whispersystems.org/blog/simplifying-otr-deniability/) 2.
[Forward Secrecy for Asynchronous
Messages](https://whispersystems.org/blog/asynchronous-security/) 3. [Advanced
Cryptographic Ratcheting](https://whispersystems.org/blog/advanced-ratcheting/)
4. [Axolotl Ratchet Specification](https://github.com/trevp/axolotl/wiki)

You might also find [this illustrated
primer](https://www.slideshare.net/ChristineCorbettMora/axolotl-protocol-an-illustrated-primer)
by [Christine Corbett Moran](http://www.christinecorbettmoran.com), the the
Signal lead developer, helpful.

## The Axolotl Ratchet Protocol

The Axolotl ratchet protocol is largely built on [OTR](https://otr.cypherpunks.ca/)'s protocol which, in addition to encrypting your messages, provides the following characteristics:

* Authentication: you can be confident that your conversation partner is who you
* think it is. Deniability: at the conclusion of a conversation, anyone can
* forge messages to make them look like they came from you, which means you can
* deny that messages you send were sent by you. Perfect forward secrecy: if your
* keys are compromised, previously transmitted ciphertext can't be decrypted.

If you're familiar with using PGP for encrypting messages, you might recognize
that while PGP does provide solid end-to-end encryption and authentication of
the other party, it falls short on deniability and perfect forward secrecy. If
you sign a message with your PGP private key, you can't deny that you didn't do
so, unless you also admit that your private key was compromised, in which case
you'd have much more to worry about. Furthermore, if an attacker with access to
previously-transmitted ciphertext gains hold of your private key, she can
decrypt all of your messages. This makes the stakes pretty high for protecting
your private key, and for most users (and even for the technically apt) a
surmountable challenge.

Thankfully OTR addresses some of the failings of PGP, and over the past two
years, the folks at Open Whisper Systems conceived of some impressive
improvements to the OTR protocol, and have implemented them into their apps, and
along the way convinced developers of other end-to-end encryption applications
like WhatsApp to do the same.

## How Axolotl Improves Deniability

### Deniability in OTR

In OTR, Alice and Bob both have a static identity key, denoted in the image
below by A and B. These keys are used repeatedly throughout their conversation
to sign [ephemeral keys](), denoted a and b. As you might already suspect,
ephemeral keys are used only temporarily, and are essential to providing forward
secrecy in OTR. Because Alice and Bob each generate new ephemeral keys every
time they start a new conversation, and then generate a new shared secret using
a Diffie Hellman handshake, if these keys are ever compromised, it will be no
issue because new ephemeral keys will be generated for the next conversation and
shared secret.

<img src="{{ site.url }}/assets/otr-current.png" />

Every message in OTR includes a MAC, which is an identifier that uses Alice and
Bob's shared secret to create a hash of the message. Because Alice and Bob can
verify that the MAC was actually derived from the shared secret, which was
derived from an ephemeral key signed by the other's identity key, they can be
sure that any message they receive came from the other. How do MACs in OTR's
protocol contribute to providing deniability? Recall that the MAC keys are
derived from the shared secret, which means that *both* Alice and Bob can
produce the same MAC! Furthermore, OTR continuously dumps old MAC keys in the
clear, so theoretically, an observer could use those to publish outdated, but
valid MACs, which can never be reused for new messages.

It's important to note that while Alice can deny that she sent a message because
Bob could have forged ciphertext and a MAC, the pool of plausible deniability is
limited to to Alice and Bob, and we might desire something less complex than
publishing old MACs and only having a deniability pool of 2.

Conveniently, Trevor Perrin and Moxie Marlinspike conceived of an improvement to
OTR's protocol that does just that.

### A New Kind of Deniability

Instead of using [DSA](https://wikipedia.org/wiki/Digital_Signature_Algorithm)
to sign their ephemeral keys with their identity keys, in the Axolotl protocol,
Alice and Bob instead perform three [Diffie-Hellman
handshakes](https://wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) and
establish 3 shared secrets: gaB, gAb, and gab.

<img src="{{ site.url }}/assets/otr-simplified.png" />

Since Alice and Bob exchange *unsigned keys*, anyone can now use either of their
public identity keys to create ephemeral keys that could then be used to create
shared secrets. This means that anyone can forge a transcript, and Alice and Bob
each have improved deniability.

## Maintaining Forward Secrecy in an Asynchronous Messaging Application

When you communicate with someone via an application like iMessage, you expect
that even if you aren't actively using the application, messages will still be
delivered to your inbox and ready to read at your convenience. This delivery
model is asynchronous -- messages are pushed to the sender, even if the sender
isn't expecting the message or actively waiting for its arrival. Mobile users
expect this from messaging applications, unlike OTR, which is used for
synchronous desktop instant-messaging conversations in which both parties are
present. Axolotl needed to come up with a way to deliver this asynchronous
functionality, all the while generating keys, executing handshakes, and
decrypting ciphertext.

This is a challenge, because these operations all involve round-trip
communications between Alice and Bob. For example, to establish a shared secret
in their initial exchange, Alice will say, "Hi Bob, here's an ephemeral key" and
Bob will reply, "Hi Alice, I got your key, here's the next one I'll use!" It's
unreasonable to expect Alice and Bob to both have the application running at the
same time in order to exchange and acknowledge each other's keys.

### Generating Prekeys

Axolotl solves this by generating 100 "prekeys" when a user registers with the
application. These prekeys are a batch of key exchange messages signed with
Alice and Bob's static identity key, just like Alice and Bob would have done
before, except now when Alice wants to send a message to Bob, she need not wait
for his reply! She can request one of his prekeys from the server, use it
generate a shared secret, and then use the shared secret to encrypt her message.
So now when Alice wants to send a message for Bob, she need not wait for his
reply, she can simply sent the message ciphertext along with the ID associated
with the prekey she used to indicate to Bob which she used to generate the
shared secret. Additionally, forward secrecy is still preserved because the
client will never send or accept the same prekey twice.

The importance of this feature should not be underestimated. Other messaging
apps also provide forward secrecy, but they weren't able to do so
asynchronously, thus thwarting meaningful progress in the world of end-to-end
encrypted communications.

That's all for now. I hope this is heplful, and remember to read the original
articles linked above. They're clear and quite understandable if you take your
time and do the necessary research when you encounter an unfamiliar concept. If
you notice any errors here, feel free to [send a
note](http://taravancil.github.io/contact).

Next time I'll talk about ratcheting, and how Axolotl makes some major
improvements on that front.

*[RTFM]: reading the fucking manual [OTR]: Off-the-Record Messaging [PGP]:
*Pretty Good Privacy [MAC]: message authentication code
