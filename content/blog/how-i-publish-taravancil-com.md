---
title: How I publish taravancil.com on the peer-to-peer Web
date: 2018-01-04
tags: [dat, beaker, peer-to-peer-web, peer-to-peer]
---

*Updated August 31, 2018. Originally published on January 4, 2018.*

I publish this website on [`dat://`](https://github.com/datproject/dat) and `https://`. As of August 31, 2018, my publishing workflow involves three tools:

<!--more-->

1. [Hugo](https://gohugo.io), a static site generator
2. The [Dat CLI](https://github.com/datproject/dat), for publishing updates to the Dat network
3. [`homebase`](https://github.com/beakerbrowser/homabes), for syncing updates from the `dat://` version of my website to the `https://` version

<!--more-->

## 1. Building my website

This website is a pretty standard static website operation. I use [Hugo](https://gohugo.io) to generate the markup that composes its pages. I don't have much to say about Hugo other than it works for me. [Jekyll](https://jekyllrb.com) seems like a decent static site generator as well.

If you're curious to learn more about how Hugo works, the source for this site is at [github.com/taravancil/taravancil.com](https://github.com/taravancil/taravancil.com). Something worth mentioning is that I don't use Hugo's `baseURL` option and I set `canonifyurls = false` in my [`config.toml`](https://github.com/taravancil/taravancil.com/blob/master/config.toml). This makes it possible to use relative URLs, so whether someone visits the site via `dat://` or `https://`, internal links always follow that protocol choice. For example, an internal link to my blog looks like this:

```html
<a href="/blog">Blog</a>
```

When I'm ready to publish an update, I run Hugo and it generates a new version of my website in the `/public` directory.

```bash
$ hugo
```

## 2. Publishing my website with Dat

I use the [Dat CLI](https://github.com/datproject/dat) to publish and sync updates to my website. You can install `dat` with npm:

```bash
$ npm i -g dat
```

After generating my website with Hugo, I `cd` into the `/public` directory and run the `dat` command:

```
$ cd public
$ dat .
```

The first time I ran the `dat` command in `/public`, it created a Dat Archive and minted a new URL. Each subsequent time I run `dat` in `/public`, it syncs the updates to the existing URL: [dat://4fa30df06cbeda4ae87be8fd4334a61289be6648fb0bf7f44f6b91d2385c9328](dat://4fa30df06cbeda4ae87be8fd4334a61289be6648fb0bf7f44f6b91d2385c9328)

## 3. HTTP mirroring

Currently `dat://` is only supported in [Beaker](https://github.com/beakerbrowser/beaker), so I need my website to work over `https://` too.

Further, `dat://` URLs are long and difficult to remember, so it would be nice to be able to access the `dat://` version of my site at a shortname like [dat://taravancil.com](dat://taravancil.com). Luckily, Beaker supports this! Beaker piggybacks off of DNS authentication in combination with the [`/.well-known`](https://tools.ietf.org/html/rfc5785) convention to enable `dat://` shortnames. When you visit [dat://taravancil.com](dat://taravancil.com) in Beaker, it sends a request to [https://taravancil.com/.well-known/dat](https://taravancil.com/.well-known/dat]) and expects to find a file that looks like this:

```
dat://4fa30df06cbeda4ae87be8fd4334a61289be6648fb0bf7f44f6b91d2385c9328
TTL=3600
```

Because Beaker can trust the DNS resolution, Beaker can trust that [dat://taravancil.com](dat://taravancil.com) should point to [dat://4fa30df06cbeda4ae87be8fd4334a61289be6648fb0bf7f44f6b91d2385c9328](dat://4fa30df06cbeda4ae87be8fd4334a61289be6648fb0bf7f44f6b91d2385c9328).

### homebase 

[Paul](https://twitter.com/pfrazee) and I built a tool called `homebase` that provides HTTP mirroring, sets up TLS with [Let's Encrypt](https://letsencrypt.org/), and configures `dat://` shortnames.

To get started with `homebase`, you'll need a server with Node.js and npm installed. Something like a Digital Ocean droplet or an EC2 instance will work. You should follow the complete [`homebase` instructions](https://github.com/beakerbrowser/homebase) if you decide to use it, but here's a short list of tasks that are easy to forget:

- Configure your DNS records to have `A` record that points to your server's IP address
- Make sure ports 80 (HTTP), 443 (HTTPS), and 3282 (Dat) are open on your server
- Write a configuration file at `~/.homebase.yml`. Here's mine:

```yaml
dats:
  - url: dat://4fa30df06cbeda4ae87be8fd4334a61289be6648fb0bf7f44f6b91d2385c9328
    domains:
      - taravancil.com
httpMirror: true
letsencrypt:
  email: 'contact@taravancil.com'
  agreeTos: true
```

After installing and configuring `homebase` and daemonizing the process (I use [pm2](https://www.npmjs.com/package/pm2)), your server will do the following:

- Remain active in the peer-to-peer swarm for the `dat://` version of your site, so there will always be an active "seeder" hosting its files
- Listen for updates to the `dat://` version of your site, and sync them to the directory that composes the `https://` version of your site
- Serve the `https://` version of your website

## Summary

Here's what I do to publish an update to my website:

1. Type some new words on my blog
2. Run `hugo` in the top-level directory of my website's source
3. `cd` into `/public` and run the `dat` command

That's it! My server automatically syncs the updates using `dat://` and the changes are propagated to both [dat://taravancil.com](dat://taravancil.com) and [https://taravancil.com](https://taravancil.com) within seconds.

Let me know if you try out this workflow! I'm [@taravancil](https://twitter.com/taravancil) on Twitter and I hang out in [#beakerbrowser on freenode](https://webchat.freenode.net/?channels=beakerbrowser). I'd love to hear how it goes for you, or offer a helping hand if you run into trouble.
