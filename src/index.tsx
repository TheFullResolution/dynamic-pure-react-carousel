import * as style from './index.scss'

import { createElement, SFC } from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader'

const Root: SFC = () => <div className={style.root}>Hello You</div>


const RootWithHot = hot(module)(Root)

render(<RootWithHot />, document.getElementById('app'))
