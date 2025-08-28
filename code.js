"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 800, height: 600 });
figma.ui.onmessage = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    if (msg.type === 'create-sankey') {
        const { nodes: nodeData, links: linkData } = msg.data;
        // Load the font that will be used in the text nodes.
        yield figma.loadFontAsync({ family: "Inter", style: "Regular" });
        const createdNodes = [];
        // Create rectangles and text labels for each node in the Sankey data.
        for (const node of nodeData) {
            const rect = figma.createRectangle();
            rect.x = node.x;
            rect.y = node.y;
            rect.resize(node.width, 40); // nodeHeight is 40 in ui.html
            // Style the rectangle to match the UI
            rect.fills = [{ type: 'SOLID', color: { r: 0.913, g: 0.949, b: 1 } }]; // #e9f2ff
            rect.strokes = [{ type: 'SOLID', color: { r: 0.4, g: 0.6, b: 0.8 } }]; // #6699cc
            rect.cornerRadius = 6;
            figma.currentPage.appendChild(rect);
            const text = figma.createText();
            text.x = node.x + 6;
            text.y = node.y;
            text.resize(node.width - 12, 40);
            text.characters = node.name;
            text.fontSize = 12;
            // Style the text to match the UI
            text.fills = [{ type: 'SOLID', color: { r: 0.137, g: 0.29, b: 0.466 } }]; // #234d77
            text.textAlignVertical = 'CENTER';
            figma.currentPage.appendChild(text);
            // Group the rectangle and its text label together.
            const nodeGroup = figma.group([rect, text], figma.currentPage);
            nodeGroup.name = node.name;
            createdNodes.push(nodeGroup);
        }
        // Create vector paths for each link in the Sankey data.
        for (const link of linkData) {
            const vector = figma.createVector();
            // Use the SVG path data from the UI to draw the vector.
            vector.vectorPaths = [{
                    windingRule: 'NONZERO',
                    data: link.path,
                }];
            // Style the vector to match the UI
            vector.fills = [{ type: 'SOLID', color: { r: 0.435, g: 0.812, b: 0.592 }, opacity: 0.8 }]; // #6fcf97
            vector.strokes = []; // No stroke
            figma.currentPage.appendChild(vector);
            createdNodes.push(vector);
        }
        // Group all the created nodes (rectangles, text, and vectors) into a single group.
        if (createdNodes.length > 0) {
            const sankeyGroup = figma.group(createdNodes, figma.currentPage);
            sankeyGroup.name = "Sankey Diagram";
            // Select the new group and zoom the viewport to it.
            figma.currentPage.selection = [sankeyGroup];
            figma.viewport.scrollAndZoomIntoView([sankeyGroup]);
            figma.notify('Sankey diagram created successfully!');
        }
        else {
            figma.notify('No data to create a diagram.');
        }
    }
});
