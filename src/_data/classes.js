require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const records = await base('Classes').select({
    fields: ['Name', 'Primary Stat', 'Secondary Stat', 'Penalty', 'Description'],
    sort: [{
      field: 'Name',
      direction: 'asc',
    }],
  }).all();

  const classes = records.map((record) => ({
    ...record.fields,
    slug: record.fields.Name.toLowerCase().replace(/\s/g, '-'),
    shorthand: record.fields.Name.replace(/^The\s/, ''),
  }));

  return classes;
};
