import { useCallback, useRef } from 'react'

/**
 * Hook die scroll-reveal animatie toevoegt aan elementen met de "reveal" klasse.
 * Gebruikt een callback ref zodat het correct werkt met voorwaardelijk gerenderde
 * content (bijv. componenten die null teruggeven tijdens het laden en daarna
 * renderen na een async fetch).
 *
 * Een MutationObserver vangt dynamisch toegevoegde .reveal elementen op (async content).
 */
const useScrollReveal = (options = {}) => {
    const cleanupRef = useRef(null)

    const ref = useCallback((container) => {
        // Ruim vorige observers op als de node verandert
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

        // Eerste scan
        container.querySelectorAll('.reveal').forEach(observe)

        // Let op nieuwe .reveal elementen die aan de DOM worden toegevoegd (async content)
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
