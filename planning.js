const fs = require('fs');

function readCsv(filename, delimiter = ',') {
  try {
    const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' });
    const rows = fileContent.split('\n');
    const data = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (row) {
        const columns = row.split(delimiter);
        data.push(columns);
      }
    }

    return data;
  } catch (err) {
    console.error('Error reading file:', err.message);
    return null;
  }
}

// Class for airports and their information
class airport {
  #code;
  #name;
  #distFromMAN;
  #distFromLGW;

  constructor([code, name, distFromMAN, distFromLGW]) {
    this.#code = code;
    this.#name = name;
    this.#distFromMAN = distFromMAN;
    this.#distFromLGW = distFromLGW;
  }

  get code() {
    return this.#code;
  }

  get name() {
    return this.#name;
  }

  get distFromMAN() {
    return this.#distFromMAN;
  }

  get distFromLGW() {
    return this.#distFromLGW;
  }
}

const airportData = readCsv('airports.csv');

const airportJFK = new airport(airportData[0])
const airportORY = new airport(airportData[1])
const airportMAD = new airport(airportData[2])
const airportAMS = new airport(airportData[3])
const airportCAI = new airport(airportData[4])