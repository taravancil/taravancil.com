---
title: Web Security Specifications You Should Know About
date: 2015-09-04
tags: [security, privacy, xss, csp]
categories: [technology]
---

The [W3C WebAppSec working group](https://github.com/w3c/WebAppSec) is tasked
with developing web standards to tackle some of the most persistest threats on
the web. Whole categories of attacks, like cross-site scripting (XSS), are
largely understood and preventable, yet tragically few web pages implement
proper defenses. This suggests there is an opportunity to build better tools
that enable developers to practice better web security, and the WebAppSec WG has
worked hard to do exactly that.

What follows is a summary of important specifications recently devised by the
WebAppSec WG. Some are available cross-platform while others are in the most
nascent stages.

#### Features You Can Implement Today
* [Content Security Policy](#content-security-policy)
* [Mixed Content](#mixed-content)
* [Upgrade Insecure Requests](#upgrade-insecure-requests)
* [Subresource Integrity]({{ post.permalink }}#subresource-integrity)

#### Not Yet Available
* [Content Security Policy Pinning](#content-security-policy-pinning)
* [Referrer Policy](#referrer-policy)
* [Entry Point Regulation](#entry-point-regulation)
* [Clear Site Data](#clear-site-data)

Some concepts and terms to be familiar with before moving forward:

origin
:   A representation of a URI that includes its scheme (`http://`, `https://`, `mailto:`, `ftp://`, etc.), host, and port. For example, `https://google.com:443` represents a unique origin, although the port is often omitted and implied by the scheme.

a priori insecure origin
:   An origin is a priori insecure if its scheme is not `https://` or `wss://`.

defense-in-depth
:   An approach to security that relies on layered defenses in order to maintain integrity in the face of a vulnerability or failure at any one layer.

man in the middle (MITM)
:   An attack in which an attacker observes and possibly modifies communications between two parties.

<h2 id="content-security-policy">Content Security Policy Level 2</h2>
Status: Established Standard [http://www.w3.org/TR/CSP/](http://www.w3.org/TR/CSP/)

<div class="status">
  <ul>
    <li class="available">Chrome<span class="hidden">Available</span></li>
    <li class="available">Firefox<span class="hidden">Available</span></li>
    <li class="available">Edge<span class="hidden">Available</span></li>
    <li class="unavailable">Safari*<span class="hidden">Unavailable</span></li>
  </ul>
  <a href="https://www.chromestatus.com/feature/4957003285790720">Details</a>
  <span>* Content Security Policy Level 1 offers many of the same features and is available in Safari.</span>
</div>

### Goal

Provide a tool to mitigate broad classes of content injection vulnerabilites.

### Background

Every web page is prepared to process different types of content, like user
input from forms and comments and scripts and images from known content
providers. On the other hand, unexpected content can be dangerous and comes in
many forms: unrecognized scripts, user input with forbidden characters,
unexpected plugins, etc. While every site's expectations are different, the
common goal is to prevent unwanted execution of code, both client-side and
server-side.

There are ways to mitigate these types of vulnerabilities, including sanitizing
input and encoding output, properly auditing file upload functionality, and
avoiding JavaScript's `innerHTML` and `eval()`, but history indicates that
implementing these defenses correctly and comprehensively is challenging for
many site administrators, and just one mistake can lead to total compromise.

### How It Works

CSP provides fine-grained control to specify what content is allowed on a given
page. A CSP is delivered either by a `Content-Security-Policy` HTTP header or a
`<meta http-equiv="Content-Security-Policy">` element.

#### CSP Directives

A policy consists of a number of directives that detail a rule for a specific
type of content. The directives for CSP Level 2 include:

##### `base-uri`

  * Restricts the URLs that can be set as the document's `base-url`
  * Mitigates attacks in which something like `<base href="https://attacker.com">` is injected before the real `<base>` element, which would allow the attacker to control the resources that are loaded with reference to the base URL.

##### `child-src`

  * Determines what types of browsing contexts (iframes, etc) and workers can be created.

##### `connect-src`

  *  Determines which URLs the page can create connections with, say via WebSockets,or `XHR`'s `send()` method.

##### `default-src`

  * Sets a default policy for a bunch of directives (`child-src`, `connect-src`, `font-src`, `img-src`, `manifest-src`, `media-src`, `object-src`, `script-src`, `script-src`, `style-src`).
  * If any of the above-listed directives are not specified in a page's CSP, the `default-src` value will be used.

##### `font-src`

  * Restricts from where fonts can be loaded.

##### `form-action`

  * Restricts the URLs that can be used in `<form>` action attributes
  * Defends against an attacker injecting a form within another user's page (by exploiting an XSS vulnerability, perhaps within an instant messaging or comments feature), eventually leading the user to unwittingly submit information to the attacker.

##### `frame-ancestors`

  * Dictates whether the document can be embedded into other documents as a `<frame>`, `<iframe>`, `<object>`, `<embed>`, or `<applet>`.
  * Can prevent some [UI redressing attacks](https://www.owasp.org/index.php/Clickjacking) in which an attacker embeds the target page into a malicious page, tricking the user into clicking on hidden buttons or elements.

##### `img-src`

  * Restricts from where images can be loaded.
  * `<img>` is fertile ground for XSS attacks. One common technique involves an attacker successfully embedding something like this `<img src="x" onerror="alert(pwned)">` into a page. The example is contrived, and most real-world attacks involve far more clever techniques in order to bypass filters, but it's a fact that images, especially those delivered via insecure ad networks, are an attack vector to pay attention to.

##### `manifest-src`

  * Restricts which [manifest](https://w3c.github.io/manifest/) file can be applied to the document.

##### `media-src`

  * Restricts from where the document can load video, audio, and text tracks.

##### `object-src`

  * Restricts from where a plugin can be loaded.

##### `plugin-types`

  * Restricts the types of plugins that can be run on the document.
  * Accepts a list of `media-types` (see [RFC 2045](https://www.ietf.org/rfc/rfc2045.txt)).
  * Example: `Content-Security-Policy: plugin-types application/pdf application/x-shockwave-flash` only allows pdf and shockwave flash plugins.

##### `reflected-xss`

  * Specifies if/how a User Agent (UA) should apply its reflected XSS filters.
  * directive-value = "allow" / "block" / "filter"
  * `allow` disables the filter, `filter` enables the filter, and `block` stops the rendering of the protected document, returns a network error, and reports a violation when a reflected script is detected.

##### `report-uri`

  * Specifies the URL to which report violations are sent
  * Used in `report-only` mode

##### `sandbox`

  * Parallels the HTML5 `sandbox` attribute for `<iframe>`s, which limits the behavior of an `<iframe>` by preventing form submission, script execution, and more.
  * Allows for *any* document to be sandboxed. This could be an uploaded file, a user-created page, etc.
  * These flags loosen the `sandbox` directive`s restrictions:

    * `allow-forms` allows the resource to submit forms
    * `allow-pointer-lock` allows the resource access information about how the cursor moves over time
    * `allow-popups` allows the resource to create new browsing contexts (e.g. with `window.open()`)
    * `allow-same-origin` allows the resource to execute same-origin communications while still restricting execution of scripts, popups, etc.
    * `allow-scripts` allows the resource to execute script

##### `script-src`

  * Restricts which `<scripts>` the resource can execute
  * The default CSP restricts inline scripts. It is possible to specify `unsafe-inline` as part of the `script-src` directive value, but don`t do that! There's no way for a UA to distinguish between expected inline script and malicious injected inline script.
  * Likewise, `eval()` is banned by default. It is possible to specify 'unsafe-eval' but try not to do that! If you use `eval()`, try to phase it out.

##### `style-src`

  * Restricts which stylesheets can be applied to the document
  * Mitigates CSS attacks involving malicious `@imports` and SVG files.
  * It is possible to specify `unsafe-inline` to allow inline `<style>`, but again, try not to do that. This doesn't affect styles loaded with `<link>`. Those are allowed.
  * It is possible to  specify `unsafe-eval`, but you know the drill. Try to avoid it.

#### Implementation

##### Report-Only Mode

If implemented incorrectly, CSP can make a mess of things by blocking vital
content and rendering a site unusable. It's wise to first implement a CSP in
report-only mode, monitor violations, and figure out how the policy needs to be
adjusted.

Report-only mode enacts the policy in a pseudo-fashion, enforcing it on all
requests, but never actually blocking content. The report-only policy uses the
same syntax described above and is delivered via the
`Content-Security-Policy-Report-Only` header. Report-only mode also requires a
`report-uri` directive where violations of policy are sent.

##### Examples

A well-implemented CSP follows a basic security principle: whitelists are more
effective than blacklists. Try to imagine listing *all* of the content you wish
to ban on your site. It's impossible! Blocking everything and then whitelisting
acceptable resources, however, is much more realistic.

Applying this principle to CSP works quite well.

Let's start out with a base policy that prohibits all scripts, fonts, styles,
images, and more. Recall that the `default-src` directive applies sets a
fallback policy for a whole bunch of other directives.

``` nginx
Content-Security-Policy: default-src 'none'
```

To build a more realistic policy, iterate on this by whitelisting all of the
acceptable resources and content for the page. It's possible to be highly
specific by listing specific URLs or to be broad by using a glob pattern.

``` nginx
Content-Security-Policy:
    default-src 'none';
    img-src *.example.com;
    script-src https://code.jquery.com 'self';
    font-src *
```

This policy first blocks all content, then whitelists images from any subdomain
on `example.com` and the page's origin, allows scripts from
`https://code.jquery.com` and the page's origin, then allows fonts from any
origin.

##### Nonces and Hashes

By default, CSP prohibits inline `<script>` and `<style>`. Specifying
`unsafe-inline` in `script-src` or `style-src` is unwise because there is no way
for the UA to distinguish between innocent script and attacker-injected inline
script.

CSP introduces the `hash` and `nonce` attributes to allow developers to indicate
which inline `<script>` and `<style>` elements were included intentionally.

###### Nonces

To whitelist an inline `<script>` or `<style>`, on each request the server
should generate a random nonce and include it in the CSP header like so:

``` nginx
Content-Security-Policy:
    script-src 'self' https://example.com 'nonce-SomeRandomValueHere'
```

The nonce can then be included in the `nonce` attribute on all inline `<script>`
elements. Because an attacker cannot guess the nonce, no injected `<script>` or
`<style>` will be executed because it won't include a valid `nonce` attribute.

###### Hashes

If a base64-encoded value of a hash digest for a `<script>` or `<style>` is
listed in the CSP header, when the UA encounters inline code, it will calculate
its hash. If the hash matches the value listed in the CSP header, it will
execute.

``` nginx
Content-Security-Policy:
    style-src 'self' 'sha256-base64EncodedHash'
```

####  Content Security Policy as a Defense-In-Depth Measure

Content Security Policy's versatility and flexibility makes it one of the most
powerful web security tools available today, but it is only one piece of a
defense-in-depth approach. It is not a panacea!

<h2 id="mixed-content">Mixed Content</h2>
Status: Status: Working Draft [http://www.w3.org/TR/mixed-content/](http://www.w3.org/TR/mixed-content/)

<div class="status">
  <ul>
    <li class="available">Chrome<span class="hidden">On By Default</span></li>
    <li class="available">Firefox<span class="hidden">On By Default</span></li>
    <li class="available">Edge<span class="hidden">On By Default</span></li>
    <li class="available">Safari<span class="hidden">On By Default</span></li>
  </ul>
  <a href="https://www.chromestatus.com/features/6263395770695680">Details</a>
</div>

Strict Mixed Content Checking Status

<div class="status">
  <ul>
    <li class="unavailable">Chrome<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Firefox<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Edge<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Safari<span class="hidden">Unavailable</span></li>
  </ul>
  <a href="https://www.chromestatus.com/features/5823679871057920">Details</a>
</div>

### Goal

Define how UAs respond to a secure document fetching content over an insecure
connection.

### Background

Properly implementing HTTPS is vital for preventing MITM attacks. Because
packets are authenticated, the user can be confident they haven't been meddled
with in transit. This assurance goes out the window in an all too common
scenario: a site implements HTTPS, but requests third-party resources over an
insecure connection. This mixed content, because it is delivered via `http://`,
can be readily modified as it travels across the wire, and poses a serious risk
on sites delivered via `https://`, where users expect a secure connection.

But migrating to HTTPS, and doing it the right way, is not without challenges,
especially for large, legacy sites with a substantial amount of third-party
resources. Imagine a large news site with thousands of images loaded by
different CDNs. Simply enumerating all of the site's external resources is a
goliath task; the additional task of ensuring each one is retrieved via a secure
connection would surely be a major roadblock in implementing HTTPS.

Understanding the risks of mixed content, a site like this may want to block all
mixed content `<script>` tags, but fears that blocking `<img>`, `<svg>`, or
`<video>` would make an unacceptable amount of content unavailable. Other
businesses that perform especially sensitive operations, like banks, may wish to
enforce a more strict policy that blocks all mixed content, and realistically
most sites' authors will never think about mixed content.

The question at hand, then, is given the different needs re: mixed content, how
should UAs handle it? What level of control should a developer have in
controlling how mixed content behaves on her site? How should a user be notified
when encountering mixed content?

### How It Works

The WebAppSec working group classifies mixed content in two categories:

  1. Optionally-blockable
  * Content that if blocked, has a high risk of breaking a large part of the web page
  * Includes `<img>`, `<svg>`, `<video>`, `<audio>`, and `<source>`
  2. Blockable
  * Everything that isn't optionally-blockable
  * Poses an especially high risk if MITM'd
  * `<scripts>`, plugins, content loaded via XHR, and more

UAs that adhere to the mixed content specification must block all blockable
content and allow optionally-blockable content (with a caveat). When a user
encounters optionally-blockable mixed content, the UA *must* notify the user by
degrading the security UI.

  <figure>
    <img src="{{ site.url }}/assets/mixed.png" />
    <figcaption>Fig1. Mixed content warnings for popular browsers. In order: Chrome 45, Firefox 40, Chrome Canary, Safari. Note that Canary entirely removes any indication that the site is potentially secure, other browsers will likely follow suit in due time. Read about the motivation for this change <a href="https://www.chromium.org/Home/chromium-security/marking-http-as-non-secure">here</a>.</figcaption>
  </figure>

#### Strict Mixed Content Checking

Strict mixed content checking is available for the cases in which site
administrators wish to block *all* mixed content. Delivered either via the
`block-all-mixed-content` directive in a CSP header or a CSP `<meta>` tag,
strict mixed content checking treats optionally-blockable content as blockable
content.

In addition to blocking potentially dangerous external resources, enabling
strict mixed content checking ensures that the security UI does not degrade when
a user encounters mixed content.

###  Moving Forward

In a perfect world, all resources would be loaded over a secure connection and
mixed content would be a thing of the past. A more realistic vision is that as
more content providers make the switch to HTTPS, the optionally-blockable
categorization will be done away with, and all mixed content will be blocked.
Currently that would render far too much of the web unusable, so there's work to
do!

<h2 id="upgrade-insecure-requests">Upgrade Insecure Requests</h2>
Status: Working Draft [http://www.w3.org/TR/upgrade-insecure-requests/](http://www.w3.org/TR/upgrade-insecure-requests/)

<div class="status">
  <ul>
    <li class="available">Chrome</li>
    <li class="available">Firefox</li>
    <li class="unavailable">Edge</li>
    <li class="unavailable">Safari</li>
  </ul>
  <a href="https://www.chromestatus.com/features/6534575509471232">Details</a>
</div>

### Goal

Make migrating to HTTPS less burdensome by providing a way to automatically
upgrade insecure requests to secure requests.

### Background

Migrating to HTTPS can be difficult for sites with a lot of legacy content.
Manually going through thousands of web pages and rewriting all `<a>`, `<img>`,
`<script>`, etc. to load over a secure connection is a major undertaking and
prone to mistakes and incompleteness.

In order to ease this pain and promote wider HTTPS adoption, there should be a
way for developers to upgrade requests like `<img
src="http://cdn.images.com/image.jpg">` to `<img
src="https://cdn.images.com/image.jpg">` with litte effort.

### How It Works

This specification introduces the `upgrade-insecure-requests` CSP directive. It
can be enabled by delivering the directive in the `Content-Security-Policy`
header. It cannot be implemented with a CSP `<meta>` tag.

#### Uprading Insecure Requests Vs. Mixed Content

UAs upgrade insecure requests before the mixed content header can be processed,
so using both renders mixed content basically useless. Use one or the other
makes sense; using both is probably overkill.

Upgrading secure requests is most useful when a site author is confident that
third-party resources are available via a secure connection, whereas enforcing
strict mixed content blocking may be preferred when there's less confidence in
that regard, but you still need to assure that mixed content does not execute on
the page.

#### Upgrade Insecure Requests and HSTS

There's a close relationship between upgrading insecure requests and HSTS, and
there many different variables that determine whether or not a web server should
respond to a request with an upgrade insecure request policy, an HSTS header,
both, or neither.

The specification lists some carefully thought out
[recommendations](http://www.w3.org/TR/upgrade-insecure-requests/#recommendations)
for several scenarios. It's worth reading if you plan to use this feature.

<h2 id="subresource-integrity">Subresource Integrity (SRI)</h2>
Status: Working Draft [http://www.w3.org/TR/SRI/](http://www.w3.org/TR/SRI/)

<div class="status">
  <ul>
    <li class="available">Chrome</li>
    <li class="available">Firefox</li>
    <li class="unavailable">Edge</li>
    <li class="unavailable">Safari</li>
  </ul>
  <a href="https://www.chromestatus.com/features/6183089948590080">Details</a>
</div>

### Goal

Provide the means to verify the content of a fetched resource.

### Background

Loading resources with TLS authenticates the source of the resource and
guarantees the data is not modified in transit, but it doesn't provide any
guarantee that the resource wasn't meddled with *before* it was delivered.
Whether a resource is unexpectedly modified by an employee with a grudge or a
hacker trying to deliver malware, it would be nice to be able to minimize the
damage caused by these sorts of events.

### How It Works

Subresource Integrity (SRI) introduces the `integrity` attribute for `<script>`
and `<link>` elements, which allows site authors to verify the content of the
resource before it executes in the UA. The `integrity` attribute contains the
base64-encoded digest of the hash over the expected data, which the UA uses to
compare with the calculated hash of the data actually retrieved. If the fetched
resource differs from the expected resource at all, the two hashes will not be
the same and the UA will return a network error for the resource.

#### Implementation

For example, to request jQuery but verify its contents before execution,
calculate the hash of the code for the desired version of jQuery, base64 encode
it, and stick it in the `integrity` attribute like so.

``` html
<script src="https://code.jquery.com/jquery-2.1.4.js"
        integrity="sha256-siFczlgw4jULnUICcdm9gjQPZkw/YPDqhQ9+nAOScE4=
                   sha512-KMPrOyKoxZ63TdrHyYlRKwGX6eWGe98FYB65BWaH9E2GoE9VXY+Mmj3WKWwBTchwj64ZeDlYjEkN3A6uJyKQ==">
```

All UAs that implement SRI support SHA-256, SHA-384, and SHA-512, and may
support others. It is acceptable (wise, even) to list multiple values for the
`integrity` attribute. Motivation for doing so includes:

  1. Graceful fallback in the face of future discoveries
  * It is possible, that like [MD5](https://www.win.tue.nl/hashclash/rogue-ca/), a hash algorithm that's currently considered collision resistant will someday not be safe for use.
  * Given multiple values with different hash algorithms, the spec requires UAs to choose the strongest algorithm. So if SHA-256 is someday considered unviable, and a page lists multiple values, the UA will automatically choose the one with the strongest algorithm.
  2. Accepting multiple resources
  * It may be desirable to accept multiple variations of a resource. In this case, multiple digests with the same hash algorithm can be listed.

##### SRI and TLS

Utilizing SRI on an a priori insecure origin provides effectively zero security
guarantees. A MITM could change or even remove the `integrity` attribute's
original value, allowing the attacker to load any resource, rendering SRI
useless.

##### SRI: Cross-Origin Or Same-Origin Requests?

There are no rules against using the `integrity` attribute on same-origin
requests, but it really only protects against someone hacking into a site's web
server and modifying scripts. If that happens, the attacker most certainly has
control over the site's HTML and could just remove or modify the original
`integrity` values. SRI shines when used to validate cross-origin resources.

<h2 id="content-security-policy-pinning">Content Security Policy Pinning</h2>
Status: First Public Working Draft [http://www.w3.org/TR/csp-pinning/](http://www.w3.org/TR/csp-pinning/)

<div class="status">
  <ul>
    <li class="unavailable">Chrome<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Firefox<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Edge<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Safari<span class="hidden">Unavailable</span></li>
  </ul>
</div>

### Goal

Allow developers to specify a default content security policy to be applied to
every page on an origin.

### Background

Implementing CSP is one of the most effective steps for building secure web
pages, but its benefits can be quickly undermined if a policy is not delivered
for *every single* page on an origin.

For example, if a site delivers a `Content-Security-Policy` header for almost
every page, but forgets about error pages, a content-injection vulnerability on
an error page could be a ticket to executing attacks on other pages on the
origin, even though those pages have a strong CSP. It would be nice for
developers to be able to specify a fallback, so if any page on an origin does
not have a `Content-Security-Policy` header, the policy defined in the
`Content-Security-Policy-Pin` header will be applied.

### How It Works

This specification introduces the `Content-Security-Policy-Pin` header, in which
developers include a CSP to be used as the default for all pages on an origin.
It must include a `max-age` directive and it may include an `includeSubdomains`
directive.

The `Content-Security-Policy-Pin` header should be delivered on *every page*.
This is necessary because a UA won`t know about the pinned policy until the user
browses to a page that has the pin header, so it's necessary to deliver it at
every possible entry point.

CSP pins are only enforced if a page doesn't already have a policy. But note
that because headers are processed before `<meta>` elements can be discovered, a
pinned CSP will always override a CSP delivered via a `<meta>` element.

#### Hostile Pinning

Imagine what would happen if a site fell victim to header injection and an
attacker set this header: `Content-Security-Policy-Pin: default src 'none'`.
This would prohibit the UA from loading and executing all resources, including
images, scripts, audio, video, iframes, and more. For most sites, it would be
devastating.

Malicious pinning can be addressed quickly by setting a new
`Content-Security-Policy-Pin` header with a `max-age` of 0, and then resending
the desired pin on all pages, but it's important to note that if a page already
has a CSP pin, injected pin headers will be ignored.

This should be enough to urge anyone already using CSP to implement CSP pinning
as soon as it's available. It's a simple step forward to make existing CSP
implementations stronger and to prevent the headache of malicious pin injection.

<h2 id="referrer-policy">Referrer Policy</h2>
Status: First Public Working Draft [http://www.w3.org/TR/referrer-policy/](http://www.w3.org/TR/referrer-policy/)

<div class="status">
  <ul>
    <li class="unavailable">Chrome</li>
    <li class="unavailable">Firefox</li>
    <li class="unavailable">Edge</li>
    <li class="unavailable">Safari</li>
  </ul>
</div>

### Goal

Provide finer control over when and how the `Referer` HTTP header is populated.

### Background

After clicking on a link on Twitter, an HTTP `Referer` header is sent along in
the request to the linked page, so administrators of the linked site know the
request originated from `twitter.com`. Sometimes this is harmless and even
useful (e.g. bloggers getting kickbacks for referral links), but in other
situations, relaying the referring URL is problematic for privacy and/or
security.

Consider a site that puts session identifiers in the URL. If an authenticated
user clicks a link to an external site, the entire URL, including the session
ID, will be sent in the request's `Referer` header. There are steps to prevent a
URL-based session ID from being misused -- authenticated users can be redirected
through another URL on the same-origin before a cross-origin request, session
timeouts can be kept very short, and each session can be tied to a unique
fingerprint (user's IP address, User-Agent info, timestamp, or some combination
of these). These steps can be effective when done correctly, but implementing
them is not immune to mistakes.

A defense-in-depth approach wants for the ability to explicitly set what a
`Referer` header should contain and when it should be sent. It's currently
possible to control how the `Referer` header is populated by setting a policy in
a `<meta name="referrer">` element, but it would be more convenient to be able
to to deliver this same functionality via an HTTP header.

### How It Works

Referrer Policy defines five states that determine how and when the `Referer`
header is delivered:

  1. None
  * Never send a header
  2. None When Downgrade
  * Don't send a header when navigating from a secure to an a priori insecure site (`https://example.com` to `http://notexample.com`)
  * This is the default behavior if no policy specified
  3. Origin Only
  * Send a header that only includes the origin (if on `https://example.com/user/1/` the `Referer` header will be `Referer: https://example.com`
  * Sends the `Referer` header to both secure and a priori insecure origins
  4. Origin When Cross Origin
  * Send only the origin for cross-origin requests
  * Send the full URL for same-origin requests
  * Note: A request from `http://example.com` to `https://example.com` is a cross-origin request because the scheme portion of the origins are not identical.
  5. Unsafe URL
  * Send the full URL for both cross-origin and same-origin requests
  * Like the name suggests, this is not a safe option. It always sends the full URL in the `Referer` header, even to insecure origins. Think carefully before doing this.

#### Implementation

A referrer policy can be set for each page on an origin and can be delivered in
one of four ways:

  1. `referrer` CSP directive in a `Content-Security-Policy` header
  2. `referrer` CSP directive via a `<meta>` tag
  3. Via a `<meta>` tag with a `name` of `referrer
  * Example: `<meta name="referrer" content="origin-when-downgrade">`
  4. Via inheritance
  * A nested documents inherits the referrer policy from the parent browsing context

<h2 id="entry-point-regulation">Entry Point Regulation</h2>
Status: First Public Working Draft [http://www.w3.org/TR/epr/](http://www.w3.org/TR/epr/)

<div class="status">
  <ul>
    <li class="unavailable">Chrome<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Firefox<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Edge<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Safari<span class="hidden">Unavailable</span></li>
  </ul>
</div>

### Goal

Restrict how resources on an origin can be accessed.

### Background

The success of the  web is largely in part to the fundamental openness of the
request/response model for retrieving documents. However, some attacks, like
reflected XSS and Cross Site Request Forgery (CSRF), exploit this property, and
the fact that it's difficult for a UA to distinguish between a request issued by
a legitimate user or an attacker.

For example, say an unsuspecting user clicks on the link in an imaginary tweet:
"How to protect yourself against CSRF attacks lnk.shrtnr/maliciouslink". The
link shortener obfuscates the actual contents of the URL, and because the user
wanted to learn how to defend against CSRF, she clicked the link without any
indication it was malicious. To the user's dismay, the link made a request to
`https://sendmymoney.com/?from=me&to=attacker&amount=100`. Since she had logged
in to `sendmymoney.com` a few minutes prior, she was authenticated for the site
and the request suceeds unprompted and the attacker receives $100.

This is a simple, boilerplate example of how CSRF attacks can happen. At a basic
level, CSRF involves an authenticated user submitting a malicious request,
prompted either by an XSS vulnerability, a phishing scam, or clicking on a link
obscured by a link shortener (let's stop using those, yeah?).

It's important to note that from the point of view of the web server, this
request is unusual. It originates from `twitter.com` rather than somewhere
within `sendmymoney.com`, and that's an unexpected behavior. If it's possible to
categorize requests as unusual or unexpected, then it should be possible to
restrict how UAs process such requests.

### How It Works

EPR gives site authors the ability to specify in their [application manifest]()
how certain types of requests should be handled on their site.

In order to do so, EPR defines three types of requests (navigational,
subresource, and connection), along with five types of behaviors.

Types of requests:

1. Navigational Request
* Loads a resource into a context where HTML markup will be rendered
* At risk of both XSS and CSRF attacks
2. Subresource Request
* Involves requesting something like a `<script>` tag
3. Connection Request
* Request that involves an XHR request, beacon, fetch, ping, etc.

Types of behaviors:

1. `allow`
* Allow all requests
2. `block`
* Block and return an network error
3. `redirect`
* Redirect to a specific URL
4. `allowUnauthenticated`
* Accept the request, but first drop the credentials and other authentication properties by setting its [credentials mode](https://fetch.spec.whatwg.org/#concept-request-credentials-mode) to `omit`
5. `allowStrippedGET`
* Default behavior
* Allow `GET` requests, but first set the URL's fragment and query string to null
* HTTP request types other than `GET` return a network error

#### Implementation

To turn on EPR, the a server includes the header `EPR: 1` in any response for
the origin, and EPR remains in effect for all documents on the origin until the
server sends the header `EPR: 0` (which is also persistent). Of course, EPR
can't be turned on for an a priori insecure origin because the `EPR` header
could be fabricated by an attacker.

An EPR policy is delivered in a manifest file, and consists of a number of
individual rules that define the behavior for different paths on the origin. The
paths can be listed by a string or a regex, and each rule should also specify
what types of requests it applies to and whether request URLs for that path are
allowed to contain query strings.

An EPR policy might look something like this:


``` javascript
{
  "epr": {
    "redirectURL": "https://example.com/",
    "navigationBehavior": "allowStrippedGET",
    "subresourceBehavior": "allow",
    "rules": [
      {
        "path": "/",
        "types": ["navigational"],
        "allowData": false
      },
      {
        "path": "/image",
         "types": [ "subresource" ],
         "allowData": true
      },
    ]
  }
}
```

Notice that there aren't many paths listed in this policy. That's OK, because if
a path isn't listed, it will be restricted to the behavior listed for the type
of request it is.

<h2 id="clear-site-data">Clear Site Data</h2>
Status: First Public Working Draft [http://www.w3.org/TR/clear-site-data/](http://www.w3.org/TR/clear-site-data/)

<div class="status">
  <ul class="browsers">
    <li class="unavailable">Chrome<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Firefox<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Edge<span class="hidden">Unavailable</span></li>
    <li class="unavailable">Safari<span class="hidden">Unavailable</span></li>
  </ul>
</div>

### Goal

Provide simple and consistent mechanism to clear a user's locally stored data
associated with a host and its subdomains.

### Background

When a user logs out, deletes her account, or asks to opt out of a certain
service a host provides, the host will often delete cookies and other data
stored in the browser as part of that process.

Deleting that data isn't easy. It requires comprehensive knowledge of all the
data that host set which could include cookies, `localStorage`, and more, and
that's plain tough to know with confidence. Ideally, UAs would implement a way
for a site author to instruct the UA to clear all data associated with a host.

### How It Works

Clear Site Data introduces the `Clear-Site-Data` header that can be sent with a
request in order to clear all data for an origin: `Clear-Site-Data: *`, or to
clear data in a more granular fashion for example: `Clear-Site-Data: cookies
domStorage`. The `includeSubdomains` directive can be included as well.

The `Clear-Site-Data` header must be ignored for a priori insecure origins.
Otherwise an attacker could inject the header and unexpectedly clear data.

#### Use Cases

In addition to being useful when a user deletes her account, or opts out of a
certain feature, the specification outlines a hypothetical situation in which
the `Clear-Site-Data` header offers incredible value as a security tool.

A developer learns her site was vulnerable to XSS. The vulnerability is quickly
addressed, but she doesn't know if the attacker was able to store any malicious
data while the site was vulnerable. In this case, she can send `Clear-Site-Data: *;
includeSubdomains` header as a "kill switch" to wipe all users' local sources of
data associated with her site and all of its subdomains.

## Conclusion

While the development of these specifications have already done a lot to move
web security forward, they are works in progress, and the process of developing
web specifications works best when developers with diverse technical experiences
contribute.

If you have suggestions about how to improve any of these specifications,
definitely chime in! It's an open process and there are a lot of different ways
to get involved:

  * Sign up for and participate in the WebAppSec [mailing list](https://lists.w3.org/Archives/Public/public-webappsec/)
  * Make an account on [Specifiction](http://discourse.wicg.io/t/welcome-to-specifiction/6) (a really welcoming platform for discussing web standards)
  * File an issue on the [WebAppSec Github repo](https://github.com/w3c/WebAppSec)

Even if you don't have anything to say, you'll likely learn a lot by just
dropping in and reading once in a while. Do it!
