import Dexie from 'dexie';

export const db = new Dexie('ERPDatabase');

db.version(1).stores({
  users: '++id, username, groups'
});

// Beispielhafte Synchronisationsfunktion (kann erweitert werden)
export async function syncUsers() {
  try {
    const response = await fetch('http://localhost:3001/api/users');
    const serverUsers = await response.json();
    await db.users.clear();
    await db.users.bulkAdd(serverUsers);
  } catch (error) {
    console.error("Sync-Fehler:", error);
  }
}
