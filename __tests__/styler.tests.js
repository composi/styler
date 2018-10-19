// @ts-nocheck

import {addStyles} from "../src"

beforeEach(() => {
  document.head.innerHTML = ''
  document.body.innerHTML = ''
})

// Create Component Mock
function createComponent(component, obj) {
  if (!component) return
  addStyles(obj.base, obj.styles)
  document.body.innnerHTML = component
}

test('Should create stylesheet with rules for designated selector.', function() {
  const component = `
    <nav #nav1>
    </nav>
  `
  const styles = {
    base: '#nav1',
    styles: {
      padding: '2rem',
      backgroundColor: 'red'
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  expect(style1.selectorText).toBe('#nav1')
  expect(style1.style.padding).toBe('2rem')
  expect(style1.style['background-color']).toBe('red')
})

test('Stylesheet should have rules for child selector.', function() {
  const component = `
    <nav>
      <h1>Title</h1>
    </nav>
  `
  const styles = {
    base: 'nav',
    styles: {
      padding: '2rem',
      backgroundColor: 'red',
      h1: {
        color: 'white'
      }
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  const style2 = document.styleSheets[0].cssRules[1]
  expect(style1.selectorText).toBe('nav')
  expect(style1.style.padding).toBe('2rem')
  expect(style1.style['background-color']).toBe('red')
  expect(style2.selectorText).toBe('nav h1')
  expect(style2.style.color).toBe('white')
})

test('Stylesheet create styles for pseudo selectors.', function() {
  const component = `
    <div>
      <button>Click</button>
    </div>
  `
  const styles = {
    base: 'button',
    styles: {
      ':hover': {
        color: 'white'
      },
      ':active': {
        color: 'red'
      }
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  const style2 = document.styleSheets[0].cssRules[1]
  expect(style1.selectorText).toBe('button:active')
  expect(style1.style.color).toBe('red')
  expect(style2.selectorText).toBe('button:hover')
  expect(style2.style.color).toBe('white')
})


test('Should be able to use hyphenated properties in camel case or quoted.', function() {
  const component = `
    <h1>Title</h1>
  `
  const styles = {
    base: 'h1',
    styles: {
      backgroundColor: 'black',
      'font-weight': 'bold'
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  expect(style1.selectorText).toBe('h1')
  expect(style1.style['background-color']).toBe('black')
  expect(style1.style['font-weight']).toBe('bold')
})


test('Number values should be converted to pixel lengths.', function() {
  const component = `
    <h1>Title</h1>
  `
  const styles = {
    base: 'h1',
    styles: {
      backgroundColor: 'black',
      'font-weight': 'bold',
      fontSize: 30,
      padding: 10,
      opacity: 1
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  expect(style1.selectorText).toBe('h1')
  expect(style1.style['background-color']).toBe('black')
  expect(style1.style['font-weight']).toBe('bold')
  expect(style1.style['font-size']).toBe('30px')
  expect(style1.style['padding']).toBe('10px')
})


test('Number values for properties like opacity should not be converted to pixels:', function() {
  const component = `
    <h1>Title</h1>
  `
  const styles = {
    base: 'h1',
    styles: {
      backgroundColor: 'black',
      'font-weight': 'bold',
      fontSize: 30,
      padding: 10,
      opacity: 1
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  expect(style1.selectorText).toBe('h1')
  expect(style1.style['background-color']).toBe('black')
  expect(style1.style['font-weight']).toBe('bold')
  expect(style1.style['font-size']).toBe('30px')
  expect(style1.style['padding']).toBe('10px')
  expect(style1.style['opacity']).toBe('1')
})


test('If there are multiple property definitions, only the last will be used.', function() {
  const component = `
    <h1>Title</h1>
  `
  const styles = {
    base: 'h1',
    styles: {
      padding: 5,
      padding: 8,
      padding: 10
    }
  }
  createComponent(component, styles)
  const style1 = document.styleSheets[0].cssRules[0]
  expect(style1.selectorText).toBe('h1')
  expect(style1.style['padding']).toBe('10px')
})

/**
 * Would like to include tests for media queries and keyframe animation. However, JSDOM seems to have problems creating them. So, we've verified them in the browser for now.
 */
