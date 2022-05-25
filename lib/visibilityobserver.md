# Visibility Observer`
## The problem
css @media query's can be used to make a website responsive, but the query is based on the full browser size.
So even if the browser is big enough, it could be that an element itself is getting to small.

![das ist der Text](https://commons.wikimedia.org/wiki/File:Example_de.jpg)

## The solution
With the visibility observer it is possible to specify the area/element to be observed. 
Rule are used to specify the range ( min max )  

1. you can use it in a way that the observer maintain a class list on a given element or
2. use an event so you can handle it by your own


The observer does use rules which describes the range, and the class 


the visiblity observer is using a resize observer 

Future
in addition to the maintenance of a class list it also could call a function

````
//--- Example: ---
let observer = new VisibilityObserver;
observer.registerRule( {name: "dense",  class: "dense", max: 500 } );
observer.observe( this.east );
observer.maintainClasslist( this.east.container );
````



## Rules
You can register as many rules for the visibility observer as you want.
The Rule itself is not responsible to make any changes. It will be used by the observer to know if the rule is in range will make the requested changes. 

````
name     : '',        // right now the name of the rule is required
dimension: 'width',   // height or width of the  
min      : 0,         // minimum rule range
max      : 999999,    // maximum rule range
class    : ''         // class to be injected if view is in range

//--- Example: ---
// this rule  is repsonible to hanlde the class "dense" from min=0px to max=500px
observer.registerRule( {name: "dense",  class: "dense", max: 500 } );


````


        let observer = new VisibilityObserver;
        observer.registerRule( {name: "dense",  class: "dense", max: 500 } );
        observer.observe( this.east );
        observer.maintainClasslist( this.east.container );
        observer.addEventListener('changeDetected', (e) => this.handleResize( e ) );