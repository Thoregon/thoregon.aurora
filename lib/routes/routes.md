Routes
======

-> see the structure of a thoregon app first to understand anchors and path

A route can be specified whith the 'aurora-link' element.

The 'aurora-link' can be used together with 'aurora-action'. 
First the 'aurora-action' will be executed, if no error (throw)
the router will follow the link. 

## Relative path

Since the whole UI structure will be nested, links will always be relative to the element
where they are defined. 
An absolute path starts with '/'. The root will be the app envelop.

A path must always refer to a registered view.

### Anchors
The structure of the UI offers some anchor points, where links can refer to.
Predefined anchors from toregon app:
- 'menu'
- 'toolbar'
- 'nav' 
- 'indicators'

## Link target
Specify the target where the route should be displayed by 'aurora-target' to 'aurora-name'.
If none is declared, the app envelop will be the target.

## Link params

If the link should reference to an entity, e.g. in a list, placeholders
can be defined in the route. The 

## Route adresses
The route can refer to entities (model) or to the viewmodel.
If the route references an item win a list without a key, the index can be used.
For persistent entities instead the index, the 'soul' (key, id) of the entity
will be referenced.  

### Hierarchically referenced enties 
specify a route to an entity/view deep in a hierarchy.
there can be names, indexed and 'souls' of entities in the route.

the route (target container) will be specified in the collection, for ever hierarchy if
necessary. The item (viewmodel) will be askey for the view, if not provided the 
registered view for the route will be used.

Use a <aurora-link> inside a <aurora-collection>. 

### Entity Specific Views
In lists and hierarchies there can be shown arbitrary entities.
The view which should be displayed may depend an the entity.
The place where the view should be show referenes the target
Views for entities must be registerd, and will be selected by
the 'purpose' of the view.

## Defining routes

Routes can not only be defines in templates as 'aurora' attributes. They can
also be declared in JS.

## Inquires, create views
Don't refer to a persistent entity,
but inquires params for a command, e.g. to create an entity.

