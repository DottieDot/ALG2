import { forwardRef, memo } from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'
import { IconDefinition } from '@fortawesome/free-solid-svg-icons'

export interface FontAwesomeIconProps {
  icon     : IconDefinition
  fontSize?: SvgIconProps['fontSize']
}

const FontAwesomeIcon = forwardRef<SVGSVGElement, FontAwesomeIconProps>(
  (props, ref) => {
    const { icon, fontSize } = props

    const {
      icon: [width, height, , , svgPathData],
    } = icon

    return (
      <SvgIcon ref={ref} fontSize={fontSize} viewBox={`0 0 ${width} ${height}`}>
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          /**
           * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
           * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
           * of a duotone icon. 40% is the default opacity.
           *
           * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
           */
          svgPathData.map((d: string, i: number) => (
            <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
          ))
        )}
      </SvgIcon>
    )
  }
)
export default memo(FontAwesomeIcon)
