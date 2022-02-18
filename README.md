This repo contains a harvest of the band 7 thermal anomaly data from the CaSITA project. 

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