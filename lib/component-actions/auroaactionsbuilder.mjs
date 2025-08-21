/*
 * Copyright (c) 2021.
 */

/*
 *
 * @author: Martin Neitz
 */

class AuroraActionBuilder {
    avatar(url) { this._avatar = url; }
}

export class AuroraActionBuilderIconList extends AuroraActionBuilder {
    renderActions( actions ) {
        let display = '';
        if (!listItemViewModel.getActions) return ;
        //let actions = listItemViewModel.getActions( actionSet )['all'];

        display += '<div class="aurora-actions">';
        display += '    <div class="aurora-actions-iconlist">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            display += this.renderAction(listItemViewModel, action);
        }

        display += '        </ul>';
        display += '      </div>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
    renderAction( listItemViewModel, action ) {
        if ( listItemViewModel.isActionAvailable( listItemViewModel, action ) ) {
            return '<li class="aurora-action ' + this.getActionClasses( listItemViewModel, action ) + ' ' + action.name + '" aurora-action="' + action.name + '"><i aria-hidden="true" class="material-icons aurora-icon">' + action.icon + '</i></li>';
        }
        return '';
    }

    getActionClasses( listItemViewModel, action ) {
        let classes = [];
        if ( listItemViewModel.isActionAvailable( listItemViewModel, action ) ) {
            classes.push('available');
        }
        if ( listItemViewModel.isActionDisabled( listItemViewModel, action ) ) {
            classes.push('disabled');
        }

        return classes.join(' ');
    }
}

export class AuroraActionBuilderIconContainer extends AuroraActionBuilder  {
    renderActions( actions ) {
        let display = '';
        if (!listItemViewModel.getActions) return ;
        //let actions = listItemViewModel.getActions( actionSet )['all'];

        // in case no actions are loaded
//        if (actions.length == 0 ) return;

//        let actions_primary = listItemViewModel.model.metaClass.getAllActions()['primary'];
//        let actions_primary = listItemViewModel.model.metaClass.getAllActions()['secondary'];

        display += '<div class="aurora-actions">';
        display += '    <div class="aurora-actions-iconcontainer">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            display += this.renderAction(listItemViewModel, action);
        }

        display += '<li class="aurora-action" ><i aria-hidden="true" class="material-icons aurora-icon">more_horiz</i></li>'

        display += '        </ul>';
        display += '      </div>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
    renderAction( listItemViewModel, action ) {
        if ( listItemViewModel.isActionAvailable( listItemViewModel, action ) ) {
            return '<li class="aurora-action ' + this.getActionClasses( listItemViewModel, action ) + ' ' + action.name + '" aurora-action="' + action.name + '"><i aria-hidden="true" class="material-icons aurora-icon">' + action.icon + '</i></li>';
        }
        return '';
    }

    getActionClasses( listItemViewModel, action ) {
        let classes = [];
        if ( listItemViewModel.isActionAvailable( listItemViewModel, action ) ) {
            classes.push('available');
        }
        if ( listItemViewModel.isActionDisabled( listItemViewModel, action ) ) {
            classes.push('disabled');
        }

        return classes.join(' ');
    }
}

export class AuroraActionBuilderMenu extends AuroraActionBuilder  {
    constructor() {
        super();
        this._showIcons = false;}

    get showIcons() {return this._showIcons;}
    set showIcons(value) { this._showIcons = value; }

    renderActions( actions ) {

        actions = actions['all'] ?? {};

        let display = '';
        display += '<div class="aurora-actions">';
        display += '    <div class="aurora-actions-trigger"><span class="material-icons">more_vert</span></div>';
        display += '    <div class="aurora-actions-menu">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            if (action.isAvailable()) {
                const disabledClass =   ( action.isDisabled() )
                    ? 'disabled'
                    : '';


                let icon        = '';
                let actionLabel = action.label;
                let actionLabelI18n = '';
                if ( action.label.startsWith( "i18n:" ) ) {
                    actionLabel = '';
                    actionLabelI18n = 'aurora-i18n="'+ action.label.slice(5) +'"';
                }

                if (this.showIcons) {
                   icon = '<i aria-hidden="true" class="material-icons aurora-menu-icon">'+ action.icon +'</i>';
                }

                display +=  '<li class="aurora-action ' + action.name + ' '+ disabledClass +' " aurora-action-name="'+ action.name +'">'+ icon +'<span  '+ actionLabelI18n +'>' + actionLabel + '</span></li>';
            }
        }

        display += '        </ul>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
}

export class AuroraActionBuilderView extends AuroraActionBuilder  {
    constructor(props) {
        super();
        this._view = undefined;
    }

    get view() { return this._view; }
    set view( view ) { this._view = view; }

    renderActions( actions ) {

        actions = actions['all'];

        return this.view;

    }
}

export class AuroraActionBuilderAvatarMenu extends AuroraActionBuilder  {
    constructor({
                    avatar = '',
                } = {}) {
        super();
        this._avatarUrl = avatar;
    }

    avatar(url) {
        this._avatar = url;
        debugger;
    }

    getAvatarUrl() {
        return 'martin';
    }

    get showIcons() {return this._showIcons;}
    set showIcons(value) { this._showIcons = value; }

    renderActions( actions ) {

        actions = actions['all'] ?? {};

        let display = '';
        display += '<div class="aurora-actions">';
        display += '    <div class="aurora-actions-trigger avatar"><img id="avatar" class="action-avatar"></div>';
        display += '    <div class="aurora-actions-menu">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            if (action.isAvailable()) {
                const disabledClass =   ( action.isDisabled() )
                    ? 'disabled'
                    : '';


                let icon        = '';
                let actionLabel = action.label;
                let actionLabelI18n = '';
                if ( action.label.startsWith( "i18n:" ) ) {
                    actionLabel = '';
                    actionLabelI18n = 'aurora-i18n="'+ action.label.slice(5) +'"';
                }

                if (this.showIcons) {
                    icon = '<i aria-hidden="true" class="material-icons aurora-menu-icon">'+ action.icon +'</i>';
                }

                if (action.properties.divider) {
//                    display += '<hr>';
                    display += '<li class="aurora-action divider"></li>';

                } else {
                    display += '<li class="aurora-action ' + action.name + ' ' + disabledClass + ' " aurora-action-name="' + action.name + '">' + icon + '<span  ' + actionLabelI18n + '>' + actionLabel + '</span></li>';
                }
            }
        }

        display += '        </ul>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
}
