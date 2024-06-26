import scss from "./header.module.scss"
{/* Import svg */}
import ListIcon from "../../assets/list"

export default function Header(props) {

  return (
      <header className={scss.header_wrap}>
        <nav>
            <div className={scss.menu_icon}>
                <ListIcon />
            </div>
            <div className={scss.menu_options}>
                <ul>
                    <li>Load graph</li>
                    <li>Algorithms</li>
                    <li>Settings</li>
                    <li>Help</li>
                </ul>
            </div>
            <div className={scss.menu_info}>
                <button className={scss.share}>Share</button>
                <span className={scss.zoom}>200%</span>
            </div>
        </nav>
      </header>
  )
}
