import { schemaVersion, updateSchema, uuid } from './db-utilities.mjs';

export const addToDb = (storeName, thingToAdd) => {
  if (thingToAdd.key == null) {
    thingToAdd.key = uuid();
  }

  const request = indexedDB.open('character-sheets', schemaVersion);
  request.onupgradeneeded = updateSchema;

  request.onerror = (event) => {
    console.log(`Database error: ${event.target.errorCode}`);
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction([storeName], 'readwrite');
    const objectStore = transaction.objectStore(storeName);
    const existingThingRequest = objectStore.get(thingToAdd.key);
    existingThingRequest.onsuccess = (event) => {
      if (event.target.result && event.target.result.isDeleted) {
        thingToAdd.isDeleted = true;
      }

      const result = objectStore.put(thingToAdd);
      result.onsuccess = () => {
        const successEvent = new CustomEvent('item-added', { detail: storeName });
        document.dispatchEvent(successEvent);
      };
    };
  }
};
