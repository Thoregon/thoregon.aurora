/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

const _tpl = {};
const _style = {};
const _vms = {};

export default class View {

    static with(viewname) {
        let view = new this();
        view.viewname = viewname;
        return view;
    }

    render(container) {
        let elems = '';
        container.innerHTML = elems;
    }
}
