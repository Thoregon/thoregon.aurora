/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export const linkProperties = (link) => link.match(/!{(.*?)}/g).map(x => x.match(/!{(.*?)}/)[1]);

export const buildLink = (link, properties) => {
    Object.entries(properties).forEach(([name, value]) => {
        link = link.replace(`!{${name}}`, value);
    });
    return link;
};

export const asColorDefinitions = (xml) => {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xml,"text/xml");
    let res = xmlDoc.children[0];
    if (!res) return;
    let colors = {};
    [...res.children].forEach(color => {
        colors[color.getAttribute('name')] = color.innerHTML;
    });
    return colors;
}

/*
 * selects a view from a path reference with conditions
 * todo [REFACTOR]: this is a very simple selector, if needed exchange by another interpreter
 */

function matchValue(condition, props) {
    let i = condition.indexOf('=');
    if (i > -1) {
        let name = condition.substring(0, i);
        let compare = condition.substring(i+1);
        return props[name] == compare;
    } else {
        return props[condition];
    }
}

function matchPath(path, props) {
    if (!path.startsWith('@')) return path;
    let i = path.indexOf(':');
    if (i < 0) return;
    let condition = path.substring(1,i);
    let ref = path.substring(i+1);
    let refthen, refelse;
    i = ref.indexOf('|');
    if (i > -1) {
        refthen = ref.substring(0,i);
        refelse = ref.substring(i+1);
    } else {
        refthen = ref;
    }

    return matchValue(condition, props) ? refthen : refelse;
}

export function selectPath(path, props) {
    let parts = path.split(',');
    let found;
    while (!found && parts.length > 0) {
        let part = parts.shift();   // get first element
        found = matchPath(part, props);
    }
    return found;
}
