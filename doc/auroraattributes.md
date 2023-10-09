Aurora Attributes
=================


all attributes can be abbreviated with a-<attrname>


## bidirectional binding model <-> view

### aurora-name, $, $$       (alpine -> x-model)

todo: add 'aurora-model', 'aurora-viewmodel' and 'aurora-vm' as synonymes 

- bind property from model or the viewmodel (if not defined on the model) to the elements value or innerText. only property name of model or view model, no evaluate
- keep in sync with the specified property
- all names are relative path, start with 'root:' to use an absolute path. 
- long form aurora-name:model 
- name shorthand -> $<attribute-name>, todo: $$<attribute-name> for view model attributes
- aurora-name:viewmodel | aurora-name:vm
    - bind property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
- aurora-name:meta
    - bind meta property from model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
- aurora-name:viewmeta | aurora-name:vmeta
    - bind meta property from view model to the elements value or innerText.only property name of meta model or meta view model, no evaluate
- .'eventname'  
    - specify the 'change' event  
- for 'input only' fields implement on the view model a get method which does not deliver anything

- works for all `<input>` fields, also for radio
  - todo: checkbox
- works for all `<select>`
- works for all aurora form elements

````html
<input $="description">                // syncs property 'description' from the model with the input value
<input aurora-name="name"/>            // model property 'name' will be synced

<input $vm="description">              // syncs property 'description' from the view model with the input value
<input aurora-name:vm="name">          // syncs property 'name' from the view model with the input value

<input aurora-name.keyup="name"/>      // on event 'keyup', model property 'name' will be synced
<input aurora-name:vm.keyup="name"/>   // on event 'keyup', view model property 'name' will be synced
````

Planned:
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
<input $="description">       // syncs property 'description' from the model with the input value
<input aurora-name="amount|money"/>
<input aurora-name="date|99.99.9999"/>
<input aurora-name="card|9999 9999 9999 9999"/>   // -> 
````

## unidirectional to view

### aurora-bind:<attribute-name>, :<attribute-name>   (alpine -> x-bind)

bind a value, which wi

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

note: the value of the attribute will be evaluated as JS. for functions and params see in [JS evaluation](#JS evaluation in aurora attributes)

````html
<span :="name"></span>                    // binds the property 'name' from the view model to the 'innerHTML' of the span
<span aurora-bind="name"></span>          // binds the property 'name' from the view model to the 'innerHTML' of the span

<span :="$.name"></span>                  // binds the property 'name' from the model to the 'innerHTML' of the span
<span aurora-bind="$.name"></span>        // binds the property 'name' from the model to the 'innerHTML' of the span

<span :class="getClass()"></span>               // sets the result from viewmodel.getClass() as attribute 'class'. see [aurora-class] for add/remove classes
<span aurora-bind:class="getClass()"></span>    // sets the result from viewmodel.getClass() as attribute 'class'. see [aurora-class] for add/remove classes
````

special handling of JS result for `<select>`:
(applies only when not element attribute is specified) 
- if the result is an array, the options will be generated with the array elements
- if the result is an object, the options will be generated with property name and value from the object
- if a string is returned, it is assumed it contains html code to create the options. it will directly be used for innerHTML

Examples:
````html
<select :="includeOptionsArray()">  // generates the options below
  <option value="Option 1">Option 1</option>
  <option value="Option 2">Option 2</option>
  <option value="Option 3">Option 3</option>
</select>
````
````javascript
includeOptionsArray() {
    return ["Option 1", "Option 2", "Option 3"];
}
````
````html
<select :="includeOptionsObject()">  // generates the options below
  <option value="A">Option A</option>
  <option value="B">Option B</option>
  <option value="C">Option C</option>
</select>
````
````javascript
includeOptionsObject() {
    return {
      "A": "Option A", 
      "B": "Option B", 
      "C": "Option C"
    }
}
````
````html
<select :="includeOptionsString()">  // generates the options below
  <option value="A">Option A</option>
  <option value="B">Option B</option>
  <option value="C">Option C</option>
</select>
````
````javascript
includeOptionsString() {
    return `
    <option value="A">Option A</option>
    <option value="B">Option B</option>
    <option value="C">Option C</option>
`;
}
````
with translate function
````html
<select :="translate(optionTokens())">
    <option value="opt1">Option A</option>
    <option value="opt2">Option B</option>
    <option value="opt3">Option C</option>
</select>
````
i18n translation for app:
````json
{
  "opt1": "Option A",
  "opt2": "Option B",
  "opt3": "Option C"
}
````
````javascript
optionTokens() {
    return ['opt1', 'opt2', 'opt3']
}
````

### aurora-i18n

- get translation for token, replace 'innerText' or 'placeholder' if available
- aurora-i18n:<element-attribute>
- specify variables with JS expression -> `aurora-i18n="text4(param1: '${paramA}', param2: 'PARAM2', param3: '${sub()}')"`
- add replacements with `${` js code `}` 

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

conditionally show an element

- evaluates JS to get a value, if true element will be shown

````html
// 
<div aurora-show="$.isImportant()"> ... </div>
````

### aurora-hide

opposite of aurora-show for convenience.

- evaluates JS to get a value, if true element will be hidden

````html
// hide 'activate' button is already active
<button aurora-hide="isActive">Activate</button>
````

### aurora-enabled

- evaluates JS to get a value, if true element is enabled
- div aurora-enabled="$.isImportant()"

````html
// 
<div > ... </div>
````

## actions

### aurora-action:<what>, @<what>  (alpine -> x-on)

- will be fired on <what>: click (default), change, focus, blur ...
- --> see @open and @toggle at AuroraButton 
- evaluates JS to handle the event
- should hover, active also be supported?  
- action shorthand -> @<what>

````html
// 
<button aurora-action:click="buy()"> ... </button>
<button aurora-action="buy()"> ... </button>
<button @click="buy()"> ... </button>

````

### aurora-route:<what>   

- specify a UI route to be displayed
- will be fired on <what>: click (default), click, change, focus, blur ...
- specify variables with JS expression -> `${` js code `}` e.g. `aurora-route="/my/item/${itemid}"`
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
<div aurora-intersect="/*elemIsVisible($intersecting)*/"></div>

// invoke elemIntersects() on view model everytime the specified ratio is exceeded or fallen below
<div aurora-intersect:0:50:100="/*elemIntersects($intersecting, $ratio)*/"></div>
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

## Params for JS evaluation in aurora attributes

Evaluate (restricted) a JS

- Context Variables:
    - the viewmodel is the scope, all properties and functions from the viewmodel are available top level (w/o referencing the viewmodel e.g. '$vm.myprop'  is the same as 'myprop')  
    - 'this' is the current HTML element the aurora attribute is bound to
    - '$' | '$model' is the model  (wish: all properties of the model are top level vars) 
    - '$meta' is the meta model
    - '$vm' | '$viewmodel' is the view model
    - '$REF' is the reference (key) from the route
    - '$viewmeta' is the meta view model
    - '$element' is the current element
    - '$viewContext' is the view context for this dom tree (if there is one)
    - '$interface' | '$i' is are the properties from the app interface settings
    - '$router' is the uirouter
    - '$blueprint' | '$bp' is the blueprint from the app
- Context Variables for List Items
  - '$listvm' is the view model of the list if the aurora-attribute is attached to a list item
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
  - formatamount( amount, locale, currency ) e.g. `<span :="formatamount($.total, $vm.locale)"></span>`
  - formatdate( date, options )  ... options see https://devhints.io/wip/intl-datetime
  - formatdatetime( date, options ) ... options see https://devhints.io/wip/intl-datetime
  - formatint( number, options ) ... options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  - formatnumber( number, options ) ... options see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
  - translate(token, params) (i18n)
    - token can have a subkey: 'token.subkey'
    - if token is an array, a map (object) with translations is returned. can be used for dropdown (select) fields
  - routeActive(route1, route2, ...)  ... true if the active route matches on of the provided routes. routes can be absolute by starting with '/' or relative
todo:
  - map()
  - formatpattern(...)

Context in an auroralist:

- aurora-attributes on the list e.g. `<aurora-list aurora-bind... >`: $ (model) and $vm (viewmodel) from the view containing the list
- aurora-attributes on list headers `<<column><header ...></column>>` and filters `<filter-definition ...>`: $ (model) and $vm (viewmodel) from the view containing the list
- aurora-attributes on a list item `<grid-definition ...>` or `<column><view ...></column>` : $ (model) and $vm (viewmodel) from the list item, $listvm is the viewmodel from the view containing the list
  
All evaluations will be reavaluated on every mutation of the model 
Arbitrary properties can be defined and accessed to use it for view control (aurora-data).  
'this' is bound to the element on which the aurora attribute is defined

# TODO (maybe later)

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

## Params

- parent: parent view model, ui structure not class hierarchy
