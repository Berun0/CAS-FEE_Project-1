/* eslint-disable max-classes-per-file */
/* eslint-disable class-methods-use-this */

// to get access to the settings Object:
import { SETTINGS } from "./data/settings_storage.js";

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
        if (!SETTINGS.showDone && currentNote.donedate) {
          return;
        }
        return `<li class="articleList_item" data-id="${currentNote.id}">
    <input type="checkbox" ${check} aria-checked="${Boolean(check)}"/>
    <label>${dateLabel}</label>
    <a href="#"><h2 class="articleList_itemTitle">
    ${currentNote.title}
    </h2></a>
    <p class="articleList_itemText">
    ${currentNote.description}
    </p>
      <button class="btn_del" aria-label="Delete this note.">
        <svg class="btn_del_img" xmlns="http://www.w3.org/2000/svg" width="19.092" height="19.092" viewBox="0 0 19.092 19.092">
          <g transform="translate(-122.454 -45.954)">
            <rect width="26" height="1" transform="translate(123.161 45.954) rotate(45)"
              fill="var(--c-signal-icon)" />
            <rect width="26" height="1" transform="translate(122.454 64.339) rotate(-45)"
              fill="var(--c-signal-icon)" />
          </g>
        </svg>
      </button>
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
    dateElem.textContent = d.toLocaleDateString(SETTINGS.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  renderSettings(filterBy_btn, orderBy_btn, settingsInp) {
    // set the orderBy_btn
    console.log(orderBy_btn);
    console.log(orderBy_btn.children);
    console.log(SETTINGS.sort);
    switch (SETTINGS.sort) {
      case "priority":
        orderBy_btn.children[2].toggleAttribute("selected");
        break;
      case "duedate":
        orderBy_btn.children[1].toggleAttribute("selected");
        break;
      default:
        orderBy_btn.children[0].toggleAttribute("selected");
        break;
    }

    // set the filterBy_btn
    filterBy_btn.checked = SETTINGS.showDone;

    // set theme visually
    document.body.setAttribute("theme", SETTINGS.theme);
    // set the correct radio box check
    switch (SETTINGS.theme) {
      case "light":
        settingsInp[1].checked = "checked";
        break;

      default:
        settingsInp[0].checked = "checked";
        break;
    }
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

  openEditView(main, modal, focusElem) {
    main.classList.add("hidden");
    modal.classList.add("open");
    focusElem.focus();
  }

  closeEditView(main, modal, inputfield) {
    main.classList.remove("hidden");
    modal.classList.remove("open");
    inputfield.value = "";
  }
}

export const listView = new ListView();
export const editView = new EditView();
