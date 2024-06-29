export default function generateOptions(selectedElements){

    
    if (selectedElements.length === 0) return globalOptions()
    else return elementsOptions(selectedElements)
}


function globalOptions(){
    const sections = []

    sections.push({
        title: "Global",
        fields: [
            {
                label: "Background color",
                initial: window.graph.backgroundColor,
                callback: data => window.cvs.$canvas.style.backgroundColor = data,
                type: "color"
            },
        ]
    })
    sections.push({
        title: "Grid",
        fields: [
            {
            label: "Grid enabled",
            initial: window.graph.gridEnabled,
            callback: data => window.graph.gridEnabled = data,
                type: "checkbox"
            },
            {
                label: "Grid color",
                initial: window.graph.gridColor,
                callback: data => window.graph.gridColor = data,
                type: "color"
            },
            {
                label: "Grid span",
                initial: window.graph.gridSize,
                callback: data => window.graph.gridSize = parseFloat(data),
                type: "number"
            },
            {
                label: "Grid thickness",
                initial: window.graph.gridThickness,
                callback: data => window.graph.gridThickness = parseFloat(data),
                type: "number",
                options: {
                    min: 0
                }
            },
            {
                label: "Grid opacity",
                initial: window.graph.gridOpacity,
                callback: data => window.graph.gridOpacity = parseFloat(data),
                type: "range",
                options:{
                    step: 0.01,
                    min: 0,
                    max: 1
                }
            },
        ]
    })

    return sections
}


function elementsOptions(selectedElements){
    const sections = []
    const nodes = selectedElements.filter(e => e.constructor.name === "Node")
    const edges = selectedElements.filter(e => e.constructor.name === "Edge")

    // Common fields
    sections.push({
        title: "Data",
        fields: [
            {
                label: "ID",
                initial: selectedElements[0].id,
                disabled: true,
            }
        ]
    })

    // Node specific fields
    if (nodes.length > 0) {
        sections.push({
            title: "Node" + (nodes.length > 1 ? "s" : ""),
            fields: []
        })
        const fields = sections.slice(-1)[0].fields

        // One node
        if (nodes.length === 1) {
            fields.push(
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
                        type: "number"
                    }
            )
        }
        
        // One or more nodes
        fields.push(
                {
                    label: "Fill color",
                    initial: nodes[0].backgroundColor,
                    callback: data => nodes.forEach(e => e.backgroundColor = data),
                    type: "color"
                },
                {
                    label: "Label color",
                    initial: nodes[0].labelColor,
                    callback: data => nodes.forEach(e => e.labelColor = data),
                    type: "color"
                },
                {
                    label: "Font size",
                    initial: nodes[0].fontSize,
                    callback: data => nodes.forEach(e => e.fontSize = parseFloat(data)),
                    type: "number"
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
                    range: [0, 10]
                },
        )
    }


    // Edge specific fields
    if (edges.length > 0) {
        sections.push({
            title: "Edge" + (edges.length > 1 ? "s" : ""),
            fields: []
        })
        const fields = sections.slice(-1)[0].fields

        // One edge
        if (edges.length === 1) {
            sections[0].fields.push(
                    {
                        label: "Source node",
                        initial: edges[0].src.id,
                        disabled: true,
                    },
                    {
                        label: "Destination node",
                        initial: edges[0].dst.id,
                        disabled: true,
                    }
            )
        }

        // One or more edges
        fields.push(
                {
                    label: "Weight",
                    initial: edges[0].weight,
                    callback: data => edges.forEach(e => e.weight = parseFloat(data)),
                    type: "number"
                },
                {
                    label: "Thickness",
                    initial: edges[0].thickness,
                    callback: data => edges.forEach(e => e.thickness = parseFloat(data)),
                    type: "number"
                },
                {
                    label: "Color",
                    initial: edges[0].color,
                    callback: data => edges.forEach(e => e.color = data),
                    type: "color"
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