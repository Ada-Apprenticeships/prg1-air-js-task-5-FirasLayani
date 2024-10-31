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

// Class for aeroplanes and their information
class aeroplane {
  #type;
  #costPerSeatPer100km;
  #maxFlightRange;
  #numEconomySeats;
  #numBusinessSeats;
  #numFirstClassSeats;

  constructor([type, costPerSeatPer100km, maxFlightRange, numEconomySeats, numBusinessSeats, numFirstClassSeats]) {
    this.#type = type;
    this.#costPerSeatPer100km = costPerSeatPer100km;
    this.#maxFlightRange = maxFlightRange;
    this.#numEconomySeats = numEconomySeats;
    this.#numBusinessSeats = numBusinessSeats;
    this.#numFirstClassSeats = numFirstClassSeats;
  }
  get type() {
    return this.#type;
  }
  get costPerSeatPer100km() {
    return this.#costPerSeatPer100km;
  }
  get maxFlightRange() {
    return this.#maxFlightRange;
  }
  get numEconomySeats() {
    return this.#numEconomySeats;
  }
  get numBusinessSeats() {
    return this.#numBusinessSeats;
  }
  get numFirstClassSeats() {
    return this.#numFirstClassSeats;
  }
}

// REFACTOR BY ITERATING THROUGH ARRAY
// TEST EACH AEROPLANE/AIRPORT OBJECT RETURNS CORRECT ATTRIBUTES, PRIVATE TOO

// Read in data
const airportData = readCsv('airports.csv');
const aeroplaneData = readCsv('aeroplanes.csv');

// Instanstiate each airport object
const airportJFK = new airport(airportData[0]);
const airportORY = new airport(airportData[1]);
const airportMAD = new airport(airportData[2]);
const airportAMS = new airport(airportData[3]);
const airportCAI = new airport(airportData[4]);

// Instantiate each aeroplane object
const medNarrowBody = new aeroplane(aeroplaneData[0])
const lrgNarrowBody = new aeroplane(aeroplaneData[1])
const medWideBody = new aeroplane(aeroplaneData[2])
