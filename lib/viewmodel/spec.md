Mutations
=========

match model - viewmodel - view  defs/attributes/events/actions/

- run over existing observable, find/create match, sync
    - matching for model and view model will be (very) lazy
        - just add listener for changes
        - wait for mach requests from the view 
    - if no match found, register it to be matched later
    - path in view -> if first property exists in model of viewmodel try to resolve the path down to the value
- observer mutations, find/create match, sync
    - remove mappings
- observe 
    - model: 
- match
    - if a new 

Kinds
- model, view model
    - attribute definition name -> label/text
    - (attribute definition  -> presentation)
    - attribute value -> value/label/text
    - attribute change -> value/label/text
- view
    - value change -> set attribute value
    - action -> 


Evaluate (restricted) a JS, 
    - '$' is the model  (wish: all properties of the model are top level vars) 
    - '$meta' is the meta model
    - '$vm' | '$viewmodel' is the view model
    - '$view' is the view
    - '$viewmeta' is the meta view model
    - '$app' is the app (if defined)
    - '$interface' | '$i' is are the properties from the app interface settings
    ? 'universe' | '$u' is are the properties from the universe
All evaluations will be reavaluated on every mutation of the model 
Arbitrary properties can be defined and accessed to use it for view control (aurora-data).  

- element attributes
    - aurora-transaction
        define a transaction context for the view
        sync e.g. with an OK button
        if no tx -> immed update
    - aurora-name      
        bind property from model to the elements value or innerText. only property name of model or view model, no evaluate
        keep in sync with the specified property
        long form aurora-name:model 
        - aurora-name:viewmodel | aurora-name:vm
            bind property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
        - aurora-name:meta
            bind meta property from model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
        - aurora-name:viewmodelmeta | aurora-name:vmmeta
            bind meta property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
        - .input  syncs only input values from the user to the model
    - aurora-i18n
        get translation for token, replace 'innerText' or 'placeholder'
    - aurora-action:<what>
        only the name of an action, will be fired on <what>: click, change, focus, blur ...
        evaluates JS to handle the event
        should hover, active also be supported?  
        action shorthand -> @<what>
    - aurora-data 
        define local variables as JSON with a default value, will be mapped to the view model if available
        <... aurora-data="{ myvar: 1 }">
    - aurora-visible
        evaluates JS to get a value, if true element is visible
    - aurora-enabled
        evaluates JS to get a value, if true element is enabled
    - aurora-bind:<element-attribute>
        bind an attribute e.g. class to a JS 
        evaluates JS to get a value
        bind shorthand -> :<element-attribute>
        bind w/o element attribute sets the 'innerText' of for input elements the 'value' property
    - aurora-intersect
        - :enter, :leave 
        - .once, .half, .full, .when:<percentage>, 
    - aurora-mask
        define a mask for the input field e.g. phonenumber, IBAN, ...
    - aurora-if
        evaluates JS to get a result, lazy init -> first add to dom only when true  (should remove from DOM?)
    - aurora-ifnot 
        evaluates JS to get a result, lazy init -> first add to dom only when false (should remove from DOM?)

    all attributes can be abbreviated with a-<attrname>
    
    Component Behavior only:
    - aurora-trigger <name>
        can be used by the behavior implementation to react on a user click somewhere on the UI
        invokes a method on the behavior named 'trigger<name>' 

## AuroraTemplate   
    
Validations & Indicators
========================

observer: keep sync

View
====

directly reference an entity
