const META_DB_NAME = "meta_database";
const META_TABLE_NAME = "meta_table";
const VERSION = 1;

let db = null;

class IndexDBCleanWorker {
    static connect() {
        return new Promise((resolve, reject) => {
            const request = self.indexedDB.open(META_DB_NAME, VERSION);

            request.onerror = (event) => {
                reject(event.target.error);
            };

            request.onsuccess = async (event) => {
                db = event.target.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                db.createObjectStore(META_TABLE_NAME);
            };
        })
    }

    static async removeOldDatabases() {

    }

    static async releaseTable() {

    }
}

self.IndexDBCleanWorker.connect().catch(error => console.log(error));

self.onmessage = async function(event) {
};