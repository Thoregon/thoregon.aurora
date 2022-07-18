/*
 * Copyright (c) 2021.
 */

/*
 *
 * @author: Martin Neitz
 */
export class AuroraActionBuilderIconList {
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

export class AuroraActionBuilderIconContainer {
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

export class AuroraActionBuilderMenu {
    renderActions( actions ) {

        actions = actions['all'];

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


                let actionLabel = action.label;
                let actionLabelI18n = '';
                if ( action.label.startsWith( "i18n:" ) ) {
                    actionLabel = '';
                    actionLabelI18n = 'aurora-i18n="'+ action.label.slice(5) +'"';
                }

                display +=  '<li class="aurora-action ' + action.name + ' '+ disabledClass +' " aurora-action-name="'+ action.name +'"><span  '+ actionLabelI18n +'>' + actionLabel + '</span></li>';
            }
        }

        display += '        </ul>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
}

export class AuroraActionBuilderView {
    constructor(props) {
        this._view = undefined;
    }

    get view() { return this._view; }
    set view( view ) { this._view = view; }

    renderActions( actions ) {

        actions = actions['all'];

        return this.view;

    }
}
