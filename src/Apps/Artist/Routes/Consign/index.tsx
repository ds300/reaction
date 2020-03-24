import { Box } from "@artsy/palette"
import { Match, Router } from "found"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { Consign_artist } from "__generated__/Consign_artist.graphql"
import { Consign_artworksByInternalID } from "__generated__/Consign_artworksByInternalID.graphql"

import { ArtistConsignFAQ } from "./Components/ArtistConsignFAQ"
import { ArtistConsignHeader } from "./Components/ArtistConsignHeader"
import { ArtistConsignHowtoSell } from "./Components/ArtistConsignHowToSell"
import { ArtistConsignMarketTrends } from "./Components/ArtistConsignMarketTrends"
import { ArtistConsignMeta } from "./Components/ArtistConsignMeta"
import { ArtistConsignPageViews } from "./Components/ArtistConsignPageViews"
import { ArtistConsignRecentlySold } from "./Components/ArtistConsignRecentlySold"
import { ArtistConsignSellArt } from "./Components/ArtistConsignSellArt"

import { getConsignmentData } from "./Utils/getConsignmentData"

interface ConsignRouteProps {
  artist: Consign_artist
  artworksByInternalID: Consign_artworksByInternalID
  match: Match
  router: Router
}

export const ConsignRoute: React.FC<ConsignRouteProps> = props => {
  const { artist, artworksByInternalID, match } = props
  const artistPathName = match.location.pathname.replace("/consign", "")
  const artistConsignment = getConsignmentData(artistPathName)
  const imageURL = artworksByInternalID[0]?.image.imageURL

  return (
    <Box>
      {/*
        Header tags
      */}
      <ArtistConsignMeta
        artistName={artist.name}
        artistHref={artist.href}
        imageURL={imageURL}
      />

      {/*
        Content
      */}
      <ArtistConsignHeader artistName={artist.name} />
      <ArtistConsignRecentlySold
        artistConsignment={artistConsignment}
        artistName={artist.name}
        artworksByInternalID={artworksByInternalID}
      />
      <ArtistConsignPageViews
        artistConsignment={artistConsignment}
        artistName={artist.name}
      />
      <ArtistConsignMarketTrends
        artistConsignment={artistConsignment}
        artistID={match.params.artistID}
      />
      <ArtistConsignHowtoSell />
      <ArtistConsignFAQ />
      <ArtistConsignSellArt />
    </Box>
  )
}

export const ConsignRouteFragmentContainer = createFragmentContainer(
  ConsignRoute,
  {
    artist: graphql`
      fragment Consign_artist on Artist {
        name
        href
      }
    `,
    artworksByInternalID: graphql`
      fragment Consign_artworksByInternalID on Artwork @relay(plural: true) {
        internalID
        image {
          aspectRatio
          imageURL
        }
        ...FillwidthItem_artwork
      }
    `,
  }
)

// Export default for bundle splitting at route
export default ConsignRouteFragmentContainer
