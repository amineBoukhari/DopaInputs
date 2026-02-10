// Footer Navigation
// ------------
// Description: The footer navigation data for the website.
export interface Logo {
	src: string
	alt: string
	text: string
}

export interface FooterAbout {
	title: string
	aboutText: string
	logo: Logo
}

export interface SubCategory {
	subCategory: string
	subCategoryLink: string
}

export interface FooterColumn {
	category: string
	subCategories: SubCategory[]
}

export interface SubFooter {
	copywriteText: string
}

export interface FooterData {
	footerAbout: FooterAbout
	footerColumns: FooterColumn[]
	subFooter: SubFooter
}

export const footerNavigationData: FooterData = {
	footerAbout: {
		title: 'Vitanorix.',
		aboutText:
			" Que vous n'ayez pas encore de site ou que votre site actuel peine à générer des projets, nous transformons votre présence en ligne en un véritable générateur de clients.",
		logo: {
			src: '/logo.png',
			alt: 'Vitanorix',
			text: 'Vitanorix.'
		}
	},
	footerColumns: [
		{
			category: 'Produit',
			subCategories: [
				{
					subCategory: 'Services',
					subCategoryLink: '/services'
				},
				{
					subCategory: 'FAQ',
					subCategoryLink: '/faq'
				},
				{
					subCategory: 'Tarifs',
					subCategoryLink: '/pricing'
				},
			
				{
					subCategory: 'Conditions',
					subCategoryLink: '/terms'
				}
			]
		},
		{
			category: 'À propos',
			subCategories: [
				{
					subCategory: 'À propos',
					subCategoryLink: '/about-us'
				},
				{
					subCategory: 'Blogs',
					subCategoryLink: '/blog'
				}
			]
		},
		{
			category: 'Nous contacter',
			subCategories: [
				{
					subCategory: 'Contact',
					subCategoryLink: '/contact'
				},
			]
		}
	],
	subFooter: {
		copywriteText: '© Vitanorix 2024.'
	}
}
