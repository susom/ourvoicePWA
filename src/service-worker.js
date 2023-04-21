/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.
// You can also remove this file if you'd prefer not to use a
// service worker, and the Workbox build step will be skipped.

import { clientsClaim } from 'workbox-core';
import { ExpirationPlugin } from 'workbox-expiration';
import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// Your service worker needs to import dexie and you should declare your db within the service worker itself or in a script that it will import.
// You can also use es6 imports and compile the service worker using webpack but in any case the db instance has to live within the service worker. You can also have another db instance in the DOM that talks to the same DB.
import { db_walks, db_files } from "./database/db"
import {firestore, storage, auth} from "./database/Firebase";
import { doc,  writeBatch, collection, setDoc } from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import {bulkUpdateDb, cloneDeep, isBase64, buildFileArr} from "./components/util";
import {signInAnonymously} from "firebase/auth";

clientsClaim();

// Precache all of the assets generated by your build process.
// Their URLs are injected into the manifest variable below.
// This variable must be present somewhere in your service worker file,
// even if you decide not to use precaching. See https://cra.link/PWA
precacheAndRoute(self.__WB_MANIFEST);

// Set up App Shell-style routing, so that all navigation requests
// are fulfilled with your index.html shell. Learn more at
// https://developers.google.com/web/fundamentals/architecture/app-shell
const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');
registerRoute(
  // Return false to exempt requests from being fulfilled by index.html.
  ({ request, url }) => {
    // If this isn't a navigation, skip.
    if (request.mode !== 'navigate') {
      return false;
    } // If this is a URL that starts with /_, skip.

    if (url.pathname.startsWith('/_')) {
      return false;
    } // If this looks like a URL for a resource, because it contains // a file extension, skip.

    if (url.pathname.match(fileExtensionRegexp)) {
      return false;
    } // Return true to signal that we want to use the handler.

    return true;
  },
  createHandlerBoundToURL(process.env.PUBLIC_URL + '/index.html')
);

// An example runtime caching route for requests that aren't handled by the
// precache, in this case same-origin .png requests like those from in public/
registerRoute(
  // Add in any other file extensions or routing criteria as needed.
  ({ url }) => url.origin === self.location.origin && url.pathname.endsWith('.png'), // Customize this strategy as needed, e.g., by changing to CacheFirst.
  new StaleWhileRevalidate({
    cacheName: 'images',
    plugins: [
      // Ensure that once this runtime cache reaches a maximum size the
      // least-recently used images are removed.
      new ExpirationPlugin({ maxEntries: 100 }),
    ],
  })
);

// This allows the web app to trigger skipWaiting via
// registration.waiting.postMessage({type: 'SKIP_WAITING'})
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Any other custom service worker logic can go here.
self.addEventListener('activate', event => {
    // Set up timer to periodically check IndexedDB

    //Cloud Firestore and Cloud Storage both have offline persistence and automatic upload , even while offline without service worker
    //just cause i read some blog about a guy that found this hybrid approach to be the best performing... maybe thats outdated?
    //neeed to find that blog again.

    const signIn = async () => {
        try {
            if(!auth.currentUser){
                await signInAnonymously(auth);
            }
        } catch (error) {
            console.error("Error signing in anonymously:", error);
        }
    };

    setInterval(async () => {
        // Query IndexedDB for new data
        console.log("every 60 seconds, navigator", navigator.onLine);

        if(navigator.onLine){
            signIn();

            console.log("in SW , navigator online");
            const walks_col = await db_walks.walks.toCollection();

            console.log("in SW , put al walks in INDEXB into collection");
            walks_col.count().then(count => {
                console.log("in sW , quuery walk collection");
                if (count > 0) {
                    console.log("in SW, has ", count, "waklks");
                    walks_col.toArray(( arr_data) => {
                        console.log("push to firestore", arr_data);
                        batchPushToFirestore(arr_data);
                    });
                }
            }).catch(error => {
                console.error('Error counting walks:', error);
            });
        }else{
            console.log("in SW what navigator not online/");
        }
    }, 60000); // Check every 60 (60000ms) seconds
});

//how to use syncManager ? is syncManager appropriate for what im trying to do?
function testNetworkConnectivityAndSync(tag) {
    fetch('/', { method: 'HEAD' })
        .then(function(response) {
            if (response.ok) {
                console.log('Network connectivity test succeeded. Attempting background sync...');
                self.registration.sync.register(tag);
            } else {
                console.log('Network connectivity test failed. Background sync cancelled.');
            }
        })
        .catch(function(error) {
            console.log('Network connectivity test failed with error:', error);
        });
}

async function uploadFiles(file_arr){
    // Query the database for records where fileName matches any value in the array
    const files         = await db_files.files.where('name').anyOf(file_arr).toArray();
    // console.log("files to array", files);
    const promises = files.map((file) => {
        const file_type = file.name.indexOf("audio") > -1 ? "audio_" : "photo_";
        const temp          = file.name.split("_" + file_type);
        const file_name     = file_type + temp[1];
        const temp_path     = temp[0].split("_");
        const file_path     = temp_path[0] + "/" + temp_path[1] + "/" + temp_path[2] + "/" + file_name;

        const storageRef    = ref(storage, file_path);
        let fileToUpload    = file.file;
        if (isBase64(fileToUpload)) {
            const binaryString = atob(fileToUpload.split(",")[1]);
            const byteArray = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                byteArray[i] = binaryString.charCodeAt(i);
            }
            fileToUpload = new Blob([byteArray], { type: "image/png" });
        }

        return uploadBytes(storageRef, fileToUpload).then(() => {
            // console.log(file.name, "uploaded");
        });
    });

    await Promise.all(promises);
};

function batchPushToFirestore(walk_data){
    // Add walk to Firestore, Add geotags Subcollection to walk, Upload files to Storage
    const update_records    = [];
    let files_arr           = [];

    // Create a batch object
    const batch = writeBatch(firestore);

    walk_data.filter(function(item) {
        //need to figure out why the query doesnt give proper collection
        //for now just filter out whole data set which should never really get that many
        if (item.uploaded || !item.complete) {
            return false; // skip
        }
        return true;
    }).map((item) => {
        // TRIM THE LOCAL CACHE TO MAKE RECORD FOR FIRESTORE
        let doc_id    = item.project_id + "_" + item.user_id + "_" + item.timestamp;
        let doc_data  = {
            "device"    : item.device,
            "lang"      : item.lang,
            "project_id": item.project_id,
            "timestamp" : item.timestamp,
            "photos"    : item.photos
        };
        //create document
        let doc_ref     = doc(firestore, "ov_walks", doc_id);

        //create subcollection under document
        let geotags     = item.geotags;
        let sub_ref     = collection(doc_ref, "geotags");
        geotags.forEach((geotag,index) => {
            let subid   = (index+1).toString();
            //add each walk route geo data point in order
            setDoc(doc(sub_ref, subid), {geotag})
                .then((docRef) => {
                    console.log('in SW Document written with ID: ', docRef.id);
                }).catch((error) => {
                    console.error('Error adding document: ', error);
                });
        });

        //set the main doc into batch for single processing
        batch.set(doc_ref, doc_data);

        //collect records to update the indexdb "uploaded" flag
        const uploaded_record = cloneDeep(item);
        uploaded_record.uploaded = 1;
        update_records.push(uploaded_record);

        //build array of files from the walks that need uploading to storage
        files_arr = [...files_arr, ...buildFileArr(doc_id, item.photos)];
    });

    // Commit the batch of walk data
    batch.commit().then(() => {
        console.log('in SW and upload the indivdual files' , files_arr);
        uploadFiles(files_arr);
        console.log('in SW now update the walks in indexDB');
        bulkUpdateDb(db_walks, "walks", update_records);
    }).catch((error) => {
        console.error('Batch write failed:', error);
    });
}
