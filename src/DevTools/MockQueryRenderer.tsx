import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLType,
} from "graphql"
import { makeExecutableSchema } from "graphql-tools"
import { GraphQLTaggedNode } from "react-relay"

import { mount } from "enzyme"
import React from "react"
import { Environment, RecordSource, Store } from "relay-runtime"
import uuid from "uuid"
import schemaText from "../../data/schema.graphql"

const schema = makeExecutableSchema({
  typeDefs: schemaText,
  resolvers: {},
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

const idMap = new WeakMap()

function getId(obj) {
  if (!obj) {
    throw new Error("can't get id of " + obj)
  }
  let id = obj.__id || idMap.get(obj)
  if (!id) {
    id = uuid()
    idMap.set(obj, id)
  }
  return id
}

// TODO: aliases
// TODO: anonymous fragments
// TODO: abstract types
export function maskData({
  fragment: { selections, type },
  data,
  errors,
  path,
}: {
  fragment: {
    selections: Selection[]
    type: GraphQLType
  }
  data: any
  path: string[]
  errors: string[]
}) {
  if (typeof data === "function") {
    data = data()
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
      })
    )
  }
  if (!(type instanceof GraphQLObjectType)) {
    errors.push(`expected object type at path ${path.join("/")}`)
    return {}
  }
  const result = {} as any
  for (const selection of selections) {
    const alias = selection.alias || selection.name
    switch (selection.kind) {
      case "ScalarField": {
        // TODO: check type of value against type.getFields()[whatevs]
        if (!data.hasOwnProperty(alias)) {
          if (selection.name === "__id") {
            result[alias] = getId(data)
            break
          }
          errors.push(
            `Can't find value at path ${path.concat([alias]).join("/")}`
          )
          break
        }
        result[alias] = data[alias]
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
        })
        break
      }
      case "FragmentSpread": {
        const fragment = require(`__generated__/${selection.name}.graphql`)
          .default as Fragment
        Object.defineProperty(result, `__fragment_${selection.name}`, {
          value: maskData({
            fragment: {
              selections: fragment.selections,
              type: schema.getType(fragment.type),
            },
            data,
            errors,
            path,
          }),
        })
        break
      }
    }
  }

  return result
}

const network = async () => ({})
const source = new RecordSource()
const store = new Store(source)
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
