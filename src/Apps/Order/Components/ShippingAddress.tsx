import { Serif } from "@artsy/palette"
import React from "react"

import { ShippingAddress_order } from "__generated__/ShippingAddress_order.graphql"
import { createFragmentContainer, graphql } from "react-relay"
import { COUNTRY_CODE_TO_COUNTRY_NAME } from "Styleguide/Components"

export interface ShippingAddressProps {
  order: ShippingAddress_order
}

export const ShippingAddress = ({
  order: { buyerPhoneNumber, requestedFulfillment },
}: ShippingAddressProps) => {
  switch (requestedFulfillment.__typename) {
    case "Ship":
      const {
        name,
        addressLine1,
        addressLine2,
        city,
        region,
        postalCode,
        country,
      } = requestedFulfillment
      return (
        <>
          <Serif size="3t">{name}</Serif>
          <Serif size="3t">
            {[addressLine1, (addressLine2 || "").trim()]
              .filter(Boolean)
              .join(", ")}
          </Serif>
          <Serif size="3t">
            {city}, {region} {postalCode}
          </Serif>
          <Serif size="3t">
            {COUNTRY_CODE_TO_COUNTRY_NAME[country] || country}
          </Serif>
          {buyerPhoneNumber && <Serif size="3t">{buyerPhoneNumber}</Serif>}
        </>
      )
    default:
      return null
  }
}

export const ShippingAddressFragmentContainer = createFragmentContainer(
  ShippingAddress,
  graphql`
    fragment ShippingAddress_order on Order {
      buyerPhoneNumber
      requestedFulfillment {
        __typename
        ... on Ship {
          name
          addressLine1
          addressLine2
          city
          postalCode
          region
          country
        }
      }
    }
  `
)
