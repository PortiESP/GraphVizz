import scss from "./loadGraph.module.scss"
import Tabs from "../components/tabs/Tabs";
import { useRef } from "react";
import { generateEdgeAndNodesList, generateGraphArray, generateURL } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph";
import { useEffect } from "react";
import { useState } from "react";

export default function SaveGraph(props) {

  return (
    <div className={scss.wrap}>
      <h3>Save Graph</h3>
      <p className={scss.tip}>Choose an option from below to save the current graph</p>
      <Tabs sections={[() => FromEdgeList, () => FromJSON, () => FromURL]} titles={["To Edge List", "To JSON", "To URL"]} closeModal={props.close}/>
    </div>
  )
}

function FromJSON(props){

  const $input = useRef(null)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setInputValue(JSON.stringify(generateGraphArray(), null, 2))
  }, [])

  const handleCopy = () => {
    $input.current.select()
    navigator.clipboard.writeText($input.current.value)
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
          <li><code>label</code> - label of the node</li>
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
    <textarea placeholder="JSON..." ref={$input} value={inputValue} readOnly/>
    <button onClick={handleCopy}>Copy</button>
  </div>
}



function FromEdgeList(props){

  const $input = useRef(null)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setInputValue(generateEdgeAndNodesList().join("\n"))
  }, [])

  const handleCopy = () => {
    $input.current.select()
    navigator.clipboard.writeText($input.current.value)
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
    <textarea placeholder="Edge List" ref={$input} value={inputValue} readOnly/>
    <button onClick={handleCopy}>Copy</button>
  </div>
}


function FromURL(props){

  const $input = useRef(null)
  const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    setInputValue(generateURL())
  }, [])

  const handleCopy = () => {
    $input.current.select()
    navigator.clipboard.writeText($input.current.value)
  }


  return <div className={scss.tab_wrap}>
    <div className={scss.tip}>
      <p>The URL must contain a query parameter <code>graph</code> with the graph scheme</p>
      <p>The graph scheme is generated when clicking the <em>Share</em> button, and it will generate a URL with the scheme of the current graph</p>
    </div>
    <input type="text" placeholder={`${window.location.origin}?graph=...`} ref={$input} value={inputValue} readOnly/>
    <button onClick={handleCopy}>Copy</button>
  </div>
}