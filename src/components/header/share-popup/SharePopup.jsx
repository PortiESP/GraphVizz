import scss from "./sharePopup.module.scss"
import CloseIcon from "../../../assets/close"
import { generateURL } from "../../graph-manager/utils/algorithms/algorithm_utils/generate_graph"

export default function SharePopup(props) {

  const url = generateURL()

  const handleShare = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className={scss.wrap} onClick={e => e.target.className === scss.wrap && props.close()}>
      <div className={scss.container}>
        <h2 className={scss.title}>Share your graph</h2>
        <p>Copy the link below and share it with your friends</p>
        <div className={scss.link}>
          <input type="text" value={url} readOnly />
          <button onClick={handleShare}>Copy</button>
        </div>
        <button onClick={props.close} className={scss.close}><CloseIcon /></button>
      </div>
    </div>
  )
}
