// Config
// ------------
// Description: The configuration file for the website.

export interface Logo {
	src: string
	alt: string
}

export type Mode = 'auto' | 'light' | 'dark'

export interface Config {
	siteTitle: string
	siteDescription: string
	ogImage: string
	logo: Logo
	canonical: boolean
	noindex: boolean
	mode: Mode
	scrollAnimations: boolean
}

export const configData: Config = {
	siteTitle: 'Vitanorix. Starter Kit Tailwind CSS pour Astro',
	siteDescription:
		'Vitanorix est une agence de design et de développement spécialisée dans la création de sites web esthétiques et fonctionnels.',
	ogImage: '/og.jpg',
	logo: {
		src: '/logo.png',
		alt: 'Vitanorix logo'
	},
	canonical: true,
	noindex: false,
	mode: 'auto',
	scrollAnimations: true
}
