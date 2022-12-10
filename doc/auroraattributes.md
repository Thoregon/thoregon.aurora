Aurora Attributes
=================


all attributes can be abbreviated with a-<attrname>


## bidirectional binding model <-> view

### aurora-name       (alpine -> x-model)

- bind property from model or the viewmodel (if not defined on the model) to the elements value or innerText. only property name of model or view model, no evaluate
- keep in sync with the specified property
- all names are relative path, start with 'root:' to use an absolute path. 
- long form aurora-name:model 
- name shorthand -> $<attribute-name>
- aurora-name:viewmodel | aurora-name:vm
    - bind property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
- aurora-name:meta
    - bind meta property from model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
- aurora-name:viewmeta | aurora-name:vmeta
    - bind meta property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
- .'eventname'  
    - specify the 'change' event  
- for 'input only' fields implement on the view model a get method which does not deliver anything

- mask for output
  - specify the mask type or the pattern after the name separated by '|' 
  - interactive formating for input fields
  - formats output for display
  - patterns
    - use '9' for digit
    - use 'A' for letter
    - use 'S' for alphanumeric
    - all other characters will be displayed in the formatted string 

````html
<input $="description">     // syncs property 'description' from the model with the input value
<input aurora-name="amount|money"/>
<input aurora-name="date|99.99.9999"/>
<input aurora-name="card|9999 9999 9999 9999"/>   // -> 
````

## unidirectional to view

### aurora-bind:<attribute-name>    (alpine -> x-bind)

- input aurora-bind:placeholder="$.extratext"
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

````html
// 
<div > ... </div>
````

### aurora-i18n

- get translation for token, replace 'innerText' or 'placeholder' if available
- aurora-i18n:<element-attribute>
- specify variables with JS expression -> aurora-i18n="text4(param1: '${paramA}', param2: 'PARAM2', param3: '${sub()}')"

````html
// 
<div > ... </div>
````

### aurora-class:<class>

- evaluates JS and sets or removes a class on an element
- allows true and false setting separated by ':'
- allows multiple classes separated by '.' 

````html
//
<div aurora-class:hightlight="$.isImportant()"></div>
<div aurora-class:hightlight:dimm="$.isImportant()"></div>
<div aurora-class:hightlight.red:dimm.blue="$.isImportant()"></div>
````

### aurora-show

- evaluates JS to get a value, if true element will be shown
- div aurora-show="$.isImportant()"

````html
// 
<div > ... </div>
````

### aurora-enabled

- evaluates JS to get a value, if true element is enabled
- div aurora-enabled="$.isImportant()"

````html
// 
<div > ... </div>
````

## actions

### aurora-action:<what>  (alpine -> x-on)

- will be fired on <what>: click (default), change, focus, blur ...
- --> see @open and @toggle at AuroraButton 
- evaluates JS to handle the event
- should hover, active also be supported?  
- action shorthand -> @<what>

````html
// 
<div > ... </div>
````

### aurora-route:<what>   

- specify a UI route to be displayed
- will be fired on <what>: click (default), click, change, focus, blur ...
- specify variables with JS expression -> ${js}: aurora-route="/my/item/${itemid}"
- control with 'aurora-show' and 'aurora-enabled' if the route can be called
- can only invoke routes which are defined in 'routes.mjs'
- aurora-route="@back" returns to the view before. this enables 'selection' views 

````html
// 
<div > ... </div>
````

### aurora-intersect

- initial state (enter/leave) will be executed
- evaluates JS

#### work with ratios
- ratios:  'ratio1':'ratio2' ... e.g. 0:100 
  - any muber of ratios can be specified
  - invoked when a ratio is exceeded or fallen below
  - available parameters
    - $intersecting: boolean, tells if element intersects
    - $ratio: float (0 .. 100), current intersection ratio

````html
// invoke elemIsVisible(true) when the element becomes visible,
// and elemIsVisible(false) when the element becomes invisible
<div aurora-intersect="elemIsVisible($intersecting)"></div>

// invoke elemIntersects() on view model everytime the specified ratio is exceeded or fallen below
<div aurora-intersect:0:50:100="elemIntersects($intersecting, $ratio)"></div>
````

#### work with state
- :enter, :leave
- :enter-once, :leave-once
- .full, .partial:'percentage'
  - if partially w/o percentage, 50 (%) is used 

````html
// invoke method 'elemVisible' on viewmodel when the element is visible just with one pixel
<div aurora-intersect:enter="elemVisible()"> ... </div>

// invoke method 'elemVisible' on viewmodel when the element is 50% visible  
<div aurora-intersect:enter.partial="elemVisible()"> ... </div>

// invoke method 'elemVisible' on viewmodel when the element is 30% visible
<div aurora-intersect:enter.partial:30="elemVisible()"> ... </div>

// invoke method 'elemNotVisible' on viewmodel when the element is full invisible
<div aurora-intersect:leave.full="elemNotVisible()"> ... </div>
````

### aurora-connect

- only once when element and view model are available
- handle an element by the view model
  - full control by the view model
  - can attach arbitrary event listeners or observers
- can be combined with other aurora-attributes
- the element will be available with the variable `$element`

````html
// pass element to viewmodel
<div aurora-connect="connectElement($element)"> ... </div>
````


## Add

### aurora-mask -> attribute of form elements?

- define a mask for the input field e.g. phonenumber, IBAN, ...

````html
// 
<div > ... </div>
````

## JS evaluation in aurora attributes

Evaluate (restricted) a JS

- Context Variables:
    - the viewmodel is the scope, all properties and functions from the viewmodel are available top level (w/o referencing the viewmodel e.g. '$vm.myprop'  is the same as 'myprop')  
    - 'this' is the current HTML element the aurora attribute is bound to
    - '$' | '$model' is the model  (wish: all properties of the model are top level vars) 
    - '$meta' is the meta model
    - '$vm' | '$viewmodel' is the view model
    - '$viewmeta' is the meta view model
    - '$element' is the current element
    - '$viewContext' is the view context for this dom tree (if there is one)
    - '$listvm' is the view model of the list if the aurora-attribute is attached to a list item
    - '$interface' | '$i' is are the properties from the app interface settings
    - '$router' is the uirouter
- Context Variables for user triggered events (only aurora-action and aurora-route)
    - $event is the original browser event
- Available globals:
    - 'app' is the app (if defined)
    - 'me' is the SSI
    - 'universe' | '$u' are the properties from the universe
    - 'thoregon'
    - 'dorifer'
    - 'device'
    - 'mediathek'
- Functions
  - formatdate($.created, 'fmt')
  - formatint()
  - formatfloat()
  - formatamount()

Context in an auroralist:

- aurora-attributes on the list e.g. `<aurora-list aurora-bind... >`: $ (model) and $vm (viewmodel) from the view containing the list
- aurora-attributes on list headers `<<column><header ...></column>>` and filters `<filter-definition ...>`: $ (model) and $vm (viewmodel) from the view containing the list
- aurora-attributes on a list item `<grid-definition ...>` or `<column><view ...></column>` : $ (model) and $vm (viewmodel) from the list item, $listvm is the viewmodel from the view containing the list
  
All evaluations will be reavaluated on every mutation of the model 
Arbitrary properties can be defined and accessed to use it for view control (aurora-data).  
Bind fn to the element (this)


# TODO (Later)

## Formating Functions

### $dateformat


### $numformat

### Provided formats
- browser locale settings
- SSI locale settngs
- app locale settings

### $map


### $translate


## Attributes

### aurora-transaction

- define a transaction context for the view
- implement on view model what to do at 'commit' e.g. sync/create model
- sync e.g. with an OK button
- if no tx -> immed update

### aurora-data  (maybe later)

? this should be mapped to the view model ?

- define local variables as JSON with a default value, will be mapped to the view model if available
- <... aurora-data="{ myvar: 1 }">

### aurora-if (later)

- evaluates JS to get a result, lazy init -> first add to dom only when true  (should remove from DOM?)

### aurora-ifnot (later)

- evaluates JS to get a result, lazy init -> first add to dom only when false (should remove from DOM?)

### aurora-ref (later)

- give elements a name to reference it elsewhere

### aurora-watch:<name> (maybe later, implement in viewmodel)

- define a variable (like in aurora-name) to listen to.
- execute a js from the attribute content
