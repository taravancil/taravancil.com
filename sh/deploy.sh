# -c use checksums instead of comparing mtime
# -m run in parallel
hugo && gsutil -m rsync -d -r -c public gs://taravancil-dot-com-www
