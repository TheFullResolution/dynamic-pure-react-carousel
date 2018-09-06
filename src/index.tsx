import { createElement, SFC } from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader'

const Root: SFC = () => <div>Hello You</div>


const RootWithHot = hot(module)(Root)

render(<RootWithHot />, document.getElementById('app'))
