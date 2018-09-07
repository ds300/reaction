import { Serif } from "@artsy/palette"
import React from "react"

import { ShippingAddress_ship } from "__generated__/ShippingAddress_ship.graphql"
import { createFragmentContainer, graphql } from "react-relay"
import { COUNTRY_CODE_TO_COUNTRY_NAME } from "Styleguide/Components"

export interface ShippingAddressProps {
  ship: ShippingAddress_ship
}

export const ShippingAddress = ({
  ship: {
    name,
    addressLine1,
    addressLine2,
    city,
    region,
    postalCode,
    country,
    phoneNumber,
  },
}: ShippingAddressProps) => (
  <>
    <Serif size="3t">{name}</Serif>
    <Serif size="3t">
      {[addressLine1, (addressLine2 || "").trim()].filter(Boolean).join(", ")}
    </Serif>
    <Serif size="3t">
      {city}, {region} {postalCode}
    </Serif>
    <Serif size="3t">{COUNTRY_CODE_TO_COUNTRY_NAME[country] || country}</Serif>
    {phoneNumber && <Serif size="3t">{phoneNumber}</Serif>}
  </>
)

export const ShippingAddressFragmentContainer = createFragmentContainer(
  ShippingAddress,
  graphql`
    fragment ShippingAddress_ship on Ship {
      name
      addressLine1
      addressLine2
      city
      postalCode
      region
      country
      phoneNumber
    }
  `
)
