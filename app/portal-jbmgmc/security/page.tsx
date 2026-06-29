import { Metadata } from 'next'
import SecurityClient from './security-client'

export const metadata: Metadata = {
  title: 'System Settings - JBMGMC',
  description: 'Manage admin credentials, storage, and backup settings',
}

export default function SecurityPage() {
  return <SecurityClient />
}
