import { useEffect } from 'react'

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