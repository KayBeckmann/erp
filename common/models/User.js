// common/models/User.js
export class User {
  constructor(id, username, groups, address, healthInsurance, taxNumber, taxClass, weeklyHours, wageSalary) {
    this.id = id;
    this.username = username;
    this.groups = groups; // Array von Gruppen
    this.address = address;
    this.healthInsurance = healthInsurance;
    this.taxNumber = taxNumber;
    this.taxClass = taxClass;
    this.weeklyHours = weeklyHours;
    this.wageSalary = wageSalary;
  }

  // Beispielmethoden zur Berechtigungsprüfung
  canRead(resource) {
    if (this.isAdmin()) return true;
    return true;
  }

  canWrite(resource) {
    if (this.isAdmin()) return true;
    return false;
  }

  isAdmin() {
    return this.groups.includes('Admin');
  }
}
