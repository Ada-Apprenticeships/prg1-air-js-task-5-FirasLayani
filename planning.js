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

// Return whether a flight is valid
function isValidFlight(flightInfo) {}

// Calculate the profit of a flight
function calculateProfit(flightInfo) {
  const income = 0;
}

// Class for airports and their information
class Airport {
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
class Aeroplane {
  #type;
  #costPerSeatPer100km;
  #maxFlightRange;
  #numEconomySeats;
  #numBusinessSeats;
  #numFirstClassSeats;

  constructor([type, costPerSeatPer100km, maxFlightRange, numEconomySeats, numBusinessSeats, numFirstClassSeats]) {
    this.#type = type;
    this.#costPerSeatPer100km = Number(costPerSeatPer100km.slice(1));
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

// Class for flight details
class Flight {
  #airportUK;
  #airportOverseas;
  #aircraftType;
  #economyBooked;
  #businessBooked;
  #firstClassBooked;
  #economyPrice;
  #businessPrice;
  #firstClassPrice;

  constructor([
    airportUK,
    airportOverseas,
    aircraftType,
    economyBooked,
    businessBooked,
    firstClassBooked,
    economyPrice,
    businessPrice,
    firstClassPrice,
  ]) {
    this.#airportUK = airportUK;
    this.#airportOverseas = airportOverseas;
    this.#aircraftType = aircraftType;
    this.#economyBooked = economyBooked;
    this.#businessBooked = businessBooked;
    this.#firstClassBooked = firstClassBooked;
    this.#economyPrice = economyPrice;
    this.#businessPrice = businessPrice;
    this.#firstClassPrice = firstClassPrice;
  }
  get airportUK(){
    return this.#airportUK
  }
  get airportOverseas(){
    return this.#airportOverseas
  }
  get aircraftType(){
    return this.#aircraftType
  }
  get economyBooked(){
    return this.#economyBooked
  }
  get businessBooked(){
    return this.#businessBooked
  }
  get firstClassBooked(){
    return this.#firstClassBooked
  }
  get economyPrice(){
    return this.#economyPrice
  }
  get businessPrice(){
    return this.#businessPrice
  }
  get firstClassPrice(){
    return this.#firstClassPrice
  }
}

// *** To do Tasks ***

// REFACTOR INSTANTIATION BY ITERATING THROUGH ARRAY
// TEST EACH AEROPLANE/AIRPORT OBJECT RETURNS CORRECT ATTRIBUTES, PRIVATE TOO
// COMMENTS FOR ATTRIBUTES OR METHODS
// MAKE AIRPORTS AND AEROPLANES EXPANDABLE SO CAN BE ADDED IN CSV
// VALIDATE FLIGHT INFO
// Test for valid, edge and invalid cases

// Read in data
const airportData = readCsv('airports.csv');
const aeroplaneData = readCsv('aeroplanes.csv');
const flightData = readCsv('valid_flight_data.csv');

// Instanstiate each airport object
const airportJFK = new Airport(airportData[0]);
const airportORY = new Airport(airportData[1]);
const airportMAD = new Airport(airportData[2]);
const airportAMS = new Airport(airportData[3]);
const airportCAI = new Airport(airportData[4]);

// Instantiate each aeroplane object
const medNarrowBody = new Aeroplane(aeroplaneData[0]);
const lrgNarrowBody = new Aeroplane(aeroplaneData[1]);
const medWideBody = new Aeroplane(aeroplaneData[2]);

// Testing

console.log(lrgNarrowBody.costPerSeatPer100km + 123);
