import { Link } from "react-router-dom"
import scss from "./example.module.scss"
import Basic1SVG from "./thumbnails/basic-1.svg?react"
import Tree1SVG from "./thumbnails/tree-1.svg?react"
import Circle1SVG from "./thumbnails/circular-1.svg?react"


const EXAMPLES = [
    {
        id: "basic-1",
        title: "Basic graph",
        description: "Basic example of a non-directed graph with default weights",
        thumbnail: <Basic1SVG />
    },
    {
        id: "tree-1",
        title: "Horizontal Tree graph",
        description: "Tree arrangement of nodes",
        thumbnail: <Tree1SVG />
    },
    {
        id: "circular-1",
        title: "circular-1",
        description: "Circular graph",
        thumbnail: <Circle1SVG />
    },
]


export default function Examples(props) {

  return (
      <div className={scss.wrap}>
        <div className={scss.content}>
            <h1>Examples</h1>

            <div className={scss.examples_wrap}>
                {EXAMPLES.map((example, index) => {
                    return <ExampleCard key={index} id={example.id || "#"}title={example.title} description={example.description} thumbnail={example.thumbnail} />
                })}
            </div>
        </div>
      </div>
  )
}


function ExampleCard(props) {

  return (
    <Link to={`/?example=${props.id}`} className={scss.example}>
      <div className={scss.thumbnail}>
        {props.thumbnail}
      </div>
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </Link>
  )
}
