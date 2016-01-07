# Graphviz Preview

**NOTE:** This is a VERY early version.

A [Brackets](https://brackets.io) extension that provides a live preview of Graphviz DOT format documents. 

![Alt text](./screenshots/graphviz-preview.png?raw=true "Graphviz Preview")

### Installation

* From the [projects GitHub page](https://github.com/briankohles/Brackets-GraphvizPreview) choose "Download Zip"
* Select **File > Extension Manager...** (or click the "brick" icon in the toolbar)
* Click "Install from URL..."
* Paste [https://github.com/briankohles/Brackets-GraphvizPreview/archive/master.zip](https://github.com/briankohles/Brackets-GraphvizPreview/archive/master.zip) into the field, and click "Install"

### How To Use
When a Graphviz DOT format document (with extension ".gv" or ".gvdot") is open, a "gv" icon is shown in the 
toolbar at the right of the Brackets window. Click this icon to open the preview panel. The panel can be 
resized vertically.

The preview is updated as you edit the document. You can hover over links to see the href in a tooltip,
or click them to open in your default browser.

Hover over the preview area to show the settings "gear" icon. Click this icon to change the settings.

### Settings
* TODO

### Credits
This extension uses the following open source components:

* [viz.js](https://github.com/mdaines/viz.js/) - A JavaScript based Graphviz rendering engine that draws using SVG
