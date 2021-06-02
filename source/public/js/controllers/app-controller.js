/* eslint-disable max-len */
import { noteService } from "../services/note-service.js";
import { listView, editView } from "../services/view-service.js";
import { Note } from "../services/note.js";

let notes; // temp variable to relay notes between model and view
let theNote; // temp variable to relay a note between model and view

/**
* init DOM elements
*/
let countElem; let dateElem;
let settings_btn; let settingsMenu; let settingsInp; let filterBy_btn; let orderBy_btn;
let articleList;
let main;
let modal; let modalTitle; let modalDescription; const modalRadio = new Array(4);
let modalDatepicker; let modalCancelBtn; let modalSaveBtn;
let addItemForm;

/**
* define   DOM elements
*/
function getDOMElements() {
  // AppTitle Area
  countElem = document.querySelector(".appTitle_visItemsCount");
  dateElem = document.querySelector(".appTitle_modDate");

  // settings dropdown
  settings_btn = document.querySelector(".btn_settings");
  settingsMenu = document.querySelector(".settingsMenu");
  settingsInp = settingsMenu.querySelectorAll("input");

  // filterout done
  filterBy_btn = document.querySelector("#chkCompleted");

  // sort dropdown
  orderBy_btn = document.querySelector("[data-js='orderBy_btn']");

  // the List - outputting the notes
  // get to the stuff inside via bubbling
  articleList = document.querySelector("#ArticleList");

  // modal
  main = document.querySelector("main"); // to set invisible, when modal open
  modal = document.querySelector("aside");
  modalTitle = modal.querySelector("[data-js='modaltitle']");
  modalDescription = modal.querySelector("[data-js='modaldescription']");
  modalRadio[0] = modal.querySelector("[data-js-radio='0']");
  modalRadio[1] = modal.querySelector("[data-js-radio='1']");
  modalRadio[2] = modal.querySelector("[data-js-radio='2']");
  modalRadio[3] = modal.querySelector("[data-js-radio='3']");
  modalDatepicker = modal.querySelector("#datepicker");
  // trying to overwrite todays date in safari
  // modalDatepicker.value = null;
  // modalDatepicker.placeholder = "yyyy-mm-dd";
  modalCancelBtn = modal.querySelector(".btn_cancel");
  modalSaveBtn = modal.querySelector("button[type='submit']");

  // addItem below list
  addItemForm = document.querySelector("[js-submitAddItem]");
}

/**
* DOM events
*/
function initEventHandler() {
  // (THEME)settings open
  settings_btn.addEventListener("click", () => {
    // click on … icon opens settings-menu and toggles tabindex of menu-items between -1 and 0
    settingsMenu.classList.toggle("open");
    settingsInp.forEach((c) => {
      return c.getAttribute("tabindex") === "-1"
        ? c.setAttribute("tabindex", "0")
        : c.setAttribute("tabindex", "-1");
    });
  });

  // THEME toggle
  settingsMenu.addEventListener("change", (e) => {
    noteService.settings.theme = e.target.value;
    document.body.setAttribute("theme", noteService.settings.theme);
  });

  // FILTER toggle done
  filterBy_btn.addEventListener("change", (e) => {
    const checkBox = e.target;
    noteService.settings.showDone = checkBox.checked;
    checkBox.toggleAttribute("checked");
    !noteService.settings.showDone;

    notes = noteService.getFilteredNotes(noteService.settings.sort, noteService.settings.showDone);
    listView.renderNotesList(notes, articleList);
    listView.renderAppTitle(notes.length, countElem, dateElem);
  });

  // SORTING of notes
  orderBy_btn.addEventListener("change", (e) => {
    noteService.settings.sort = e.target.value;

    notes = noteService.getFilteredNotes(noteService.settings.sort, noteService.settings.showDone);
    listView.renderNotesList(notes, articleList);
    listView.renderAppTitle(notes.length, countElem, dateElem);
  });

  // ADD note
  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault(); // do not reload page from form
    // initialize default listItem
    const input = addItemForm.querySelector("input").value;
    // set the title to empty or a regex filtered value of the input-field:
    const title = input ? input.match(/[a-z, 0-9]/gi).join("") : "";
    theNote = editView.renderEditView(new Note(noteService.settings.nextID, title), modal, modalTitle, modalDescription, modalRadio, modalDatepicker);
    editView.openEditView(main, modal);
  });

  // CANCEL ADD note
  modalCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    editView.closeEditView(main, modal, addItemForm.querySelector("input"));
  });

  // SAVE a note
  modalSaveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    theNote.title = modalTitle.value;
    theNote.description = modalDescription.value;
    theNote.priority = +modalRadio.filter((c) => {
      // returns an array with all radios that are checked
      return c.checked;
    })[0].value; // get the value from the first in array (there is only one, anyway)
    theNote.duedate = modalDatepicker.value;
    theNote.id = +modal.dataset.id;

    if (theNote.isnew) {
      // ADD a new note
      theNote.isnew = false;
      noteService.addNote(theNote);
    } else {
      // UPDATE an existing note
      console.log(noteService.notes);
      noteService.updateNote(theNote);
    }

    editView.closeEditView(main, modal, addItemForm.querySelector("input"));
    notes = noteService.getFilteredNotes(noteService.settings.sort, noteService.settings.showDone);
    listView.renderNotesList(notes, articleList);
    listView.renderAppTitle(notes.length, countElem, dateElem);
  });

  // EDIT a note
  articleList.addEventListener("click", (e) => {
    const hotArea = e.target.classList.contains("articleList_itemTitle")
      || e.target.classList.contains("articleList_itemText");
    if (hotArea) {
      const currentID = +e.target.closest(".articleList_item").dataset.id;
      theNote = noteService.getNote(currentID);
      theNote = editView.renderEditView(theNote, modal, modalTitle, modalDescription, modalRadio, modalDatepicker);
      editView.openEditView(main, modal);
    }
  });

  // CHECK listitem toggle done
  articleList.addEventListener("change", (e) => {
    const hotArea = e.target.type; // checkbox is assumed to be only element with a type attribute
    if (hotArea) {
      const currentItem = e.target.closest(".articleList_item");
      const currentID = +currentItem.dataset.id;

      noteService.checkNote(currentID);

      notes = noteService.getFilteredNotes(noteService.settings.sort, noteService.settings.showDone);
      listView.renderNotesList(notes, articleList);
      listView.renderAppTitle(notes.length, countElem, dateElem);
    }
  });
}

function initApp() {
  getDOMElements();
  initEventHandler();
  notes = noteService.loadData();
  listView.renderNotesList(notes, articleList);
  listView.renderAppTitle(notes.length, countElem, dateElem);
}

initApp();
