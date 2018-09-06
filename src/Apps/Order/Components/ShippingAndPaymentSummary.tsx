import { Serif } from "@artsy/palette"
import { ShippingAndPaymentSummary_order } from "__generated__/ShippingAndPaymentSummary_order.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { StepSummaryItem } from "Styleguide/Components/StepSummaryItem"
import { Flex, FlexProps } from "Styleguide/Elements/Flex"
import { CreditCardDetails } from "./CreditCardDetails"
import { ShippingAddress } from "./ShippingAddress"

export const ShippingAndPaymentSummary = ({
  order,
  ...others
}: {
  order: ShippingAndPaymentSummary_order
} & FlexProps) => {
  const {
    requestedFulfillment: { __typename },
    lineItems,
    creditCard,
  } = order
  return (
    <Flex flexDirection="column" {...others}>
      {__typename === "Ship" ? (
        <StepSummaryItem title="Ship to">
          <ShippingAddress order={order} />
        </StepSummaryItem>
      ) : (
        <StepSummaryItem
          title={
            <>Pick up ({lineItems.edges[0].node.artwork.shippingOrigin})</>
          }
        >
          <Serif size="3t">
            You’ll be appointed an Artsy specialist within 2 business days to
            handle pickup logistics.
          </Serif>
        </StepSummaryItem>
      )}
      <StepSummaryItem>
        <CreditCardDetails {...creditCard} />
      </StepSummaryItem>
    </Flex>
  )
}

export const ShippingAndPaymentSummaryFragmentContainer = createFragmentContainer(
  ShippingAndPaymentSummary,
  graphql`
    fragment ShippingAndPaymentSummary_order on Order {
      ...ShippingAddress_order
      requestedFulfillment {
        __typename
      }
      lineItems {
        edges {
          node {
            artwork {
              shippingOrigin
            }
          }
        }
      }
      creditCard {
        brand
        last_digits
        expiration_year
        expiration_month
      }
    }
  `
)
