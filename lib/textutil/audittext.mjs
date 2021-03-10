/*
 * Copyright (c) 2021.
 */

/*
 *
 * @author: Martin Neitz
 */

export function auditText( text ) {
    let comment_analyse = {};
    comment_analyse.length 			= text.length;
    comment_analyse.is_html_used 	= isHTMLUsed( text );
    comment_analyse.hasExternalLink = hasExternalLink(text);
    comment_analyse.is_script_used 	= isScriptUsed(text);
    comment_analyse.stopwords       = includesStopwords(text);
    return comment_analyse;
}

function isHTMLUsed( text ) {
    let html_status = false;
    let doc = new DOMParser().parseFromString(text, "text/html");
    html_status = Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
    return html_status;
}

function isScriptUsed( text ) {
    let script_status = false;
    if( text.match( /<script[\s\S]*?>[\s\S]*?<\/script>/gi ) ){
        script_status = true;
    }
    return script_status;
}

function hasExternalLink( text ) {
    let linkStatus = false;
    return linkStatus;
}

function includesStopwords( text ) {
    return 0;
}
