import { useRef, useState } from 'react'
import VanishingBlock from './VanishingBlock'
import ColorMarker from './ColorMarker'
import { HexColorPicker } from 'react-colorful'

export default function PopoverPicker({ color, onChange }) {
    const [pickerOpen, setPickerOpen] = useState(false)
    const ref = useRef(null)

    return (
        <>
            <ColorMarker color={color} name='choose color' onClick={() => setPickerOpen(true)} ref={ref} />
            {pickerOpen && <VanishingBlock
                anchorRef={ref}
                containerClassName='color-picker'
                onClose={() => setPickerOpen(false)}
            >
                <HexColorPicker color={color} onChange={onChange} />
            </VanishingBlock>}
        </>
    )
}