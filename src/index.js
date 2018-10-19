/**
 * Creates a stylesheet scoped to the component.
 * Takes and object: {base: selector, styles: {selector: {property: value}}
 * @param {'string'} base The base for the stylesheet.
 * @param {Object<string, any>} styles An object literal defining the styles to create.
 */

export const addStyles = (base, styles) => {

  function createComponentStyles () {
    let sharedSheet = null

    const unitlessProps = {
      columnCount: true,
      fillOpacity: true,
      flex: true,
      flexGrow: true,
      flexShrink: true,
      fontWeight: true,
      lineClamp: true,
      lineHeight: true,
      opacity: true,
      order: true,
      orphans: true,
      widows: true,
      zIndex: true,
      zoom: true
    }

    function flatten(array) {
      const flat = Array.prototype.concat(array)
      for (let i = 0; i < flat.length; i++) {
        if (Array.isArray(flat[i])) {
          flat.splice(i, 1, flat[i--])
        }
      }
      return flat
    }

    function createStyleSheet(options) {
      if (!(this instanceof createStyleSheet)) {
        return new createStyleSheet(options)
      }
      options || (options = {})
      options.prefix = !options.hasOwnProperty("prefix") ? true : !!options.prefix
      options.unit = options.hasOwnProperty("unit") ? options.unit : "px"

      this._sheet = null
      this._prefix = null

      this.css = function (element, styles, selector) {
        if (styles == null) return ""
        if (this._sheet == null) {
          this._sheet = sharedSheet = (sharedSheet || createSheet())
        }
        selector = element

        const rules = rulesFromStyles(selector, styles)
        if (options.prefix || options.unit !== "") {
          rules.map(set => {
            if (options.unit !== "") {
              addUnit(set[1], options.unit)
            }
          })
        }

        insertRules(rules, this._sheet)
      }
    }

    function createSheet() {
      if (document.head == null) {
        throw new Error("Can't add stylesheet before <head> is available. Make sure your document has a head element.")
      }
      const style = document.createElement("style")
      style.id = "styles_" + Math.random().toString(16).slice(2, 8)
      document.head.appendChild(style)
      return style.sheet
    }

    function rulesFromStyles(selector, styles) {
      if (!Array.isArray(styles)) styles = [styles]
      const style = {}
      let rules = []
      styles = flatten(styles)
      styles.map(block => {
        for (let prop in block) {
          let value = block[prop]
          if (isPlainObject(value) || Array.isArray(value)) {
            rules = rules.concat(
              rulesFromStyles(combineSelectors(selector, prop), value)
            )
          } else {
            if (prop === "content") value = "'"+value+"'"
            style[prop] = value
          }
        }
      })

      rules.push([ selector, style ])
      return rules
    }

    function insertRules(rules, sheet) {
      window.sheet = sheet
      function hyphenate(str) {
        return str.replace(/[A-Z]/g, function($0) { return '-'+$0.toLowerCase() })
      }
      rules.map(function(rule) {
        const pairs = []
        for (let prop in rule[1]) {
          pairs.push(hyphenate(prop) + ":" + rule[1][prop])
        }
        if (pairs.length > 0) {
          const rulez = rule[0] ? rule[0] : ''
          sheet.insertRule(rulez + "{" + pairs.join(";") + "}", 0)
        }
      })
      return sheet
    }

    function combineSelectors(parent, child) {
      const pseudoRe = /^[:\[]/
      const parents = parent.split(","), children = child.split(",")
      return parents.map(function(parent) {
        return children.map(function(part) {
          const separator = pseudoRe.test(part) ? "" : " "
          return parent + separator + part
        }).join(",")
      }).join(",")
    }

    function addUnit(style, unit) {
      for (let prop in style) {
        let value = style[prop] + ""
        if (!isNaN(value) && !unitlessProps[prop]) {
          value = value + unit
        }
        style[prop] = value
      }
      return style
    }

    function isPlainObject(obj) {
      return obj === Object(obj) && Object.prototype.toString === obj.toString
    }

    const stylesheets = {}
    stylesheets.css = createStyleSheet().css
    return stylesheets
  }
  const style = createComponentStyles()
  style.css(base, styles)
}
