import { useCallback, useRef } from 'react'

/**
 * Hook that adds scroll-reveal animation to elements with the "reveal" class.
 * Uses a callback ref so it works correctly with conditionally rendered content
 * (e.g. components that return null while loading, then render after async fetch).
 *
 * A MutationObserver picks up dynamically added .reveal elements (async content).
 */
const useScrollReveal = (options = {}) => {
    const cleanupRef = useRef(null)

    const ref = useCallback((container) => {
        // Cleanup previous observers if the node changes
        if (cleanupRef.current) {
            cleanupRef.current()
            cleanupRef.current = null
        }

        if (!container) return

        const threshold = options.threshold ?? 0.1
        const rootMargin = options.rootMargin ?? '0px 0px -40px 0px'

        const intersectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed')
                        intersectionObserver.unobserve(entry.target)
                    }
                })
            },
            { threshold, rootMargin }
        )

        const observe = (el) => {
            if (!el.classList.contains('revealed')) {
                intersectionObserver.observe(el)
            }
        }

        // Initial scan
        container.querySelectorAll('.reveal').forEach(observe)

        // Watch for new .reveal elements added to the DOM (async content)
        const mutationObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType !== Node.ELEMENT_NODE) continue
                    if (node.classList?.contains('reveal')) observe(node)
                    node.querySelectorAll?.('.reveal').forEach(observe)
                }
            }
        })

        mutationObserver.observe(container, { childList: true, subtree: true })

        cleanupRef.current = () => {
            intersectionObserver.disconnect()
            mutationObserver.disconnect()
        }
    }, [options.threshold, options.rootMargin])

    return ref
}

export default useScrollReveal
