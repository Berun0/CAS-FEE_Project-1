/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

// to get access to the settings Object:
import { noteService } from "./note-service.js";

export class ListView {
  renderNotesList(notes, htmlParent) {
    // empty the DOM element where the Note-Listing will be residing
    htmlParent.innerHTML = "";
    htmlParent.insertAdjacentHTML(
      "beforeend",
      this.createNotesHTML(notes),
    );
  }

  createNotesHTML(notes) {
    // OBJ -> HTML-String
    if (notes) {
      notes = notes.map((currentNote) => {
        let check = ""; // = checked attribute if note is unchecked
        if (currentNote.donedate) {
          check = "checked";
        }
        const dateLabel = currentNote.donedate
          ? currentNote.donedate
          : currentNote.duedate
            ? currentNote.duedate
            : "sometime"; // neither donedate nor duedate = sometime
        // if done notes should not be shown and current note is done, return empty template:
        if (!noteService.settings.showDone && currentNote.donedate) {
          return;
        }
        return `<li class="articleList_item" data-id="${currentNote.id}">
    <input type="checkbox" ${check} aria-checked="${Boolean(check)}"/>
    <label>${dateLabel}</label>
    <h2 class="articleList_itemTitle">
    ${currentNote.title}
    </h2>
    <p class="articleList_itemText">
    ${currentNote.description}
    </p>
    </li>`;
      })
        .join("");
    }
    // notes could be empty if all are done. and done notes should not be shown
    return notes || "<p class='emptyApp'>This list is empty.<br>Time to hammer-in some Topics:</p>";
  }

  renderAppTitle(listLen, countElem, dateElem) {
    countElem.textContent = ` (${listLen})`;
    const d = new Date();
    dateElem.textContent = d.toLocaleDateString(noteService.settings.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }
}

export class EditView {
  renderEditView(theNote, modalObj) {
    const { modalParent, modalTitle, modalDescription, modalRadio, modalDatepicker } = modalObj;
    if (theNote) {
      modalTitle.value = theNote.title;
      modalDescription.value = theNote.description;
      const { priority } = theNote;
      // set the checkbox in the radio-btn array
      modalRadio[priority].checked = true;
      modalDatepicker.value = theNote.duedate;
      modalParent.dataset.id = theNote.id;
    }
  }

  openEditView(main, modal) {
    main.classList.toggle("hidden");
    modal.classList.toggle("open");
  }

  closeEditView(main, modal, inputfield) {
    main.classList.toggle("hidden");
    modal.classList.toggle("open");
    inputfield.value = "";
  }
}

export const listView = new ListView();
export const editView = new EditView();
