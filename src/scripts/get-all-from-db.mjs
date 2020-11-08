import { schemaVersion, updateSchema, uuid } from './db-utilities.mjs';

export const getAllFromDb = (storeName) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('character-sheets', schemaVersion);
    request.onupgradeneeded = updateSchema;

    request.onerror = (event) => {
      const error = `Database error: ${event.target.errorCode}`;
      reject(error);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const result = objectStore.getAll();
      result.onsuccess = (event) => {
        resolve(event.target.result);
      };
    }
  });
};
