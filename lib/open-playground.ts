'use client'

/** Preload HTML code into the editor and navigate to the playground page. */
export function openHtmlPlayground(htmlCode: string, fromPath?: string) {
	try {
		if (typeof window !== 'undefined') {
			sessionStorage.setItem('tryit_code', htmlCode || '')
			const from = fromPath || window.location.pathname || '/'
			sessionStorage.setItem('tryit_from', from)
			window.location.href = '/editor'
		}
	} catch {
		// noop
	}
} 