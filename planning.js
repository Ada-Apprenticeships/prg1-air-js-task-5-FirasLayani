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

    // Convert intended elements to numbers
    data.forEach((row, rowIndex) => {
      data[rowIndex] = row.map(element => (element === '0' || Number(element) ? Number(element) : element));
    });

    return data;
  } catch (err) {
    console.error('Error reading file:', err.message);
    return null;
  }
}

// Return whether a flight is valid
function isValidFlight(flight) {
  const distance = airports.findDistance(flight.airportUK, flight.airportOverseas);
  const aircraft = aeroplanes.search(flight.aircraftType);
  const airportCodes = ['MAN', 'LGW', 'JFK', 'ORY', 'MAD', 'AMS', 'CAI'];
  // Test each condition
  // Invalid airport codes automatically error handled in findDistance() in Airports class

  if (distance > aircraft.maxFlightRange) {
    // Flight distance is further than aeroplane's max flight range
    throw new Error(`${flight.aircraftType} doesn't have the range to fly to ${flight.airportOverseas}`);
  } else if (flight.firstClassBooked > aircraft.numFirstClassSeats) {
    // Not enough first-class seats
    throw new Error(`${flight.aircraftType} doesn't have enough first-class seats`);
  } else if (flight.businessBooked > aircraft.numBusinessSeats) {
    // Not enough business seats
    throw new Error(`${flight.aircraftType} doesn't have enough business class seets`);
  } else if (flight.economyBooked > aircraft.numEconomySeats) {
    // Not enough economy seats
    throw new Error(`${flight.aircraftType} doesn't have enough economy class seets`);
  }
  {
    airports.findDistance(flight.airportUK, flight.airportOverseas); // Check for invalid airport codes
    return true;
  }
}

// Calculate the profit of a flight
function calculateProfit(flight) {
  const income =
    flight.economyBooked * flight.economyPrice +
    flight.businessBooked * flight.businessPrice +
    flight.firstClassBooked * flight.firstClassPrice;
  const numSeats = Number(flight.economyBooked) + Number(flight.businessBooked) + Number(flight.firstClassBooked);
  const flightCostPerSeat =
    (aeroplanes.search(flight.aircraftType).costPerSeatPer100km *
      airports.findDistance(flight.airportUK, flight.airportOverseas)) /
    100;
  const cost = flightCostPerSeat * numSeats;
  const profit = income - cost;
  return profit.toFixed(2);
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

// Class container for all airports
class Airports {
  #airports;
  constructor() {
    this.#airports = [];
  }

  add(airport) {
    this.#airports.push(airport);
    return this.#airports.length;
  }

  // remove aeroplane?
  get quantity() {
    return this.#airports.length;
  }

  list() {
    return this.#airports;
  }

  // Return the aeroplane with the specified type name
  search(airportCode) {
    const airport = this.#airports.find(airport => airport.code === airportCode);
    if (!airport) {
      throw new Error(`Invalid airport code (${airportCode})`);
    } else {
      return airport;
    }
  }

  // Return the distance between two UK and overseas airports
  findDistance(ukCode, overseasCode) {
    const overseasAirport = this.search(overseasCode);
    if (!overseasAirport) {
      throw new Error(`Invalid airport code (${overseasCode})`);
    } else if (ukCode !== 'MAN' && ukCode !== 'LGW') {
      throw new Error(`Invalid airport code (${ukCode})`);
    } else {
      return ukCode === 'MAN' ? overseasAirport.distFromMAN : overseasAirport.distFromLGW;
    }
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

// Class container for all aeroplane types
class Aeroplanes {
  #aeroplanes;
  constructor() {
    this.#aeroplanes = [];
  }

  add(aeroplane) {
    this.#aeroplanes.push(aeroplane);
    return this.#aeroplanes.length;
  }

  // remove aeroplane?
  get quantity() {
    return this.#aeroplanes.length;
  }

  list() {
    return this.#aeroplanes;
  }

  // Return the aeroplane with the specified type name
  search(aircraftType) {
    return this.#aeroplanes.find(aeroplane => aeroplane.type === aircraftType);
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
  get airportUK() {
    return this.#airportUK;
  }
  get airportOverseas() {
    return this.#airportOverseas;
  }
  get aircraftType() {
    return this.#aircraftType;
  }
  get economyBooked() {
    return this.#economyBooked;
  }
  get businessBooked() {
    return this.#businessBooked;
  }
  get firstClassBooked() {
    return this.#firstClassBooked;
  }
  get economyPrice() {
    return this.#economyPrice;
  }
  get businessPrice() {
    return this.#businessPrice;
  }
  get firstClassPrice() {
    return this.#firstClassPrice;
  }
}

// Class container for all flights
class Flights {
  #flights;
  constructor() {
    this.#flights = [];
  }

  add(flight) {
    this.#flights.push(flight);
    return this.#flights.length;
  }

  // remove flight?
  get quantity() {
    return this.#flights.length;
  }

  list() {
    return this.#flights;
  }
}

// *** To do Tasks ***

// TEST EACH AEROPLANE/AIRPORT OBJECT RETURNS CORRECT ATTRIBUTES, PRIVATE TOO
// COMMENTS FOR ATTRIBUTES OR METHODS
// VALIDATE FLIGHT INFO
// Test for valid, edge and invalid cases
// Validate flight before calculating
// Container class where Aeroplanes, Airports and Aeroplanes extend?
// Search function?
// Check each csv field is an integerwhere necessary

// Read in data
const airportData = readCsv('airports.csv');
const aeroplaneData = readCsv('aeroplanes.csv');
const flightData = readCsv('valid_flight_data.csv');

// Instanstiate each airport
const airports = new Airports();
airportData.forEach(airport => {
  airports.add(new Airport(airport));
});

// Instantiate each aeroplane
const aeroplanes = new Aeroplanes();
aeroplaneData.forEach(aeroplane => {
  aeroplanes.add(new Aeroplane(aeroplane));
});

// Instantiate each flight
const flights = new Flights();
flightData.forEach(flight => {
  flights.add(new Flight(flight));
});

// Output all flight detials
console.table(
  // Create a table from an array of all flight objects, where each one has been mapped to a new flight object accessing the private attributes of the original
  flights.list().map(flight => ({
    'UK Airport': flight.airportUK === 'MAN' ? 'Manchester' : 'Gatwick',
    'Overseas Airport': airports.search(flight.airportOverseas).name,
    'Aircraft Type': flight.aircraftType,
    '# Economy Seats': flight.economyBooked,
    '# Business Seats': flight.businessBooked,
    '# First Class Seats': flight.firstClassBooked,
    'Economy Seat Price': `£${flight.economyPrice}`,
    'Business Seat Price': `£${flight.businessPrice}`,
    'First Class Seat Price': `£${flight.firstClassPrice}`,
    'Profit': `£${calculateProfit(flight)}`,
  }))
);

// Testing
const invalidFlightData = readCsv('invalid_flight_data.csv');

const invalidFlights = new Flights();
invalidFlightData.forEach(flight => {
  invalidFlights.add(new Flight(flight));
});

console.log(isValidFlight(flights.list()[0]));
console.log(isValidFlight(invalidFlights.list()[5]));
