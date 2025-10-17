import React from 'react'
import { PaymentDashboard } from '@/components/payments/PaymentDashboard'

interface PaymentsPanelProps {
  businessId: string
}

export function PaymentsPanel({ businessId }: PaymentsPanelProps) {
  return <PaymentDashboard businessId={businessId} />
}