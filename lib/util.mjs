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
