# User Stories /index.html

= wer will warum was erreichen

## Wer

1 ?
2 eher mobile user - schnell, kompakt
3 ...

## Warum

als user will ich:

- meine notizen als übersicht sehen
- eine bestimme notiz bearbeiten
- schnell eine neue notiz erstellen
- notizen priorisieren (unabhängig von einem datum)
- notizen ein Fälligkeitsdatum geben
- die liste manipulieren, sodass ich sehe
  - was schon fertig ist
  - was noch zu tun ist - mit dem was schon längst hätte fertig sein sollen zuoberst
  - was priorität hat
- meine notizen genau gleich gelistet sehen, wenn ich die app ein ander mal wieder aufmache

Project Goals:
to learn ES6
• Funktionsumfang
• Architektur
• JS Qualität
• CSS Qualität
• HTML Qualität

Architektur
• REST: Server und Client kommunizieren über JSON
• Client:
− Server-Calls nur im Service Layer
− Routing/Event-Handling nur im Controller
− Rendering/DOM Manipulation nur in der View
− View und Controller können im gleichem File definiert werden.
− Kein HTML Zusammenbasteln aus String
− Handlebars oder Template Strings verwenden
• Server:
− Memory-Storage- / DB-Zugriffe nur im Service
− Controller stellt Actions/Request-Handlers zur Verfügung
− Router: Verknüpfung von Routen und Actions/Request-handlers

## Was / Funktionalität

- alle notizen listen
  [ ] reads notes from server oder local storage
  - pro listed notiz
    [ ] check done mit done datum
    [ ] uncheck note: re-print due date
    [ ] print due date
    [ ] print title
    [ ] print multiline Teaser
    [ ] pro listed notiz edit
  - alle sichtbaren notizen sortieren
    - creation date (default)
      [ ] newest to oldest
    - due date
      [ ] oldest (=overdue) to newest to sometime
      [ ] ? today, tomorrow, overdue, > tomorrow, sometime
    - priority
      [ ] 3 to 0 (0 am schluss)
  - filter
    [ ] not completed (default)
    [ ] include completed (checkbox)
- notiz editieren
  [ ] titel\* (länge?) einziges mussfeld
  [ ] multiline text (sanitized?) - default ist leer
  [ ] priority 1-3 - default ist 0
  - date
    [ ] default date pre-filled "sometime"
    [ ] standart datepicker to overwrite sometime
    [ ] date printed DD.MM.YYYY
    [ ] hidden read only creation date
- notiz hinzufügen
  - inputfield + add btn
    - opens edit mode with title filled in
  - btn done in edit mode
    - saves new note - to object & local storage?
    - closes edit mode - jumps back to list mode
  - btn cancel in edit mode
    - no save new note
    - closes edit mode - jumps back to list mode
- theme change (light/dark) - if no localstorage - theme = theme by OS - else theme = theme dark - theme selectable by button click - possible selection ≠ theme - save theme to local storage
  [ ] Notizen auf Server speichern
  [ ] Notizen lokal speichern
  <<<<<<< HEAD
  =======
- ? kann notizen nicht löschen - andernfalls - pro listed notiz swipe to reveal delete button - delete in edit mode
  > > > > > > > 0ca3b63c2f49a96fe4327b94533a9397ff44744d

# Interaktionen

- App
  [ ] first tab focuses input-field
  [ ] second tab focuses btn_add
  [ ] third tab focuses jump to content
  [ ] fourth tab focuses Filter
- List
  - scroll through list
    [ ] tab ?arrow up/down zooms it
    [ ] slide up/down
  - item-card interaction
    [ ] hover card zooms it
    [ ] first touch card zooms it
    - zoomed card
      [ ] prefocused title&Teaser (-> enter opens modal)
      [ ] tab moves through card fields except btn_delete
      [ ] btn_completed toggle klick/space checkbox completed
      [ ] title||text klick/enter opens Modal Edit
      - reveal btn_delete
        [ ] slide left/Backspace reveals btn_delete prefocused
        [ ] slide right/ESC hides&unfocuses btn_delete
        [ ] btn_delete klick/enter removes card from list & zooms nothing
        ? what happens when arrow up/down now gets pressed
- Modal

  - Open
    [ ] btn_add/enter
    [ ] klick/enter List_item-card_title&Teaser opens edit-modal
    [ ] slide up modal with all avail. content filled in
    [ ] btn_save pre-focused
    [ ] open modal disables keyboard and mouse interaction of all content underneath
  - Edit
    [ ] priority (0 - 3) radio or bar

    - save
      [ ] enter/btn_save saves
      [ ] closes modal
      [ ] shows new entry atop the List
      [ ] disables keyboard/mouse interaction with modal content
      [ ] enables keyboard/mouse interaction with main content
      [ ] prefocuses on input-field
    - cancel
      [ ] esc/btn_cancel closes modal
      [ ] deletes current item data
      [ ] disables keyboard/mouse interaction with modal content
      [ ] enables keyboard/mouse interaction with main content
      [ ] prefocuses on input-field

    - keyboard nav
      [ ] tab to next field

- Settings
  [x] aria-hidden @done(2021-05-08)
  [x] btn_gear/enter opens settings nav @done(2021-05-08)
  [x] select input options with standard keyboard interaction @done(2021-05-08)
- Help
  - [ ] btn_help opens help-modal
  - [ ] esc/btn_cancel cancels
- Filter
  - [x] select radio input with standard keyboard interaction
- Show Completed
  - [ ] checkbox with standard keyboard interaction
