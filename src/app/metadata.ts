import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Reservation Book",
    description: "Reservation management app for small-to-medium gastronomy businesses",
    manifest: '/manifest.json',
    themeColor: '#000000',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Reservation Book',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
    },
};