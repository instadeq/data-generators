//@format
/*globals Deno*/

const COLUMN_NAMES = [
    'Country',
    'Code',
    'City',
    'Year',
    'Quarter',
    'Line',
    'Amount'
  ],
  ROW_FIELD_NAMES = [
    'country',
    'code',
    'city',
    'year',
    'quarter',
    'line',
    'amount'
  ],
  CURRENT_YEAR = new Date().getFullYear(),
  LINES = ['Watches', 'Phones', 'Tablets', 'VR'],
  BASE_DATA = [
    ['United States', 'US', 'New York'],
    ['Portugal', 'PT', 'Lisbon'],
    ['Argentina', 'AR', 'Buenos Aires'],
    ['Nigeria', 'NG', 'Lagos'],
    ['China', 'CN', 'Shanghai'],
    ['Australia', 'AU', 'Sydney'],
    ['United States', 'US', 'San Francisco'],
    ['Portugal', 'PT', 'Porto'],
    ['Argentina', 'AR', 'Cordoba'],
    ['Nigeria', 'NG', 'Kano'],
    ['China', 'CN', 'Beijing'],
    ['Australia', 'AU', 'Melbourne']
  ];

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

function genRandomFields() {
  const year = CURRENT_YEAR - randint(0, 1),
    quarter = `Q${randint(1, 4)}`,
    line = choice(LINES),
    amount = randdec(100, 1000);
  return [year, quarter, line, amount];
}

class Row {
  constructor(country, code, city, year, quarter, line, amount) {
    this.country = country;
    this.code = code;
    this.city = city;
    this.year = year;
    this.quarter = quarter;
    this.line = line;
    this.amount = amount;
  }

  toJSON() {
    return {
      Country: this.country,
      Code: this.code,
      City: this.city,
      Year: this.year,
      Quarter: this.quarter,
      Line: this.line,
      Amount: this.amount
    };
  }

  toCSV() {
    return [
      this.country,
      this.code,
      this.city,
      this.year,
      this.quarter,
      this.line,
      this.amount
    ];
  }
}

function genRows(count) {
  const baseDataLen = BASE_DATA.length,
    result = new Array(count);

  for (let i = 0; i < count; i += 1) {
    const [country, code, city] = BASE_DATA[i % baseDataLen],
      [year, quarter, line, amount] = genRandomFields(),
      row = new Row(country, code, city, year, quarter, line, amount);

    result[i] = row;
  }

  return result;
}

function toCSVCols(seq) {
  return JSON.stringify(seq).slice(1, -1);
}

function toJSON(v) {
  return JSON.stringify(v, null, 2);
}

function generateForType(type, count) {
  switch (type) {
    case 'json':
    case 'json-table-array-of-objects':
      return toJSON(genRows(count));
    case 'json-table':
    case 'json-table-object-keys':
      return toJSON({
        rows: genRows(count).map(v => v.toCSV()),
        columns: COLUMN_NAMES
      });
    case 'json-table-object-cols': {
      const rows = genRows(count);
      return toJSON(
        Object.fromEntries(
          ROW_FIELD_NAMES.map(key => {
            return [key, rows.map(row => row[key])];
          })
        )
      );
    }
    case 'json-table-array-of-pairs': {
      const rows = genRows(count);
      return toJSON(
        ROW_FIELD_NAMES.map(key => {
          return [key, rows.map(row => row[key])];
        })
      );
    }

    case 'json-table-array':
      return toJSON([COLUMN_NAMES].concat(genRows(count).map(v => v.toCSV())));
    case 'json-table-array-no-headers':
      return toJSON(genRows(count).map(v => v.toCSV()));
    case 'csv':
      return [toCSVCols(COLUMN_NAMES)]
        .concat(genRows(count).map(v => toCSVCols(v.toCSV())))
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

async function main() {
  const [type, countStr, url] = Deno.args,
    count0 = parseInt(countStr, 10),
    count = Number.isNaN(count0) ? 10 : Math.max(1, count0),
    output = generateForType(type, count);

  if (output === null) {
    console.error('Unknown type', type);
  } else if (url !== undefined) {
    console.log('POST', url, contentTypeForType(type));
    const response = await postJSON(url, output);
    console.log('Reponse:', response.status, response.statusText);
  } else {
    console.log(output);
  }
}

main();
