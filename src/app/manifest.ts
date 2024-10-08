import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Reservation Book',
        short_name: 'ResBook',
        description: 'Reservation management app for small-to-medium gastronomy businesses',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#000000',
        icons: [
            {
                src: '/assets/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png'
            },
            {
                src: '/assets/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png'
            }
        ]
    }
}