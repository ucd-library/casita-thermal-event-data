This repo contains a harvest of the band 7 thermal anomaly data from the CaSITA project. 

# File Descriptions

`initial_thermal_events.csv` contains the initial detection pixel for a thermal event. The CaSITA thermal anomaly event pixels are grouped spatially and the event expires after 7 days of no activity within the spatial grouping. This CSV file contains the first pixel detected for a thermal event.

`event-px-history.json` contains the historical (past 10 days) data for most (note on this below) pixels in the `initial_thermal_events.csv`.  The structure is as follows; the main object is a key/value pair of `thermal_event_id` to `thermal_event_px` data where the `thermal_event_px_id` is the first detected pixel as described above.  The `thermal_event_px` has the following structure:

 - `pixel`: (Object) pixel metadata
 - `historical`: (Boolean) is there historical data for this pixel. Early versions of data collection do not have historical data and are not stored in this file.
 - `data`: (Array) of objects
   - `date`: (ISO String) date/time of pixel
   - `max`: hourly max value for this pixel
   - `amax-average`: windowed (+/- 2 hours) rolling average of hourly maximum value over past 10 days.
   - `amax-stddev`: windowed (+/- 2 hours) standard devation of hourly maximum value over past 10 days.

*Note, some early dates in `initial_thermal_events.csv` due not have historical pixel data, as that functionality had yet to be developed.

# Updating the data

The `update.sh` script describes then entire update process, and be run the  update both the `initial_thermal_events.csv` and `event-px-history.json` files.

Requirements to run the script:
 - NodeJS
 - kubectl
 - gcloud (logged in with account that has access to the casita GC project)

The script will:
  - Install node dependencies (only if no node_modules folder is detected)
  - Use gcloud cli to setup the kubectl credentials, so kubectl has access to the k8s cluster
  - Establish a port-fowarding connection from k8s postgres-service to localhost on 5432 (make sure you don't have any local postgres services running on the port).
  - Update the `initial_thermal_events.csv` file via a `psql \copy` command
  - Kill the port-foward process
  - Run the node script to pull new event data from the api.  Note, events already in `event-px-history.json` are note updated.