import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLType,
  isAbstractType,
  isInterfaceType,
  isLeafType,
  isNonNullType,
} from "graphql"
import { makeExecutableSchema } from "graphql-tools"
import { GraphQLTaggedNode } from "react-relay"

import { mount } from "enzyme"
import React from "react"
import { Environment, RecordSource, Store } from "relay-runtime"
import uuid from "uuid"
import schemaText from "../../data/schema.graphql"
import { inferConcreteTypeName } from "./inferConcreteTypeName"

const schema = makeExecutableSchema({
  typeDefs: schemaText,
  resolvers: {},
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

const idMap = new WeakMap()

function getId(obj, alias) {
  if (!obj) {
    throw new Error("can't get id of " + obj)
  }
  let id = obj[alias] || idMap.get(obj)
  if (!id) {
    id = uuid()
    idMap.set(obj, id)
  }
  return id
}

function resolveScalarField({
  selection,
  data,
  type,
  errors,
  path,
}: {
  selection: { name?: string; alias?: string }
  data: any
  type: GraphQLObjectType
  errors: string[]
  path: string[]
}) {
  const alias = selection.alias || selection.name

  if (selection.name === "__typename") {
    if (isAbstractType(type)) {
      return inferConcreteTypeName({
        schema,
        errors,
        path,
        type,
        value: data,
      })
    }
    return type.inspect()
  }

  if (selection.name === "__id" || alias === "__id") {
    return getId(data, alias)
  }

  if (!data.hasOwnProperty(alias)) {
    errors.push(`Can't find value at path ${path.concat([alias]).join("/")}`)
    return null
  }

  if (!type.getFields()[selection.name]) {
    errors.push(
      `Can't find field def ${selection.name} in type ${type.inspect()}`
    )
    return null
  }
  let childType = type.getFields()[selection.name].type

  if (isNonNullType(childType)) {
    if (data[alias] === null) {
      errors.push(
        `Expecting non-null value of type ${childType.ofType.inspect()} at path ${path
          .concat([alias])
          .join("/")}`
      )
      return null
    }
    childType = childType.ofType
  }

  if (!isLeafType(childType)) {
    errors.push(
      `Expecting leaf type for field ${type.inspect()}#${
        selection.name
      } but got ${childType.inspect()}`
    )
    return null
  }

  try {
    childType.parseValue(data[alias])
  } catch (e) {
    errors.push(
      `Expected mock value of type '${type}' but got '${typeof data[
        alias
      ]}' at path '${path.concat([alias]).join("/")}'`
    )
    return null
  }

  return data[alias]
}

// TODO: improve errors
export function maskData({
  fragment: { selections, type },
  data,
  errors,
  path,
  variables,
}: {
  fragment: {
    selections: Selection[]
    type: GraphQLType
  }
  data: any
  path: string[]
  errors: string[]
  variables: any
}) {
  if (typeof data === "function") {
    data = data(variables)
  }
  if (data === null) {
    if (type instanceof GraphQLNonNull) {
      errors.push(`expected non-null object at path ${path.join("/")}`)
    }
    return null
  }
  if (type instanceof GraphQLNonNull) {
    type = (type as GraphQLNonNull<any>).ofType
  }
  if (type instanceof GraphQLList) {
    const elemType = (type as GraphQLList<any>).ofType
    if (!Array.isArray(data)) {
      errors.push(`expected array at path ${path.join("/")}`)
      return null
    }
    return data.map((elem, i) =>
      maskData({
        fragment: {
          type: elemType,
          selections,
        },
        data: elem,
        errors,
        path: path.concat([i.toString()]),
        variables,
      })
    )
  }
  if (isAbstractType(type)) {
    const typeName = inferConcreteTypeName({
      errors,
      path,
      schema,
      type,
      value: data,
    })
    if (!typeName) {
      return null
    }
    type = schema.getType(typeName)
  }
  if (!(type instanceof GraphQLObjectType)) {
    errors.push(`expected object type at path ${path.join("/")}`)
    return null
  }
  const result = {} as any
  for (const selection of selections) {
    const alias = selection.alias || selection.name
    switch (selection.kind) {
      case "ScalarField": {
        result[alias] = resolveScalarField({
          selection,
          data,
          type,
          errors,
          path,
        })
        break
      }
      case "LinkedField": {
        result[alias] = maskData({
          fragment: {
            selections: selection.selections,
            type: type.getFields()[selection.name].type,
          },
          data: data[alias],
          errors,
          path: path.concat([alias]),
          variables,
        })
        break
      }
      case "FragmentSpread": {
        const fragment = require(`__generated__/${selection.name}.graphql`)
          .default as Fragment
        const fragmentType = schema.getType(fragment.type)
        if (
          fragmentType === type ||
          (isInterfaceType(fragmentType) &&
            schema.getPossibleTypes(fragmentType).includes(type))
        ) {
          if (!result.__fragments) {
            result.__fragments = {}
          }
          // relay needs fragment-containing objects to have an __id
          // https://github.com/facebook/relay/blob/master/packages/relay-runtime/store/RelayModernSelector.js#L75
          if (!result.__id) {
            result.__id = getId(result, "__id")
          }
          result.__fragments[selection.name] = maskData({
            fragment: {
              selections: fragment.selections,
              type: schema.getType(fragment.type),
            },
            data,
            errors,
            path,
            variables,
          })
        }
        break
      }
      case "InlineFragment": {
        const fragmentType = schema.getType(selection.type)
        if (
          fragmentType === type ||
          (isInterfaceType(fragmentType) &&
            schema.getPossibleTypes(fragmentType).includes(type))
        ) {
          Object.assign(
            result,
            maskData({
              fragment: {
                selections: selection.selections,
                type,
              },
              data,
              errors,
              path,
              variables,
            })
          )
        }
        break
      }
      default: {
        // @ts-ignore
        errors.push(`Don't know how to handle selection kind ${selection.kind}`)
        return null
      }
    }
  }

  return result
}

const network = async () => ({})
const source = new RecordSource()
const store = new Store(source)
store.lookup = function lookup(selector) {
  if (selector.variables) {
    return { data: selector.variables }
  }
  throw new Error("what")
} as any
const environment = new Environment({
  network,
  store,
})

class ProvideRelayContext extends React.Component {
  static childContextTypes = {
    relay() {
      return null
    },
  }

  getChildContext() {
    return {
      relay: { environment, variables: {} },
    }
  }

  render() {
    return this.props.children
  }
}

interface Fragment {
  type: string
  kind: "Fragment"
  selections: Selection[]
}

type Selection =
  | {
      kind: "LinkedField"
      concreteType: string
      name: string
      plural: boolean
      alias: string | null
      selections: Selection[]
    }
  | {
      kind: "ScalarField"
      name: string
      // TODO: check alias type
      alias: string | null
    }
  | {
      kind: "FragmentSpread"
      name: string
      alias: undefined
    }
  | {
      kind: "InlineFragment"
      type: string
      selections: Selection[]
      name: undefined
      alias: undefined
    }

export function renderRelayTreeSuperFast({
  query,
  data,
  Component,
  variables,
}: {
  query: GraphQLTaggedNode
  data: any
  Component: React.ComponentType<any>
  variables?: object
}) {
  const node = (query as any)().default

  const errors = []
  const rootData = maskData({
    data,
    fragment: {
      selections: node.fragment.selections,
      type: schema.getQueryType(),
    },
    path: [],
    errors,
    variables,
  })

  if (errors.length) {
    throw new Error(errors.join("\n\n"))
  }

  return mount(
    <ProvideRelayContext>
      <Component {...rootData} />
    </ProvideRelayContext>
  )
}
