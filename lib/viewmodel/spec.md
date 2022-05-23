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


Evaluate (restricted) a JS, all properties of the model are top level vars, 'meta$' is the meta model, 'vm$' is the view model, 'metavm$' is the meta view model, 'view$' is the view
Evaluations in all attributes -> ${ js }
All evaluations will be reavaluated on every mutation of the model 
Arbitrary properties can be defined and accessed to use it for view control.  

- 

- element attributes
    - aurora-property      
        bind property from model or view model to the elements value or innerText. only property name of model or view model, no evaluate
    - aurora-property:meta      
        bind meta property from model or view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
    - aurora-i18n
        get translation for token, replace 'innerText' or 'value'
    - aurora-action:<when>
        only the name of an action, will be fired on <when>: click, change. ? > hover, active,  
    - aurora-data 
        define variables as JSON with a default value
        <... aurora-data="{ myvar: 1 }">
    - aurora-visible
        eval to get a value
    - aurora-visible
        eval to get a value
    - aurora-enabled
        eval to get a value
    - aurora-bind:<element-attribute>
        bind an attribute e.g. class to a JS 
        eval to get a value
    - aurora-value
        eval to get a value
    - aurora-intersect
        - :enter, :leave 
        - .once, .half, .full, .when:<percentage>, 
    - aurora-mask
        define a mask for the input field e.g. phonenumber, IBAN, ...
    - aurora-if
        eval to get a result, lazy init -> first add to dom only when true  (should remove from DOM?)
    - aurora-ifnot 
        eval to get a result, lazy init -> first add to dom only when false (should remove from DOM?)

## AuroraTemplate   
    
Validations & Indicators
========================

observer: keep sync

View
====

directly reference an entity
