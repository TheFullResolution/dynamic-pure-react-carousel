# Dynamic pure-react-carousel


## General Information

Project with a dedicated wrapper for package [pure-react-carousel](https://github.com/express-labs/pure-react-carousel) to enable dynamic resizing of slides for example when they contain text. 

The goal is to eventually move it to NPM and make it available for easy use with an original package, or committing the code to the original repo.

## Testing 

After installing all the dependencies using npm `npm i`, run `npm start`

The wrapper is located inside the folder:  `src/CarouselDynamic/CarouselSlidesWrapper/`

In order to make it work it needs to be wrapped inside `ListenerWrapper` which simply listens for resize event and rerenders when it happens, triggering update `CarouselSlidesWrapper`

The rest of the code is simply show implementation of the wrapper. 

## Dependencies

Wrapper is dependant of following lodash methods: 
- [lodash.debounce](https://lodash.com/docs/4.17.10#debounce)
- [lodash.dropright](https://lodash.com/docs/4.17.10#dropRight)
- [lodash.last](https://lodash.com/docs/4.17.10#last) 
- [lodash.sortby](https://lodash.com/docs/4.17.10#sortBy)
