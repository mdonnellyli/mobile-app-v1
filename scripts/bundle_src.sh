 #!/usr/bin/env bash

 ARCHIVE_NAME=mobile-app-v1.tar.gz

rm $ARCHIVE_NAME ; \
 
find . \
 \( -type d -name 'node_modules' -o -type d -name '.history' \) -prune -o -type f \( -name '*.tsx' -o -name '*.js' \) -print |  tar -czvf app-server-src.tar.gz -T -
