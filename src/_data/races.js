require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const raceRecords = await base('Races').select({
    fields: ['Name', 'Description'],
    sort: [
      {
        field: 'Order',
        direction: 'asc',
      },
    ]
  }).all();

  const races = raceRecords.map(r => ({
    slug: r.fields.Name.toLowerCase().replace(/\s/g, '-'),
    ...r.fields,
  }));

  return races;
};
