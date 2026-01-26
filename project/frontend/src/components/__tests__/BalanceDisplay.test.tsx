import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import BalanceDisplay from '../BalanceDisplay'
import type { Balance } from '../../api/client'

const mockBalance: Balance = {
  total_income: 100000,
  total_fixed_expenses: 30000,
  savings_amount: 10000,
  available_budget: 60000,
  days_in_month: 30,
  daily_budget: 2000,
  current_day: 15,
  expected_spent: 30000,
  actual_spent: 25000,
  balance: 5000,
  daily_balances: []
}

const mockNegativeBalance: Balance = {
  ...mockBalance,
  actual_spent: 35000,
  balance: -5000
}

describe('BalanceDisplay', () => {
  it('renders nothing when balance is null', () => {
    const { container } = render(<BalanceDisplay balance={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('displays income correctly', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('100,000')).toBeInTheDocument()
  })

  it('displays fixed expenses correctly', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('30,000')).toBeInTheDocument()
  })

  it('displays savings amount correctly', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('10,000')).toBeInTheDocument()
  })

  it('displays available budget correctly', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('60,000')).toBeInTheDocument()
  })

  it('displays daily budget correctly', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('2,000')).toBeInTheDocument()
  })

  it('displays current day and days in month', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('15 / 30')).toBeInTheDocument()
  })

  it('displays positive balance with plus sign', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('+5,000')).toBeInTheDocument()
  })

  it('displays negative balance without plus sign', () => {
    render(<BalanceDisplay balance={mockNegativeBalance} />)
    expect(screen.getByText('-5,000')).toBeInTheDocument()
  })

  it('applies green styling for positive balance', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    const balanceElement = screen.getByText('+5,000')
    expect(balanceElement).toHaveClass('text-income')
  })

  it('applies red styling for negative balance', () => {
    render(<BalanceDisplay balance={mockNegativeBalance} />)
    const balanceElement = screen.getByText('-5,000')
    expect(balanceElement).toHaveClass('text-expense')
  })

  it('renders all main sections', () => {
    render(<BalanceDisplay balance={mockBalance} />)
    expect(screen.getByText('Income')).toBeInTheDocument()
    expect(screen.getByText('Fixed Expenses')).toBeInTheDocument()
    expect(screen.getByText('Savings')).toBeInTheDocument()
    expect(screen.getByText('Available Budget')).toBeInTheDocument()
    expect(screen.getByText('Daily budget')).toBeInTheDocument()
    expect(screen.getByText('Balance')).toBeInTheDocument()
  })
})
