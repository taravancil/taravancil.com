---
title: Google Password Alert
date: 2015-05-02
---

A few days ago, Google released an extension, [Password
Alert](https://github.com/google/password-alert), that aims to protect users
from entering their Google password on phishing sites. It alerts a user anytime
they enter a Google password on any site other than accounts.google.com.

## How It Works

When a user installs Password Alert, a 37-bit, salted, SHA-1 hash of their
password is stored in the extension's `localStorage` and compared against hashes
of the user's keystrokes when they type into a form on a web page. While the
extension can monitor and modify the content of websites in their browser, those
sites cannot access the code or data that belongs to the extension. This means
that the hashed password stored in Password Alert's `localStorage` is out of
reach to any sites that the user visits. This is thanks to a Chrome security
feature that isolates each extension's program heaps from web pages running in
the browser, and is appropriately referred to as the ["isolated worlds"
mechanism](https://www.usenix.org/system/files/conference/usenixsecurity12/sec12-final177_0.pdf).
(P.S., if you're a Chrome extension developer, or interested in becoming one, I
highly recommend checking out the previous link.)

When a user visits a phishing site and they type in their password, the Password
Alert extension goes to work, and if it recognizes their Google password, opens
a popup alert that warns them about the attack and encourages them to reset
their password.

## Bypass #1

The popup alert was easily bypassed by researcher [Paul
Moore](https://ramblingrant.co.uk/) in just over a day. In the first release of
the extension, the alert was injected onto the malicious page as a node with
`id="warning_banner"` and could easily be removed if the attacker who wrote the
phishing page included the following snippet of code on the page.

{% highlight javascript %} setInterval(function() {
if(document.getElementById("warning_banner")) {
document.getElementById("warning_banner").remove(); } }, 5); {% endhighlight %}

Easy peasy, huh? You can see it here action
[here](https://www.youtube.com/watch?v=HwEGYwCgqtk).

### A Game of Cat and Mouse

Google fully expected these sorts of things to happen, as detailed in the
project's [Github
page](https://github.com/google/password-alert/blob/master/SECURITY.md). The
developers described the dance between attacker's evasion tools and Google's
response as a game of cat and mouse, and one that they will play as attacks
emerge and evolve. Furthermore, these sorts of evasion attacks were not included
under the scope of their bug bounty program for the extension, because they
fully expect evasions to happen, and they don't expose any sensitive data.

If it seems like Google is being recklessly blase, you should recognize that
bypassing the alert, or conducting other similar evasion strategies does not
threaten the user's security or put their password at risk. If an attacker 1) is
aware of the Password Alert extension and 2) preemptively includes one of these
attacks in the page, sure, then a user is at risk of accidentally exposing their
password to an attacker, but not at the fault of the extension leaking it.

### Patching Bypass #1

[Drew Hintz](https://github.com/adhintz), one of the developers on the project,
quickly submitted a patch that should prevent the phishing site from bypassing
the alert. By opening the alert in a new tab, instead of injecting it into the
malicious page's HTML, the attacker's no longer can prevent the alert from
popping up, because the tab executes in its own origin, which the phishing site
does not have access to.

[Other proposed solutions](https://github.com/google/password-alert/issues/22)
include randomly assigning the alert banner's `id` so that the attacker wouldn't
know which node to remove from their page, but I think that could be routed
around quite trivially too.

If the extension were to use an exposed set of `id`s, then the attacker can
simply include that entire list in the script. Alternatively, the extension
could randomly construct the `id` from several sets of strings, thus making it
even more difficult to know what the `id` of the alert node will be, but this is
all probably too complicated. Opening the alert in a new tab is much easier, and
more secure, since the malicious site simply can't access the new tab's DOM.

## Bypass #2

The second bypass is a little bit more sophisticated, in that on each keystroke,
the malicious page repeatedly refreshes the page, changing the value of
`window.location.href`. If this happens fast enough (i.e. the user types
rapidly), Password Alert's event handlers within respond as if it's detecting a
password on an entirely new page, thus reading a password like "pass123" as "p"
then "a", "s", and so forth, and never triggering the alert.

### Fixing Bypass #2

After about 24 hours since it was reported, it looks like the developers are
still working on a patch for this one, but they're moving swiftly.

Hop on over to the project's [Github
page](https://github.com/google/password-alert) if you have any suggestions or
want to submit a pull request.

## Using Password Alert in the Meantime

If you plan on using Password Alert, know that since it's brand new, it's under
a lot of scrutiny right now, and there's still an unpatched bypass. This doesn't
mean that your password is being leaked by the extension, but it does mean that
if you visit a phishing site and the attacker has implemented this attack, it
might not work as you'd hope. You're probably better off practicing caution by
manually checking the URL of a site before typing a password into any of its
forms.
