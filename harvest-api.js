const fetch = require('node-fetch');
const {parse} = require('csv-parse');
const fs = require('fs');
const path = require('path');

const INPUT_FILE = path.join(__dirname, 'initial_thermal_events.csv');

function readCsv() {
  return new Promise((resolve, reject) => {
    var parser = parse({delimiter: ','}, function (err, data) {
      if( err ) reject(err);
      else resolve(data);
    });
    fs.createReadStream(INPUT_FILE).pipe(parser);
  });
}

async function fetchApiData(eventId) {
  let resp = await fetch('https://data.casita.library.ucdavis.edu/_/thermal-anomaly/thermal-event-px/'+eventId);
  return resp.json();
}

(async function() {
  let rows = await readCsv();
  rows.splice(0, 93); // splice off bad data rows
  let results = {};

  for( let event of rows ) {
    console.log('fetching '+event[0]+': '+event[1]);
    let data = await fetchApiData(event[1]);

    // check for bad values
    if( Object.keys(data.data[0]).includes('undefined') ) {
      console.log('Badness', data.data[0]);
      continue;
    }

    results[event[0]] = data;
  }

  fs.writeFileSync(path.join(__dirname, 'event-px-history.json'), JSON.stringify(results, '  ',  '  '));
})();
