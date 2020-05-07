import React from "react"
import { Flex, color, Color, FontWeights, Box, Sans } from "@artsy/palette"
import { useIsRouteActive } from "Artsy/Router/useRouter"
import { RouterLink } from "Artsy/Router/RouterLink"
import { LinkProps } from "found"
import styled from "styled-components"

interface ViewingRoomTabBarProps {}

export const ViewingRoomTabBar: React.FC<ViewingRoomTabBarProps> = props => {
  return (
    <Flex width="100%" justifyContent="center" id="tabBarAnchor">
      <Flex width="66%" height={50}>
        {/* FIXME: Update with `:id` prop when ready */}
        <Tab to={`/viewing-room`}>Statement</Tab>
        <Tab to={`/viewing-room/works`}>Works</Tab>
      </Flex>
    </Flex>
  )
}

const Tab: React.FC<LinkProps> = ({ children, to }) => {
  const active = useIsRouteActive(to)

  const borderBottom = active
    ? `2px solid ${color("black100")}`
    : `1px solid ${color("black10")}`

  const textColor: Color = active ? "black100" : "black60"
  const weight: FontWeights = active ? "medium" : "regular"

  return (
    <TabContainer
      width="50%"
      textAlign="center"
      height={40}
      style={{
        cursor: "pointer",
        borderBottom,
      }}
    >
      <RouterLink to={to} activeClassName="active">
        <Sans size="3" color={textColor} weight={weight}>
          {children}
        </Sans>
      </RouterLink>
    </TabContainer>
  )
}

const TabContainer = styled(Box)`
  a {
    text-decoration: none;
  }
`
