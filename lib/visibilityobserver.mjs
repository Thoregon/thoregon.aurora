/*
 *
 * @author: Martin Neitz, Bernhard Lukassen
 */


export default class VisibilityObserver {
//const event = new CustomEvent('build', { detail: elem.dataset.time });
    constructor() {
        this.rules    = {};
        this.element = undefined;
        this.events = {};

        this.resisizeObserver  = new ResizeObserver( entries => this.handleResize( entries ) );

    }

    maintainClasslist( element ) {
        this.element = element;
    }

    registerRule( ruleDefinition ){
        let rule = new Rule( ruleDefinition );
        this.rules[ rule.name ] = new Rule( ruleDefinition );
    }

    observe ( element ) {
        this.resisizeObserver.observe( element );
    }

    handleResize( entries ) {
        let changeDetected  = false;
        let classListAdd    = [];
        let classListRemove = [];
        let element         = entries[0];
        let width  = element.contentRect.width;
        let height = element.contentRect.height;

        for ( const name in this.rules ) {
            let rule = this.rules[name];
            if ( rule.changeDetected( width , height ) ) {
                changeDetected = true;
            }
            if (rule._inRange) {
                classListAdd.push(rule.definition.class);
            } else {
                classListRemove.push(rule.definition.class);
            }
        }

        //build array to see if an rule is true
        //--- create event + send event

        if ( this.element ) {
            if ( ! classListRemove.is_empty ) {
                this.element.classList.remove( ...classListRemove );
            }
            if ( ! classListAdd.is_empty ) {
                this.element.classList.add( ...classListAdd );
            }
        }

        if ( changeDetected ) {
            let event = new CustomEvent('changeDetected');
            event.resize = {
                classesInRange   : classListAdd,
                classesOutOfRange: classListRemove,
                height           : height,
                width            : width,
            };
            this.dispatchEvent( event );
        }
    }

    //----- event handling  ---------
    addEventListener (event, callback) {
        // Check if the callback is not a function
        if (typeof callback !== 'function') {
            console.error(`The listener callback must be a function, the given type is ${typeof callback}`);
            return false;
        }
        // Check if the event is not a string
        if (typeof event !== 'string') {
            console.error(`The event name must be a string, the given type is ${typeof event}`);
            return false;
        }

        // Create the event if not exists
        if (this.events[event] === undefined) {
            this.events[event] = {
                listeners: []
            }
        }

        this.events[event].listeners.push(callback);
    }

    removeEventListener (event, callback) {
        // Check if this event not exists
        if (this.events[event] === undefined) {
            console.error(`This event: ${event} does not exist`);
            return false;
        }

        this.events[event].listeners = this.events[event].listeners.filter(listener => {
            return listener.toString() !== callback.toString();
        });
    }

    dispatchEvent (event) {
        // Check if this event not exists
        if (this.events[event.type] === undefined) {
            console.error(`This event: ${event} does not exist`);
            return false;
        }
        this.events[event.type].listeners.forEach((listener) => {
            listener(event);
        });
    }

}

export class Rule {
    constructor( ruleDefinition ) {
        // 1
        this.status   = undefined;
        this._inRange = false;
        this._name    = '';

        let rulePresets   = {
            name     : '',        // if true a value is required for the entity to be valid. Caution: also non valid entities will be stored, they can be revised later
            dimension: 'width',   // height or width  TODO: dimension is wrong
            min      : 0,         // minimum rule range
            max      : 999999,    // maximum rule range
            class    : ''         // class to be injected if view is in range
        };

        this.definition = { ...rulePresets, ...ruleDefinition };
        this._name = this.definition.name;

    }

    get name () { return this._name; }
    set name( name ) { this._name = name; }

    inRange(  width , height  ) {
        switch (this.definition.dimension ) {
            case 'height':
                this._inRange = ( height >= this.definition.min &&
                                  height <= this.definition.max );
            case 'width':
            default:
                this._inRange = ( width >= this.definition.min &&
                                  width <= this.definition.max );
        }
        return this._inRange;
    }

    changeDetected( width , height ) {
        if ( this.inRange(  width , height  )  ) {
            if ( this.status === true ) {
                return false;
            } else {
                this.status = true;
                return true;
            }
        } else {
            if ( this.status === false ) {
                return false;
            } else {
                this.status = false;
                return true;
            }
        }
    }
}
