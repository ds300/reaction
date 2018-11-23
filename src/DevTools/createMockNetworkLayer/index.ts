// import { GraphQLFieldResolver, responsePathAsArray } from "graphql"
import { IMocks } from "graphql-tools/dist/Interfaces"
import getNetworkLayer from "relay-mock-network-layer"
import { Network } from "relay-runtime"
import schema from "../../../data/schema.graphql"
import FormattedNumber from "./CustomScalars/formatted_number"

export const createMockNetworkLayer = (mockResolvers: IMocks) => {
  return Network.create(
    getNetworkLayer({
      schema,
      mocks: {
        FormattedNumber: () => FormattedNumber,
        // String: ((_source, _args, _context, info) => {
        //   const path = responsePathAsArray(info.path).join("/")
        //   throw new Error(
        //     "A mock for String field was expeced but not found at path " + path
        //   )
        // }) as GraphQLFieldResolver<any, any>,
        // Int: ((_source, _args, _context, info) => {
        //   const path = responsePathAsArray(info.path).join("/")
        //   throw new Error(
        //     "A mock for Int field was expeced but not found at path " + path
        //   )
        // }) as GraphQLFieldResolver<any, any>,
        // Float: ((_source, _args, _context, info) => {
        //   const path = responsePathAsArray(info.path).join("/")
        //   throw new Error(
        //     "A mock for Float field was expeced but not found at path " + path
        //   )
        // }) as GraphQLFieldResolver<any, any>,
        // Boolean: ((_source, _args, _context, info) => {
        //   const path = responsePathAsArray(info.path).join("/")
        //   throw new Error(
        //     "A mock for Boolean field was expeced but not found at path " + path
        //   )
        // }) as GraphQLFieldResolver<any, any>,
        ...mockResolvers,
      },
    })
  )
}
