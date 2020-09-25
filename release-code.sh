#!/bin/bash
set -e 

SITE="weather-report"

tar -czvf $SITE.tar.gz \
    ./package.json \
    ./package-lock.json \
    ./Dockerfile \
    ./src \
    .env
    
scp ./$SITE.tar.gz $1:~/containers/$SITE

ssh $1 << EOF
    cd ~/containers/$SITE
    tar -xvf $SITE.tar.gz

    docker build --no-cache --tag $SITE-image .
EOF

rm $SITE.tar.gz
