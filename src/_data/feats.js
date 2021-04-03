require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const featRecords = await base('General Feats').select({
    fields: ['Name', 'Level', 'Description', 'IsOncePer'],
    sort: [
      {
        field: 'Level',
        direction: 'asc',
      },
      {
        field: 'Order',
        direction: 'asc',
      },
    ]
  }).all();

  const feats = featRecords.map(r => ({
    id: r.id,
    ...r.fields,
  }));

  return feats;
};
