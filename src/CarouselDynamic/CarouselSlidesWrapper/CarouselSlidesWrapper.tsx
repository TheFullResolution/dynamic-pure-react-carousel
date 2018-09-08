import lodashDropRight from 'lodash.dropRight'
import lodashLast from 'lodash.last'
import lodashSortBy from 'lodash.sortBy'
import { Component, createElement, ReactElement, ReactNode } from 'react'
import { force } from '../../utils/utils'

interface RenderProps {
  naturalSlideHeight: number
  naturalSlideWidth: number
  visibleSlides: number
  slides: ReactElement<{}>[]
}

export interface Props {
  readonly slides: ReactElement<{}>[]
  readonly children: (params: RenderProps) => ReactNode
  readonly slideClassName?: string
  readonly visibleSlides?: number
}

interface State {
  readonly assignedRefs: boolean
  readonly slidesLength: number
  readonly naturalSlideHeight: number
  readonly naturalSlideWidth: number
}

export class CarouselSlidesWrapper extends Component<Props, State> {
  public readonly state = {
    assignedRefs: false,
    naturalSlideHeight: 600,
    slidesLength: this.props.slides.length,
    naturalSlideWidth: 600,
  }

  protected slideBiggestDivRef!: HTMLDivElement
  protected slideDivRefs: HTMLDivElement[] = []
  protected slideDivRefsFiltered: HTMLDivElement[] = []

  public componentDidMount() {
    this.onMountCall()
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      prevProps.slides.length !== this.props.slides.length &&
      this.props.slides.length > 0
    ) {
      this.cleanMinHeight()

      this.updateStateForNewRefs()
    }

    if (prevState.slidesLength !== this.state.slidesLength) {
      this.assignDivRefs()
    }

    if (
      this.state.assignedRefs &&
      (this.slideBiggestDivRef.clientHeight !== this.state.naturalSlideHeight ||
        this.slideBiggestDivRef.clientWidth !== this.state.naturalSlideWidth)
    ) {
      this.setNaturalDimensions()
    }
  }

  public render() {
    return this.props.children({
      naturalSlideHeight: this.state.naturalSlideHeight,
      naturalSlideWidth: this.state.naturalSlideWidth,
      slides: this.renderDataWithRef(),
      visibleSlides: this.props.visibleSlides ? this.props.visibleSlides : 1,
    })
  }

  private readonly renderDataWithRef = () => {
    const { slides } = this.props

    this.slideDivRefs = []

    return slides.map((element) => {
      const slideDivRefs = (el: HTMLDivElement) => {
        if (el) this.slideDivRefs.push(el)
      }

      return (
        <div
          key={force(element.key)}
          style={{ display: 'flex' }}
          ref={slideDivRefs}
        >
          {element}
        </div>
      )
    })
  }

  private readonly cleanMinHeight = () => {
    this.slideDivRefs.forEach((element) => {
      element.style.minHeight = '0px'
    })
  }

  private readonly updateStateForNewRefs = () => {
    this.setState(() => ({
      assignedRefs: false,
      slidesLength: this.props.slides.length,
    }))
  }

  private readonly onMountCall = () => {
    this.assignDivRefs()
  }

  private readonly assignDivRefs = () => {
    const sortArray = lodashSortBy(this.slideDivRefs, (o) => o.clientHeight)
    this.slideBiggestDivRef =
      sortArray.length > 1 ? force(lodashLast(sortArray)) : sortArray[0]
    this.slideDivRefsFiltered = lodashDropRight(sortArray)

    this.setState(() => ({
      assignedRefs: true,
    }))
  }

  private readonly setNaturalDimensions = () => {
    this.setState(
      () => ({
        naturalSlideHeight: this.slideBiggestDivRef.clientHeight,
        naturalSlideWidth: this.slideBiggestDivRef.clientWidth,
      }),
      () => {
        this.adjustMinHeight()
      }
    )
  }

  private readonly adjustMinHeight = () => {
    this.slideDivRefsFiltered.forEach((element) => {
      element.style.minHeight = `${this.slideBiggestDivRef.clientHeight}px`
    })
  }
}
