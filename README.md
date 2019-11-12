# taravancil.com
This is the source for [taravancil.com](https://taravancil.com).

## Dependencies

- [`go`](https://golang.org/doc/install)
- [`hugo`](https://gohugo.io/getting-started/installing/)
- [`npm`](https://www.npmjs.com/get-npm)
- [Google Cloud SDK](https://cloud.google.com/sdk/install) *(for deploys only)*

## Development
Install the development dependencies.

```
npm install
```

Start the local server.
```
npm start
```

## Deploys

Run `sh/deploy.sh` to deploy changes.

This runs `hugo` to build the site, then runs `gsutil rsync` to sync the built files in `public/` to the `gs://taravancil-dot-com-www` bucket.

Hugo rebuilds the *entire site* on each build. This means that even files that haven't been edited are re-written to `public/`, and consequently, have a new `mtime`. We use the `-c` option to force `rsync` to use checksums instead of comparing `mtime`s.
