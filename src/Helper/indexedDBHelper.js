// indexedDBHelper.js
// const fileDB = "FileStorageDB"; // Tên database
// const files = "files"; // Tên bảng

export const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("fileDB", 1);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("files")) {
        db.createObjectStore("files"); //Tạo object store nếu chưa tồn tại
      }
    };
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
};

// Lưu file vào IndexedDB
export const saveFileToDB = async (key, file) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.put(file, key);
    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        window.dispatchEvent(new Event("indexedDBUpdated")); // 🔥 Phát sự kiện
        resolve(true);
      }
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error saving file to DB:", error);
    return false;
  }
};

//  Lấy file từ IndexedDB
export const getFileFromDB = async (key) => {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("files", "readonly");
      const store = transaction.objectStore("files");
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result || null); // Trả về null nếu không tìm thấy
      request.onerror = () => reject(null);
    });
  } catch (error) {
    console.error("Error getting file from DB:", error);
    return null;
  }
};

// Xóa file khỏi IndexedDB

export const deleteFileFromDB = async (key) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.delete(key);

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        window.dispatchEvent(new Event("indexedDBUpdated")); // 🔥 Phát sự kiện
        resolve(true);
      }
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("Error deleting file from DB:", error);
    return false;
  }
};

// 🔥 Xóa tất cả file khỏi IndexedDB 🔥
export const clearAllFilesFromDB = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction("files", "readwrite");
    const store = transaction.objectStore("files");
    store.clear(); // Xóa toàn bộ dữ liệu trong object store

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => {
        console.log("✅ Tất cả file đã bị xóa khỏi IndexedDB.");
        resolve(true);
      };
      transaction.onerror = () => reject(transaction.error);
    });
  } catch (error) {
    console.error("❌ Lỗi khi xóa tất cả file IndexedDB:", error);
    return false;
  }
};

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
    console.error("❌ Lỗi khi lấy danh sách key từ IndexedDB:", error);
    return [];
  }
};
