# styler

This is an ES6 module that lets you create a virtual stylesheet for a component. 

* [base](#base)
* [styles](#styles)
* [Install](#Install)
* [Creating a Styles Object](#Creating-a-Styles-Object)
* [Semicolons](#Semicolons)
* [Camel Case or Quoted](#Camel-Case-or-Quoted)
* [Pixel Values](#Pixel-Values)
* [Nested Elements](#Nested-Elements)
* [BEM](#BEM)
* [@composi/core Components](#@composi/core-Components)

Styler exposes one function: `addstyles`. This takes two arguments: `base` and `styles`. 

### base
`base` is a valid CSS selector for the element to which the stylesheet will be attached. This should be unique in the document to prevent style leaks. So, best to use an id for `base`. If your component will be used multiple times, give it a class and use that as the base. 

### styles
`styles` is an object defining the stylesheet you want to create.

## Install

If you're created a project using `@composi/create-composi-app` then it's already and install. All you have to do is import it into your project to use:

```javascript
import { addStyles } from '@composi/styler'
```

If you want to use @composi/styler with another library, you can install it from NPM:

```sh
npm i -g styler
```

Then import it into your project. Styler is an ES6 module, so use standard ES6 import syntax:

```javascript
import {addStyles} from '@composi/styler'
```

After importing styler, you need to use it in a lifecycle event. For React, Preact or Inferno: `componentDidMount`, for Vue: `created`, Angular: `ngOnInit` and Composi: `componentWasCreated`. If you are using it with a library that does not have lifecycle events, use it during a DOM ready event.

## Creating a Styles Object

When creating the object to define the stylesheet there are several rules to be aware of. Because this is a JavaScript object, it must follow JavaScript naming conventions. That means any CSS properties with hyphens must be converted to camel case or quoted. Any properties with non-alphabetic characters, such as `:` must be quoted. An all values must be quoted.

## Semicolons

Because this is a JavaScript object, you can't put semicolons at the end of a definition. Instead use a comma:

```javascript
// Correct usage:
addStyles('#list', {
  // Use comma to separate from next property:
  border: 'solid 1px #ccc',
  margin: '20px'
})

// Incorrect:
addStyles('#list', {
  // Do not put semicolons at end!
  // This will generate an error:
  border: 'solid 1px #ccc';
  margin: '20px';
})
```

## Camel Case or Quoted

Below are some examples of camel case and quoted properties:

```javascript
// Camel case:
addStyles('#list', {
  backgroundColor: '#ff0000',
  fontFamily: 'sans-serif',
  textAlign: 'center'
})

// Or quoted:
addStyles('#list', {
  'background-color': '#ff0000',
  'font-family': 'sans-serif',
  'text-align': 'center'
})
```

## Pixel Values

If you're using a pixel value for a property, you can leave off the length identifier and provide just a raw number:

```javascript
addStyles('#list', {
  // Define margin of 20px:
  margin: 20,
  // Define width of 300px:
  width: 300
})
```

## Nested Elements

Like LESS and SASS, you can nest child elements to define their relationship to parents. This also works for pseudo-elements.

```javascript
addStyles('#main', {
  ul: {
    margin: 10,
    width: 350,
    border: 'solid 1px #ccc',
    li: {
      padding: 10,
      borderBottom: 'solid 1px #ccc',
      transition: 'all .25s ease-out',
      ':hover': {
        cursor: 'pointer',
        backgroundColor: '#333',
        color: '#fff'
      },
      ':last-of-type': {
        border: 'none'
      }
    }
  }
})
```

This will produce the following stylesheet:

```css
#main ul {
  margin: 10px;
  width: 350px;
  border: solid 1px #ccc;
}
#main ul li {
  padding: 10px;
  border-bottom: solid 1px #ccc;
  transition: all .25s ease-out;
}
#main ul li:hover {
  cursor: pointer;
  background-color: #333;
  color: #fff;
}
#main ul li:last-of-type {
  border: none;
}
```

## BEM

This will also work with [BEM](https://css-tricks.com/bem-101/). When doing so, best to just use the generic body tag as the base for the stylesheet:

```html
<ul class="list">
  <li class="list__item">
    <h3 class="item__title">Joe Bodoni</h3>
  </li>
  <li class="list__item">
    <h3 class="item__title-selected">Ellen Vanderbilt</h3>
  </li>
  <li class="list__item">
    <h3 class="item__title">Sam Anderson</h3>
  </li>
</ul>
```
Define BEM CSS for above markup:

```javascript
addStyles('body', {
  '.list': {
    margin: '20px 0',
    listStyle: 'none',
    border: 'solid 1px #ccc'
  },
  '.list__item': {
    padding: 0,
    borderBottom: 'solid 1px #ccc',
    ':last-of-type': {
      border: 'none'
    }
  },
  '.item__title': {
    margin: 0,
    padding: 10,
    ':hover': {
      backgroundColor: '#333',
      color: '#fff',
      cursor: 'pointer'
    }
  },
  'item__title-selected': {
    backgroundColor: '#333',
    color: '#fff'
  }
})
```

## @composi/core Components

It's easy to style your @composi/core components with @composi/styler. The easiest way is to do it right before the return statement in a component:

```javascript
import { h, render } from '@composi/core'
import { addStyles } from '@composi/styler'

// Create list with associated stylesheet:
function List({data}) {
  // Base stylesheet rule on class 'list':
  addStyles('.list', {
    listStyles: 'none',
    padding: 0,
    margin: 0,
    border: 'solid 1px #ccc',
    li: {
      padding: '5px 10px'
      borderBottom: 'solid 1px #ccc'
      ':last-of-type': {
        border: 'none'
      }
    }
  })
  // Give list class of 'list':
  return (
    <ul class='list'>
      {
        data.map(item => <li key={item.key}>{item.value}</li>)
      }
    </ul>
  )
}
```