Using Thoregon Aurora
=====================

thoregon aurora is a library to develop browser app interfaces.

it consists of two parts  

- aurora attributes ... see [using aurora attributes](./auroraattributes.md) in views
- aurora elements


## Aurora Elements

are browser custom elements.

see [building own aurora elements](./aurora%20elements.md)

using aurora elements

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


### Blueprint

#### 

### Views


### Includes

other than a view, an include does not have its own context (viewmodel, model).
the referened view will be incuded in the DOM of the parent view.
