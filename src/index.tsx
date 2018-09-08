import 'pure-react-carousel/dist/react-carousel.es.css'
import * as style from './index.scss'

import 'focus-visible/dist/focus-visible.js'

import { createElement, SFC } from 'react'
import { render } from 'react-dom'
import { hot } from 'react-hot-loader'
import { ListenerWrapper } from './CarouselDynamic/ListenerWrapper/ListenerWrapper'
import { CarouselSlidesWrapper } from './CarouselDynamic/CarouselSlidesWrapper/CarouselSlidesWrapper'
import { mockData } from './Mock/mockData'
import { SlideMock } from './Mock/SlideMock'
import {
  ButtonBack,
  CarouselProvider,
  DotGroup,
  Slider,
  Slide,
  ButtonNext,
} from 'pure-react-carousel'
import { force } from './utils/utils'
import { MockDataProvider } from './Mock/MockDataProvider'

const Root: SFC = () => (
  <MockDataProvider data={mockData}>
    {({ data, filterData, resetData, loading }) => {
      const slidesArray = data.map((el) => (
        <SlideMock key={el.Name} item={el} />
      ))
      return (
        <div className={style.root}>
          <div className={style.data}>
            <button onClick={filterData}>Filter Random</button>
            <button onClick={resetData}>Reset Data</button>
            <span>Data Count: {data.length}</span>
          </div>
          <ListenerWrapper>
            {({ width }) => (
              <CarouselSlidesWrapper
                slides={slidesArray}
                visibleSlides={width > 850 ? 3 : width > 480 ? 2 : 1}
              >
                {({
                  naturalSlideHeight,
                  naturalSlideWidth,
                  slides,
                  visibleSlides,
                }) =>
                  loading ? (
                    <div className={style.loading}>
                      <p>Loading...</p>
                      <img
                        src="loader.gif"
                        alt="loading gif"
                      />
                    </div>
                  ) : (
                    <CarouselProvider
                      className={style.carousel_container}
                      lockOnWindowScroll={false}
                      naturalSlideHeight={naturalSlideHeight}
                      dragEnabled={false}
                      naturalSlideWidth={naturalSlideWidth}
                      totalSlides={slides.length}
                      visibleSlides={visibleSlides}
                    >
                      <ButtonBack className={style.carousel_control_button}>
                        <span>Back</span>
                      </ButtonBack>
                      <div className={style.carousel_slider_container}>
                        <Slider>
                          {slides.map((content, index) => (
                            <Slide
                              index={index}
                              key={force(content.key)}
                              className={style.slide}
                              data-test="Slide"
                            >
                              {content}
                            </Slide>
                          ))}
                        </Slider>
                        <DotGroup className={style.carousel_dot_group} />
                      </div>

                      <ButtonNext className={style.carousel_control_button}>
                        <span>Next</span>
                      </ButtonNext>
                    </CarouselProvider>
                  )
                }
              </CarouselSlidesWrapper>
            )}
          </ListenerWrapper>
        </div>
      )
    }}
  </MockDataProvider>
)

const RootWithHot = hot(module)(Root)

render(<RootWithHot />, document.getElementById('app'))
