View Specifications
===================

Specify views, reduce programming.

## default capabilities
views for collections and trees comes with a bunch
of capabilities like search, sort, customize columns,
group and filter ...
controls for capabilities can be arranged (where and how to view) 
unwanted capabilities can be disabled.

## view repository
views are comprised of views.
A composite view can reference inner views by its species or its name.
Depending on the content of the attribute (class) the right view will be choosen.
a default and also inheritance by specifiying a view for a superclass is available.
 
## Router

### Routes
Move to another view by a user request (click, swipe). 
View changes to target.

There are only very view situations where the user may get another view than he requests.
This must always be an action, e.g. login, which allows the user to proceed with
the view he wants.  

Special route: Back 

### Actions, Interceptors
Inquire data by the user to perform an action. 
Events emitted by action:
- successful    Action done without error
- failed        action failed, error will be reported. some actions allow a retry. in this case the errors will be collected and reported on 'back' 
- back          go back, collected errors will be reported

actions will not be tracked in router (browser) history. They will only be displayed on a condition (app,state) 
and can not be repeated with browser controls.

### Events
Don't bother the user by poping up another view. Events has to be displayed with indicators
e.g. with a badge. The view for the event can be opend by the user manually.

Events can provide additional information to the user, but never take the whole screen or switch to another view.
E.g. on a map view show marks or (little) information tags.

Indicators:
e.g. payment expires, grace period expires, approaching limit of ...

## Collections
connect to queries
