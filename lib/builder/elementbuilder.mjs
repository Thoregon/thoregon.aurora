/**
 *
 *
 * @author: blukassen
 */

export default class UIElementBuilder  {

    constructor() {
    }

    newDiv(attrs) {
        let div = document.createElement('div');
        this.setAttributes(div, attrs);
        return div;
    }

    newText(text, attrs) {
        let p = document.createElement('p');
        if (text) p.innerHTML = text;
        this.setAttributes(p, attrs);
        return p;
    }

    newSpan(text, attrs) {
        let span = document.createElement('span');
        if (text) span.innerHTML = text;
        this.setAttributes(span, attrs);
        return span;
    }

    newSlot(id) {
        let slot = document.createElement('slot');
        this.setAttributes(slot, { id } );
        return slot;
    }

    // **** tables

    newTable(attrs) {
        let elem = document.createElement('table');
        this.setAttributes(elem, attrs);
        return elem;
    }
    newTableHeader(attrs) {
        let elem = document.createElement('th');
        this.setAttributes(elem, attrs);
        return elem;
    }
    newTableRow(attrs) {
        let elem = document.createElement('tr');
        this.setAttributes(elem, attrs);
        return elem;
    }
    newTableColumn(attrs) {
        let elem = document.createElement('td');
        this.setAttributes(elem, attrs);
        return elem;
    }


    // ****

    setAttributes(elem, attrs) {
        if (!attrs) return;
        Object.entries(attrs).forEach(([name, value]) => elem.setAttribute(name, value) );
    }
};
