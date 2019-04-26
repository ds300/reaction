import { MockQueryRenderer_related } from "__generated__/MockQueryRenderer_related.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { renderRelayTreeSuperFast } from "../MockQueryRenderer"

jest.unmock("react-relay")

jest.mock("relay-runtime/lib/RelayModernFragmentSpecResolver", () => {
  return require("DevTools/__mocks__/RelayModernFragmentSpecResolver")
})

const Component = createFragmentContainer(
  function Lol({ related }: { related: MockQueryRenderer_related }) {
    return <div>the name is {related.artists.edges[0].node.banana}</div>
  },
  {
    related: graphql`
      fragment MockQueryRenderer_related on ArtistRelatedData {
        artists {
          edges {
            node {
              banana: name
            }
          }
        }
      }
    `,
  }
)

describe(renderRelayTreeSuperFast, () => {
  it("banana", async () => {
    const wrapper = await renderRelayTreeSuperFast({
      Component: ({ artist }) => <Component related={artist.related} />,
      query: graphql`
        query MockQueryRendererTestQuery {
          artist(id: "whatever") {
            name
            related {
              ...MockQueryRenderer_related
            }
            ... on Artist {
              birthday
            }
          }
        }
      `,
      data: {
        artist: {
          related: {
            artists: { edges: [{ node: { banana: "David O'Doherty" } }] },
          },
          name: "Banksface",
          birthday: "today",
        },
      },
    })

    expect(wrapper.text()).toMatch("the name is David O'Doherty")
  })
})
