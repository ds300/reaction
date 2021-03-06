import React from "react"
import { Box, Button, Sans, Serif } from "@artsy/palette"
import { ViewingRoomArtworkDetails_artwork } from "__generated__/ViewingRoomArtworkDetails_artwork.graphql"
import { createFragmentContainer, graphql } from "react-relay"
import { RouterLink } from "Artsy/Router/RouterLink"
import { AnalyticsSchema, useTracking } from "Artsy"

interface ViewingRoomArtworkDetailsProps {
  artwork: ViewingRoomArtworkDetails_artwork
}

export const ViewingRoomArtworkDetails: React.FC<ViewingRoomArtworkDetailsProps> = ({
  artwork: {
    artistNames,
    title,
    date,
    href,
    additionalInformation,
    saleMessage,
  },
}) => {
  const tracking = useTracking()

  return (
    <Box maxWidth={["100%", 470]} m="auto">
      <Box>
        <Sans size="3">{artistNames}</Sans>
      </Box>

      <Box style={{ textOverflow: "ellipsis" }}>
        <Sans size="3" color="black60">
          {[title, date].filter(s => s).join(", ")}
        </Sans>
      </Box>

      {saleMessage && (
        <Box>
          <Sans size="3" color="black60">
            {saleMessage}
          </Sans>
        </Box>
      )}

      <RouterLink
        to={href}
        onClick={() => {
          tracking.trackEvent({
            action_type: AnalyticsSchema.ActionType.ClickedBuyViewingGroup,
            context_module:
              AnalyticsSchema.ContextModule.ViewingRoomArtworkRail,
            subject: AnalyticsSchema.Subject.Rail,
            destination_path: href,
          })
        }}
      >
        <Button width="100%" size="large" my={2}>
          Buy
        </Button>
      </RouterLink>

      {additionalInformation && (
        <Serif size={["4", "5"]}>{additionalInformation}</Serif>
      )}
    </Box>
  )
}

export const ViewingRoomArtworkDetailsFragmentContainer = createFragmentContainer(
  ViewingRoomArtworkDetails,
  {
    artwork: graphql`
      fragment ViewingRoomArtworkDetails_artwork on Artwork {
        id
        additionalInformation
        artistNames
        title
        date
        href
        saleMessage
      }
    `,
  }
)
