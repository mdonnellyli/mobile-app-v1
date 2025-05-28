 #!/usr/bin/env bash

 ARCHIVE_NAME=mobile-app-v1.tar.gz

rm $ARCHIVE_NAME ; \
 
find . \
 \( -type d -name 'node_modules' -o -type d -name '.history' -o -type d -name '.expo' -o -type d -name 'ios' \) -prune -o -type f \( -name '*.tsx' -o -name '*.js' -o -name '*.json' \) -print |  tar -czvf $ARCHIVE_NAME -T -
