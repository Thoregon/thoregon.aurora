/*
 * Copyright (c) 2021.
 */

/*
 *
 * @author: Martin Neitz
 */

export class AuroraActionBuilderIconContainer {
    renderActions( listItemViewModel, actionSet ) {
        let display = '';
        let actions = listItemViewModel.getActions( actionSet )['all'];

        // in case no actions are loaded
//        if (actions.length == 0 ) return;

//        let actions_primary = listItemViewModel.model.metaClass.getAllActions()['primary'];
//        let actions_primary = listItemViewModel.model.metaClass.getAllActions()['secondary'];

        display += '<div class="aurora-table-actions">';
        display += '    <div class="aurora-table-actions-container">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            display += this.renderActionIconContainer(listItemViewModel, action);
        }

        display += '<li class="aurora-table-action" ><i aria-hidden="true" class="material-icons aurora-icon">more_horiz</i></li>'

        display += '        </ul>';
        display += '      </div>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
    renderActionIconContainer( listItemViewModel, action ) {

        if (listItemViewModel.isActionAvailable()) {
            const disabledClass =   ( listItemViewModel.isActionDisabled() )
                ? 'disabled'
                : '';

            return '<li class="aurora-table-action ' + disabledClass + ' ' + action.name + '" aurora-action="' + action.name + '"><i aria-hidden="true" class="material-icons aurora-icon">' + action.icon + '</i></li>';
        }
        return '';
    }
}

export class AuroraActionBuilderMenu {
    renderActions( listItemViewModel, actionSet  ) {
        let display = '';

        let actions = listItemViewModel.getActions( actionSet )['all'];

        display += '<div class="aurora-table-actions">';
        display += '    <div class="aurora-table-actions-trigger"><span class="material-icons">more_horiz</span></div>';
        display += '    <div class="aurora-table-actions-menu hidden">';
        display += '        <ul>';

        for (let i = 0; i < actions.length; i++) {
            let action = actions[i];
            if (listItemViewModel.isActionAvailable()) {
                const disabledClass =   ( listItemViewModel.isActionDisabled() )
                    ? 'disabled'
                    : '';

                display +=  '<li class="aurora-table-action ' + action.name + ' '+ disabledClass +' " aurora-action="'+ action.name +'"><span>' + action.label + '</span></li>';
            }
        }

        display += '        </ul>';
        display += '    </div>';
        display += '</div>';
        return display;
    }
}