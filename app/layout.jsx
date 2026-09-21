/* eslint-disable react-refresh/only-export-components */
import './globals.css'

export const metadata = {
  title: {
    default: 'PetCare — Pet Management',
    template: '%s | PetCare',
  },
  description: 'A calm, practical workspace for every pet-care responsibility.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
