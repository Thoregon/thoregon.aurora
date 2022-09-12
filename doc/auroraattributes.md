Aurora Attributes
=================

- aurora-name       (alpine -> x-model)
    - bind property from model or the viewmodel (if not defined on the model) to the elements value or innerText. only property name of model or view model, no evaluate
    - keep in sync with the specified property
    - all names are relative path, start with 'root:' to use an absolute path. 
    - long form aurora-name:model 
    - aurora-name:viewmodel | aurora-name:vm
        - bind property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
    - aurora-name:meta
        - bind meta property from model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
    - aurora-name:viewmeta | aurora-name:vmeta
        - bind meta property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
    - .<eventname>  
        - specify the 'change' event  
    - for 'input only' fields implement on the view model a get method which does not deliver anything  
- aurora-bind:<attribute-name>    (alpine -> x-bind)
    - <input aurora-bind:placeholder="$.extratext">
    - bind an attribute e.g. class to a JS 
        - if the attribute-name is a function, it will be invoked with the value
        - if the attribute-name is a property of the element, it will be set
        - otherwise the element html-attribute will be set
    - evaluates JS to get a value, value will be assigned to the element attribute
    - bind shorthand -> :<attribute-name>
    - bind w/o element attribute sets the 'innerText' of for input elements the 'value' property
    
    - [todo] .once subselector defined this bind will only be evaluated once per view model (when the viewmodel is set or changed)
        - take selector in account (model or viewmodel)
        - !caution: first it may be evaluated when the is only the viewmodel, but not the model available
- aurora-i18n
    - get translation for token, replace 'innerText' or 'placeholder' if available
    - aurora-i18n:<element-attribute>
    - specify variables with JS expression -> ${js}: aurora-i18n="text4(param1: '${paramA}', param2: 'PARAM2', param3: '${sub()}')"
- aurora-show
    - evaluates JS to get a value, if true element will be shown
- aurora-enabled
    - evaluates JS to get a value, if true element is enabled
- aurora-action:<what>  (alpine -> x-on)
    - will be fired on <what>: click (default), click, change, focus, blur ...
    - --> see @open and @toggle at AuroraButton 
    - evaluates JS to handle the event
    - should hover, active also be supported?  
    - action shorthand -> @<what>
- aurora-route:<what>   
    - specify a UI route to be displayed
    - will be fired on <what>: click (default), click, change, focus, blur ...
    - specify variables with JS expression -> ${js}: aurora-route="/my/item/${itemid}"
    - control with 'aurora-show' and 'aurora-enabled' if the route can be called
    - can only invoke routes which are defined in 'routes.mjs'
    - aurora-route="@back" returns to the view before. this enables 'selection' views 

Add:
- aurora-mask -> attribute of form elements?
    - define a mask for the input field e.g. phonenumber, IBAN, ...

Later:
- aurora-transaction
    - define a transaction context for the view
    - implement on view model what to do at 'commit' e.g. sync/create model
    - sync e.g. with an OK button
    - if no tx -> immed update
- aurora-intersect (later)
    - :enter, :leave 
    - .once, .half, .full, .when:<percentage>, 
    - evaluates JS
- aurora-data  (maybe later)
     - define local variables as JSON with a default value, will be mapped to the view model if available
     - <... aurora-data="{ myvar: 1 }">
- aurora-if (later)
    - evaluates JS to get a result, lazy init -> first add to dom only when true  (should remove from DOM?)
- aurora-ifnot (later)
    - evaluates JS to get a result, lazy init -> first add to dom only when false (should remove from DOM?)
- aurora-ref (later)
    - give elements a name to reference it elsewhere
- aurora-watch:<name> (maybe later, implement in viewmodel)
    - define a variable (like in aurora-name) to listen to. 
    - execute a js from the attribute content
        
all attributes can be abbreviated with a-<attrname>

## JS evaluation in aurora attributes

Evaluate (restricted) a JS

- Context Variables:
    - all properties and functions from the viewmodel are available top level (w/o referencing the viewmodel e.g. '$vm.myprop'  is the same as 'myprop')  
    - 'this' is the current HTML element the aurora attribute is bound to
    - '$' | '$model' is the model  (wish: all properties of the model are top level vars) 
    - '$meta' is the meta model
    - '$vm' | '$viewmodel' is the view model
    - '$viewmeta' is the meta view model
    - '$interface' | '$i' is are the properties from the app interface settings
    - '$router' is the uirouter
- Available globals:
    - 'app' is the app (if defined)
    - 'me' is the SSI
    - 'universe' | '$u' is are the properties from the universe
    - 'thoregon'
    - 'dorifer'
    - 'device'
    - 'mediathek'
  
All evaluations will be reavaluated on every mutation of the model 
Arbitrary properties can be defined and accessed to use it for view control (aurora-data).  
Bind fn to the element (this)