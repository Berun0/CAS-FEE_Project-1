/* eslint-disable import/prefer-default-export */

export class NoteStorage {
  constructor() {
    const notes = JSON.parse(localStorage.getItem("Notes_v1") || "[ ]"); // array of objects
    this.notes = notes;
    localStorage.setItem("Notes_v1", JSON.stringify(notes));
  }

  getAll() {
    return this.notes;
  }

  update(notes) {
    localStorage.setItem("Notes_v1", JSON.stringify(this.notes));
    return this.notes;
  }
}
