import { useCallback, useEffect, useState } from 'react'

// Improved version of https://usehooks.com/useOnClickOutside/
// This code is from https://codesandbox.io/p/sandbox/react-colorful-popover-opmco?file=%2Fsrc%2FuseClickOutside.js%3A1%2C1-33%2C2
export function useClickOutside(ref, handler) {
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

export function useClickOnBg(backgroundRef, blockRef, handler) {
    useEffect(() => {
        let startedInside = false
        let startedWhenMounted = false
        let startedOnBg = false
        let startedOnBgWhenMounted = false

        const listener = (event) => {
            // Do nothing if `mousedown` or `touchstart` started inside ref element
            if (startedInside || !startedWhenMounted || !startedOnBgWhenMounted) return
            // Do nothing if clicking ref's element or descendent elements
            if (!blockRef.current || blockRef.current.contains(event.target)) return
            if (startedOnBg) handler(event)
        }

        const validateEventStart = (event) => {
            startedWhenMounted = blockRef.current
            startedInside = blockRef.current && blockRef.current.contains(event.target)
            startedOnBgWhenMounted = backgroundRef.current
            startedOnBg = backgroundRef.current && backgroundRef.current.contains(event.target) && !blockRef.current.contains(event.target)
        }

        document.addEventListener('mousedown', validateEventStart)
        document.addEventListener('touchstart', validateEventStart)
        document.addEventListener('click', listener)

        return () => {
            document.removeEventListener('mousedown', validateEventStart)
            document.removeEventListener('touchstart', validateEventStart)
            document.removeEventListener('click', listener)
        }
    }, [backgroundRef, blockRef, handler])
}

export function useInfiniteScroll(scrollContainer, infiniteQuery) {
    useEffect(() => {
        const container = scrollContainer.current
        if (!container) return
        const handleScroll = () => {
            // const container = scrollContainer.current
            if (!container || infiniteQuery.isFetching || !infiniteQuery.hasNextPage) return
            // scrollTop: The vertical scroll position(how far the user has scrolled from the top).
            // clientHeight: The visible height of the scroll container.
            // scrollHeight: The total height of the content inside the container, including scrolled - out content.
            const { scrollTop, scrollHeight, clientHeight } = container
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                infiniteQuery.fetchNextPage()
            }
        }
        container.addEventListener("scroll", handleScroll)
        return () => container.removeEventListener("scroll", handleScroll)
    }, [infiniteQuery, scrollContainer])
}

export function useCalculatePositionWithRef(elementRef) {
    const [position, setPosition] = useState(null)

    const updatePosition = useCallback(() => {
        if (elementRef?.current) {
            const rect = elementRef.current.getBoundingClientRect()
            setPosition({ x: rect.left, y: rect.bottom + 4 })
        }
    }, [elementRef])

    useEffect(() => {
        if (!elementRef?.current) return

        updatePosition()

        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition)

        return () => {
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition)
        }
    }, [elementRef, updatePosition])

    return position
}

export function useCalculatePosition() {
    const [position, setPosition] = useState(null)
    const [element, setElement] = useState(null)

    const ref = useCallback(node => {
        if (node) {
            setElement(node)
            const rect = node.getBoundingClientRect()
            setPosition({ x: rect.left, y: rect.top })
        }
    }, [])

    const updatePosition = useCallback(() => {
        if (element) {
            const rect = element.getBoundingClientRect()
            setPosition({ x: rect.left, y: rect.top })
        }
    }, [element])

    useEffect(() => {
        if (!element) return

        window.addEventListener('resize', updatePosition)
        window.addEventListener('scroll', updatePosition)

        return () => {
            window.removeEventListener('resize', updatePosition)
            window.removeEventListener('scroll', updatePosition)
        }
    }, [element, updatePosition])

    return { ref, position }
}