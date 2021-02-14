/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

export const linkProperties = (link) => link.match(r).map(x => x.match(/!{(.*?)}/)[1]);

export const buildLink = (link, properties) => {
    Object.entries(properties).forEach(([name, value]) => {
        link = link.replace(`!{${name}}`, value);
    });
    return link;
};
