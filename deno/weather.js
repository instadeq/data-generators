//@format
import {
  entryPoint,
  DataClass,
  mkCountRepeat,
  mkCycleRepeat,
  mkCycle,
  mkGenDict,
  mkRandomInRange
} from './datagen.js';

const PLACES = ['London', 'Paris', 'New York', 'Tokyo'],
  // keep in sync with value field gen below
  TYPES = ['Temperature', 'Humidity', 'Precipitation'];

class Weather extends DataClass {
  constructor() {
    super();
    this.day = null;
    this.location = null;
    this.type = null;
    this.value = null;
  }
}

Weather.FIELDS = ['day', 'location', 'type', 'value'];
Weather.COLUMNS = ['Day', 'Location', 'Type', 'Value'];

function main() {
  const fieldGens = {
    location: mkCycleRepeat(PLACES, TYPES.length),
    type: mkCycle(TYPES),
    day: mkCountRepeat(PLACES.length * TYPES.length, 1),
    value: mkGenDict('type', {
      Temperature: mkRandomInRange(10, 25),
      Humidity: mkRandomInRange(10, 85),
      Precipitation: mkRandomInRange(0, 40)
    })
  };

  entryPoint(Deno.args, Weather, fieldGens);
}

main();
