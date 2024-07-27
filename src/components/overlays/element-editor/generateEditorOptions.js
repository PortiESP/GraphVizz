import constants from "../../graph-manager/utils/constants"
import { focusOnElement } from "../../graph-manager/utils/view"

/*
    To add a new section:
    ```
    sections.push({
        title: "Section title",
        fields: []
    })
    ```

    To add a new field to a section:
    ```
    fields.push({
        type: "field type",
        label: "Field label",
        initial: initial value,
        callback: callback function,
        checkError: error checking function,
        default: default value,
        disabled: is field disabled,
    })
    ```

    > Some field types have an additional `options` field where you can add attributes for the `<input>` tag. See the `widgets/` folder for more information on each field type.
*/


/**
 * Generate the options for the element editor based on the selected elements 
 * 
 * @param {Array} selectedElements - The selected elements of the graph
 * 
 * @returns {Array} - The sections with the corresponding fields
 */
export default function generateOptions(selectedElements) {
    // If no elements are selected, show the global options
    if (selectedElements.length === 0) return globalOptions()
    // Return the options for the selected elements
    else return elementsOptions(selectedElements)
}


/**
 * Generate the options for the global settings
 * 
 * @returns {Array} - The sections with the corresponding fields
 */
function globalOptions() {
    const sections = []

    // Add the "Global" section
    // This section contains the settings for the environment
    sections.push({
        title: "Global",
        fields: [
            {
                label: "Background color",
                initial: window.graph.backgroundColor,
                callback: data => window.cvs.$canvas.style.backgroundColor = data,
                type: "color",
                default: "#eee"
            },
        ]
    })

    // Add the "Grid" section
    // This section contains the settings for the grid
    sections.push({
        title: "Grid",
        fields: [
            {
                label: "Show grid",
                initial: window.graph.gridEnabled,
                callback: data => window.graph.gridEnabled = data,
                type: "checkbox",
                default: true
            },
            {
                label: "Grid color",
                initial: window.graph.gridColor,
                callback: data => window.graph.gridColor = data,
                type: "color",
                default: "#ddd"
            },
            {
                label: "Grid span",
                initial: window.graph.gridSize,
                callback: data => window.graph.gridSize = parseFloat(data),
                type: "number",
                default: 50
            },
            {
                label: "Grid thickness",
                initial: window.graph.gridThickness,
                callback: data => window.graph.gridThickness = parseFloat(data),
                type: "number",
                options: {
                    min: 0
                },
                default: 1
            },
            {
                label: "Grid opacity",
                initial: window.graph.gridOpacity,
                callback: data => window.graph.gridOpacity = parseFloat(data),
                type: "range",
                options: {
                    step: 0.01,
                    min: 0,
                    max: 1
                },
                default: 1
            },
        ]
    })

    return sections
}


/**
 * Generate the options for the selected elements
 * 
 * @param {Array} selectedElements - The selected elements of the graph
 * 
 * @returns {Array} - The sections with the corresponding fields
 */
function elementsOptions(selectedElements) {
    const sections = []

    // Separate the nodes from the edges
    const nodes = selectedElements.filter(e => e.constructor.name === "Node")
    const edges = selectedElements.filter(e => e.constructor.name === "Edge")

    // --- NODES SPECIFIC FIELDS ---
    if (nodes.length > 0) {
        // Add a new section to the sections array
        sections.push({
            title: "Node" + (nodes.length > 1 ? "s" : ""),  // Node or Nodes
            fields: []
        })

        // Holds the current section from the sections array as a shorter reference
        const currentSection = sections[sections.length - 1]
        // Holds the fields of the current section as a shorter reference
        const fields = currentSection.fields

        // Only one node selected
        if (nodes.length === 1) {
            fields.push(
                {
                    type: "text",
                    label: "ID",
                    initial: selectedElements[0].id,
                    callback: data => selectedElements[0].id = data,
                    checkError: data => {
                        if (data === "") return "Id cannot be empty"
                        if (window.graph.nodes.find(e => e.id === data) !== undefined || window.graph.edges.find(e => e.id === data) !== undefined) return "Id already exists"

                        return null
                    },
                },
                {
                    type: "text",
                    label: "Label",
                    initial: nodes[0].label,
                    callback: data => nodes[0].label = data
                },
                {
                    type: "number",
                    label: "X",
                    initial: nodes[0].x,
                    callback: data => nodes[0].x = parseFloat(data),
                },
                {
                    type: "number",
                    label: "Y",
                    initial: nodes[0].y,
                    callback: data => nodes[0].y = parseFloat(data),
                },
                {
                    type: "number",
                    label: "Radius",
                    initial: nodes[0].r,
                    callback: data => nodes[0].r = parseFloat(data),
                    default: constants.NODE_RADIUS
                }
            )
        }

        // One or more nodes selected
        fields.push(
            {
                type: "color",
                label: "Fill color",
                initial: nodes[0].backgroundColor,
                callback: data => nodes.forEach(e => e.backgroundColor = data),
                default: constants.NODE_BACKGROUND_COLOR
            },
            {
                type: "color",
                label: "Label color",
                initial: nodes[0].labelColor,
                callback: data => nodes.forEach(e => e.labelColor = data),
                default: constants.NODE_LABEL_COLOR
            },
            {
                type: "number",
                label: "Font size",
                initial: nodes[0].fontSize,
                callback: data => nodes.forEach(e => e.fontSize = parseFloat(data)),
                default: constants.NODE_LABEL_FONT_SIZE
            },
            {
                type: "color",
                label: "Border color",
                initial: nodes[0].borderColor,
                callback: data => nodes.forEach(e => e.borderColor = data),
            },
            {
                type: "range",
                label: "Border width",
                initial: nodes[0].borderWidth,
                callback: data => nodes.forEach(e => e.borderWidth = parseFloat(data)),
                options: {
                    min: 0,
                    max: Math.min(nodes.map(e => e.r)),
                    step: 0.1
                },
                default: 0
            },
            {
                type: "checkbox",
                label: "Show bubble",
                initial: nodes[0].bubble !== null,
                callback: data => nodes.forEach(e => e.bubble = data ? 0 : null),
                default: false
            },
            {
                type: "number",
                label: "Bubble value",
                initial: nodes[0].bubble,
                callback: data => nodes.forEach(e => e.bubble = parseFloat(data)),
                default: 0
            },
            {
                type: "number",
                label: "Bubble radius",
                initial: nodes[0].bubbleRadius,
                callback: data => nodes.forEach(e => e.bubbleRadius = parseFloat(data)),
                default: constants.NODE_BUBBLE_RADIUS
            },
            {
                type: "color",
                label: "Bubble color",
                initial: nodes[0].bubbleColor,
                callback: data => nodes.forEach(e => e.bubbleColor = data),
                default: constants.NODE_BUBBLE_COLOR
            },
            {
                type: "number",
                label: "Bubble font size",
                initial: 12,
                callback: data => nodes.forEach(e => e.bubbleTextSize = parseFloat(data)),
                default: constants.NODE_BUBBLE_TEXT_SIZE
            },
            {
                type: "color",
                label: "Bubble text color",
                initial: nodes[0].bubbleTextColor,
                callback: data => nodes.forEach(e => e.bubbleTextColor = data),
                default: constants.NODE_BUBBLE_TEXT_COLOR
            }
        )
    }

    // --- EDGES SPECIFIC FIELDS ---
    if (edges.length > 0) {

        // Add a new section to the sections array
        sections.push({
            title: "Edge" + (edges.length > 1 ? "s" : ""),
            fields: []
        })

        // Holds the current section from the sections array as a shorter reference
        const currentSection = sections[sections.length - 1]
        // Holds the fields of the current section as a shorter reference
        const fields = currentSection.fields

        // Only one edge selected
        if (edges.length === 1) {
            fields.push(
                {
                    type: "text",
                    label: "ID",
                    initial: selectedElements[0].id,
                    callback: data => selectedElements[0].id = data,
                    checkError: data => {
                        if (data === "") return "Id cannot be empty"
                        if (window.graph.nodes.find(e => e.id === data) !== undefined || window.graph.edges.find(e => e.id === data) !== undefined) return "Id already exists"

                        return null
                    },
                },
                {
                    type: "text",
                    label: "Source node",
                    initial: edges[0].src.id,
                    disabled: true,
                    callback: () => focusOnElement(edges[0].src),
                    labelStyle: { cursor: "pointer" }
                },
                {
                    type: "text",
                    label: "Destination node",
                    initial: edges[0].dst.id,
                    disabled: true,
                    callback: () => focusOnElement(edges[0].dst),
                    labelStyle: { cursor: "pointer" }
                }
            )
        }

        // One or more edges selected
        fields.push(
            {
                type: "number",
                label: "Weight",
                initial: edges[0].weight,
                callback: data => edges.forEach(e => e.weight = parseFloat(data)),
                default: constants.EDGE_WEIGHT,
                checkError: data => isNaN(parseFloat(data)) ? "Invalid number" : null
            },
            {
                type: "checkbox",
                label: "Directed",
                initial: edges[0].directed,
                callback: data => edges.forEach(e => e.directed = data),
            },
            {
                type: "number",
                label: "Thickness",
                initial: edges[0].thickness,
                callback: data => edges.forEach(e => e.thickness = parseFloat(data)),
                default: constants.EDGE_THICKNESS
            },
            {
                type: "color",
                label: "Color",
                initial: edges[0].color,
                callback: data => edges.forEach(e => e.color = data),
                default: constants.EDGE_COLOR
            },
            {
                type: "number",
                label: "Arrow size",
                initial: edges[0].arrowSizeFactor,
                callback: data => edges.forEach(e => e.arrowSizeFactor = parseFloat(data)),
                default: constants.EDGE_ARROW_SIZE_FACTOR
            },
            {
                type: "checkbox",
                label: "Show weight",
                initial: edges[0].weightColor !== null,
                callback: data => edges.forEach(e => e.weightColor = data ? "#fff4" : null),
                default: true
            },
            {
                type: "color",
                label: "Weight color",
                initial: edges[0].weightColor,
                callback: data => edges.forEach(e => e.weightColor = data),
                default: constants.EDGE_WEIGHT_COLOR
            },
            {
                type: "number",
                label: "Weight font size",
                initial: edges[0].weightFontSize,
                callback: data => edges.forEach(e => e.weightFontSize = parseFloat(data)),
                default: constants.EDGE_WEIGHT_FONT_SIZE
            },
            {
                type: "checkbox",
                label: "Show weight background",
                initial: edges[0].weightBackgroundColor !== null,
                callback: data => edges.forEach(e => e.weightBackgroundColor = data ? "#8888" : null),
                default: true
            },
            {
                type: "color",
                label: "Weight background",
                initial: edges[0].weightBackgroundColor,
                callback: data => edges.forEach(e => e.weightBackgroundColor = data),
                default: constants.EDGE_WEIGHT_BACKGROUND_COLOR
            }
        )
    }

    // --- COMMON FIELDS ---
    sections.push({
        title: "Element" + (selectedElements.length > 1 ? "s" : ""),
        fields: [
            {
                type: "range",
                label: "Opacity",
                initial: selectedElements[0].opacity,
                callback: data => selectedElements.forEach(e => e.opacity = parseFloat(data)),
                options: {
                    step: 0.01,
                    min: 0,
                    max: 1
                }
            }
        ]
    })

    return sections
}