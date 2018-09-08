import { Component, ReactNode } from 'react'
import lodashDebounce from 'lodash.debounce'

interface Props {
  readonly children: (params: { width: number }) => ReactNode
  readonly timeout?: number
}

interface State {
  readonly width: number
}

export class ListenerWrapper extends Component<Props, State> {
  public static readonly defaultProps: Partial<Props> = {
    timeout: 100,
  }

  public readonly state: State = { width: window.innerWidth }

  public readonly handleWindowSize = lodashDebounce(() => {
    this.setState({ width: window.innerWidth })
  }, this.props.timeout)

  public componentDidMount() {
    this.handleWindowSize()
    window.addEventListener('resize', this.handleWindowSize)
  }

  public componentWillUnmount() {
    this.handleWindowSize.cancel()
    window.removeEventListener('resize', this.handleWindowSize)
  }

  public render() {
    return this.props.children({ width: this.state.width })
  }
}
