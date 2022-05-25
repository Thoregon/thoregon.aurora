Refactorings
============

- reusable styles
    - chrome: adoptedStyleSheets    -> https://web.dev/constructable-stylesheets/

- remove viewmodel from AuroraElement
- introdice viewmodel on View (lib/blueprint/layout/view.mjs)


ToDo
====

- view for function with parameters (API)
    - Generic Object containing params (with defaults)
    - or Instance from specified Class
    - actions: run, verify, reserve?

- runtime dynamic
    - add/remove style 
    - modify content (in slots)

- link triggers multiple views to be displayed
    - routes.mjs

- breadcrumbs context sensitive
    - 'active' path/view defines current breadcrumbs
    - maintain selected items

- state machine
    - elements which can be displayed immed (necessary?)
    - views/elements referencing data from model 

- top level apps as dynamic custom elements
    - placeholder not app: <thoregon-app/> -> <thoregon/>
    - <my-app> create dynamically if it has no implementation
    - override/refactor get templates and 
- aurora-toolbar
    - link to welcome/default view on logo/appname

- multiple slots
    - move child elements to spcified slots not only to 'main'

- ViewModel
    - PropertyItem
        - non input fields -> text content or specified attribute
    - connect (custom) item attributes
    
- CollectionViewModel
    - connect collection property from model

- views specifies requirements
    - defines which interceptors used

- dev overlays (mode)
    - help developers
    - display component id's an path
    - display origin (path) of displayed data

- collaboration featues
    - selected by other
    - edited by other

    - indicator on field(s) 
    - info tooltip who's editing (privacy!)
    
    - conflict resolution
        - last wins
        - editors consens. negotiation between users
 
