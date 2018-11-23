import React from "react"

import {
  Flex,
  FlexProps,
  Sans,
  Serif,
  StackableBorderBox,
} from "@artsy/palette"
import styled from "styled-components"
import LockIcon from "Styleguide/Elements/icons/LockIcon"

export interface StepSummaryItemProps extends FlexProps {
  title?: React.ReactNode
  onChange?: () => void
  locked?: boolean
}

const LockIconPositioner = styled(Flex)`
  position: absolute;
  top: 0;
  right: 0;
`

export const StepSummaryItem: React.SFC<StepSummaryItemProps> = ({
  title,
  onChange,
  children,
  locked,
  ...others
}) => {
  const showHeading = title || onChange
  return (
    <StackableBorderBox
      flexDirection="column"
      {...others}
      style={{ position: "relative" }}
    >
      {showHeading && (
        <Flex justifyContent="space-between" alignItems="baseline" mb={1}>
          {title && (
            <Serif size={["2", "3t"]} weight="semibold" color="black100">
              {title}
            </Serif>
          )}
          {!locked &&
            onChange && (
              <Sans size="2">
                <a className="colorLink" onClick={onChange}>
                  Change
                </a>
              </Sans>
            )}
          {locked && <LockIcon />}
        </Flex>
      )}
      {!showHeading &&
        locked && (
          <LockIconPositioner p={[2, 3]}>
            <LockIcon />
          </LockIconPositioner>
        )}
      {children}
    </StackableBorderBox>
  )
}
