require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const raceFeats = await base('Race Feats').select({
    fields: ['Name', 'Level', 'Description', 'Race', 'IsOncePer'],
    sort: [
      {
        field: 'Level',
        direction: 'asc',
      },
      {
        field: 'Name',
        direction: 'asc',
      },
    ]
  }).all();

  const raceRecords = await base('Races').select({
    fields: ['Name'],
  }).all();

  const races = raceRecords.reduce((acc, r) => ({
    ...acc,
    [r.id]: r.fields.Name,
  }), {});

  const classFeats = await base('Class Feats').select({
    fields: ['Name', 'Level', 'Description', 'Class', 'IsOncePer'],
    sort: [
      {
        field: 'Level',
        direction: 'asc',
      },
      {
        field: 'Name',
        direction: 'asc',
      },
    ]
  }).all();

  const classRecords = await base('Classes').select({
    fields: ['Name'],
  }).all();

  const classes = classRecords.reduce((acc, r) => ({
    ...acc,
    [r.id]: r.fields.Name,
  }), {});

  const generalFeats = await base('General Feats').select({
    fields: ['Name', 'Level', 'Description', 'IsOncePer'],
    sort: [
      {
        field: 'Order',
        direction: 'asc',
      },
      {
        field: 'Name',
        direction: 'asc',
      },
    ]
  }).all();

  const feats = raceFeats.map(r => ({
    id: r.id,
    ...r.fields,
    race: races[r.fields.Race],
    type: `${races[r.fields.Race]} Feat`,
  }))
  .concat(classFeats.map(r => ({
    id: r.id,
    ...r.fields,
    class: r.fields.Class?.map((i) => classes[i]).join(','),
    type: `${r.fields.Class?.map((i) => classes[i]).join(',')} Feat`.replace(/^The\s/, ''),
  })))
  .concat(generalFeats.map(r => ({
    id: r.id,
    ...r.fields,
    type: 'General Feat'
  })));

  return feats;
};
