/**
 *
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */
import AuroraFormElement from "../formcomponents/auroraformelement.mjs";
// import EditorJS          from "./editorjs.mjs";
// import Header            from "./tools/header.mjs";
import Quill             from "./quill.mjs";

export default class AuroraTextEditor extends AuroraFormElement {

    static get elementTag() {
        return 'aurora-texteditor';
    }

    async elementStyle(templatename) {
        return '';
    }

    async applyContent(container) {
        this.skeletonOn(container);
        const editorelem = this.builder.newDiv({ id: 'editorjs' });
        container.appendChild(editorelem);
        this.editor = new Quill(editorelem);
        await this.processInitQ();
        this.skeletonOff(container);
/*
        this.editor = new EditorJS({
                                       /!**
                                        * Enable/Disable the read only mode
                                        *!/
                                       readOnly: false,
                                       /!**
                                        * Id of Element that should contain the Editor
                                        *!/
                                       holder  : editorelem, // 'editorjs',

                                       /!**
                                        * Available Tools list.
                                        * Pass Tool's class or Settings object for each Tool you want to use
                                        *!/
                                       tools: {
                                           header: {
                                               class: Header,
                                               inlineToolbar: ['marker','link']
                                           },
/!*
                                           list: {
                                               class: List,
                                               inlineToolbar: true
                                           }
*!/
                                       },

                                       /!**
                                        * Initial Editor data
                                        *!/
                                       data: {
                                           blocks: [
                                               {
                                                   type: "header",
                                                   data: {
                                                       text: "Editor.js",
                                                       level: 2
                                                   }
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : 'Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration.'
                                                   }
                                               },
                                               {
                                                   type: "header",
                                                   data: {
                                                       text: "Key features",
                                                       level: 3
                                                   }
                                               },
                                               {
                                                   type : 'list',
                                                   data : {
                                                       items : [
                                                           'It is a block-styled editor',
                                                           'It returns clean data output in JSON',
                                                           'Designed to be extendable and pluggable with a simple API',
                                                       ],
                                                       style: 'unordered'
                                                   }
                                               },
                                               {
                                                   type: "header",
                                                   data: {
                                                       text: "What does it mean «block-styled editor»",
                                                       level: 3
                                                   }
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : 'Workspace in classic editors is made of a single contenteditable element, used to create different HTML markups. Editor.js <mark class=\"cdx-marker\">workspace consists of separate Blocks: paragraphs, headings, images, lists, quotes, etc</mark>. Each of them is an independent contenteditable element (or more complex structure) provided by Plugin and united by Editor\'s Core.'
                                                   }
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : `There are dozens of <a href="https://github.com/editor-js">ready-to-use Blocks</a> and the <a href="https://editorjs.io/creating-a-block-tool">simple API</a> for creation any Block you need. For example, you can implement Blocks for Tweets, Instagram posts, surveys and polls, CTA-buttons and even games.`
                                                   }
                                               },
                                               {
                                                   type: "header",
                                                   data: {
                                                       text: "What does it mean clean data output",
                                                       level: 3
                                                   }
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : 'Classic WYSIWYG-editors produce raw HTML-markup with both content data and content appearance. On the contrary, Editor.js outputs JSON object with data of each Block. You can see an example below'
                                                   }
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : `Given data can be used as you want: render with HTML for <code class="inline-code">Web clients</code>, render natively for <code class="inline-code">mobile apps</code>, create markup for <code class="inline-code">Facebook Instant Articles</code> or <code class="inline-code">Google AMP</code>, generate an <code class="inline-code">audio version</code> and so on.`
                                                   }
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : 'Clean data is useful to sanitize, validate and process on the backend.'
                                                   }
                                               },
                                               {
                                                   type : 'delimiter',
                                                   data : {}
                                               },
                                               {
                                                   type : 'paragraph',
                                                   data : {
                                                       text : 'We have been working on this project more than three years. Several large media projects help us to test and debug the Editor, to make its core more stable. At the same time we significantly improved the API. Now, it can be used to create any plugin for any task. Hope you enjoy. 😏'
                                                   }
                                               },
                                               {
                                                   type: 'image',
                                                   data: {
                                                       url: 'assets/codex2x.png',
                                                       caption: '',
                                                       stretched: false,
                                                       withBorder: true,
                                                       withBackground: false,
                                                   }
                                               },
                                           ]
                                       }
                                   });
*/
    }

}

AuroraTextEditor.defineElement();
