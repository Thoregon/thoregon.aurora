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


View Context Variables
    - this is the element
    - $ref.<name>   
    Functions
    - $emit  emit an event with name and params   

- element attributes

Views only
    - aurora-model
        - inject another object as $ (model)
    
Indicators
    - specialized elements ->  AuroraValidationIndicator: redesign to pub/sub (see connectedCallback() MutationObserver) 
    - 'valid-state' event
    - aurora-indicator attribute ?
        
Component Behavior only:
    - aurora-trigger <name>
        - can be used by the behavior implementation to react on a user click somewhere on the UI
        - invokes a method on the behavior named 'trigger<name>' 


## Processing


## Embedded View
--> use 'aurora-include'

Not valid anymore 
- view model will get the parent model and view model
- with attribute 'set-parent-viewmodel' 
- ? 'set-parent-model'
- model-property=<property-name>
    - a property from the model can be passed to the embedded view as model
    - you have to know what to do when it's used together with 'set-parent-viewmodel'


## AuroraTemplate   
    
Validations & Indicators
========================

observer: keep sync

View
====

directly reference an entity

