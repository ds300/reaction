import { Button, Checkbox, CheckboxProps } from "@artsy/palette"
import { mockTracking } from "Artsy/Analytics"
import { mount } from "enzyme"
import React from "react"

import { Collapse } from "@artsy/palette"
import {
  BuyOrderPickup,
  BuyOrderWithShippingDetails,
  UntouchedOfferOrder,
} from "Apps/__tests__/Fixtures/Order"
import {
  fillCountrySelect,
  fillIn,
  validAddress,
} from "Apps/Order/Routes/__tests__/Utils/addressForm"
import { Input } from "../../../../Components/Input"
import {
  ActiveTabContainer,
  CheckMarkWrapper,
  Stepper,
} from "../../../../Styleguide/Components"
import {
  creatingCreditCardFailed,
  creatingCreditCardSuccess,
  settingOrderPaymentFailed,
  settingOrderPaymentSuccess,
} from "../__fixtures__/MutationResults"
import { ContinueButton, PaymentProps, PaymentRoute } from "../Payment"
jest.mock("react-relay", () => ({
  commitMutation: jest.fn(),
  createFragmentContainer: component => component,
}))

jest.mock("react-stripe-elements", () => ({
  CardElement: ({ onReady, hidePostalCode, ...props }) => <div {...props} />,
  injectStripe: args => args,
}))
jest.unmock("react-tracking")

import { MockBoot } from "DevTools"
import { commitMutation, RelayProp } from "react-relay"
import { Breakpoint } from "Utils/Responsive"
import {
  ErrorModal,
  ModalButton,
} from "../../../../Components/Modal/ErrorModal"
import { Address, AddressForm } from "../../Components/AddressForm"

const mutationMock = commitMutation as jest.Mock<any>

const fillAddressForm = (component: any, address: Address) => {
  fillIn(component, { title: "Full name", value: address.name })
  fillIn(component, { title: "Address line 1", value: address.addressLine1 })
  fillIn(component, {
    title: "Address line 2 (optional)",
    value: address.addressLine2,
  })
  fillIn(component, { title: "City", value: address.city })
  fillIn(component, {
    title: "State, province, or region",
    value: address.region,
  })
  fillIn(component, { title: "Postal code", value: address.postalCode })
  fillCountrySelect(component, address.country)
}

describe("Payment", () => {
  let stripeMock
  let testProps: PaymentProps

  const getWrapper = (props, breakpoint: Breakpoint = "xs") => {
    return mount(
      <MockBoot breakpoint={breakpoint}>
        <PaymentRoute {...props} />
      </MockBoot>
    )
  }

  beforeEach(() => {
    mutationMock.mockReset()

    stripeMock = {
      createToken: jest.fn(() => Promise.resolve()),
    }

    testProps = {
      order: { ...BuyOrderWithShippingDetails, id: "1234" },
      relay: { environment: {} } as RelayProp,
      router: { push: jest.fn() },
      stripe: stripeMock,
      mediator: { trigger: jest.fn() },
    } as any
  })

  it("always shows the billing address form without checkbox when the user selected 'pick' shipping option", () => {
    const paymentRoute = getWrapper({
      ...testProps,
      order: {
        ...BuyOrderPickup,
        id: "1234",
      },
    })

    expect(paymentRoute.find(Checkbox).length).toBe(0)
    expect(paymentRoute.find(Collapse).props().open).toBe(true)
  })

  it("removes all data when the billing address form is hidden", () => {
    const paymentRoute = getWrapper(testProps)
    const nameInput = () =>
      paymentRoute.find("input[placeholder='Add full name']")
    // expand address form
    paymentRoute.find(Checkbox).simulate("click")
    ;(nameInput().instance() as any).value = "Dr Collector"
    nameInput().simulate("change")
    expect((nameInput().instance() as any).value).toEqual("Dr Collector")

    // hide address form
    paymentRoute.find(Checkbox).simulate("click")

    // expand address form again
    paymentRoute.find(Checkbox).simulate("click")

    // expect name to be empty
    expect((nameInput().instance() as any).value).toEqual("")
  })

  it("does not pre-populate with available details when returning to the payment route", () => {
    const paymentRoute = getWrapper({
      ...testProps,
      order: {
        ...BuyOrderPickup,
        id: "1234",
        creditCard: {
          name: "Artsy UK Ltd",
          street1: "14 Gower's Walk",
          street2: "Suite 2.5, The Loom",
          city: "London",
          state: "Whitechapel",
          country: "UK",
          postal_code: "E1 8PY",
        },
      },
    })

    expect(paymentRoute.find(AddressForm).props().value).toEqual({
      name: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      region: "",
      postalCode: "",
      country: "US",
      phoneNumber: "",
    })
  })

  it("always uses the billing address for stripe tokenization when the user selected 'pick' shipping option", () => {
    const paymentRoute = getWrapper({
      ...testProps,
      order: {
        ...BuyOrderPickup,
        id: "1234",
      },
    })

    fillAddressForm(paymentRoute, validAddress)
    paymentRoute.find(ContinueButton).simulate("click")

    expect(stripeMock.createToken).toHaveBeenCalledWith({
      name: "Artsy UK Ltd",
      address_line1: "14 Gower's Walk",
      address_line2: "Suite 2.5, The Loom",
      address_city: "Whitechapel",
      address_state: "London",
      address_zip: "E1 8PY",
      address_country: "UK",
    })
  })

  it("tokenizes credit card information using shipping address as billing address", () => {
    const paymentRoute = getWrapper(testProps)
    paymentRoute.find(ContinueButton).simulate("click")

    expect(stripeMock.createToken).toHaveBeenCalledWith({
      name: "Joelle Van Dyne",
      address_line1: "401 Broadway",
      address_line2: "Suite 25",
      address_city: "New York",
      address_state: "NY",
      address_zip: "10013",
      address_country: "US",
    })
  })

  it("tokenizes credit card information with a different billing address", () => {
    const paymentRoute = getWrapper(testProps)
    ;(paymentRoute.find(Checkbox).props() as CheckboxProps).onSelect(false)

    fillAddressForm(paymentRoute, validAddress)
    paymentRoute.find(ContinueButton).simulate("click")

    expect(stripeMock.createToken).toHaveBeenCalledWith({
      name: "Artsy UK Ltd",
      address_line1: "14 Gower's Walk",
      address_line2: "Suite 2.5, The Loom",
      address_city: "Whitechapel",
      address_state: "London",
      address_zip: "E1 8PY",
      address_country: "UK",
    })
  })

  it("commits createCreditCard mutation with stripe token id", async () => {
    const stripeToken: stripe.TokenResponse = {
      token: {
        id: "tokenId",
        object: null,
        client_ip: null,
        created: null,
        livemode: null,
        type: null,
        used: null,
      },
    }

    stripeMock.createToken.mockReturnValue(Promise.resolve(stripeToken))

    const paymentRoute = getWrapper(testProps)
    fillAddressForm(paymentRoute, validAddress)
    paymentRoute
      .find(ContinueButton)
      .props()
      .onClick()

    // flush the promise queue
    await Promise.resolve()

    expect(mutationMock.mock.calls[0][1]).toMatchObject({
      variables: {
        input: {
          token: "tokenId",
        },
      },
    })
  })

  it("shows the button spinner while loading the mutation", async () => {
    const paymentRoute = getWrapper(testProps)

    fillAddressForm(paymentRoute, validAddress)

    const isButtonLoading = () =>
      paymentRoute
        .update()
        .find(Button)
        .props().loading

    expect(isButtonLoading()).toBeFalsy()

    paymentRoute.find(ContinueButton).simulate("click")

    await Promise.resolve()

    expect(isButtonLoading()).toBeTruthy()
  })

  it("shows an error message when CreateToken passes in an error", async () => {
    const stripeError: stripe.TokenResponse = {
      error: {
        type: null,
        charge: null,
        message: "Your card number is invalid.",
        code: null,
        decline_code: null,
        param: null,
      },
    }

    stripeMock.createToken.mockReturnValue(Promise.resolve(stripeError))

    const paymentRoute = getWrapper(testProps)
    fillAddressForm(paymentRoute, validAddress)

    expect(paymentRoute.text()).not.toContain("Your card number is invalid.")

    paymentRoute.find(ContinueButton).simulate("click")

    // flush the promise queue
    await Promise.resolve()

    expect(paymentRoute.text()).toContain("Your card number is invalid.")
  })

  it("shows an error modal when CreateToken raises an error", async () => {
    stripeMock.createToken.mockReturnValue(
      Promise.reject(new Error("something failed"))
    )
    const paymentRoute = getWrapper(testProps)
    fillAddressForm(paymentRoute, validAddress)
    paymentRoute.find(ContinueButton).simulate("click")

    // flush promise queue
    await Promise.resolve()
    await Promise.resolve()

    expect(
      paymentRoute
        .update()
        .find(ErrorModal)
        .props().show
    ).toBe(true)
  })

  it("commits setOrderPayment mutation with Gravity credit card id", async () => {
    stripeMock.createToken.mockReturnValue(
      Promise.resolve({ token: { id: "tokenId" } })
    )

    mutationMock.mockImplementationOnce((_, { onCompleted }) =>
      onCompleted(creatingCreditCardSuccess)
    )

    const paymentRoute = getWrapper(testProps)
    fillAddressForm(paymentRoute, validAddress)
    paymentRoute.find(ContinueButton).simulate("click")

    // flush promise queue
    await Promise.resolve()

    expect(mutationMock.mock.calls[1][1]).toMatchObject({
      variables: {
        input: {
          creditCardId: "gravityCreditCardId",
          orderId: "1234",
        },
      },
    })
  })

  it("takes the user to the review step", async () => {
    stripeMock.createToken.mockReturnValue(
      Promise.resolve({ token: { id: "tokenId" } })
    )

    mutationMock
      .mockImplementationOnce((_, { onCompleted }) =>
        onCompleted(creatingCreditCardSuccess)
      )
      .mockImplementationOnce((_, { onCompleted }) =>
        onCompleted(settingOrderPaymentSuccess)
      )
    const paymentRoute = getWrapper(testProps)
    fillAddressForm(paymentRoute, validAddress)
    paymentRoute.find(ContinueButton).simulate("click")

    await Promise.resolve()

    expect(testProps.router.push).toHaveBeenCalledWith("/orders/1234/review")
  })

  it("shows an error modal when there is an error in CreateCreditCardPayload", async () => {
    stripeMock.createToken.mockReturnValue(
      Promise.resolve({ token: { id: "tokenId" } })
    )

    mutationMock.mockImplementationOnce((_, { onCompleted }) =>
      onCompleted(creatingCreditCardFailed)
    )

    const component = getWrapper(testProps)

    expect(component.find(ErrorModal).props().show).toBe(false)

    component.find(ContinueButton).simulate("click")

    await Promise.resolve()
    component.update()

    expect(component.find(ErrorModal).props().show).toBe(true)
    expect(component.find(ErrorModal).props().detailText).toBe(
      "No such token: fake-token"
    )

    component.find(ModalButton).simulate("click")

    expect(component.find(ErrorModal).props().show).toBe(false)
  })

  it("shows an error modal when there is an error in SetOrderPaymentPayload", async () => {
    stripeMock.createToken.mockReturnValue(
      Promise.resolve({ token: { id: "tokenId" } })
    )

    const component = getWrapper(testProps)

    mutationMock
      .mockImplementationOnce((_, { onCompleted }) =>
        onCompleted(creatingCreditCardSuccess)
      )
      .mockImplementationOnce((_, { onCompleted }) =>
        onCompleted(settingOrderPaymentFailed)
      )

    component.find(ContinueButton).simulate("click")

    // flush promise queue
    await Promise.resolve()
    component.update()

    expect(component.find(ErrorModal).props().show).toBe(true)
  })

  it("shows an error modal when there is a network error", async () => {
    stripeMock.createToken.mockReturnValue(
      Promise.resolve({ token: { id: "tokenId" } })
    )

    const component = getWrapper(testProps)

    mutationMock.mockImplementationOnce((_, { onError }) =>
      onError(new TypeError("Network request failed"))
    )

    component.find(ContinueButton).simulate("click")

    // flush promise queue
    await Promise.resolve()
    component.update()

    expect(component.find(ErrorModal).props().show).toBe(true)
  })

  describe("Analytics", () => {
    it("tracks click when use shipping address checkbox transitions from checked to unchecked but not from unchecked to checked", () => {
      const { Component, dispatch } = mockTracking(PaymentRoute)
      const component = mount(<Component {...testProps} />)
      // Initial state is checked
      component
        .find(Checkbox)
        .at(0)
        .simulate("click")
      expect(dispatch).toBeCalledWith({
        action_type: "Click",
        subject: "use shipping address",
        flow: "buy now",
        type: "checkbox",
      })
      expect(dispatch).toHaveBeenCalledTimes(1)

      dispatch.mockClear()

      // State is now unchecked
      component
        .find(Checkbox)
        .at(0)
        .simulate("click")
      expect(dispatch).not.toBeCalled()
    })

    it("triggers order:payment event on component did mount", () => {
      const { Component } = mockTracking(PaymentRoute)
      const component = mount(<Component {...testProps} />)
      component.instance().componentDidMount()
      expect(testProps.mediator.trigger).toHaveBeenCalledWith("order:payment")
    })
  })

  describe("Validations", () => {
    it("says a required field is required with billing address exposed", () => {
      const paymentRoute = getWrapper(testProps)
      ;(paymentRoute.find(Checkbox).props() as CheckboxProps).onSelect(false)

      paymentRoute.find(ContinueButton).simulate("click")
      const input = paymentRoute
        .find(Input)
        .filterWhere(wrapper => wrapper.props().title === "Full name")
      expect(input.props().error).toEqual("This field is required")
    })

    it("before submit, only shows a validation error on inputs that have been touched", () => {
      const component = getWrapper(testProps)
      ;(component.find(Checkbox).props() as CheckboxProps).onSelect(false)

      fillIn(component, { title: "Full name", value: "Erik David" })
      fillIn(component, { title: "Address line 1", value: "" })
      component.update()

      const [addressInput, cityInput] = ["Address line 1", "City"].map(label =>
        component
          .find(Input)
          .filterWhere(wrapper => wrapper.props().title === label)
      )

      expect(addressInput.props().error).toBeTruthy()
      expect(cityInput.props().error).toBeFalsy()
    })

    it("after submit, shows all validation errors on inputs that have been touched", () => {
      const component = getWrapper(testProps)
      ;(component.find(Checkbox).props() as CheckboxProps).onSelect(false)

      fillIn(component, { title: "Full name", value: "Erik David" })

      component.find("Button").simulate("click")

      const cityInput = component
        .find(Input)
        .filterWhere(wrapper => wrapper.props().title === "City")

      expect(cityInput.props().error).toBeTruthy()
    })

    it("does not submit an empty form with billing address exposed", () => {
      const paymentRoute = getWrapper(testProps)
      ;(paymentRoute.find(Checkbox).props() as CheckboxProps).onSelect(false)

      paymentRoute.find(ContinueButton).simulate("click")
      expect(commitMutation).not.toBeCalled()
    })

    it("does not submit the mutation with an incomplete form with billing address exposed", () => {
      const paymentRoute = getWrapper(testProps)
      ;(paymentRoute.find(Checkbox).props() as CheckboxProps).onSelect(false)
      fillIn(paymentRoute, { title: "Full name", value: "Air Bud" })
      paymentRoute.find(ContinueButton).simulate("click")
      expect(commitMutation).not.toBeCalled()
    })

    it("allows a missing postal code if the selected country is not US or Canada", () => {
      const paymentRoute = getWrapper(testProps)

      const address = {
        name: "Erik David",
        addressLine1: "401 Broadway",
        addressLine2: "",
        city: "New York",
        region: "NY",
        postalCode: "",
        phoneNumber: "5555937743",
        country: "AQ",
      }
      fillAddressForm(paymentRoute, address)
      paymentRoute.find("Button").simulate("click")
      expect(stripeMock.createToken).toBeCalled()
    })

    it("allows a missing state/province if the selected country is not US or Canada", () => {
      const paymentRoute = getWrapper(testProps)
      const address = {
        name: "Erik David",
        addressLine1: "401 Broadway",
        addressLine2: "",
        city: "New York",
        region: "",
        postalCode: "7Z",
        phoneNumber: "5555937743",
        country: "AQ",
      }
      fillAddressForm(paymentRoute, address)

      paymentRoute.find("Button").simulate("click")
      expect(stripeMock.createToken).toBeCalled()
    })
  })

  describe("Offer-mode orders", () => {
    it("shows an active offer stepper if the order is an Offer Order", () => {
      const offerOrder = {
        ...BuyOrderWithShippingDetails,
        ...UntouchedOfferOrder,
      }
      const component = getWrapper({ ...testProps, order: offerOrder })
      expect(component.find(ActiveTabContainer).text()).toEqual("Payment")
      expect(component.find(Stepper).props().currentStepIndex).toEqual(2)
      expect(component.find(CheckMarkWrapper).length).toEqual(2)
    })
  })
})
