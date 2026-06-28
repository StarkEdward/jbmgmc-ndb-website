import { Metadata } from 'next'
import SecurityClient from './security-client'

export const metadata: Metadata = {
  title: 'Admin Security Settings - JBMGMC',
  description: 'Manage admin credentials and security settings',
}

export default function SecurityPage() {
  return <SecurityClient />
}
