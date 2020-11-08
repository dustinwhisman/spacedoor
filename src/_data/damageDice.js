require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const weaponRecords = await base('Weapons').select({
    fields: ['Mixed Success Damage', 'Success Damage', 'Critical Success Damage'],
  }).all();

  const damageDice = [];
  weaponRecords.forEach((weapon) => {
    if (!damageDice.includes(weapon.fields['Mixed Success Damage'])) {
      damageDice.push(weapon.fields['Mixed Success Damage']);
    }

    if (!damageDice.includes(weapon.fields['Success Damage'])) {
      damageDice.push(weapon.fields['Success Damage']);
    }

    if (!damageDice.includes(weapon.fields['Critical Success Damage'])) {
      damageDice.push(weapon.fields['Critical Success Damage']);
    }
  });

  const results = damageDice
    .filter(d => !!d)
    .sort((a, b) => {
      if (a.length > 3 && b.length <= 3) {
        return 1;
      }

      if (a.length <= 3 && b.length > 3) {
        return -1;
      }

      if (a < b) {
        return -1;
      }

      if (a > b) {
        return 1;
      }

      return 0;
    });

  return results;
};
