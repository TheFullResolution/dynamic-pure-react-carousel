import { Component, ReactNode } from 'react'
import { DataItem } from './mockData'

interface RenderProps {
  readonly data: DataItem[]
  readonly loading: boolean
  readonly filterData: () => void
  readonly resetData: () => void
}

interface Props {
  readonly data: DataItem[]
  readonly children: (params: RenderProps) => ReactNode
}

interface State {
  readonly loading: boolean
  readonly data: DataItem[]
}

export class MockDataProvider extends Component<Props, State> {

  timeout: any

  public readonly state = {
    loading: false,
    data: this.props.data,
  }

  public componentWillUnmount() {
    clearTimeout(this.timeout)
  }

  public render() {
    return this.props.children({
      data: this.state.data,
      loading: this.state.loading,
      resetData: this.resetData,
      filterData: this.filterData,
    })
  }

  private filterData = () => {
    const { data } = this.props

    this.setState(() => ({
      loading: true
    }))

   this.timeout =  setTimeout(() => {
    const sliceEnd = Math.floor(Math.random() * (data.length - 2)) + 2

    this.setState(() => ({
      loading: false,
      data: data.slice(0, sliceEnd),
    }))

    }, 800)

  }

  private resetData = () => {
    this.setState(() => ({
      data: this.props.data,
    }))
  }
}
