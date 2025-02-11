export class User {
  constructor(id, username, usergroup) {
    this.id = id;
    this.username = username;
    this.usergroup = usergroup;
  }

  // Beispielmethoden zur Berechtigungsprüfung
  canRead(resource) {
    if (this.usergroup === 'Administrator') return true;
    if (this.usergroup === 'Mitarbeiter') {
      // Beispiel: Mitarbeiter haben evtl. nur Lesezugriff auf bestimmte Ressourcen
      return true;
    }
    return false;
  }

  canWrite(resource) {
    if (this.usergroup === 'Administrator') return true;
    if (this.usergroup === 'Mitarbeiter') {
      // Beispiel: Mitarbeiter dürfen evtl. nicht schreiben
      return false;
    }
    return false;
  }
}
