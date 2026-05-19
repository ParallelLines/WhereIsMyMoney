import { useEffect } from 'react'

// Improved version of https://usehooks.com/useOnClickOutside/
// This code is from https://codesandbox.io/p/sandbox/react-colorful-popover-opmco?file=%2Fsrc%2FuseClickOutside.js%3A1%2C1-33%2C2
export default function useClickOutside(ref, handler) {
    useEffect(() => {
        let startedInside = false
        let startedWhenMounted = false

        const listener = (event) => {
            // Do nothing if `mousedown` or `touchstart` started inside ref element
            if (startedInside || !startedWhenMounted) return
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) return

            handler(event)
        }

        const validateEventStart = (event) => {
            startedWhenMounted = ref.current
            startedInside = ref.current && ref.current.contains(event.target)
        }

        document.addEventListener('mousedown', validateEventStart)
        document.addEventListener('touchstart', validateEventStart)
        document.addEventListener('click', listener)

        return () => {
            document.removeEventListener('mousedown', validateEventStart)
            document.removeEventListener('touchstart', validateEventStart)
            document.removeEventListener('click', listener)
        }
    }, [ref, handler])
}