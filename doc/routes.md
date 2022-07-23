Routes
======

for every view a route must be defined.

the route can contain variables.

a route always start with a named app/module/widget/... reference, e.g.:

    https://domain.abc/cockaigne#my-app/product/{id}
    
    https://domain.abc/cockaigne#my-app/order/{orderid}/item/{itemid}

the 'app' can also be defined by to domain. 
this feature is supported by the configuration (universe.config) belonging to the start document (html):

    https://my-app.abc/entry#/product/{id}
     
    https://easypay.plus/product/{id}   --> see IPFS DNSLink to ipns CID
    
    https://my-app.abc/entry#/order/{orderid}/item/{itemid}

    universe.config:
    
    export APP_REFERENCE = 'my-app';

generic domains. 
this feature is supported by the configuration (universe.config) belonging to the start document (html):

    https://neuland.plus/my-app/product/{id}

    universe.config:
    
    export APP_IN_PATH = true;

TODO: add settings APP_REFERENCE and APP_IN_PATH to Dorifer 

## Route References

specify a route reference
- target name -> view and state
- multiple targets possible   
- media queries supported


    {
       [target] {
            view: 'viewname',
            ids: [{ id: 'productid' }],     // id mapping by name
        }   
       [target2] {
            view: 'viewname',
            ids: (ids) => {},   // id mapper as function
        }   
        drawerRight: { state: 'closed' },
        drawerLeft : { width: 50 },
        header     : {},
        footer     : {},
        menu       : {}
    }
    


or define a handler function for the route

    (req, blueprint) => {
    }

the handler implements what to show when the route is requested.

## UIRouter interface:

