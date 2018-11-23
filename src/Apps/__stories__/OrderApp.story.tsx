import {
  mockResolver,
  OrderWithShippingDetails,
  PickupOrder,
  UntouchedBuyOrder,
  UntouchedOfferOrder,
} from "Apps/__tests__/Fixtures/Order"
import { MockRouter } from "DevTools/MockRouter"
import React from "react"
import { storiesOf } from "storybook/storiesOf"
import { routes as orderRoutes } from "../Order/routes"

const Router = props => (
  <MockRouter
    routes={orderRoutes}
    mockResolvers={mockResolver()}
    historyOptions={{ useBeforeUnload: true }}
    context={{
      mediator: {
        trigger: x => x,
      },
    }}
    {...props}
  />
)

storiesOf("Apps/Order Page/Buy Now/Shipping", module)
  .add("Shipping - Pre-filled", () => (
    <Router initialRoute="/orders/123/shipping" />
  ))
  .add("Shipping - Untouched Order", () => (
    <Router
      // The UntouchedBuyOrder has a specified requestedFulfillment, but it should be null.
      // Unfortunately, enough of our tests use UntouchedBuyOrder to change it, so we'll specify it here to avoid breaking our story.
      mockResolvers={mockResolver({
        ...UntouchedBuyOrder,
        requestedFulfillment: null,
      })}
      initialRoute="/orders/123/shipping"
    />
  ))

storiesOf("Apps/Order Page/Buy Now/Review", module).add("Review", () => (
  <Router initialRoute="/orders/123/review" />
))

storiesOf("Apps/Order Page/Buy Now/Payment", module)
  .add("With 'Ship'", () => <Router initialRoute="/orders/123/payment" />)
  .add("With 'Pickup'", () => (
    <Router
      initialRoute="/orders/123/payment"
      mockResolvers={mockResolver(PickupOrder)}
    />
  ))

storiesOf("Apps/Order Page/Buy Now/Status", module)
  .add("submitted (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "SUBMITTED",
      })}
    />
  ))
  .add("submitted (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...PickupOrder,
        state: "SUBMITTED",
      })}
    />
  ))
  .add("approved (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "APPROVED",
      })}
    />
  ))
  .add("approved (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({ ...PickupOrder, state: "APPROVED" })}
    />
  ))
  .add("fulfilled (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "FULFILLED",
      })}
    />
  ))
  .add("fulfilled (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({ ...PickupOrder, state: "FULFILLED" })}
    />
  ))
  .add("canceled (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "CANCELED",
      })}
    />
  ))
  .add("canceled (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({ ...PickupOrder, state: "CANCELED" })}
    />
  ))

storiesOf("Apps/Order Page/Make Offer/Offer", module).add("Empty", () => (
  <Router
    initialRoute="/orders/123/offer"
    mockResolvers={mockResolver({
      ...UntouchedOfferOrder,
      requestedFulfillment: null,
    })}
  />
))

storiesOf("Apps/Order Page/Make Offer/Shipping", module)
  .add("Shipping - Pre-filled", () => (
    <Router
      initialRoute="/orders/123/shipping"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        mode: "OFFER",
      })}
    />
  ))
  .add("Shipping - Untouched Order", () => (
    <Router
      // The UntouchedBuyOrder has a specified requestedFulfillment, but it should be null.
      // Unfortunately, enough of our tests use UntouchedBuyOrder to change it, so we'll specify it here to avoid breaking our story.
      mockResolvers={mockResolver({
        ...UntouchedBuyOrder,
        requestedFulfillment: null,
        mode: "OFFER",
      })}
      initialRoute="/orders/123/shipping"
    />
  ))

storiesOf("Apps/Order Page/Make Offer/Payment", module)
  .add("With 'Ship'", () => (
    <Router
      initialRoute="/orders/123/payment"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        mode: "OFFER",
      })}
    />
  ))
  .add("With 'Pickup'", () => (
    <Router
      initialRoute="/orders/123/payment"
      mockResolvers={mockResolver({ ...PickupOrder, mode: "OFFER" })}
    />
  ))

storiesOf("Apps/Order Page/Make Offer/Review", module).add("Review", () => (
  <Router
    initialRoute="/orders/123/review"
    mockResolvers={mockResolver({
      ...OrderWithShippingDetails,
      mode: "OFFER",
    })}
  />
))

storiesOf("Apps/Order Page/Counter Offer", module).add("Respond", () => (
  <Router
    initialRoute="/orders/123/respond"
    mockResolvers={mockResolver({
      ...OrderWithShippingDetails,
      mode: "OFFER",
    })}
  />
))

storiesOf("Apps/Order Page/Make Offer/Status", module)
  .add("submitted (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "SUBMITTED",
        mode: "OFFER",
      })}
    />
  ))
  .add("submitted (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...PickupOrder,
        state: "SUBMITTED",
        mode: "OFFER",
      })}
    />
  ))
  .add("approved (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "APPROVED",
        mode: "OFFER",
      })}
    />
  ))
  .add("approved (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...PickupOrder,
        state: "APPROVED",
        mode: "OFFER",
      })}
    />
  ))
  .add("fulfilled (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "FULFILLED",
        mode: "OFFER",
      })}
    />
  ))
  .add("fulfilled (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...PickupOrder,
        state: "FULFILLED",
        mode: "OFFER",
      })}
    />
  ))
  .add("canceled (ship)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...OrderWithShippingDetails,
        state: "CANCELED",
        mode: "OFFER",
      })}
    />
  ))
  .add("canceled (pickup)", () => (
    <Router
      initialRoute="/orders/123/status"
      mockResolvers={mockResolver({
        ...PickupOrder,
        state: "CANCELED",
        mode: "OFFER",
      })}
    />
  ))
