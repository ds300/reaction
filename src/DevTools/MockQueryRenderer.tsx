import { parse } from "graphql"
import { makeExecutableSchema } from "graphql-tools"
import { memoize } from "lodash"
import { useMemo } from "react"
import { GraphQLTaggedNode } from "react-relay"

import schemaText from "../../data/schema.graphql"

const schema = makeExecutableSchema({
  typeDefs: schemaText,
  resolvers: {},
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

const _validate = memoize(
  function __validate(operation: any, data: any) {},
  () => {}
)

export function validate(query: GraphQLTaggedNode, data: any) {
  const node = (query as any)().default

  if (node.operationKind !== "query") {
    throw new Error("MockQueryRenderer only supports queries so far")
  }

}

// export function MockQueryRenderer(props: {
//   query: GraphQLTaggedNode
//   variables: object
//   data: object
//   Component: React.ComponentType<any>
// }) {
//   const document = useMemo(() => parseDocument(props.query as any), [
//     props.query,
//   ])
// }
