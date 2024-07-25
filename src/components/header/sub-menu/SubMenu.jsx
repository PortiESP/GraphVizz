import scss from "./submenu.module.scss"

export default function SubMenu(props) {

  return (
      <div className={scss.submenu_wrap}>
        <div className={scss.submenu}>
            {
                props.children
            }
        </div>
        <div className={scss.arrow}/>
      </div>
  )
}


export function SubMenuItem(props) {

    const handleClick = () => {
        console.log("Clicked on", props.title)
        props.callback()
    }

  return (
    <div className={scss.submenu_item} onClick={handleClick}>
        {
            props.icon && <div className={scss.submenu_icon}><props.icon /></div>
        }
        <span className={scss.submenu_title}>{props.title}</span>
    </div>
  )
}