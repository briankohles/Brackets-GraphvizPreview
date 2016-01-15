# Graphviz Preview

# TODO:

- [ ] add examples
- [ ] create icon

A [Brackets](https://brackets.io) extension that provides a live preview of [Graphviz](http://www.graphviz.org) DOT format documents. 

![Alt text](./screenshots/graphviz-preview.png?raw=true "Graphviz Preview")

### Installation

* Select **File > Extension Manager...** (or click the "brick" icon in the toolbar)
* Click "Install from URL..."
* Paste [https://github.com/briankohles/Brackets-GraphvizPreview](https://github.com/briankohles/Brackets-GraphvizPreview) into the field, and click "Install"

### How To Use
When a Graphviz DOT format document (with extension ".gv" or ".gvdot") is open, a "gv" icon is shown in the 
toolbar at the right of the Brackets window. Click this icon to open the preview panel. The panel can be 
resized vertically.

The preview is updated as you edit the document. You can hover over links to see the href in a tooltip,
or click them to open in your default browser.

Hover over the preview area to show the settings "gear" icon. Click this icon to change the settings.

### About Graphviz and the DOT Language

Documentation of the DOT language can be found at:
* [Graphviz Documentation](http://www.graphviz.org/Documentation.php)
* [The DOT Language](http://www.graphviz.org/content/dot-language)
* [Node, Edge and Graph Attributes](http://www.graphviz.org/content/attrs)
* [Node Shapes](http://www.graphviz.org/content/node-shapes)
* [Arrow Shapes](http://www.graphviz.org/content/arrow-shapes)
* [Colors](http://www.graphviz.org/content/color-names)

### Credits
This extension is based on the MarkdownPreview extension by Glenn Ruehle
* [MarkdownPreview](https://github.com/gruehle/MarkdownPreview) - Markdown viewer for Brackets
>MarkdownPreview LICENSE
>
>Copyright (c) 2012 Glenn Ruehle. All rights reserved.
>
>Permission is hereby granted, free of charge, to any person obtaining a
>copy of this software and associated documentation files (the "Software"), 
>to deal in the Software without restriction, including without limitation 
>the rights to use, copy, modify, merge, publish, distribute, sublicense, 
>and/or sell copies of the Software, and to permit persons to whom the 
>Software is furnished to do so, subject to the following conditions:
> 
>The above copyright notice and this permission notice shall be included in
>all copies or substantial portions of the Software.
> 
>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
>IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
>FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
>AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
>LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
>FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
>DEALINGS IN THE SOFTWARE.

This extension uses the following open source components:
* [viz.js](https://github.com/mdaines/viz.js/) - A JavaScript based Graphviz rendering engine that draws using SVG
>viz.js LICENSE
>
>Copyright (c) 2014-2015, Michael Daines
>All rights reserved.
>
>Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
>
>1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
>
>2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
>
>3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
>
>THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.