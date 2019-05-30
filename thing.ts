import chalk from "chalk"
import * as fs from "fs"
import * as json5 from "json5"
import * as klawSync from "klaw-sync"
import { relative } from "path"
import * as ts from "typescript"

const { options, ...others } = ts.convertCompilerOptionsFromJson(
  json5.parse(fs.readFileSync("./tsconfig.json").toString()).compilerOptions,
  "."
)

if (others.errors && others.errors.length > 0) {
  throw new Error(JSON.stringify(others.errors))
}

// Initialize files constituting the program as all .ts files in the current directory
const sourceFiles = klawSync("./src", {
  traverseAll: true,
  filter(item) {
    return item.path.endsWith(".ts") || item.path.endsWith(".tsx")
  },
}).map(item => item.path)

// Create the language service host to allow the LS to communicate with the host
const servicesHost: ts.LanguageServiceHost = {
  getScriptFileNames: () => sourceFiles,
  getScriptVersion: _ => "0",
  getScriptSnapshot: fileName => {
    if (!fs.existsSync(fileName)) {
      return undefined
    }

    return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString())
  },
  getCurrentDirectory: () => process.cwd(),
  getCompilationSettings: () => options,
  getDefaultLibFileName: opts => ts.getDefaultLibFilePath(opts),
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
}

// Create the language service files
const services = ts.createLanguageService(
  servicesHost,
  ts.createDocumentRegistry()
)

// const sources = services
//   .getProgram()
//   .getSourceFile("src/__generated__/Reject_order.graphql.ts")

// const sources = services
//   .getProgram()
//   .getSourceFile("src/__generated__/OfferHistoryItem_order.graphql.ts")

const sources = services
  .getProgram()
  .getSourceFiles()
  .filter(
    f =>
      f.fileName.match("__generated__") &&
      !f.fileName.endsWith("Query.graphql.ts")
  ) as any

function traverse({
  typeNode,
  errors,
  path,
}: {
  typeNode: ts.TypeNode
  errors: string[]
  path: ReadonlyArray<string>
}) {
  const node = typeNode
  if (ts.isParenthesizedTypeNode(node)) {
    if (!node.type) {
      console.error("bad node", node)
      return
    }
    traverse({ typeNode: node.type, errors, path })
    return
  }
  if (ts.isArrayTypeNode(node)) {
    traverse({ typeNode: node.elementType, errors, path })
    return
  }
  if (ts.isUnionTypeNode(node)) {
    for (const child of node.types) {
      traverse({ typeNode: child, errors, path })
    }
    return
  }
  if (!ts.isTypeLiteralNode(node)) {
    switch (node.kind) {
      case ts.SyntaxKind.AnyKeyword:
      case ts.SyntaxKind.NumberKeyword:
      case ts.SyntaxKind.BooleanKeyword:
      case ts.SyntaxKind.StringKeyword:
      case ts.SyntaxKind.TypeReference:
      case ts.SyntaxKind.NullKeyword:
        break
      default:
        errors.push(
          `Ignoring node of kind ${
            ts.SyntaxKind[node.kind]
          } at path ${path.join("/")}.`
        )
    }
    return
  }
  for (const property of node.members) {
    if (property.name.getText().startsWith('"')) {
      // ignore meta properties
      continue
    }

    const findReferencesResult = services.findReferences(
      node.getSourceFile().fileName,
      property.name.getStart()
    )

    const fieldPath = path.concat([property.name.getText()]).join("/")

    if (!findReferencesResult) {
      errors.push(
        `No references found to field at path ${fieldPath}, this is a developer error`
      )
      continue
    }

    if (findReferencesResult.length > 1) {
      errors.push(
        `⁉️ Found multiple definitions for field at path ${fieldPath}.`
      )
      continue
    }

    const [{ references }] = findReferencesResult

    if (references.length === 1) {
      errors.push(
        `${chalk.gray("Possibly unused field at path")} ${fieldPath}.`
      )
      continue
    }

    const typeNodes = property.getChildren().filter(ts.isTypeNode)
    if (typeNodes.length !== 1) {
      errors.push(
        `️⁉️ Expected exactly one type node for child property at path ${fieldPath}`
      )
      continue
    }

    traverse({
      typeNode: typeNodes[0],
      errors,
      path: path.concat([property.name.getText()]),
    })
  }
}

ts.transform(sources as ts.SourceFile[], [
  context => file => {
    const errors = []
    const result = ts.visitEachChild(
      file,
      node => {
        // TODO: relay compiler currently outputs `type Blah = {}` but could easily
        // switch to `interface Blah {}` one day, maybe take account of that here
        if (ts.isTypeAliasDeclaration(node)) {
          if (node.name.getText().match(/^\w+_\w+$/)) {
            // e.g. Reject_order but not Reject_order$ref
            const typeNode = node.getChildren().find(ts.isTypeNode)
            if (!typeNode) {
              console.error(
                "Can't find type expression for type ",
                node.name.getText()
              )
              return
            }
            traverse({
              typeNode,
              errors,
              path: [node.name.getText()],
            })
          }
        }
        return node
      },
      context
    )

    if (errors.length) {
      console.log(
        "⚠️ ",
        chalk.cyan.bold(relative(process.cwd(), file.fileName))
      )
      console.log(errors.map(line => "  " + line).join("\n"))
      console.log()
    }

    return result
  },
])
