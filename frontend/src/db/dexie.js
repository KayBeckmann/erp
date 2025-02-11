import Dexie from 'dexie';

export const db = new Dexie('ERPDatabase');

export function initDexie() {
  db.version(1).stores({
    users: '++id, username, usergroup' // Beispiel-Schema für Benutzer
    // Weitere Stores können hier definiert werden
  });
}
