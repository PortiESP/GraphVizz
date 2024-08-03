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
        title: "Canvas",
        fields: [
            {
                type: "title",
                label: "Background"
            },
            {
                label: "Background color",
                initial: window.graph.backgroundColor,
                callback: data => window.cvs.$canvas.style.backgroundColor = data,
                type: "color",
                default: "#eee"
            },
            {
                type: "title",
                label: "Grid"
            },
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
                    type: "title",
                    label: "Identity"
                },
                {
                    type: "text",
                    label: "ID",
                    initial: selectedElements[0].id,
                    callback: data => selectedElements[0].id = data,
                    checkError: data => {
                        if (data === "") return "Id cannot be empty"
                        if (data.includes(" ")) return "Id cannot contain spaces"
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
                    type: "title",
                    label: "Position"
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
                    type: "title",
                    label: "Appearance"  
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
            nodes.length > 1 && {  // Only add the title if there are more than one node selected, otherwise skip it (this is because when there is only one node selected, the title is already added)
                type: "title",
                label: "Appearance"
            },
            {
                type: "color",
                label: "Fill color",
                initial: nodes[0].backgroundColor,
                callback: data => nodes.forEach(e => e.style.backgroundColor = data),
                default: constants.NODE_BACKGROUND_COLOR
            },
            {
                type: "color",
                label: "Label color",
                initial: nodes[0].labelColor,
                callback: data => nodes.forEach(e => e.style.labelColor = data),
                default: constants.NODE_LABEL_COLOR
            },
            {
                type: "number",
                label: "Font size",
                initial: nodes[0].fontSize,
                callback: data => nodes.forEach(e => e.style.fontSize = parseFloat(data)),
                default: constants.NODE_LABEL_FONT_SIZE
            },
            {
                type: "color",
                label: "Border color",
                initial: nodes[0].borderColor,
                callback: data => nodes.forEach(e => e.style.borderColor = data),
            },
            {
                type: "range",
                label: "Border width ratio",
                initial: nodes[0].borderRatio,
                callback: data => nodes.forEach(e => {e.style.borderRatio = parseFloat(data); e.computeStyle()}),
                options: {
                    min: 0,
                    max: 1,
                    step: 0.1
                },
                default: 0
            },
            {
                type: "title",
                label: "Bubble"
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
                callback: data => nodes.forEach(e => e.style.bubbleRadius = parseFloat(data)),
                default: constants.NODE_BUBBLE_RADIUS
            },
            {
                type: "color",
                label: "Bubble color",
                initial: nodes[0].bubbleColor,
                callback: data => nodes.forEach(e => e.style.bubbleColor = data),
                default: constants.NODE_BUBBLE_COLOR
            },
            {
                type: "number",
                label: "Bubble font size",
                initial: 12,
                callback: data => nodes.forEach(e => e.style.bubbleTextSize = parseFloat(data)),
                default: constants.NODE_BUBBLE_TEXT_SIZE
            },
            {
                type: "color",
                label: "Bubble text color",
                initial: nodes[0].bubbleTextColor,
                callback: data => nodes.forEach(e => e.style.bubbleTextColor = data),
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
                    type: "title",
                    label: "Identity"
                },
                {
                    type: "text",
                    label: "ID",
                    initial: selectedElements[0].id,
                    callback: data => selectedElements[0].id = data,
                    checkError: data => {
                        if (data === "") return "Id cannot be empty"
                        if (data.includes(" ")) return "Id cannot contain spaces"
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
                type: "title",
                label: "Properties"
            },
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
                type: "title",
                label: "Edge appearance"
            },
            {
                type: "number",
                label: "Thickness",
                initial: edges[0].thickness,
                callback: data => edges.forEach(e => e.style.thickness = parseFloat(data)),
                default: constants.EDGE_THICKNESS_RATIO
            },
            {
                type: "color",
                label: "Line color",
                initial: edges[0].color,
                callback: data => edges.forEach(e => e.style.color = data),
                default: constants.EDGE_COLOR
            },
            edges.some(e => e.directed) && {
                type: "number",
                label: "Arrow size",
                initial: edges[0].arrowSizeFactor,
                callback: data => edges.forEach(e => e.style.arrowSizeFactor = parseFloat(data)),
                default: constants.EDGE_ARROW_SIZE_FACTOR
            },
            {
                type: "title",
                label: "Weight appearance"
            },
            {
                type: "checkbox",
                label: "Show weight",
                initial: edges[0].weightColor !== null,
                callback: data => edges.forEach(e => e.style.weightColor = data ? "#fff4" : null),  // The draw function will not draw the weight if the color is null
                default: true
            },
            {
                type: "color",
                label: "Weight color",
                initial: edges[0].weightColor,
                callback: data => edges.forEach(e => e.style.weightColor = data),
                default: constants.EDGE_WEIGHT_COLOR
            },
            {
                type: "number",
                label: "Weight font size",
                initial: edges[0].weightFontSize,
                callback: data => edges.forEach(e => e.style.weightFontSize = parseFloat(data)),
                default: constants.EDGE_WEIGHT_FONT_SIZE
            },
            {
                type: "checkbox",
                label: "Show weight background",
                initial: edges[0].weightBackgroundColor !== null,
                callback: data => edges.forEach(e => e.style.weightBackgroundColor = data ? "#8888" : null),
                default: true
            },
            {
                type: "color",
                label: "Weight background",
                initial: edges[0].weightBackgroundColor,
                callback: data => edges.forEach(e => e.style.weightBackgroundColor = data),
                default: constants.EDGE_WEIGHT_BACKGROUND_COLOR
            },
            {
                type: "range",
                label: "Weight container size",
                initial: edges[0].weightContainerFactor,
                callback: data => edges.forEach(e => e.style.weightContainerFactor = parseFloat(data)),
                default: constants.EDGE_WEIGHT_CONTAINER_FACTOR,
                options: {
                    min: 0,
                    max: 1,
                    step: 0.1
                }
            }
        )
    }

    // --- COMMON FIELDS ---
    sections.push({
        title: "Element" + (selectedElements.length > 1 ? "s" : ""),
        fields: [
            {
                type: "title",
                label: "Appearance"
            },
            {
                type: "range",
                label: "Opacity",
                initial: selectedElements[0].opacity,
                callback: data => selectedElements.forEach(e => e.style.opacity = parseFloat(data)),
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