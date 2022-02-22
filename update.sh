#! /bin/bash

set -e
ROOT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
cd $ROOT_DIR

if [[ ! -d node_modules ]]; then 
  npm install
fi

gcloud container clusters get-credentials casita-krm  \
  --zone us-central1-c \
  --project casita-298223

kubectl port-forward service/postgres-service 5432:5432 &
PORT_FORWARD_PID=$!

# this is (hopefully) an over guess...
# otherwise just rerun script and make sure to manually kill of pid
# ps -ef | grep port-forward
sleep 10

psql -h localhost -U postgres \
  -c "\copy (select distinct on (thermal_event_id) thermal_event_id, * from  thermal_event_px order by thermal_event_id, date) TO './initial_thermal_events.csv' csv header" \
  casita

echo "attempting to kill port-forward process: $PORT_FORWARD_PID"
while $(kill -15 $PORT_FORWARD_PID &> /dev/null); do 
    sleep 1
done

node harvest-api.js