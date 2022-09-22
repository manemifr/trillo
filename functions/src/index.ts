import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const algoliasearch = require("algoliasearch");

const APP_ID = functions.config().algolia.app;
const ADMIN_KEY = functions.config().algolia.key;

const client = algoliasearch(APP_ID, ADMIN_KEY);

// Listen to User changes
export const addToIndex = functions.firestore
    .document("users/{id}")
    .onCreate((snapshot) => {
      const data = snapshot.data();
      const objectID = snapshot.id;
      const userIndex = client.initIndex("users");
      return userIndex.saveObject({...data, objectID});
    });


export const updateIndex = functions.firestore
    .document("users/{id}")
    .onUpdate((change) => {
      const newData = change.after.data();
      const objectID = change.after.id;
      const userIndex = client.initIndex("users");
      return userIndex.saveObject({...newData, objectID});
    });

export const deleteFromIndex = functions.firestore
    .document("users/{id}")
    .onDelete((snapshot) => {
      const userIndex = client.initIndex("users");
      userIndex.deleteObject(snapshot.id);
    });

// Listen to Card changes
export const addToIndexCard = functions.firestore
    .document("cards/{id}")
    .onCreate((snapshot) => {
      const data = snapshot.data();
      const objectID = snapshot.id;
      const cardIndex = client.initIndex("cards");
      return cardIndex.saveObject({...data, objectID});
    });


export const updateIndexCard = functions.firestore
    .document("cards/{id}")
    .onUpdate((change) => {
      const newData = change.after.data();
      const objectID = change.after.id;
      const changedBy = newData?.lastEdit;

      if (newData && changedBy && changedBy !== newData.assignee) {
        createPush(objectID, newData);
        addNotification(objectID, newData);
      } else {
        console.log("car changed by assignee himself!");
      }
      const cardIndex = client.initIndex("cards");
      return cardIndex.saveObject({...newData, objectID});
    });

export const deleteFromIndexCard = functions.firestore
    .document("cards/{id}")
    .onDelete((snapshot) => {
      const taskIndex = client.initIndex("cards");
      taskIndex.deleteObject(snapshot.id);
    });

// Seed Algolia from existing data
export const seedAlgolia = functions.https.onCall((data, context) =>{
  const records: any[] = [];
  const collection = data.collection;
  console.log("Seed collection: ", collection);
  return admin
      .firestore()
      .collection(collection)
      .get()
      .then((snapshot) =>{
        const docs = snapshot.docs;

        docs.forEach((doc) =>{
          const document = doc.data();

          let record: any;

          if ( collection === "users") {
            record = {
              objectID: doc.id,
              displayName: document.displayName,
              email: document.email,
              photoURL: document.photoURL,
            };
          } else if ( collection === "cards") {
            record = {
              objectID: document.id,
              name: document.name,
              creator: document.creator,
              createdAt: document.createdAt,
              list: document.list,
              board: document.board,
              desc: document.desc,
            };
          }
          console.log("push record: ", record);

          records.push(record);
        });

        // Add or update new objects
        const index = client.initIndex(collection);

        index
            .saveObjects(records)
            .then(() =>{
              console.log("Documents imported into Algolia");
              process.exit(0);
            })
            .catch((error: any) =>{
              console.error("Error when importing documents into Algolia",
                  error);
              process.exit(1);
              return {msg: "Seeding Algolia for collection TEST: " +
              collection};
            });
      })
      .catch((error: any) => {
        console.error("Error getting documments", error);
        return {msg: "Error; " + error};
      });
});


// eslint-disable-next-line require-jsdoc
function createPush(cardId: any, data: any) {
  const assignee = data.assignee;
  if (!assignee) {
    return;
  }
  const payload = {
    notification: {
      title: "Carte mise à jour",
      body: "Une de vos cartes a été mise à jour.",
      badge: "1",
    },
    data: {
      cardId,
    },
  };
  admin
      .firestore()
      .doc(`devices/${assignee}`)
      .get()
      .then(
          (device) => {
            const deviceData = device.data();
            if (deviceData) {
              const token = deviceData["token"];
              console.log(token);
              admin
                  .messaging()
                  .sendToDevice(token, payload)
                  .then(
                      () => {
                        console.log("PUSH SENT");
                      },
                      (err) => {
                        console.log("push err: ", err);
                      }
                  );
            }
          },
          (err) => {
            console.log("device err: ", err);
          }
      );
}

// eslint-disable-next-line require-jsdoc
function addNotification(cardId: any, data: any) {
  const assignee = data.assignee;
  if (!assignee) {
    return;
  }

  admin
      .firestore()
      .collection("notifications")
      .add({
        user: assignee,
        msg: `${data.lastAction} de votre carte ${data.name} a été mis à jour.`,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        cardId,
        read: false,
      })
      .catch((err) =>{
        console.log("error: ", err);
      });
}

