/* eslint-disable import/prefer-default-export */

// note object
// empty dates must be ""
// unchecked listItems must have donedate = ""
// creationdate is in ms
// other dates in YYYY-MM-DD
export class Note {
  constructor(id, title, description = "", priority = 0, duedate = "", creationdate = Date.now(), isnew = true, donedate = "") {
    this.id = id;
    this.title = title;
    this.description = description;
    this.priority = priority;
    this.duedate = duedate;
    this.creationdate = creationdate;
    this.isnew = isnew; // to distinguish between ADD and UPDATE
    this.donedate = donedate;
  }
}
