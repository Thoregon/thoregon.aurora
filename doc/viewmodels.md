ViewModels
==========

TODO: Rename ViewModel to Presenter and introduce ViewModel

Sit between model and view.
Enhance with 'Presenter' functionality
Mirrors all properties and functions from the view


## CollectionViewModel

Connect to
- Query (tru4D)
- JS collection
- Collection property of object

### Travelling Window List

- start window for a collection e.g. unread messges (msgs newer than x)
- window size
- filled by events
    - collects until start window is reached
    - older items are cached, not displayed
    - if start window is not reached after 300ms after last event display available window
 
