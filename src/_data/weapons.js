require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const weaponRecords = await base('Weapons').select({
    fields: ['Name', 'Modifier', 'Required Bonus', 'Description', 'Restrictions', 'Mixed Success Damage', 'Success Damage', 'Critical Success Damage', 'Custom Dice Roller Link'],
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
    id: r.id,
    ...r.fields,
  }));

  return weapons;
};
