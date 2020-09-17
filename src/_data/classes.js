require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const classRecords = await base('Classes').select({
    fields: ['Name', 'Primary Stat', 'Secondary Stat', 'Penalty', 'Description', 'Subclasses'],
    sort: [{
      field: 'Name',
      direction: 'asc',
    }],
  }).all();

  const classes = Promise.all(classRecords.map(async (record) => {
    const subclasses = await base('Subclasses').select({
      fields: ['Name', 'Description'],
      filterByFormula: `OR(${record.fields.Subclasses.map(r => `RECORD_ID()='${r}'`).join(',')})`,
    }).all();

    return {
      ...record.fields,
      slug: record.fields.Name.toLowerCase().replace(/\s/g, '-'),
      shorthand: record.fields.Name.replace(/^The\s/, ''),
      subclasses: subclasses.map((r) => ({
        ...r.fields
      })),
    };
  }));

  return classes;
};
