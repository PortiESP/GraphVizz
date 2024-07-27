import scss from "./liveEditor.module.scss"
import { useRef, useState, useEffect } from "react"

// Functions
import { generateEdgeAndNodesList } from "@components/graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import { isValidElement, loadFromEdgePlainTextList } from "@components/graph-manager/utils/load_graph"
import { organicArrange } from "@components/graph-manager/utils/arrangements"
import { focusOnAllNodes } from "@components/graph-manager/utils/view"
import { saveToCache } from "@components/graph-manager/utils/cache"
import { recordMemento } from "@components/graph-manager/utils/memento"

export default function GraphEditor() {

    const [lines, setLines] = useState([])  // Textarea lines
    const [textarea, setTextarea] = useState("")  // Textarea value
    const [forceUpdate, setForceUpdate] = useState(0) // Force update when the selected elements change
    const $tArea = useRef(null)  // Textarea reference

    const handleTextChange = (e) => {
        // Parse the textarea value into lines and update the states
        const newLines = e.target.value?.split("\n") || []  // Split the text into lines
        setLines(newLines)  // Update the lines state
        setTextarea(e.target.value)  // Update the textarea state
        
        const validLines = []    // Valid lines that can be parsed into edges or nodes
        const invalidLines = []  // Invalid lines that cannot be parsed into edges or nodes
        
        // Resize the textarea to fit the content
        $tArea.current.style.height = "auto"
        $tArea.current.style.height = $tArea.current.scrollHeight + "px"
        
        // Parse the lines into edges and nodes
        newLines.forEach((line, i) => {
            if (line === "") return  // Skip empty lines
            
            if (isValidElement(line)) validLines.push(line)  // Check if the line is a valid edge or node
            else invalidLines.push(i)  // Add the line number to the invalid lines
        })

        const nodesBefore = Object.fromEntries(window.graph.nodes.map(node => [node.label, node]))  // Take the nodes that are already in the graph
        // Load the graph from the valid lines (we provide the nodes list so those nodes are not instantiated again)
        loadFromEdgePlainTextList(validLines.join("\n"), nodesBefore)

        // Arrange the nodes in an organic layout (we provide the nodes list so the nodes in that list are not repositioned)
        organicArrange(nodesBefore)
        focusOnAllNodes()

        // Cache
        saveToCache()

        // Debug
        if (window.cvs.debug) {
            console.log("Live editor valid lines:", validLines)
            console.log("Live editor invalid lines:", invalidLines)
        }
    }

    // Update the textarea value when the graph changes
    useEffect(() => {
        // Ignore if the textarea is focused (the changes that triggered this effect are from the textarea itself)
        if (document.activeElement === $tArea.current) return

        // Update the textarea with the new state of the graph
        const resList = generateEdgeAndNodesList()  // Generate the edge and nodes list from the graph
        setLines(resList)  // Update the lines state
        setTextarea(resList.join("\n")) // Update the textarea state

    }, [forceUpdate])
    

    // Add the force update listener (to update the textarea when the graph changes)
    useEffect(() => {
        window.graph.graphListeners.push(() => setForceUpdate(old => old + 1))
    }, [])

    return (
        <div className={scss.wrap}>
            <div className={scss.lines_nums}>
                {
                    // Add the line numbers
                    lines.map((_, i) => <div key={i} className={scss.line_num}>{i + 1}</div>)
                }
                {
                    // For the case when the textarea is empty, add at least one line number
                    lines.length === 0 && <div className={scss.line_num}>{1}</div>
                }
            </div>
            <textarea name="live-editor" id="live-editor" autoCapitalize="off" wrap="off" autoCorrect="off" spellCheck="false" ref={$tArea} 
                onInput={handleTextChange}
                value={textarea}
                rows={lines.length}
                onBlur={recordMemento}
            ></textarea>
        </div>
    )
}


