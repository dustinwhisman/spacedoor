import { schemaVersion, updateSchema, uuid } from './db-utilities.mjs';

export const getFromDb = (storeName, key) => {
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
      const result = objectStore.get(key);
      result.onsuccess = (event) => {
        resolve(event.target.result);
      }
    }
  });
};

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
        const successEvent = new CustomEvent('item-added', { detail: thingToAdd.key });
        document.dispatchEvent(successEvent);
      };
    };
  }
};
