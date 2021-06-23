/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import { Note } from "./note.js";
import { SETTINGS, saveSettings } from "./data/settings-storage.js";
import { getNotes, saveNotes } from "./data/notes-storage.js";

export class NoteService {
  constructor() {
    this.notes = []; // noteService.notes will have all the notes
  }

  async loadNotes() {
    this.notes = await getNotes();
    console.log("serverData loaded: ");
    console.log(this.notes);

    // if no datastorage - we get 'null' back - take these values instead:
    if (!this.notes) {
      this.notes = [];
      this.notes.push(new Note(0, "Titel 00", "Prio: 0\nDuedate: 2021-05-26\nCreationdate: 16\nDonedate: 2021-05-24", 0, "2021-05-26", 16, false, "2021-05-24"));
      this.notes.push(new Note(1, "Titel 01", "Prio: 2\nDuedate: \"\"\nCreationdate: 17\nDonedate: \"\"", 2, "", 17, false, ""));
      SETTINGS.nextID = this.notes.length;
    }
    return this.notes;
  }

  async saveAll() {
    // saves all this.notes
    // and all SETTINGS
    // to local storage
    await saveNotes(this.notes);
    saveSettings();
  }

  getFilteredNotes(orderBy, showDone) {
    let filteredNotes = this.notes;
    console.log("getFilteredNotes: this.notes");
    console.log(filteredNotes);
    if (!showDone) {
      // copy of this.notes filter
      filteredNotes = filteredNotes.filter((current) => {
        return current.donedate === "";
      });
      // settings object update
      SETTINGS.showDone = showDone;
    }
    // sort needs to happen all the time, as filteredNotes is always new
    // return this.sortArrayOfObjects(filteredNotes, orderBy);
    const temp = this.sortArrayOfObjects(filteredNotes, orderBy);
    console.log("result of sortArray");
    console.log(temp);
    return temp;
  }

  sortArrayOfObjects(myArray, sortKey = "title") {
    // returns a sorted array of objects
    console.log(`sortkey: ${sortKey}`);
    if (myArray.length > 0) {
      const sortFunction = {
        // sortKey can be
        string: (a, b) => {
          console.log("sorting strings");
          // do not consider uppercase
          let sa = a.toLowerCase();
          let sb = b.toLowerCase();
          // sort "" empty string = "sometime" last
          if (!sa) {
            sa = "Z";
          }
          if (!sb) {
            sb = "Z";
          }
          return sa > sb ? 1 : sa < sb ? -1 : 0;
        },
        number: (a, b) => {
          console.log("sorting biggest to smallest numbers");
          return b - a;
        },
      };
      // ermittle typeof v. key anhand des ersten arrayelementes
      // -> fn for "string" or "number"
      const compareFunction = sortFunction[typeof myArray[0][sortKey]];
      return [...myArray].sort((firstItem, secondItem) => {
        return compareFunction(firstItem[sortKey], secondItem[sortKey]);
      }); // z.B. firstItem["title"], secondItem["title"]
    } // if (myArray)
    // if myArray has no length property, give an empty array back
    return [];
  }

  checkNote(id) {
    // get current note in the notes array of objetcs
    const idInNotes = this.notes.findIndex((cur) => { return cur.id === id; });
    console.log(`Checknote_id:${idInNotes}`);
    let doneValue;
    // toggle the donedate to "" or the current date
    this.notes[idInNotes].donedate ? (doneValue = "") : (doneValue = this.getTodayUS());
    this.notes[idInNotes].donedate = doneValue;
    this.saveAll();
  }

  addNote(note) {
    // save to notes Object
    this.notes.push(note);
    // increment nextID
    SETTINGS.nextID++;
    this.saveAll();
  }

  deleteNote(id) {
    // reduce notes to entries ≠ id
    this.notes = this.notes.filter((note) => { return note.id !== id; });
    this.saveAll();
  }

  updateNote(note) {
    this.saveAll();
  }

  getNote(id) {
    console.log(`getNote_id:${id}`);
    console.log(this.notes);
    const idInNotes = this.notes.findIndex((cur) => { return cur.id === id; });
    console.log(`getNote_idInNotes:${idInNotes}`);
    console.log(this.notes[idInNotes]);
    return this.notes[idInNotes];
  }

  getTodayUS() {
    // returns current date in YYYY-MM-DD
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    // make sure single digits are preceded by "0"
    // add a "0" then take the last 2 chars in the string
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);

    return `${year}-${month}-${day}`;
  }
}

// instanciates an object to be used throughout the app
export const noteService = new NoteService();
