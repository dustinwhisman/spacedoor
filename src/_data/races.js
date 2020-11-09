require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const raceRecords = await base('Races').select({
    fields: ['Name', 'Description', 'Race Feats'],
    sort: [
      {
        field: 'Order',
        direction: 'asc',
      },
    ]
  }).all();

  const races = Promise.all(raceRecords.map(async (record) => {
    let feats = [];
    if (record.fields['Race Feats'] != null) {
      feats = await base('Race Feats').select({
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
        ],
        filterByFormula: `OR(${record.fields['Race Feats'].map(r => `RECORD_ID()='${r}'`).join(',')})`,
      }).all();
    }

    return {
      ...record.fields,
      slug: record.fields.Name.toLowerCase().replace(/\s/g, '-'),
      feats: feats.map((r) => ({
        id: r.id,
        ...r.fields,
      })),
    };
  }));

  return races;
};
