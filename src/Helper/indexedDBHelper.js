// indexedDBHelper.js
// const fileDB = "FileStorageDB"; // name database
// const files = "files"; // name object store

// open IndexedDB
export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fileDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files"); //create object store if it doesn't exist
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// save file to IndexedDB
export const saveFileToDB = async (key, file) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.put(file, key);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        window.dispatchEvent(new Event("indexedDBUpdated")); // report change
        resolve(true);
      }
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error saving file to DB:", error);
    return false;
  }
};

//  get file from IndexedDB
export const getFileFromDB = async (key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("files", "readonly");
      const store = transaction.objectStore("files");
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null); // return null if not found
      request.onerror = () => reject(null);
    });
  } catch (error) {
    console.error("Error getting file from DB:", error);
    return null;
  }
};

// delete file from IndexedDB

export const deleteFileFromDB = async (key) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.delete(key);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        window.dispatchEvent(new Event("indexedDBUpdated")); // report change
        resolve(true);
      }
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error deleting file from DB:", error);
    return false;
  }
};

// delete all files from IndexedDB
export const clearAllFilesFromDB = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.clear(); // Xóa toàn bộ dữ liệu trong object store

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("Tất cả file đã bị xóa khỏi IndexedDB.");
        resolve(true);
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Lỗi khi xóa tất cả file IndexedDB:", error);
    return false;
  }
};

// get all keys from IndexedDB
export const getAllKeysFromDB = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readonly");
    const store = transaction.objectStore("files");
    const request = store.getAllKeys();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách key từ IndexedDB:", error);
    return [];
  }
};
