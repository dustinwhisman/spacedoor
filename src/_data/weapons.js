require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const weaponRecords = await base('Weapons').select({
    fields: ['Name', 'Modifier', 'Required Bonus', 'Description', 'Restrictions'],
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

  const weapons = weaponRecords.map(r => ({
    ...r.fields,
  }));

  return weapons;
};
