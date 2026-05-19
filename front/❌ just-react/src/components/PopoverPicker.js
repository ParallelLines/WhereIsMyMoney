import { useState } from 'react'
import VanishingBlock from './VanishingBlock'
import ColorMarker from './ColorMarker'
import { HexColorPicker } from 'react-colorful'

export default function PopoverPicker({ color, onChange }) {
    const [pickerOpen, setPickerOpen] = useState(false)

    return (
        <>
            <ColorMarker color={color} name="choose color" onClick={() => setPickerOpen(true)} />
            {pickerOpen && <VanishingBlock containerClassName="color-picker" onClose={() => setPickerOpen(false)}>
                <HexColorPicker color={color} onChange={onChange} />
            </VanishingBlock>}
        </>
    )
}