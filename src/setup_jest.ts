import chalk from "chalk"
import Enzyme from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import "regenerator-runtime/runtime"
import { format } from "util"

jest.mock("react-tracking")
import _track from "react-tracking"
const track = _track as jest.Mock<typeof _track>
track.mockImplementation(y => x => x)

jest.mock("react-sizeme", () => jest.fn(c => d => d))
jest.mock("Utils/logger")

/**
 * We want each test to have assertions, otherwise it’s too easy to write async
 * tests that never end up making any, leading to false positives.
 *
 * TODO: Find a way to make this not emit after failing tests.
 *
 * SEE: https://github.com/facebook/jest/issues/2209#issuecomment-458706599
 */
// afterEach(() => expect.hasAssertions())

import "DevTools/renderUntil"
Enzyme.configure({ adapter: new Adapter() })

import "jsdom"
if (typeof window !== "undefined") {
  window.open = jest.fn()
  window.matchMedia = undefined
  window.scrollTo = jest.fn()
  HTMLMediaElement.prototype.pause = jest.fn()
  HTMLMediaElement.prototype.play = jest.fn()
}

if (process.env.ALLOW_CONSOLE_LOGS !== "true") {
  const originalLoggers = {
    error: console.error,
    warn: console.warn,
  }

  function logToError(type, args, constructorOpt: () => void) {
    const explanation =
      chalk.white(`Test failed due to \`console.${type}(…)\` call.\n`) +
      chalk.gray("(Disable with ALLOW_CONSOLE_LOGS=true env variable.)\n\n")
    if (args[0] instanceof Error) {
      const msg = explanation + chalk.red(args[0].message)
      const err = new Error(msg)
      err.stack = args[0].stack.replace(`Error: ${args[0].message}`, msg)
      return err
    } else {
      const err = new Error(
        explanation + chalk.red(format(args[0], ...args.slice(1)))
      )
      Error.captureStackTrace(err, constructorOpt)
      return err
    }
  }

  beforeEach(done => {
    ;["error", "warn"].forEach((type: "error" | "warn") => {
      // Don't spy on loggers that have been modified by the current test.
      if (console[type] === originalLoggers[type]) {
        const handler = (...args) => done.fail(logToError(type, args, handler))
        jest.spyOn(console, type).mockImplementation(handler)
      }
    })
    done() // it is important to call this here or every test will timeout
  })
}

jest.mock("styled-components", () => {
  const tags = [
    "a",
    "abbr",
    "address",
    "area",
    "article",
    "aside",
    "audio",
    "b",
    "base",
    "bdi",
    "bdo",
    "blockquote",
    "body",
    "br",
    "button",
    "canvas",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "data",
    "datalist",
    "dd",
    "del",
    "details",
    "dfn",
    "dialog",
    "div",
    "dl",
    "dt",
    "em",
    "embed",
    "fieldset",
    "figcaption",
    "figure",
    "footer",
    "form",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "head",
    "header",
    "hgroup",
    "hr",
    "html",
    "i",
    "iframe",
    "img",
    "input",
    "ins",
    "kbd",
    "keygen",
    "label",
    "legend",
    "li",
    "link",
    "main",
    "map",
    "mark",
    "math",
    "menu",
    "menuitem",
    "meta",
    "meter",
    "nav",
    "noscript",
    "object",
    "ol",
    "optgroup",
    "option",
    "output",
    "p",
    "param",
    "picture",
    "pre",
    "progress",
    "q",
    "rb",
    "rp",
    "rt",
    "rtc",
    "ruby",
    "s",
    "samp",
    "script",
    "section",
    "select",
    "slot",
    "small",
    "source",
    "span",
    "strong",
    "style",
    "sub",
    "summary",
    "sup",
    "svg",
    "table",
    "tbody",
    "td",
    "template",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "time",
    "title",
    "tr",
    "track",
    "u",
    "ul",
    "var",
    "video",
    "wbr",
  ]
  const { getPropertyInfo } = require("DevTools/HTMLProperties")
  // tslint:disable-next-line:no-shadowed-variable
  const React = require("react")
  /**
   * Removes entries from an object based on a list of keys
   */
  const omitNonHtmlProps = (obj: object) => {
    const next = {}
    for (const key of Object.keys(obj)) {
      if (getPropertyInfo(key)) {
        next[key] = obj[key]
      }
    }
    return next
  }
  const sf = f =>
    Object.assign(f, {
      withConfig: () => sf(f),
      attrs: props => {
        return sf(() => {
          const C = f()
          return _props => React.createElement(C, { ...props, ..._props })
        })
      },
    })
  const styled = C => sf(() => C)
  tags.forEach(
    tag =>
      (styled[tag] = sf(() =>
        React.forwardRef((props, ref) =>
          React.createElement(tag, { ref, ...omitNonHtmlProps(props) })
        )
      ))
  )

  const Noop = ({ children }) => children || null

  return {
    createGlobalStyle: () => Noop,
    default: styled,
    css: () => [],
    __esModule: true,
    keyframes: () => [],
    injectGlobalStyles: () => ({ GlobalStyles: Noop }),
    Theme: Noop,
    ThemeProvider: Noop,
  }
})
