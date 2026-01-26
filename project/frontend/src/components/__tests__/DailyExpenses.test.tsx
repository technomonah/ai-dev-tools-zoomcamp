import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DailyExpenses from '../DailyExpenses'
import type { DailyExpense } from '../../api/client'

// Mock the API client
vi.mock('../../api/client', () => ({
  createDailyExpense: vi.fn(),
  updateDailyExpense: vi.fn(),
  deleteDailyExpense: vi.fn(),
  detectCategory: vi.fn(),
  getCategories: vi.fn().mockResolvedValue({
    data: [
      { id: 1, name: 'Groceries', keywords: '' },
      { id: 2, name: 'Transport', keywords: '' },
      { id: 3, name: 'Other', keywords: '' },
    ]
  }),
}))

const mockExpenses: DailyExpense[] = [
  {
    id: 1,
    month_id: 1,
    date: '2024-07-15',
    description: 'Lunch at cafe',
    amount: 500,
    category: 'Groceries'
  },
  {
    id: 2,
    month_id: 1,
    date: '2024-07-15',
    description: 'Bus ticket',
    amount: 50,
    category: 'Transport'
  },
  {
    id: 3,
    month_id: 1,
    date: '2024-07-14',
    description: 'Coffee',
    amount: 150,
    category: 'Other'
  }
]

describe('DailyExpenses', () => {
  const mockOnUpdate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the component with title', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)
    expect(screen.getByText('Daily Expenses')).toBeInTheDocument()
  })

  it('renders all expenses', async () => {
    render(<DailyExpenses monthId={1} expenses={mockExpenses} onUpdate={mockOnUpdate} />)

    await waitFor(() => {
      expect(screen.getByText('Lunch at cafe')).toBeInTheDocument()
      expect(screen.getByText('Bus ticket')).toBeInTheDocument()
      expect(screen.getByText('Coffee')).toBeInTheDocument()
    })
  })

  it('displays expense amounts correctly', async () => {
    render(<DailyExpenses monthId={1} expenses={mockExpenses} onUpdate={mockOnUpdate} />)

    await waitFor(() => {
      expect(screen.getByText('500')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('150')).toBeInTheDocument()
    })
  })

  it('displays expense categories', async () => {
    render(<DailyExpenses monthId={1} expenses={mockExpenses} onUpdate={mockOnUpdate} />)

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument()
      expect(screen.getByText('Transport')).toBeInTheDocument()
      expect(screen.getByText('Other')).toBeInTheDocument()
    })
  })

  it('groups expenses by date', async () => {
    render(<DailyExpenses monthId={1} expenses={mockExpenses} onUpdate={mockOnUpdate} />)

    // Should have two date groups (Jul 15 and Jul 14)
    await waitFor(() => {
      const dateHeaders = screen.getAllByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/)
      expect(dateHeaders.length).toBe(2)
    })
  })

  it('renders input fields for adding new expense', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Description')).toBeInTheDocument()
      expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument()
    })
  })

  it('has a date input field', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)

    await waitFor(() => {
      const dateInputs = document.querySelectorAll('input[type="date"]')
      expect(dateInputs.length).toBeGreaterThan(0)
    })
  })

  it('has a category select dropdown', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)

    await waitFor(() => {
      const select = screen.getByRole('combobox')
      expect(select).toBeInTheDocument()
    })
  })

  it('allows entering description', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)

    const input = screen.getByPlaceholderText('Description')
    fireEvent.change(input, { target: { value: 'New expense' } })

    expect(input).toHaveValue('New expense')
  })

  it('allows entering amount', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)

    const input = screen.getByPlaceholderText('Amount')
    fireEvent.change(input, { target: { value: '100' } })

    expect(input).toHaveValue(100)
  })

  it('renders empty state when no expenses', async () => {
    render(<DailyExpenses monthId={1} expenses={[]} onUpdate={mockOnUpdate} />)

    // Should only show the add form, no expense items
    await waitFor(() => {
      expect(screen.queryByText('Lunch at cafe')).not.toBeInTheDocument()
    })
  })

  it('renders edit and delete buttons on hover (visible in DOM)', async () => {
    render(<DailyExpenses monthId={1} expenses={mockExpenses} onUpdate={mockOnUpdate} />)

    // The buttons exist in DOM but may be hidden with opacity
    await waitFor(() => {
      const buttons = document.querySelectorAll('button')
      expect(buttons.length).toBeGreaterThan(1)
    })
  })
})
