const fs = require('fs');

// Read in a CSV file and convert strings to numbers where possible
function readCsv(filename, delimiter = ',') {
  try {
    const fileContent = fs.readFileSync(filename, { encoding: 'utf-8' });
    const rows = fileContent.split('\n');
    const data = [];

    for (let i = 0; i < rows.length; i++) {
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
  try {
    // Extract variables from flight
    const { airportUK, airportOverseas, aircraftType, firstClassBooked, businessBooked, economyBooked } = flight;

    // Validate distance and aircraft details
    const distance = airports.findDistance(airportUK, airportOverseas);

    // Extract information about flight's aeroplane type
    const { maxFlightRange, numFirstClassSeats, numBusinessSeats, numEconomySeats } = aeroplanes.search(aircraftType);

    // Check conditions and throw errors if invalid
    if (distance > maxFlightRange) {
      throw new Error(`${aircraftType} doesn't have the range to fly to ${airportOverseas}`);
    }
    if (firstClassBooked > numFirstClassSeats) {
      throw new Error(`${aircraftType} doesn't have enough first-class seats (${firstClassBooked} > ${numFirstClassSeats})`);
    }
    if (businessBooked > numBusinessSeats) {
      throw new Error(`${aircraftType} doesn't have enough business class seats (${businessBooked} > ${numBusinessSeats})`);
    }
    if (economyBooked > numEconomySeats) {
      throw new Error(`${aircraftType} doesn't have enough economy class seats (${economyBooked} > ${numEconomySeats})`);
    }

    // Return true if all conditions are satisfied
    return true;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return false;
  }
}

// Calculate the profit of a flight
function calculateProfit(flight) {
  const income = flight.economyBooked * flight.economyPrice + flight.businessBooked * flight.businessPrice + flight.firstClassBooked * flight.firstClassPrice;
  const numSeats = flight.economyBooked + flight.businessBooked + flight.firstClassBooked;
  const flightCostPerSeat =
    (aeroplanes.search(flight.aircraftType).costPerSeatPer100km * airports.findDistance(flight.airportUK, flight.airportOverseas)) / 100;
  const cost = flightCostPerSeat * numSeats;
  return (income - cost).toFixed(2);
}

// Output flight details to a file
function outputToFile(flightData, outputFile) {
  // Remove existing output file
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  // Append to output file
  flightData.forEach((row, rowIndex) => {
    if (rowIndex === 0) {
      row.push('Profit');
    } else {
      row.push(calculateProfit(new Flight(row)));
    }
    fs.appendFileSync(outputFile, `${row.join(',')}\n`);
  });
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

  // Add an airport to the list of airports
  add(airport) {
    this.#airports.push(airport);
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

  list() {
    return this.#aeroplanes;
  }

  // Return the aeroplane with the specified type name
  search(aircraftType) {
    const aeroplane = this.#aeroplanes.find(aeroplane => aeroplane.type === aircraftType);
    if (!aeroplane) {
      throw new Error(`Invalid aeroplane type (${aircraftType})`);
    } else {
      return aeroplane;
    }
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

  constructor([airportUK, airportOverseas, aircraftType, economyBooked, businessBooked, firstClassBooked, economyPrice, businessPrice, firstClassPrice]) {
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

  list() {
    return this.#flights;
  }
}

// Read in data
const airportData = readCsv('airports.csv').slice(1);
const aeroplaneData = readCsv('aeroplanes.csv').slice(1);
const flightData = readCsv('valid_flight_data.csv').slice(1);

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

// Check if all flights are valid
let allValid = true;
flights.list().forEach(flight => {
  // Iterate through each flight and check if it is valid
  let valid = isValidFlight(flight);
  if (!valid) {
    allValid = false;
  }
});

// Output flight details if all flights are valid
if (allValid) {
  // Create a table from an array of all flight objects, where each one has been mapped to a new flight object accessing the private attributes of the original
  console.table(
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
}

// Write flight details and profit to output file
outputToFile(flightData, './flights_with_profits.csv');

// Testing
/*

const invalidFlightData = readCsv('invalid_flight_data.csv');

const invalidFlights = new Flights();
invalidFlightData.forEach(flight => {
  invalidFlights.add(new Flight(flight));
});

// Check if all flights are valid
let allValid2 = true;
invalidFlights.list().forEach(flight => {
  // Iterate through each flight and check if it is valid
  let valid = isValidFlight(flight);
  if (!valid) {
    allValid2 = false;
  }
});

// If all flights are valid
if (allValid2) {
  // Output all flight details
console.table(
  // Create a table from an array of all flight objects, where each one has been mapped to a new flight object accessing the private attributes of the original
  invalidFlights.list().map(flight => ({
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
}
*/
