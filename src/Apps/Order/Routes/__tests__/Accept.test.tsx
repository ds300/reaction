import {
  Buyer,
  OfferOrderWithShippingDetails,
  Offers,
  OfferWithTotals,
} from "Apps/__tests__/Fixtures/Order"
import { trackPageView } from "Apps/Order/Utils/trackPageView"
import moment from "moment"
import { graphql } from "react-relay"
import {
  acceptOfferFailed,
  AcceptOfferPaymentFailed,
  acceptOfferSuccess,
} from "../__fixtures__/MutationResults"
import { AcceptFragmentContainer } from "../Accept"
import { TestPage } from "./Utils/TestPage"

jest.mock("Apps/Order/Utils/trackPageView")
jest.unmock("react-relay")

jest.mock("Utils/getCurrentTimeAsIsoString")
const NOW = "2018-12-05T13:47:16.446Z"
require("Utils/getCurrentTimeAsIsoString").__setCurrentTime(NOW)

const testOrder = {
  ...OfferOrderWithShippingDetails,
  stateExpiresAt: moment(NOW)
    .add(1, "day")
    .add(4, "hours")
    .add(22, "minutes")
    .add(59, "seconds")
    .toISOString(),
  lastOffer: {
    ...OfferWithTotals,
    createdAt: moment(NOW)
      .subtract(1, "day")
      .toISOString(),
    amount: "$sellers.offer",
    fromParticipant: "SELLER",
  },
  offers: { edges: Offers },
  buyer: Buyer,
}

class AcceptTestPage extends TestPage({
  Component: AcceptFragmentContainer,
  query: graphql`
    query AcceptTestQuery {
      order(id: "") {
        ...Accept_order
      }
    }
  `,
  defaultData: {
    order: testOrder,
  },
}) {}

describe("Accept seller offer", () => {
  const page = new AcceptTestPage()

  beforeEach(() => {
    page.reset()
  })

  describe("with default data", () => {
    beforeEach(async () => {
      await page.init()
    })

    it("Shows the stepper", async () => {
      expect(page.orderStepper.text()).toMatchInlineSnapshot(`"Respond Review"`)
      expect(page.orderStepperCurrentStep).toBe(`Review`)
    })

    it("shows the countdown timer", async () => {
      expect(page.countdownTimer.text()).toContain("01d 04h 22m 59s left")
    })

    it("shows the transaction summary", async () => {
      expect(page.transactionSummary.text()).toMatch(
        "Accept seller's offerChange"
      )
      expect(page.transactionSummary.text()).toMatch(
        "Seller's offer$sellers.offer"
      )
    })

    it("shows the artwork summary", async () => {
      expect(page.artworkSummary.text()).toMatch(
        "Lisa BreslowGramercy Park South"
      )
    })

    it("shows the shipping details", async () => {
      expect(page.shippingSummary.text()).toMatch(
        "Ship toJoelle Van Dyne401 Broadway"
      )
    })

    it("shows the payment details", async () => {
      expect(page.paymentSummary.text()).toMatchInlineSnapshot(
        `"•••• 4444  Exp 3/21"`
      )
    })

    it("shows the submit button", async () => {
      expect(page.submitButton.text()).toBe("Submit")
    })

    it("Shows the conditions of sale disclaimer.", async () => {
      expect(page.conditionsOfSaleDisclaimer.text()).toMatchInlineSnapshot(
        `"By clicking Submit, I agree to Artsy’s Conditions of Sale."`
      )
    })
  })

  describe("mutation", () => {
    const resolveMutation = jest.fn(
      () => acceptOfferSuccess.ecommerceBuyerAcceptOffer
    )

    beforeEach(async () => {
      await page.init({
        mockMutationResults: {
          ecommerceBuyerAcceptOffer: resolveMutation,
        },
      })
    })

    it("routes to status page after mutation completes", async () => {
      await page.clickSubmit()
      expect(page.mockPushRoute).toHaveBeenCalledWith(
        `/orders/${testOrder.id}/status`
      )
    })

    it("shows the button spinner while loading the mutation", async () => {
      resolveMutation.mockImplementationOnce(() => {
        expect(page.submitButton.props().loading).toBeTruthy()
        return acceptOfferSuccess.ecommerceBuyerAcceptOffer
      })

      expect(page.submitButton.props().loading).toBeFalsy()
      await page.clickSubmit()
      expect(page.submitButton.props().loading).toBeFalsy()

      expect.assertions(3)
    })

    it("shows an error modal when there is an error from the server", async () => {
      resolveMutation.mockReturnValueOnce(
        () => acceptOfferFailed.ecommerceBuyerAcceptOffer
      )

      await page.clickSubmit()

      expect(page.modalDialog.props().show).toBe(true)
      expect(page.modalDialog.text()).toContain("An error occurred")
      expect(page.modalDialog.text()).toContain(
        "Something went wrong. Please try again or contact orders@artsy.net."
      )

      await page.dismissModal()

      expect(page.modalDialog.props().show).toBe(false)
    })

    it("shows an error modal if there is a capture_failed error", async () => {
      resolveMutation.mockReturnValueOnce(
        () => AcceptOfferPaymentFailed.ecommerceBuyerAcceptOffer
      )

      await page.clickSubmit()

      expect(page.modalDialog.props().show).toBe(true)
      expect(page.modalDialog.text()).toContain("An error occurred")
      expect(page.modalDialog.text()).toContain(
        "There was an error processing your payment. Please try again or contact orders@artsy.net."
      )

      await page.dismissModal()

      expect(page.modalDialog.props().show).toBe(false)
    })
  })

  it("tracks a pageview", async () => {
    await page.init()

    expect(trackPageView).toHaveBeenCalledTimes(1)
  })
})
