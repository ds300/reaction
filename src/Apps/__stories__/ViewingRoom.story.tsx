import { MockRouter } from "DevTools/MockRouter"
import React from "react"
import { storiesOf } from "storybook/storiesOf"
import { routes as viewingRoomRoutes } from "Apps/ViewingRoom/routes"

storiesOf("Apps/ViewingRoom", module).add("Viewing Room", () => {
  return (
    <MockRouter
      routes={viewingRoomRoutes}
      initialRoute="/viewing-room/invoicing-demo-partner-christine-sun-kim"
    />
  )
})
