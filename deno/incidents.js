//@format
import {
  entryPoint,
  DataClass,
  makeWeightedChoice,
  dateLastNDays,
  addAtMostNDaysTo
} from './datagen.js';

const TYPES = ['Injury', 'Near Miss', 'Hazzard', 'Other'],
  typesGen = makeWeightedChoice(TYPES, [2, 3, 3, 1]),
  SOURCES = [
    'Ergonomic',
    'Chemical',
    'Biological',
    'Fire',
    'Electrical',
    'Equipment',
    'Environment',
    'Other'
  ],
  sourcesGen = makeWeightedChoice(SOURCES, [3, 2, 1, 2, 3, 4, 3, 1]),
  CONSEQUENCES = [
    'Lost Time',
    'Medical Case',
    'First Aid',
    'No Treatment',
    'Lost Days',
    'Other'
  ],
  consequencesGen = makeWeightedChoice(CONSEQUENCES, [3, 1, 2, 3, 2, 1]),
  SEVERITY = ['Low', 'Medium', 'High', 'Critical'],
  severityGen = makeWeightedChoice(SEVERITY, [1, 3, 2, 1]),
  BODY_PARTS = [
    'Head',
    'Back (Upper)',
    'Back (Lower)',
    'Arm (Left)',
    'Arm (Right)',
    'Hand (Left)',
    'Hand (Right)',
    'Leg (Left)',
    'Leg (Right)',
    'Face',
    'Foot (Left)',
    'Foot (Right)',
    'Torso',
    'Other'
  ],
  bodyPartsGen = makeWeightedChoice(
    BODY_PARTS,
    [3, 2, 4, 2, 3, 2, 3, 2, 3, 1, 2, 3, 2, 1]
  ),
  PLACES = ['Office', 'Parking', 'Factory', 'Deposit', 'Other'],
  placesGen = makeWeightedChoice(PLACES, [3, 1, 2, 2, 1]),
  JOB_TYPES = ['Driver', 'Technician', 'Office Worker', 'Other'],
  jobTypeGen = makeWeightedChoice(JOB_TYPES, [1, 3, 2, 2]),
  LOCATIONS = ['California', 'Texas', 'Florida', 'New York', 'Washington'],
  locationsGen = makeWeightedChoice(LOCATIONS, [2, 2, 3, 2, 1]);

class Incident extends DataClass {
  constructor() {
    super();
    this.incidentDate = null;
    this.reportDate = null;
    this.severity = null;
    this.type = null;
    this.source = null;
    this.consequence = null;
    this.bodyPart = null;
    this.place = null;
    this.location = null;
    this.jobType = null;
    this.note = null;
  }
}

Incident.FIELDS = [
  'incidentDate',
  'reportDate',
  'severity',
  'type',
  'source',
  'consequence',
  'bodyPart',
  'place',
  'location',
  'jobType',
  'note'
];
Incident.COLUMNS = [
  'Incident Date',
  'Report Date',
  'Severity',
  'Type',
  'Source',
  'Consequence',
  'Body Part',
  'Place',
  'Location',
  'Job Type',
  'Note'
];

function main() {
  const fieldGens = {
    incidentDate: _ => dateLastNDays(60),
    reportDate: o => addAtMostNDaysTo(o.incidentDate, 10),
    severity: _ => severityGen(),
    type: _ => typesGen(),
    source: _ => sourcesGen(),
    consequence: _ => consequencesGen(),
    bodyPart: _ => bodyPartsGen(),
    place: _ => placesGen(),
    location: _ => locationsGen(),
    jobType: _ => jobTypeGen(),
    note: _ => ''
  };

  entryPoint(Deno.args, Incident, fieldGens);
}

main();
