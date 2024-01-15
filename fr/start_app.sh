#!/bin/sh

# this needs to change but it is required to do this as there is a badzip exception gets thrown
while true
. /root/env/bin/activate
do
    # start the app
    gunicorn --workers ${WORKERS} --bind ${HOST}:${PORT} 'app:app'
done
