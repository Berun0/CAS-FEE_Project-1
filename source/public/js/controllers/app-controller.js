/* eslint-disable camelcase */
/* eslint-disable max-len */
import { SETTINGS, loadSettings, saveSettings } from "../services/data/settings_storage.js";
import { noteService } from "../services/note-service.js";
import { listView, editView } from "../services/view-service.js";
import { Note } from "../services/note.js";

let tempNotes; // temp variable to relay notes between model and view
let theNote; // temp variable to relay a note between model and view

/**
* declare DOM elements
*/
let countElem; let dateElem;
let settings_btn; let settingsMenu; let settingsInp; let filterBy_btn; let orderBy_btn;
let articleList;
let main;
let modalParent; let modalTitle; let modalDescription; const modalRadio = new Array(4);
let modalDatepicker; let modalCancelBtn; let modalSaveBtn;
// object to send DOM elements to edit view
let NOTE_ELEMS = { modalParent, modalTitle, modalDescription, modalRadio, modalDatepicker };
let newNoteInput;

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

  // filter done
  filterBy_btn = document.querySelector("#chkCompleted");

  // sort dropdown
  orderBy_btn = document.querySelector("[data-js='orderBy_btn']");

  // the List - outputting the notes
  // get to the stuff inside via bubbling
  articleList = document.querySelector("#ArticleList");

  // listing view
  main = document.querySelector("main"); // to set invisible, when modalParent open

  // edit view = modalParent
  modalParent = document.querySelector("aside");
  modalTitle = modalParent.querySelector("[data-js='modaltitle']");
  modalDescription = modalParent.querySelector("[data-js='modaldescription']");

  for (let i = 0; i < modalRadio.length; i++) {
    modalRadio[i] = modalParent.querySelector(`[data-js-radio='${i}']`);
  }

  modalDatepicker = modalParent.querySelector("#datepicker");
  // trying to overwrite todays date in safari
  // modalDatepicker.value = null;
  // modalDatepicker.placeholder = "yyyy-mm-dd";
  modalCancelBtn = modalParent.querySelector(".btn_cancel");
  modalSaveBtn = modalParent.querySelector("button[type='submit']");

  NOTE_ELEMS = { modalParent, modalTitle, modalDescription, modalRadio, modalDatepicker };

  // addItem below list
  newNoteInput = document.querySelector("[js-submitAddItem]");
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
    SETTINGS.theme = e.target.value;
    document.body.setAttribute("theme", SETTINGS.theme);
    saveSettings();
    settingsMenu.classList.toggle("open");
  });

  // FILTER toggle done
  filterBy_btn.addEventListener("change", (e) => {
    const checkBox = e.target;
    SETTINGS.showDone = checkBox.checked;
    checkBox.toggleAttribute("checked");
    !SETTINGS.showDone;

    saveSettings();
    tempNotes = noteService.getFilteredNotes(SETTINGS.sort, SETTINGS.showDone);
    listView.renderNotesList(tempNotes, articleList);
    listView.renderAppTitle(tempNotes.length, countElem, dateElem);
  });

  // SORTING of tempNotes
  orderBy_btn.addEventListener("change", (e) => {
    SETTINGS.sort = e.target.value;
    saveSettings();

    tempNotes = noteService.getFilteredNotes(SETTINGS.sort, SETTINGS.showDone);
    listView.renderNotesList(tempNotes, articleList);
    listView.renderAppTitle(tempNotes.length, countElem, dateElem);
  });

  // ADD note
  newNoteInput.addEventListener("submit", (e) => {
    e.preventDefault(); // do not reload page from form
    // initialize default listItem
    const input = newNoteInput.querySelector("input").value;
    // set the title to empty or a regex filtered value of the input-field:
    const title = input ? input.match(/[a-z, 0-9]/gi).join("") : "";
    // create a new note, to save it later when modalSaveBtn pressed
    theNote = new Note(SETTINGS.nextID, title);
    editView.renderEditView(theNote, NOTE_ELEMS);
    editView.openEditView(main, modalParent, modalSaveBtn);
  });

  // ESC the EDIT note modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      editView.closeEditView(main, modalParent, newNoteInput.querySelector("input"));
    }
  });

  // CANCEL EDIT/ADD note
  modalCancelBtn.addEventListener("click", (e) => {
    console.log("CancelBtn was clicked");
    editView.closeEditView(main, modalParent, newNoteInput.querySelector("input"));
  });

  // SAVE a note
  modalSaveBtn.addEventListener("click", (e) => {
    // grab the values in the modal
    console.log("tempNotes");
    console.log(tempNotes);
    console.log("noteService.notes");
    console.log(noteService.notes);
    theNote.title = modalTitle.value;
    theNote.description = modalDescription.value;
    theNote.priority = +modalRadio.filter((c) => {
      // returns an array with all radios that are checked
      return c.checked;
    })[0].value; // get the value from the first in array (there is only one, anyway)
    theNote.duedate = modalDatepicker.value;
    theNote.id = +modalParent.dataset.id;

    if (theNote.isnew) {
      // ADD a new note
      theNote.isnew = false;
      noteService.addNote(theNote);
    } else {
      // UPDATE an existing note
      noteService.updateNote(theNote);
    }

    editView.closeEditView(main, modalParent, newNoteInput.querySelector("input"));
    tempNotes = noteService.getFilteredNotes(SETTINGS.sort, SETTINGS.showDone);
    listView.renderNotesList(tempNotes, articleList);
    listView.renderAppTitle(tempNotes.length, countElem, dateElem);
  });

  // EDIT or DELETE a note
  articleList.addEventListener("click", (e) => {
    // EDIT
    if (e.target.classList.contains("articleList_itemTitle")
      || e.target.classList.contains("articleList_itemText")) {
      const currentID = +e.target.closest(".articleList_item").dataset.id;
      theNote = noteService.getNote(currentID);

      editView.renderEditView(theNote, NOTE_ELEMS);
      editView.openEditView(main, modalParent, modalTitle);
    }

    // DELETE
    if (e.target.classList.contains("btn_del")
      || e.target.classList.contains("btn_del_img")) {
      const currentID = +e.target.closest(".articleList_item").dataset.id;
      noteService.deleteNote(currentID);
      tempNotes = noteService.getFilteredNotes(SETTINGS.sort, SETTINGS.showDone);
      listView.renderNotesList(tempNotes, articleList);
      listView.renderAppTitle(tempNotes.length, countElem, dateElem);
    }
  });

  // CHECK listitem toggle done
  articleList.addEventListener("change", (e) => {
    const hotArea = e.target.type; // checkbox is assumed to be only element with a type attribute
    if (hotArea) {
      const currentItem = e.target.closest(".articleList_item");
      const currentID = +currentItem.dataset.id;

      noteService.checkNote(currentID);

      tempNotes = noteService.getFilteredNotes(SETTINGS.sort, SETTINGS.showDone);
      listView.renderNotesList(tempNotes, articleList);
      listView.renderAppTitle(tempNotes.length, countElem, dateElem);
    }
  });
}

function initApp() {
  getDOMElements();
  initEventHandler();
  loadSettings();
  listView.renderSettings(filterBy_btn, orderBy_btn, settingsInp);
  tempNotes = noteService.loadNotes();
  tempNotes = noteService.getFilteredNotes(SETTINGS.sort, SETTINGS.showDone);
  listView.renderNotesList(tempNotes, articleList);
  listView.renderAppTitle(tempNotes.length, countElem, dateElem);
}

initApp();
