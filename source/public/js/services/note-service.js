/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
/* eslint-disable import/prefer-default-export */
import { NoteStorage } from "./data/note-storage.js";
import { Note } from "./note.js";

export class NoteService {
  constructor() {
    this.notes = []; // noteService.notes will have all the notes
    this.settings = { // and all the settings, initially instanciated with these values:
      nextID: 0,
      locale: "en",
      theme: "dark",
      sort: "creationdate",
      showDone: true,
    };
  }

  loadData() {
    this.notes.push(new Note(0, "Titel", "A Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aperiam quidem qui fugiat unde quam temporibus quis, aspernatur reprehenderit sunt vel sed, illo, autem neque nesciunt?Architecto harum necessitatibus dolor suscipit.", 0, "2021-05-26", 16, false, "2021-05-24"));
    this.notes.push(new Note(1, "Titel2", "Z Aspernatur reprehenderit sunt vel sed, illo, autem neque nesciunt?Architecto harum necessitatibus dolor suscipit.", 2, "", 17, false, ""));
    this.settings.nextID = this.notes.length;
    return this.notes;
  }

  getFilteredNotes(orderBy, showDone) {
    let filteredNotes = this.notes;
    if (!showDone) {
      // copy of this.notes filter
      filteredNotes = filteredNotes.filter((current) => {
        return current.donedate === "";
      });
      // settings object update
      this.settings.showDone = showDone;
    }
    // sort needs to happen all the time, as filteredNotes is always new
    return this.sortArrayOfObjects(filteredNotes, orderBy);
  }

  sortArrayOfObjects(myArray, sortKey = "title") {
    // returns a sorted array of objects
    // sortKey can be
    if (myArray.length > 0) {
      const sortFunction = {
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
      // ermittle typeof v. key-value anhand des ersten arrayelementes
      // -> fn for "string" or "number"
      const compareFunction = sortFunction[typeof myArray[0][sortKey]];
      return myArray.sort((firstItem, secondItem) => {
        return compareFunction(firstItem[sortKey], secondItem[sortKey]);
      }); // z.B. firstItem["price"], secondItem["price"]
    } // if (myArray)
    // if myArray has no length property, give an array back
    return [];
  }

  checkNote(id) {
    const idInNotes = this.notes.findIndex((cur) => { return cur.id === id; });
    console.log(`Checknote_id:${idInNotes}`);
    let doneValue;
    this.notes[idInNotes].donedate ? (doneValue = "") : (doneValue = this.getTodayUS());
    this.notes[idInNotes].donedate = doneValue;
  }

  addNote(note) {
    // save to notes Object
    this.notes.push(note);
    // increment nextID
    this.settings.nextID++;
  }

  updateNote(note) {
    const { id } = note;
    // console.log(`updateNote_id:${id}`);
    // console.log(this.notes);
    // const idInNotes = this.notes.findIndex((cur) => { return cur.id === id; });
    // console.log(`updateNote_idInNotes:${idInNotes}`);
    // console.log(this.notes[idInNotes]);
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
    const month = (`0${currentDate.getMonth() + 1}`).slice(-2);
    const day = (`0${currentDate.getDate()}`).slice(-2);

    return `${year}-${month}-${day}`;
  }
}

// instanciates an object to be used throughout the app
export const noteService = new NoteService();
