require('dotenv').config();
const Airtable = require('airtable');
const base = new Airtable({
  apiKey: process.env.API_KEY,
}).base(process.env.APP_ID);

module.exports = async () => {
  const classRecords = await base('Classes').select({
    fields: ['Name', 'Primary Stat', 'Secondary Stat', 'Penalty', 'Description', 'Subclasses', 'Class Feats', 'Special Equipment'],
    sort: [{
      field: 'Name',
      direction: 'asc',
    }],
  }).all();

  const classes = Promise.all(classRecords.map(async (record) => {
    const subclasses = await base('Subclasses').select({
      fields: ['Name', 'Description'],
      sort: [{
        field: 'Order',
        direction: 'asc',
      }],
      filterByFormula: `OR(${record.fields.Subclasses.map(r => `RECORD_ID()='${r}'`).join(',')})`,
    }).all();

    const equipment = await base('Special Equipment').select({
      fields: ['Name', 'Description'],
      filterByFormula: `OR(${record.fields['Special Equipment'].map(r => `RECORD_ID()='${r}'`)})`,
    }).all();

    let feats = [];
    if (record.fields['Class Feats'] != null) {
      feats = await base('Class Feats').select({
        fields: ['Name', 'Level', 'Description', 'Subclass'],
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
        filterByFormula: `OR(${record.fields['Class Feats'].map(r => `RECORD_ID()='${r}'`).join(',')})`,
      }).all();
    }

    return {
      ...record.fields,
      slug: record.fields.Name.toLowerCase().replace(/\s/g, '-'),
      shorthand: record.fields.Name.replace(/^The\s/, ''),
      subclasses: subclasses.map((r) => ({
        ...r.fields,
        shorthand: r.fields.Name.toLowerCase().replace(/\s/g, '-'),
      })),
      equipment: equipment.map((r) => ({
        ...r.fields,
      })),
      feats: feats.map((r) => {
        let subs = [];
        if (r.fields.Subclass != null) {
          r.fields.Subclass.forEach((s) => {
            const match = subclasses.find((x) => {
              return x.id === s;
            });

            if (match != null) {
              subs.push({
                name: match.fields.Name,
                shorthand: match.fields.Name.toLowerCase().replace(/\s/g, '-'),
              });
            }
          });
        }

        return {
          ...r.fields,
          subclasses: subs,
        };
      }),
    };
  }));

  return classes;
};
