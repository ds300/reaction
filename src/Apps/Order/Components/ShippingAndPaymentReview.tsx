import { Sans } from "@artsy/palette"
import { ShippingAndPaymentReview_order } from "__generated__/ShippingAndPaymentReview_order.graphql"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { StepSummaryItem } from "Styleguide/Components/StepSummaryItem"
import { Flex, FlexProps } from "Styleguide/Elements/Flex"
import { CreditCardDetails } from "./CreditCardDetails"
import { ShippingAddressFragmentContainer as ShippingAddress } from "./ShippingAddress"

export const ShippingAndPaymentReview = ({
  order,
  onChangePayment,
  onChangeShipping,
  ...others
}: {
  order: ShippingAndPaymentReview_order
  onChangePayment(): void
  onChangeShipping(): void
} & FlexProps) => {
  const {
    requestedFulfillment: { __typename },
    lineItems,
    creditCard,
  } = order
  return (
    <Flex flexDirection="column" {...others}>
      {__typename === "Ship" ? (
        <StepSummaryItem onChange={onChangeShipping} title="Shipping address">
          <ShippingAddress order={order} />
        </StepSummaryItem>
      ) : (
        <StepSummaryItem
          onChange={onChangeShipping}
          title={
            <>Pick up ({lineItems.edges[0].node.artwork.shippingOrigin})</>
          }
        >
          <Sans size="2">
            After you place your order, you’ll be appointed an Artsy specialist
            within 2 business days to handle pickup logistics.
          </Sans>
        </StepSummaryItem>
      )}
      <StepSummaryItem onChange={onChangePayment} title="Payment method">
        <CreditCardDetails {...creditCard} />
      </StepSummaryItem>
    </Flex>
  )
}

export const ShippingAndPaymentReviewFragmentContainer = createFragmentContainer(
  ShippingAndPaymentReview,
  graphql`
    fragment ShippingAndPaymentReview_order on Order {
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
