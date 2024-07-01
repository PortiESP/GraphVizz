import { useLayoutEffect } from "react"
import { generateSVG } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph"
import Tabs from "../components/tabs/Tabs"
import scss from "./exportGraph.module.scss"

export default function Export_graph(props) {



  return (
    <div className={scss.wrap}>
      <h3>Export graph</h3>
      <p className={scss.tip}>Choose an option from below to export the graph</p>
      <hr />
      <Tabs sections={[() => AsSVG, () => AsPNG]} titles={["As SVG", "As PNG"]} closeModal={props.close} />

    </div>
  )
}


function AsSVG() {

  useLayoutEffect(() => {
    generateSVG("export-svg")
  }, [])

  // Function to export the SVG as a file
  const handleExportAsSVG = () => {
    const svg = document.getElementById("export-svg")  // Get the SVG element
    const svgData = new XMLSerializer().serializeToString(svg)  // Serialize the SVG element to a string
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })  // Create a blob from the SVG string
    const url = URL.createObjectURL(blob)  // Create a URL from the blob

    // Create a link element and click it (automatically) to download the SVG file, then revoke the URL
    const a = document.createElement("a")
    a.href = url  // Set the URL of the link
    a.download = "graph.svg"  // Set the name of the downloaded file
    a.click() // Click the link to download the file automatically
    URL.revokeObjectURL(url) // Revoke the URL
  }



  return (<div className={scss.tab_wrap}>
    <div className={scss.export_result}>
      <svg id="export-svg"></svg>
    </div>
    <button onClick={() => handleExportAsSVG()}>Export as SVG</button>
  </div>)
}

function AsPNG() {

  useLayoutEffect(() => {
    // Take a snapshot of the canvas and set it as the image source
    const canvas = window.cvs.$canvas
    const img = document.getElementById("export-img")
    img.src = canvas.toDataURL("image/png")
  }, [])

  // Function to export the canvas to a PNG file
  const handleExportAsPNG = () => {
    const canvas = window.cvs.$canvas  // Get the canvas element
    const dataURL = canvas.toDataURL("image/png")  // Get the data URL of the canvas
    const a = document.createElement("a")  // Create a link element
    a.href = dataURL  // Set the data URL as the link's URL
    a.download = "graph.png"  // Set the name of the downloaded file
    a.click()  // Click the link to download the file automatically
  }

  return (
    <div className={scss.tab_wrap}>
      <div className={scss.export_result}>
        <img id="export-img" />
      </div>
      <button onClick={() => handleExportAsPNG()}>Export as PNG</button>
    </div>
  )
}