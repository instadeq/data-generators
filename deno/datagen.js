//@format

class DataClass {
  toJSON() {
    const result = {},
      COLUMNS = this.constructor.COLUMNS;

    this.constructor.FIELDS.forEach((field, i, _it) => {
      result[COLUMNS[i]] = this[field];
    });
    return result;
  }

  toCSV() {
    const FIELDS = this.constructor.FIELDS,
      result = new Array(FIELDS.length);

    FIELDS.forEach((field, i, _it) => {
      result[i] = this[field];
    });
    return result;
  }
}

DataClass.GENERATOR = function (fieldGens) {
  const instance = new this();

  this.FIELDS.forEach(field => {
    const fieldGen = fieldGens[field];
    if (fieldGen) {
      instance[field] = fieldGen(instance);
    }
  });

  return instance;
};

function makeWeightedChoice(items, weights) {
  const len = items.length,
    wSum = new Array(len),
    limits = new Array(len);

  if (items.length !== weights.length) {
    throw new Error('items and weight lengths dont match');
  }

  let sum = 0;
  for (let i = 0; i < len; i += 1) {
    sum += weights[i];
  }

  for (let i = 0, accum = 0; i < len; i += 1) {
    accum += weights[i];
    limits[i] = accum / sum;
  }

  return () => {
    const r = Math.random();

    for (let i = 0; i < len; i += 1) {
      if (r < limits[i]) {
        return items[i];
      }
    }

    return items[len - 1];
  };
}

function doTimes(n, fn) {
  for (let i = 0; i < n; i += 1) {
    fn(i);
  }
}

// to inclusive
function randint(from, to) {
  return Math.trunc(Math.random() * (to + 1 - from) + from);
}

// to inclusive
function randdec(from, to) {
  return Math.trunc((Math.random() * (to + 1 - from) + from) * 100) / 100;
}

function choice(items) {
  return items[randint(0, items.length - 1)];
}

function cloneDate(d) {
  const Cls = d.constructor;
  return new Cls(d.getTime());
}

function dateLastNDays(n) {
  const now = new DateOnly(),
    offsetDays = randint(0, n);

  now.setDate(now.getDate() - offsetDays);
  return now;
}

function addAtMostNDaysTo(dateBase, n) {
  const date = cloneDate(dateBase);

  date.setDate(date.getDate() + randint(0, n));

  return date;
}

function zipToObject(keys, vals) {
  const result = {};

  keys.forEach((k, i, _it) => {
    result[k] = vals[i];
  });

  return result;
}

function toCSVCols(seq) {
  return JSON.stringify(seq).slice(1, -1);
}

function toJSON(v) {
  return JSON.stringify(v, null, 2);
}

function genRows(count, Class, fieldGens) {
  const result = new Array(count);

  doTimes(count, i => {
    result[i] = Class.GENERATOR(fieldGens);
  });

  return result;
}

function generateForType(type, count, Class, fieldGens) {
  const instances = genRows(count, Class, fieldGens);
  switch (type) {
    case 'json':
    case 'json-table-array-of-objects':
      return toJSON(instances);
    case 'json-table':
    case 'json-table-object-keys':
      return toJSON({
        rows: instances.map(v => v.toCSV()),
        columns: Class.COLUMNS
      });
    case 'json-table-object-cols': {
      const rows = instances;
      return toJSON(
        Object.fromEntries(
          Class.FIELDS.map(key => {
            return [key, rows.map(row => row[key])];
          })
        )
      );
    }
    case 'json-table-array-of-pairs': {
      const rows = instances;
      return toJSON(
        Class.FIELDS.map(key => {
          return [key, rows.map(row => row[key])];
        })
      );
    }

    case 'json-table-array':
      return toJSON([Class.COLUMNS].concat(instances.map(v => v.toCSV())));
    case 'json-table-array-no-headers':
      return toJSON(instances.map(v => v.toCSV()));
    case 'csv':
      return [toCSVCols(Class.COLUMNS)]
        .concat(instances.map(v => toCSVCols(v.toCSV())))
        .join('\n');
    default:
      return null;
  }
}

function contentTypeForType(type) {
  switch (type) {
    case 'json':
    case 'json-table-array-of-objects':
    case 'json-table':
    case 'json-table-object-keys':
    case 'json-table-object-cols':
    case 'json-table-array-of-pairs':
    case 'json-table-array':
    case 'json-table-array-no-headers':
      return 'application/json';
    case 'csv':
      return 'text/csv';
    default:
      return null;
  }
}

function postJSON(url, body, contentType) {
  return fetch(url, {
    method: 'POST',
    headers: {'Content-Type': contentType},
    body
  });
}

async function entryPoint(args, Class, fieldGens) {
  const [type, countStr, url] = args,
    count0 = parseInt(countStr, 10),
    count = Number.isNaN(count0) ? 10 : Math.max(1, count0),
    output = generateForType(type, count, Class, fieldGens);

  if (output === null) {
    console.error(
      'Usage: <this-script> <type> [<count> [<url>]]\n\n\ttype: json|csv|json-table-array-of-objects|json-table|json-table-object-keys|json-table-object-cols|json-table-array-of-pairs|json-table-array|json-table-array-no-headers\n\n\tcount: number of items to generate\n\n\turl: if set will POST data to that url, if not it will print to stdout'
    );
  } else if (url !== undefined) {
    console.log('POST', url, contentTypeForType(type));
    const response = await postJSON(url, output);
    console.log('Reponse:', response.status, response.statusText);
  } else {
    console.log(output);
  }
}

class DateOnly extends Date {
  constructor(v) {
    if (v === undefined) {
      super();
    } else {
      super(v);
    }
  }

  toISOString() {
    return super.toISOString().split('T')[0];
  }

  toJSON() {
    return this.toISOString();
  }
}

console.log((new DateOnly()).toISOString(), (new DateOnly()).toJSON());

export {
  entryPoint,
  DataClass,
  makeWeightedChoice,
  dateLastNDays,
  addAtMostNDaysTo,
  DateOnly,
};
