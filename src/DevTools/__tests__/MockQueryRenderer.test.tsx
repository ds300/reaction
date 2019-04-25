import { graphql } from "react-relay"
import { validate } from "../MockQueryRenderer"

describe(validate, () => {
  it("banana", () => {
    validate(
      graphql`
        query MockQueryRendererTestQuery {
          artist(id: "blah") {
            name
            ...Follow_artist
          }
        }
      `,
      {}
    )
  })
})
