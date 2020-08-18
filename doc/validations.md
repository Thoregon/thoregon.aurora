Validations
===========

! wie im Flugzeug Cockpit: 
- Keine Meldung ist eine gute Meldung
- Echtzeitanzeige: Fehler nur solang anzeigen wie er besteht
- Status Details können abgefragt werden

Kinds of validations
- immed, no error possible (length)
- immed, error possible (required)
- valid values
    - only searchable weil zuviele
- validations über mehrere Felder
- immed business context
- long lasting validations, must be triggered
    - UID Abfrage in EU DB

Cascade of errors
- required, complexity

## UI Validations

- required fields
- complexity (pwd)

if UI validation fails, no context validation is done

- add generic validation API

## Context Validations

- unique identifier

- add generic validation API

## Anzeige

- direkt beim Feld
- status zeile wenn fehler in einem nicht sichtbaren bereich
