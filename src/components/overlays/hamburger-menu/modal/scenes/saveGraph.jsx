import scss from "./save-and-loadGraph.module.scss"
import { useRef, useEffect, useState } from "react";

// Components & functions
import Tabs from "../components/tabs/Tabs";
import { generateEdgeAndNodesList, generateGraphObject, generateURL } from "@components/graph-manager/utils/algorithms/algorithm_utils/generate_graph";
import toast from "react-hot-toast";


/**
 * Save graph scene
 * 
 * @param {Object} props
 * @param {Function} props.close - Function to close the modal
 * 
 * @returns {JSX.Element}
 */
export default function SaveGraph(props) {

    return (
        <div className={scss.wrap}>
            <h3>Save Graph</h3>
            <p className={scss.tip}>Choose an option from below to save the current graph</p>
            <Tabs tabs={[() => ToEdgeList, () => ToJSON, () => ToURL]} titles={["To Edge List", "To JSON", "To URL"]} closeModal={props.close} />
        </div>
    )
}


/**
 * Displays the tab option "To Edge List" in the save graph modal
 */
function ToEdgeList(props) {

    const $input = useRef(null)
    const [inputValue, setInputValue] = useState("")

    // Generate the edge list of the graph and set it as the value of the input field
    useEffect(() => {
        setInputValue(generateEdgeAndNodesList().join("\n"))
    }, [])

    // Copy the edge list to the clipboard
    const handleCopy = () => {
        $input.current.select()
        navigator.clipboard.writeText($input.current.value)
        toast.success("Copied to clipboard")
    }

    return <div className={scss.tab_wrap}>
        <div className={scss.tip}>
            <p>Each line represents an edge in the graph, or a single node</p>
            <p>The lines must follow one of the following formats:</p>
            <ul>
                <li><code>src-weight-{">"}dst</code> - directed edge with weight</li>
                <li><code>src-weight-dst</code> - undirected edge with weight</li>
                <li><code>src-{">"}dst</code> - directed edge with no weight</li>
                <li><code>src-dst</code> - undirected edge with no weight</li>
                <li><code>node</code> - single node</li>
            </ul>
        </div>
        <textarea placeholder="Edge List" ref={$input} value={inputValue} readOnly />
        <button onClick={handleCopy}>Copy</button>
    </div>
}



/**
 * Displays the tab option "To JSON" in the save graph modal
 */
function ToJSON() {

    const $input = useRef(null)
    const [inputValue, setInputValue] = useState("")

    // Generate the JSON of the graph and set it as the value of the input field
    useEffect(() => {
        setInputValue(JSON.stringify(generateGraphObject(), null, 2))
    }, [])

    // Copy the JSON to the clipboard
    const handleCopy = () => {
        $input.current.select()
        navigator.clipboard.writeText($input.current.value)
        toast.success("Copied to clipboard")
    }

    return <div className={scss.tab_wrap}>
        <div className={scss.tip}>
            <p>A graph is represented as an object with two keys: <code>nodes</code> and <code>edges</code></p>
            <div>
                <p>The <code>nodes</code> key is an array of objects, each object representing a node with the following keys</p>
                <ul>
                    <li><code>x</code> - x-coordinate of the node</li>
                    <li><code>y</code> - y-coordinate of the node</li>
                    <li><code>r</code> - radius of the node <em>(optional)</em></li>
                    <li><code>id</code> - ID of the node</li>
                </ul>
            </div>
            <div>
                <p>The <code>edges</code> key is an array of objects, each object representing an edge with the following keys</p>
                <ul>
                    <li><code>src</code> - source node of the edge</li>
                    <li><code>dst</code> - destination node of the edge</li>
                    <li><code>weight</code> - weight of the edge <em>(optional, default: 1)</em></li>
                    <li><code>directed</code> - (optional) boolean value indicating if the edge is directed</li>
                </ul>
            </div>
        </div>
        <textarea placeholder="JSON..." ref={$input} value={inputValue} readOnly />
        <button onClick={handleCopy}>Copy</button>
    </div>
}


/**
 * Displays the tab option "To URL" in the save graph modal
 */
function ToURL(props) {

    const $input = useRef(null)
    const [inputValue, setInputValue] = useState("")

    // Generate the URL of the graph and set it as the value of the input field
    useEffect(() => {
        setInputValue(generateURL())
    }, [])

    // Copy the URL to the clipboard
    const handleCopy = () => {
        $input.current.select()
        navigator.clipboard.writeText($input.current.value)
        toast.success("Copied to clipboard")
    }

    return <div className={scss.tab_wrap}>
        <div className={scss.tip}>
            <p>The URL must contain a query parameter <code>graph</code> with the graph scheme</p>
            <p>The graph scheme is generated when clicking the <em>Share</em> button, and it will generate a URL with the scheme of the current graph</p>
        </div>
        <input type="text" placeholder={`${window.location.origin}?graph=...`} ref={$input} value={inputValue} readOnly />
        <button onClick={handleCopy}>Copy</button>
    </div>
}