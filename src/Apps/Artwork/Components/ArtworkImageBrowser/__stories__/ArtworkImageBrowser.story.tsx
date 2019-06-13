import {
  Box,
  Col,
  Flex,
  Join,
  Sans,
  Separator,
  Serif,
  Spacer,
} from "@artsy/palette"
import { ArtworkImageBrowserQueryRenderer } from "Apps/Artwork/Components/ArtworkImageBrowser"
import React from "react"
import { storiesOf } from "storybook/storiesOf"
import { Section } from "Utils/Section"

storiesOf("Apps/Artwork Page/Components/ArtworkImageBrowser", module)
  .add("ArtworkBrowser", () => {
    return (
      <>
        <Section title="Multiple images (responsive)">
          <Box width={"100%"}>
            <ArtworkImageBrowserQueryRenderer artworkID="andy-warhol-lenin-fs-ii-dot-402-1" />
          </Box>
        </Section>
        <Section title="Single image">
          <Col sm="8">
            <ArtworkImageBrowserQueryRenderer artworkID="pablo-picasso-david-et-bethsabee" />
          </Col>
        </Section>
      </>
    )
  })

  .add("Fonts!", () => {
    return (
      <Flex ml={40} flexDirection="column">
        <Flex pb="2" background="palevioletred" />
        <Join separator={<Separator />}>
          <Sans size="0" bg="papayawhip">
            This is some
            <br /> text 0
          </Sans>
          <Sans size="1" bg="papayawhip">
            This is some
            <br />
            text 1
          </Sans>
          <Sans size="2" bg="papayawhip">
            This is some
            <br />
            text 2
          </Sans>
          <Sans size="3" bg="papayawhip">
            This is some
            <br />
            text 3
          </Sans>
          <Sans size="3t" bg="papayawhip">
            This is some
            <br />
            text 3t
          </Sans>
          <Sans size="4" bg="papayawhip">
            This is some
            <br />
            text 4
          </Sans>
          <Sans size="4t" bg="papayawhip">
            This is some
            <br />
            text 4t
          </Sans>
        </Join>
        <Spacer mb={2} />
        <Join separator={<Separator />}>
          <Serif size="1" bg="papayawhip">
            This is some
            <br />
            text 1
          </Serif>
          <Serif size="2" bg="papayawhip">
            This is some
            <br />
            text 2
          </Serif>
          <Serif size="3" bg="papayawhip">
            This is some
            <br />
            text 3
          </Serif>
          <Serif size="3t" bg="papayawhip">
            This is some
            <br />
            text 3t
          </Serif>
          <Serif size="4" bg="papayawhip">
            This is some
            <br />
            text 4
          </Serif>
          <Serif size="4t" bg="papayawhip">
            This is some
            <br />
            text 4t
          </Serif>
          <Serif size="5" bg="papayawhip">
            This is some
            <br />
            text 5t
          </Serif>
          <Serif size="5t" bg="papayawhip">
            This is some
            <br />
            text 5t
          </Serif>
        </Join>
      </Flex>
    )
  })
