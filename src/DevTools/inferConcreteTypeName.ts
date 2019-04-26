import { GraphQLAbstractType, GraphQLSchema } from "graphql"

export const inferConcreteTypeName = ({
  schema,
  value,
  type,
  errors,
  path,
}: {
  schema: GraphQLSchema
  value: any
  type: GraphQLAbstractType
  errors: string[]
  path: string[]
}): string => {
  if (value.__typename) {
    return value.__typename
  }
  const unionMemberTypes = schema.getPossibleTypes(type)

  // try to find keys in the object which are unique to one type
  for (const key of Object.keys(value)) {
    const matchingTypes = unionMemberTypes.filter(t => t.getFields()[key])
    if (matchingTypes.length === 1) {
      return matchingTypes[0].name
    }
  }

  const possibleTypes = unionMemberTypes.map(t => t.name).join(", ")

  errors.push(
    `Ambiguous object at path '${path}'. Add a __typename from this list: [${possibleTypes}]`
  )

  return null
}
