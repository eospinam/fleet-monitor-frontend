import { openDB } from 'idb';

const DB_NAME = 'fleetMonitor';
const STORE = 'telemetry';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveTelemetryOffline(data) {
  const db = await initDB();
  await db.add(STORE, { ...data, synced: false, createdAt: new Date() });
}

export async function getPendingTelemetry() {
  const db = await initDB();
  return await db.getAll(STORE);
}

export async function clearTelemetry(id) {
  const db = await initDB();
  await db.delete(STORE, id);
}
