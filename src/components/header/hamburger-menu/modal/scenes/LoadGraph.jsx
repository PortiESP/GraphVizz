import scss from "./save-and-loadGraph.module.scss"
import { useRef } from "react";

// Components & functions
import Tabs from "../components/tabs/Tabs";
import { loadFromEdgePlainTextList, loadFromJSON, loadFromURL } from "@components/graph-manager/utils/load_graph";
import { circularArrange } from "@components/graph-manager/utils/arrangements";
import { focusOnAllNodes } from "@components/graph-manager/utils/view";


/**
 * Load graph scene
 * 
 * @param {Object} props
 * @param {Function} props.close - Function to close the modal
 * 
 * @returns {JSX.Element}
 */
export default function LoadGraph(props) {

    return (
        <div className={scss.wrap}>
            <h3>Load Graph</h3>
            <p className={scss.tip}>Choose an option from below to load a graph</p>
            <Tabs tabs={[() => FromEdgeList, () => FromJSON, () => FromURL]} titles={["From Edge List", "From JSON", "From URL"]} closeModal={props.close} />
        </div>
    )
}


/**
 * Displays the tab option "From JSON" in the load graph modal
 */
function FromJSON(props) {

    const $input = useRef(null)

    // Load the graph in memory from the JSON entered by the user in the input field
    const handleLoad = () => {
        const json = eval(`[${$input.current.value}]`)[0]  // Evaluate the JSON string to an object (the [] is to avoid errors when the JSON starts with an object due to the eval function way of working)
        loadFromJSON(json)
        focusOnAllNodes()
        props.closeModal()
    }

    return <div className={scss.tab_wrap}>
        <div className={scss.tip}>
            <p>The graph scheme can be introduced using JSON or JS syntax</p>
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
            <hr />
            <span className={scss.tip_code}><pre>{exampleJSON}</pre><em>Example code using JS syntax</em></span>
        </div>
        <textarea placeholder="JSON..." ref={$input} />
        <button onClick={handleLoad}>Load</button>
    </div>
}

/**
 * Displays the tab option "From Edge List" in the load graph modal
 */
function FromEdgeList(props) {

    const $input = useRef(null)

    // Load the graph in memory from the edge list entered by the user in the input field
    const handleLoad = () => {
        const edgeList = $input.current.value
        loadFromEdgePlainTextList(edgeList)
        circularArrange(window.graph.nodes)
        focusOnAllNodes()
        props.closeModal()
    }

    return <div className={scss.tab_wrap}>
        <div className={scss.tip}>
            <p>Enter the edge list of the graph</p>
            <p>Each line represents an edge in the graph, or a single node</p>
            <p>The lines must follow one of the following formats:</p>
            <ul>
                <li><code>src-weight-{">"}dst</code> - directed edge with weight</li>
                <li><code>src-weight-dst</code> - undirected edge with weight</li>
                <li><code>src-{">"}dst</code> - directed edge with no weight</li>
                <li><code>src-dst</code> - undirected edge with no weight</li>
                <li><code>node</code> - single node</li>
            </ul>
            <hr />
            <span className={scss.tip_code}><pre>{exampleEdgeList}</pre><em>Example edge list</em></span>
        </div>
        <textarea placeholder="Edge List" ref={$input} />
        <button onClick={handleLoad}>Load</button>
    </div>
}


/**
 * Displays the tab option "From URL" in the load graph modal
 */
function FromURL(props) {
    const $input = useRef(null)

    // Load the graph in memory from the URL entered by the user in the input field
    const handleLoad = () => {
        const url = $input.current.value
        loadFromURL(url)
        circularArrange(window.graph.nodes)
        focusOnAllNodes()
        props.closeModal()
    }

    return <div className={scss.tab_wrap}>
        <div className={scss.tip}>
            <p>Enter the URL of the graph</p>
            <p>The URL must contain a query parameter <code>graph</code> with the graph scheme</p>
            <p>The graph scheme is generated when clicking the <em>Share</em> button, and it will generate a URL with the scheme of the current graph</p>
        </div>
        <input type="text" placeholder={`${window.location.origin}?graph=...`} ref={$input} />
        <button onClick={handleLoad}>Load</button>
    </div>
}

const exampleJSON = `{
  nodes: [
      {x: 300, y: 300, r: 30, label: "A"},
      {x: 400, y: 400, r: 30, label: "B"},
      {x: 500, y: 500, r: 30, label: "C"},
  ],
  edges: [
      {src: "A", dst: "B", weight: 1},
      {src: "B", dst: "C", weight: 1, directed: true},
  ]
}`


const exampleEdgeList = `A-2-B
A-4->C
A-D
B-3-C
B-2->E
G
H
I-2-J
J-3->K
K->L
`