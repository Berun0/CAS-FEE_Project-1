# User Stories

= wer will warum was erreichen

## Wer

1 ?
2 eher mobile user - schnell, kompakt
3 ...

## Was

- kann notizen nicht löschen
  - andernfalls
    - pro listed notiz swipe to reveal delete button
    - delete in edit mode
- alle notizen listen
  - reads notes from server oder local storage
  - pro listed notiz check done mit done datum
  - pro listed notiz due date
  - pro listed notiz title
  - pro listed notiz multiline anriss
  - pro listed notiz edit
  - sortieren
    - creation date (default)
      - newest to oldest
    - due date
      - oldest (=overdue) to newest to sometime
      - ? today, tomorrow, overdue, > tomorrow, sometime
    - priority
      - 3 to 0
  - filtern
    - alle
    - nicht abgeschlossene (default)
- notiz editieren
  - titel\* (länge?)
  - multiline text (sanitized?)
  - due date datum with date picker
    - no date picked: sometime
  - hidden read only creation date
  - priority (0 - 3)
- notiz hinzufügen
  - inputfield + add btn
    - opens edit mode with title filled in
  - btn done in edit mode
    - saves new note - to object & local storage?
    - closes edit mode - jumps back to list mode
  - btn cancel in edit mode
    - no save new note
    - closes edit mode - jumps back to list mode
- theme change (light/dark)
  - if no localstorage
    - theme = theme by OS
    - else theme = theme dark
  - theme selectable by button click
    - possible selection ≠ theme
    - save theme to local storage
- Notizen auf Server speichern
- Notizen lokal speichern

## Warum

to learn ES6
• Funktionsumfang
• Architektur
• JS Qualität
• CSS Qualität
• HTML Qualität
