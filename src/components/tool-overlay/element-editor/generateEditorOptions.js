import constants from "../../graph-manager/utils/constants"
import { focusOnElement } from "../../graph-manager/utils/view"

export default function generateOptions(selectedElements) {


    if (selectedElements.length === 0) return globalOptions()
    else return elementsOptions(selectedElements)
}


function globalOptions() {
    const sections = []

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


function elementsOptions(selectedElements) {
    const sections = []
    const nodes = selectedElements.filter(e => e.constructor.name === "Node")
    const edges = selectedElements.filter(e => e.constructor.name === "Edge")

    // Common fields (disabling for now)
    // if (selectedElements.length === 1) sections.push({
    //     title: "Data",
    //     fields: []
    // })

    // Node specific fields
    if (nodes.length > 0) {
        const currentSection = {
            title: "Node" + (nodes.length > 1 ? "s" : ""),
            fields: []
        }
        sections.push(currentSection)
        const fields = currentSection.fields

        // One node
        if (nodes.length === 1) {
            fields.push(
                {
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
                    label: "Label",
                    initial: nodes[0].label,
                    callback: data => nodes[0].label = data
                },
                {
                    label: "X",
                    initial: nodes[0].x,
                    callback: data => nodes[0].x = parseFloat(data),
                    type: "number"
                },
                {
                    label: "Y",
                    initial: nodes[0].y,
                    callback: data => nodes[0].y = parseFloat(data),
                    type: "number"
                },
                {
                    label: "Radius",
                    initial: nodes[0].r,
                    callback: data => nodes[0].r = parseFloat(data),
                    type: "number",
                    default: constants.NODE_RADIUS
                }
            )
        }

        // One or more nodes
        fields.push(
            {
                label: "Fill color",
                initial: nodes[0].backgroundColor,
                callback: data => nodes.forEach(e => e.backgroundColor = data),
                type: "color",
                default: constants.NODE_BACKGROUND_COLOR
            },
            {
                label: "Label color",
                initial: nodes[0].labelColor,
                callback: data => nodes.forEach(e => e.labelColor = data),
                type: "color",
                default: constants.NODE_LABEL_COLOR
            },
            {
                label: "Font size",
                initial: nodes[0].fontSize,
                callback: data => nodes.forEach(e => e.fontSize = parseFloat(data)),
                type: "number",
                default: constants.NODE_LABEL_FONT_SIZE
            },
            {
                label: "Border color",
                initial: nodes[0].borderColor,
                callback: data => nodes.forEach(e => e.borderColor = data),
                type: "color"
            },
            {
                label: "Border width",
                initial: nodes[0].borderWidth,
                callback: data => nodes.forEach(e => e.borderWidth = parseFloat(data)),
                type: "range",
                range: [0, 10],
                default: 0
            },
        )
    }


    // Edge specific fields
    if (edges.length > 0) {
        const currentSection = {
            title: "Edge" + (edges.length > 1 ? "s" : ""),
            fields: []
        }
        sections.push(currentSection)
        const fields = currentSection.fields

        // One edge
        if (edges.length === 1) {
            fields.push(
                {
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
                    label: "Source node",
                    initial: edges[0].src.id,
                    disabled: true,
                    callback: () => focusOnElement(edges[0].src),
                    labelStyle: { cursor: "pointer" }
                },
                {
                    label: "Destination node",
                    initial: edges[0].dst.id,
                    disabled: true,
                    callback: () => focusOnElement(edges[0].dst),
                    labelStyle: { cursor: "pointer" }
                }
            )
        }

        // One or more edges
        fields.push(
            {
                label: "Weight",
                initial: edges[0].weight,
                callback: data => edges.forEach(e => e.weight = parseFloat(data)),
                type: "number",
                default: constants.EDGE_WEIGHT,
                checkError: data => isNaN(parseFloat(data)) ? "Invalid number" : null
            },
            {
                label: "Directed",
                initial: edges[0].directed,
                callback: data => edges.forEach(e => e.directed = data),
                type: "checkbox"
            },
            {
                label: "Thickness",
                initial: edges[0].thickness,
                callback: data => edges.forEach(e => e.thickness = parseFloat(data)),
                type: "number",
                default: constants.EDGE_THICKNESS
            },
            {
                label: "Color",
                initial: edges[0].color,
                callback: data => edges.forEach(e => e.color = data),
                type: "color",
                default: constants.EDGE_COLOR
            },
            {
                label: "Arrow size",
                initial: edges[0].arrowSizeFactor,
                callback: data => edges.forEach(e => e.arrowSizeFactor = parseFloat(data)),
                type: "number",
                default: constants.EDGE_ARROW_SIZE_FACTOR
            },
            {
                label: "Show weight",
                initial: edges[0].weightColor !== null,
                callback: data => edges.forEach(e => e.weightColor = data ? "#fff4" : null),
                type: "checkbox",
                default: true
            },
            {
                label: "Weight color",
                initial: edges[0].weightColor,
                callback: data => edges.forEach(e => e.weightColor = data),
                type: "color",
                default: constants.EDGE_WEIGHT_COLOR
            },
            {
                label: "Weight font size",
                initial: edges[0].weightFontSize,
                callback: data => edges.forEach(e => e.weightFontSize = parseFloat(data)),
                type: "number",
                default: constants.EDGE_WEIGHT_FONT_SIZE
            },
            {
                label: "Show weight background",
                initial: edges[0].weightBackgroundColor !== null,
                callback: data => edges.forEach(e => e.weightBackgroundColor = data ? "#8888" : null),
                type: "checkbox",
                default: true
            },
            {
                label: "Weight background",
                initial: edges[0].weightBackgroundColor,
                callback: data => edges.forEach(e => e.weightBackgroundColor = data),
                type: "color",
                default: constants.EDGE_WEIGHT_BACKGROUND_COLOR
            }
        )
    }

    // Common fields (continued)
    sections.push({
        title: "Element" + (selectedElements.length > 1 ? "s" : ""),
        fields: [
            {
                label: "Opacity",
                initial: selectedElements[0].opacity,
                callback: data => selectedElements.forEach(e => e.opacity = parseFloat(data)),
                type: "range",
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