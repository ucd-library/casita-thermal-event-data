\copy (select distinct on (thermal_event_id) thermal_event_id, * from  thermal_event_px order by thermal_event_id, date) TO '~/Desktop/initial_thermal_events.csv' csv header