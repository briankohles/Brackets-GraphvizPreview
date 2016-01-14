/*
 * Graphviz Preview Brackets extension
 * Copyright (c) 2016 Brian Kohles
 *
 * Based on the MarkdownPreview Brackets extension
 * Copyright (c) 2012 Glenn Ruehle
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

/*jslint vars: true, plusplus: true, devel: true, nomen: true,  regexp: true, indent: 4, maxerr: 50 */
/*global define, brackets, $, window, _hideSettings */

define(function (require, exports, module) {
    "use strict";

    // Brackets modules
    var AppInit             = brackets.getModule("utils/AppInit"),
        NativeApp           = brackets.getModule("utils/NativeApp"),
        DocumentManager     = brackets.getModule("document/DocumentManager"),
        EditorManager       = brackets.getModule("editor/EditorManager"),
        ExtensionUtils      = brackets.getModule("utils/ExtensionUtils"),
        FileUtils           = brackets.getModule("file/FileUtils"),
        MainViewManager     = brackets.getModule("view/MainViewManager"),
        PopUpManager        = brackets.getModule("widgets/PopUpManager"),
        WorkspaceManager    = brackets.getModule("view/WorkspaceManager"),
        CommandManager      = brackets.getModule("command/CommandManager"),
        Menus               = brackets.getModule("command/Menus"),
        _                   = brackets.getModule("thirdparty/lodash");

    // Templates
    var panelHTML       = require("text!templates/panel.html"),
        previewHTML     = require("text!templates/preview.html");

    // Local modules
    require("lib/viz");

    // jQuery objects
    var $icon,
        $iframe,
        $panel;

    // Other vars
    var currentDoc,
        currentEditor,
        panel,
        viewMenu,
        toggleCmd,
        visible = false,
        realVisibility = false;

    // (based on code in brackets.js)
    function _handleLinkClick(e) {
        // Check parents too, in case link has inline formatting tags
        var node = e.target, url;
        while (node) {
		//console.log("LINKNODE:"+node.tagName+";");
	    // TODO: submit this change to markdown preview
            if (node.tagName.match(/^a$/i)) {
	    	//console.log("IN A TAG");
                url = node.getAttribute("xlink:href");
	        //console.log("Opening URL:"+url+" in default browser");
                if (url && !url.match(/^#/)) {
                    NativeApp.openURLInDefaultBrowser(url);
                }
                e.preventDefault();
                break;
            }
            node = node.parentElement;
        }

    }

    function _calcScrollPos() {
        var scrollInfo = currentEditor._codeMirror.getScrollInfo();
        var scrollPercentage = scrollInfo.top / (scrollInfo.height - scrollInfo.clientHeight);
        var scrollTop = ($iframe[0].contentDocument.body.scrollHeight - $iframe[0].clientHeight) * scrollPercentage;

        return Math.round(scrollTop);
    }

    function _editorScroll() {
    }

    function _loadDoc(doc, isReload) {
        if (doc && visible && $iframe) {
            var docText     = doc.getText(),
                scrollPos   = 0,
                bodyText    = "",
                yamlRegEx   = /^-{3}([\w\W]+?)(-{3})/,
                yamlMatch   = yamlRegEx.exec(docText);

            // If there's yaml front matter, remove it.
            if (yamlMatch) {
                docText = docText.substr(yamlMatch[0].length);
            }

            if (isReload) {
                scrollPos = $iframe.contents()[0].body.scrollTop;
            } 

            // Parse Graphviz into HTML
	    var validDot = _validateDotText(docText);
            if (validDot) {
	    	bodyText = Viz(docText);
	    } else {
		console.log("DOT Syntax invalid");
	    }	
	    //alert("BODYTEXT"+bodyText);

            // Show URL in link tooltip
            bodyText = bodyText.replace(/(href=\"([^\"]*)\")/g, "$1 title=\"$2\"");

            // Convert protocol-relative URLS
            bodyText = bodyText.replace(/src="\/\//g, "src=\"http://");

            if (isReload) {
                $iframe[0].contentDocument.body.innerHTML = bodyText;
            } else {
                // Make <base> tag for relative URLS
                var baseUrl = window.location.protocol + "//" + FileUtils.getDirectoryPath(doc.file.fullPath);

                // Assemble the HTML source
                var htmlSource = _.template(previewHTML)({
                    baseUrl    : baseUrl,
                    themeUrl   : require.toUrl("./themes/clean.css"),
                    scrollTop  : scrollPos,
                    bodyText   : bodyText
                });
                $iframe.attr("srcdoc", htmlSource);

                // Remove any existing load handlers
                $iframe.off("load");
                $iframe.load(function () {
                    // Open external browser when links are clicked
                    // (similar to what brackets.js does - but attached to the iframe's document)
                    $iframe[0].contentDocument.body.addEventListener("click", _handleLinkClick, true);

                    // Sync scroll position (if needed)
                    if (!isReload) {
                        _editorScroll();
                    }

                    // Make sure iframe is showing
                    $iframe.show();
                });
            }
        }
    }

    function _documentChange(e) {
        _loadDoc(e.target, true);
    }

    function _resizeIframe() {
        if (visible && $iframe) {
            var iframeWidth = panel.$panel.innerWidth();
            $iframe.attr("width", iframeWidth + "px");
        }
    }

    function _setPanelVisibility(isVisible) {
        if (isVisible === realVisibility) {
            return;
        }

        realVisibility = isVisible;
        if (isVisible) {
            if (!panel) {
                $panel = $(panelHTML);
                $iframe = $panel.find("#panel-graphviz-preview-frame");

                panel = WorkspaceManager.createBottomPanel("graphviz-preview-panel", $panel);
                $panel.on("panelResizeUpdate", function (e, newSize) {
                    $iframe.attr("height", newSize);
                });
                $iframe.attr("height", $panel.height());

                window.setTimeout(_resizeIframe);

                $iframe.hide();
            }
            _loadDoc(DocumentManager.getCurrentDocument());
            $icon.toggleClass("active");
            panel.show();
        } else {
            $icon.toggleClass("active");
            panel.hide();
            $iframe.hide();
        }
    }

    function _currentDocChangedHandler() {
        var doc = DocumentManager.getCurrentDocument(),
            ext = doc ? FileUtils.getFileExtension(doc.file.fullPath).toLowerCase() : "";

        if (currentDoc) {
            currentDoc.off("change", _documentChange);
            currentDoc = null;
        }

        if (currentEditor) {
            currentEditor.off("scroll", _editorScroll);
            currentEditor = null;
        }

        if (doc && /gv|gvdot/.test(ext)) {
            currentDoc = doc;
            currentDoc.on("change", _documentChange);
            currentEditor = EditorManager.getCurrentFullEditor();
            currentEditor.on("scroll", _editorScroll);
            $icon.css({display: "block"});
            _setPanelVisibility(visible);
            toggleCmd.setEnabled(true);
            _loadDoc(doc);
        } else {
            $icon.css({display: "none"});
            toggleCmd.setEnabled(false);
            _setPanelVisibility(false);
        }
    }

    function _toggleVisibility() {
        visible = !visible;
        _setPanelVisibility(visible);

        toggleCmd.setChecked(visible);
    }

    function _validateDotText(docText) {
   	// verify that our text is valid DOT file
	// for now we just count braces, brackets, & quotes
	
	// count the number of curly braces
	// console.log("CURLY-L:"+(docText.match(/\{/g).length) || []);
	// console.log("CURLY-R:"+(docText.match(/\}/g).length) || []);
	// return false if curly count is off
	if ((docText.match(/\{/g).length) != (docText.match(/\}/g).length)) {
		return false;
	}
	// return false if square count is off
	// console.log("SQUARE-L:"+(docText.match(/\[/g).length) || []);
	// console.log("SQUARE-R:"+(docText.match(/\]/g).length) || []);
	if ((docText.match(/\[/g).length) != (docText.match(/\]/g).length)) {
		return false;
	}
	// return false if odd number of quotes
	// console.log("QUOTES:"+(docText.match(/\"/g).length)%2 || []);
	if ((docText.match(/\"/g).length)%2 > 0) {
		return false;
	}

	return true;
    }

    // Debounce event callback to avoid excess overhead
    // Update preview 300 ms ofter document change
    // Sync scroll 1ms after document scroll (just enough to ensure
    // the document scroll isn't blocked).
    _documentChange = _.debounce(_documentChange, 300);
    _editorScroll = _.debounce(_editorScroll, 1);

    // Insert CSS for this extension
    ExtensionUtils.loadStyleSheet(module, "styles/GraphvizPreview.css");

    // Add toolbar icon
    $icon = $("<a>")
        .attr({
            id: "graphviz-preview-icon",
            href: "#"
        })
        .css({
            display: "none"
        })
        .click(_toggleVisibility)
        .appendTo($("#main-toolbar .buttons"));

    // Add a document change handler
    MainViewManager.on("currentFileChange", _currentDocChangedHandler);

    viewMenu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
    toggleCmd = CommandManager.register("Graphviz Preview", "toggleGraphvizPreview", _toggleVisibility);

    viewMenu.addMenuItem(toggleCmd);

    toggleCmd.setChecked(realVisibility);
    toggleCmd.setEnabled(realVisibility);

    // currentDocumentChange is *not* called for the initial document. Use
    // appReady() to set initial state.
    AppInit.appReady(function () {
        _currentDocChangedHandler();
    });

    // Listen for resize events
    WorkspaceManager.on("workspaceUpdateLayout", _resizeIframe);
    $("#sidebar").on("panelCollapsed panelExpanded panelResizeUpdate", _resizeIframe);
});
