import * as style from './SlideMock.scss'

import { createElement, SFC } from 'react'
import { DataItem } from './mockData'

interface Props {
  item: DataItem
}

export const SlideMock: SFC<Props> = ({ item }) => (
  <div key={item.Name} className={style.slides_container}>
    <div className={style.slides_wrapper}>
      <h2 className={style.slides_heading}>
        <img src={item.Logo} alt="logo" aria-hidden="true" />
        {item.Name}
      </h2>
      <div className={style.slides_big_image}>
        <img src={item.Img} alt={`${item.Name} screen`} />
      </div>
      <p>{item.Description}</p>
    </div>
  </div>
)
