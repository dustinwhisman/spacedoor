export const schemaVersion = 3;

export const updateSchema = (event) => {
  const upgradeDb = event.target.result;

  if (upgradeDb.objectStoreNames.contains('characters')) {
    upgradeDb.deleteObjectStore('characters');
  }
  upgradeDb.createObjectStore('characters', { keyPath: 'key' });
};

// tiny uuidv4 generator
// https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
export const uuid = () => ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);
