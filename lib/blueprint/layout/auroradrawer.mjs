/**
 *
 */

import AuroraBlueprintElement from "./aurorablueprintelement.mjs";

export default class AuroraDrawer extends AuroraBlueprintElement {

    /**
     * defines the elements HTML tag
     * @return {string}
     */
    static get elementTag() {
        return 'aurora-drawer';
    }

    getMyBlueprintElement() {
        return this;
    }

    static get observedAttributes() {
        return [...super.observedAttributes, 'animated','width', 'overlay', 'state'];
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if ( ! this.container ) return;

        let drawer = this.container.querySelector('.aurora-drawer');

        switch (name) {
            case 'animated':
                drawer.classList.add("animate");
                break;
            case 'width':
                drawer.setAttribute('data-width', newValue );
                break;
            case 'overlay':
                if (newValue === 'true') {
                    this.propertiesValues()['overlay'] = true;
                    drawer.classList.add("overlay");
                } else {
                    this.propertiesValues()['overlay'] = false;
                    drawer.classList.remove("overlay");
                }
                break;
            case 'state':
                this.propertiesValues()['state'] = newValue;
                this.getAuroraBlueprint().stateChangeOnDrawer( this, newValue );

                break;
            default:
                return super.attributeChangedCallback(name, oldValue, newValue);
        }
    }

    /*
     * aurora element features
     */

    /*
     * Structure
    */

    async renderForMount() {
        this.getAuroraBlueprint()[this.isLeft() ? 'drawerLeft' : 'drawerRight'] = this;
    }

    isLeft()  { return this.propertiesValues()['position'] === 'left'; }
    isRight() { return this.propertiesValues()['position'] === 'right'; }

    isOverlaid() { return this.propertiesValues()['overlay']; }

    // theme ... component... templates

    get componentConfiguration() {
        return {
            theme: 'material',
            component: 'blueprint-drawer',
            templates: ['drawer'],
        }
    }



    propertiesDefinitions() {
        let parentPropertiesValues = super.propertiesDefinitions();
        return Object.assign(parentPropertiesValues, {
            width: {
                default:        '250px',
                type:           'text',
                description:    'How much space will be used for the drawer',
                group:          'Behavior',
                example:        '250px'
            },
            dense: {
                default:        false,
                type:           'boolean',
                description:    'will remove the left and right padding of the drawer',
                group:          'Behavior',
                example:        'true'
            },
            position: {
                default:        'left',
                type:           'text',
                description:    'left or right position of the drawer',
                group:          'Behavior',
                example:        'left | right'
            },
            state: {
                default:        'closed',
                type:           'text',
                description:    'indicate if the drawer should be opened or closed',
                group:          'Behavior',
                example:        'open | closed'
            },
            overlay: {
                default:        false,
                type:           'boolean',
                description:    'indicate if the drawer should be overlaid over the content ',
                group:          'Behavior',
                example:        'true'
            },
        });
    }

    propertiesAsBooleanRequested() {
        return {
        };
    }

    getDefaultWidth() { return false; }

    /**
     *  routine to add all needed classes.
     *  This only can be done on the element level as it will be differ from element to element
     */
    collectClasses() {
        let classes = [];
        let propertiesValues = this.propertiesValues();
        let blueprint        = this.getAuroraBlueprint();

        let drawerPosition   = this.propertiesValues()['position'];

        classes.push(drawerPosition);

        if ( blueprint != undefined ) {
            switch ( drawerPosition ) {
                case 'left' :
                    if( blueprint.isLeftDrawerFixed() ) {
                        classes.push('fixed-left');
                    } else {
                        classes.push('absolute-left');
                    }
                    break;
                case 'right' :
                    if( blueprint.isRightDrawerFixed() ) {
                        classes.push('fixed-right');
                    } else {
                        classes.push('absolute-right');
                    }
                    break;
            }
        } else {
            if ( propertiesValues['position'] )  { classes.push( propertiesValues['position'] ); }
        }

        if ( propertiesValues['overlay'] ) { classes.push( 'overlay'); }
        if ( propertiesValues['state'] == 'closed' ) { classes.push( 'completely-closed'); }

        classes.push( 'state-' + propertiesValues['state'] );

        return classes;
    }

    toggle() {
        let drawer = this.container.querySelector('.aurora-drawer');

        drawer.classList.toggle("completely-closed");
    }

    open() {
        let drawer = this.container.querySelector('.aurora-drawer');
        drawer.classList.remove("completely-closed");
    }

    close() {
        let drawer = this.container.querySelector('.aurora-drawer');
        drawer.classList.add("completely-closed");
    }

    removeAnimation( drawer ) {
        // console.log('animation finished');
        // drawer.classList.remove("animate");
    }

    adjustToBlueprint( definition ) {

        let blueprint = this.blueprint;
        let position  = this.isLeft()
                        ? 'left'
                        : 'right';

        let style = [];
        if ( definition.isDrawerBelowHeader( position ) ) {
            if (blueprint.header) {
                let headerHeight = blueprint.header.offsetHeight;
                style.push('top: '+ headerHeight +'px;' );
            }
        }

        if ( definition.isDrawerAboveFooter( position ) ) {
            if (blueprint.footer) {
                let footerHeight = blueprint.footer.offsetHeight;
                style.push('bottom: '+ footerHeight +'px;' );
            }
        }

        let drawer = this.container.querySelector('.aurora-drawer');

        style.push( 'width: ' + drawer.getAttribute('data-width')  + ';');

        if ( this.isLeft() )  { this.adjustToBlueprintAsLeftDrawer( definition, style ) }
        if ( this.isRight() ) { this.adjustToBlueprintAsRightDrawer( definition, style ) }
    }

    adjustToBlueprintAsLeftDrawer(definition, style ) {
        let drawer = this.container.querySelector('.aurora-drawer');

        if ( drawer.classList.contains('completely-closed') ) {
            style.push('transform: ' + 'translateX(-' + drawer.offsetWidth + 'px);');
        } else {
            style.push( 'transform: ' + 'translateX(0px);' );
        }

        drawer.setAttribute('style', style.join( ' ' ) );
    }
    adjustToBlueprintAsRightDrawer(definition, style ) {
        let drawer = this.container.querySelector('.aurora-drawer');

        if ( drawer.classList.contains('completely-closed') ) {
            style.push('transform: ' + 'translateX(' + drawer.offsetWidth + 'px);');
        } else {
            style.push( 'transform: ' + 'translateX(0px);');
        }

        drawer.setAttribute('style', style.join( ' ' ) );
    }

    get visibleWidth() {
        let drawer = this.container.querySelector('.aurora-drawer');
        if ( drawer ) {
            if ( drawer.classList.contains('completely-closed') ) {
              return "0";
            }
            return drawer.offsetWidth;
        }
        return "0";
    }

    get offsetWidth() {
        let drawer = this.container.querySelector('.aurora-drawer');
        if ( drawer ) {
            return drawer.offsetWidth;
        }
        return "0";
    }


    async adjustContent(container) {
        container.classList.add("aurora-drawer-wrapper");
    }

    get appliedTemplateName() {
        return 'drawer';
    }

    use(obj, attr) {
        this.input.setAttribute('value', obj[attr]);
    }

}

AuroraDrawer.defineElement();
