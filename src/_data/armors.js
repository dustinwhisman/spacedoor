require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const armorRecords = await base('Armor').select({
    fields: ['Name', 'Modifier', 'Required Bonus', 'Description'],
    sort: [
      {
        field: 'Modifier',
        direction: 'asc',
      },
      {
        field: 'Required Bonus',
        direction: 'asc',
      },
      {
        field: 'Name',
        direction: 'asc',
      },
    ]
  }).all();

  const armors = armorRecords.map(r => ({
    ...r.fields,
  }));

  return armors;
};
