import { schemaVersion, updateSchema, uuid } from './db-utilities.mjs';

const firestore = firebase.firestore();
let user = null;
document.addEventListener('user-logged-in', ({ detail }) => {
  user = detail;
});

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
        if (user) {
          firestore
            .collection('character-sheets')
            .doc(key)
            .get()
            .then((doc) => {
              if (doc.exists) {
                resolve(doc.data());
              } else {
                throw new Error(`We couldn't find this character sheet.`);
              }
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        } else {
          resolve(event.target.result);
        }
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
        if (user) {
          firestore
            .collection('character-sheets')
            .where('uid', '==', user.uid)
            .get()
            .then((querySnapshot) => {
              const characters = [];
              querySnapshot.forEach((doc) => {
                characters.push(doc.data());
              });

              event.target.result.forEach((character) => {
                if (!characters.some((c) => c.key === character.key)) {
                  characters.push(character);
                }
              });

              resolve(characters);
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        } else {
          resolve(event.target.result);
        }
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
        if (user) {
          firestore
            .collection('character-sheets')
            .doc(thingToAdd.key)
            .set({ ...thingToAdd, uid: user.uid })
            .then(() => {
              const successEvent = new CustomEvent('item-added', { detail: thingToAdd.key });
              document.dispatchEvent(successEvent);
            })
            .catch(console.error);
        } else {
          const successEvent = new CustomEvent('item-added', { detail: thingToAdd.key });
          document.dispatchEvent(successEvent);
        }
      };
    };
  }
};

export const deleteFromDb = (storeName, key) => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('character-sheets', schemaVersion);
    request.onupgradeneeded = updateSchema;

    request.onerror = (event) => {
      console.log(`Database error: ${event.target.errorCode}`);
      reject();
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const result = objectStore.get(key);
      result.onsuccess = (event) => {
        const endResult = objectStore.delete(key);
        endResult.onsuccess = () => {
          if (user) {
            firestore
              .collection('character-sheets')
              .doc(key)
              .delete()
              .then(() => {
                const successEvent = new CustomEvent('item-deleted');
                document.dispatchEvent(successEvent);
                resolve();
              })
              .catch((error) => {
                console.error(error);
                reject();
              });
          } else {
            const successEvent = new CustomEvent('item-deleted');
            document.dispatchEvent(successEvent);
            resolve();
          }
        }
      };
    }
  });
}
