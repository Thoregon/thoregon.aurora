/**
 * defines all errors used in pubsub
 *
 * @author: blukassen
 */
import { EError }       from '/evolux.supervise';
import { className }    from "/evolux.util";

export const ErrNotImplemented          = (msg)             => new EError(`Not implemented: ${msg}`,                    "AURORA:00001");
export const ErrNoHTMLElement           = (msg)             => new EError(`Not a HTML Element: ${msg}`,                 "AURORA:00002");
export const ErrTemplateNotFound        = (msg)             => new EError(`Template bot found: ${msg}`,                 "AURORA:00003");
