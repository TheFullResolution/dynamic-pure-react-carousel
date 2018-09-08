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
  readonly width: number
  readonly visibleSlides?: number
}

interface State {
  readonly assignedRefs: boolean
  readonly slidesLength: number
  readonly getWidthState: number
  readonly naturalSlideHeight: number
  readonly naturalSlideWidth: number
  readonly visibleSlides: number
}

export class CarouselSlidesWrapper extends Component<Props, State> {
  public readonly state = {
    assignedRefs: false,
    slidesLength: this.props.slides.length,
    getWidthState: this.props.width,
    naturalSlideHeight: 600,
    naturalSlideWidth: this.props.width,
    visibleSlides: this.props.visibleSlides ? this.props.visibleSlides : 1,
  }

  protected slideBiggestDivRef!: HTMLDivElement
  protected slideDivRefs: HTMLDivElement[] = []
  protected slideDivRefsFiltered: HTMLDivElement[] = []
  private timeout: any // tslint:disable-line: no-any

  public componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  public componentDidMount() {
    this.onMountCall()
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    // To prevent using setTimeout or other weird hacks I leverage component lifecycle.
    // Update (re-render) is the trigger on prop change or state, however,
    // any calculations related to manipulation of a height of slides is being
    // triggered only by state changes. If prop changes I either remove min-height,
    // so components will redraw or trigger state change to delay recalculation one update.
    // Then only after state changes, I trigger recalculations of slides heights.
    if (
      (prevProps.slides.length !== this.props.slides.length &&
        this.props.slides.length > 0) ||
      prevProps.visibleSlides !== this.props.visibleSlides
    ) {
      this.cleanMinHeight()
    }

    if (prevState.slidesLength !== this.state.slidesLength) {
      this.assignDivRefs()
    }

    if (prevProps.width !== this.props.width) this.updateWidthState()

    if (prevState.getWidthState !== this.state.getWidthState) {
      this.setNaturalDimensions()
    }

    if (
      prevState.assignedRefs !== this.state.assignedRefs &&
      prevState.assignedRefs === false
    ) {
      return this.setNaturalDimensions()
    }

    if (
      prevState.naturalSlideHeight !== this.state.naturalSlideHeight ||
      prevState.naturalSlideWidth !== this.state.naturalSlideWidth
    ) {
      this.adjustMinHeight()
    }
  }

  public render() {
    console.log(this.slideBiggestDivRef && this.slideBiggestDivRef)
    return this.props.children({
      naturalSlideHeight: this.state.naturalSlideHeight,
      naturalSlideWidth: this.state.naturalSlideWidth,
      slides: this.renderDataWithRef(),
      visibleSlides: this.state.visibleSlides,
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
    this.updateStateForRender()
  }

  private readonly onMountCall = () => {
    this.timeout = setTimeout(() => {
      this.assignDivRefs()
    })
  }

  private readonly updateWidthState = () => {
    this.setState(() => ({ getWidthState: this.props.width }))
  }

  private readonly updateStateForRender = () => {
    this.setState(() => ({
      slidesLength: this.props.slides.length,
      visibleSlides: this.props.visibleSlides ? this.props.visibleSlides : 1,
    }))
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
    if (
      this.slideBiggestDivRef.clientHeight !== this.state.naturalSlideHeight ||
      this.slideBiggestDivRef.clientWidth !== this.state.naturalSlideWidth
    ) {
      this.setState(() => ({
        naturalSlideHeight: this.slideBiggestDivRef.clientHeight,
        naturalSlideWidth: this.slideBiggestDivRef.clientWidth,
      }))
    }
  }

  private readonly adjustMinHeight = () => {
    this.slideDivRefsFiltered.forEach((element) => {
      element.style.minHeight = `${this.slideBiggestDivRef.clientHeight}px`
    })
  }
}
