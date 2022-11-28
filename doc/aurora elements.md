AuroraElement
=============


## Features

### Forwared Attributes
- forwared attribute content from the surrounding AuroraElement to element attributes(s) in the container

### Exposed Events 
- propagate events from elements inside the container to listeners on the AuroraElement

### Template Variables

template variables can be defined where the element is used, and will be replaced by the template engine.
this is not reactive and will only happen when once the template is used.
variables can either be defined explicit with an `<arg>` tag or by an attribute on the aurora element.
note that the attributes can only have lowercase letters
````HTML
<aurora-element>
  <var name="varname">value</var>
</aurora-element>
````
````HTML
<aurora-element varname="value"></aurora-element>
````

AuroraElement ChildElements
- Elements inside an AuroraElement 
- only if auroraelement.applyChildNodes is true
- move to a 'slot' in the container (template) -> container.querySelector('*[aurora-slot="main"]')
    - or move to the container if nothing found
- todo: process as definitions

Reactive
- event driven
    - handle user input non modal
    - show synced modifications from distributed db 
- aurora attributes
    - adds reactive features to the components and views 

Responsive
- UI adapts to the User device 
    - not only mobile first
    - use larger UI with another arrangement and segmentation
    - all functions of the app must remain also on small or even missing UI
- user click somewhere on the UI (see also Widget)
    - behavior can react when attribute 'aurora-trigger' is defined 
    - should only be used inside components

AuroraWidget
============

Embedded in a website or another app or meshup

Can communicate with the outside
- widget attributes
    - data can be passed on to the app in the widget
    - modifications will also be recognized, app developer must handle
- events
    - click on the outside of the widget will notify the app inside (e.g. to close a window)
    - widget can send events to the outside (means outside can add event listeners)
- resize
    - widget will resize to the outsides specifications
