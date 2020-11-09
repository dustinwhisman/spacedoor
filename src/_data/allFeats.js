require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const raceFeats = await base('Race Feats').select({
    fields: ['Name', 'Level', 'Description'],
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

  const classFeats = await base('Class Feats').select({
    fields: ['Name', 'Level', 'Description'],
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

  const generalFeats = await base('General Feats').select({
    fields: ['Name', 'Level', 'Description'],
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

  const feats = raceFeats.map(r => ({
    id: r.id,
    ...r.fields,
  }))
  .concat(classFeats.map(r => ({
    id: r.id,
    ...r.fields,
  })))
  .concat(generalFeats.map(r => ({
    id: r.id,
    ...r.fields,
  })));

  return feats;
};
