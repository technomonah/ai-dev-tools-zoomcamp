import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface MonthSummary {
  id: number;
  year: number;
  month: number;
  savings_percent: number;
}

export interface Month extends MonthSummary {
  created_at: string;
  incomes: Income[];
  fixed_expenses: FixedExpense[];
  daily_expenses: DailyExpense[];
}

export interface Income {
  id: number;
  month_id: number;
  name: string;
  amount: number;
}

export interface FixedExpense {
  id: number;
  month_id: number;
  name: string;
  amount: number;
}

export interface DailyExpense {
  id: number;
  month_id: number;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export interface Balance {
  total_income: number;
  total_fixed_expenses: number;
  savings_amount: number;
  available_budget: number;
  days_in_month: number;
  daily_budget: number;
  current_day: number;
  expected_spent: number;
  actual_spent: number;
  balance: number;
  daily_balances: DailyBalance[];
}

export interface DailyBalance {
  day: number;
  date: string;
  spent: number;
  cumulative_spent: number;
  expected_spent: number;
  balance: number;
}

export interface CategoryAnalytics {
  name: string;
  amount: number;
  percentage: number;
}

export interface Analytics {
  categories: CategoryAnalytics[];
  total: number;
}

export const getMonths = () => api.get<MonthSummary[]>('/api/months');
export const createMonth = (year: number, month: number) =>
  api.post<MonthSummary>('/api/months', { year, month, savings_percent: 0 });
export const getMonth = (id: number) => api.get<Month>(`/api/months/${id}`);
export const updateMonth = (id: number, data: { savings_percent?: number }) =>
  api.put<MonthSummary>(`/api/months/${id}`, data);

export const getIncomes = (monthId: number) =>
  api.get<Income[]>(`/api/months/${monthId}/incomes`);
export const createIncome = (monthId: number, name: string, amount: number) =>
  api.post<Income>(`/api/months/${monthId}/incomes`, { name, amount });
export const updateIncome = (id: number, data: { name?: string; amount?: number }) =>
  api.put<Income>(`/api/incomes/${id}`, data);
export const deleteIncome = (id: number) => api.delete(`/api/incomes/${id}`);

export const getFixedExpenses = (monthId: number) =>
  api.get<FixedExpense[]>(`/api/months/${monthId}/fixed-expenses`);
export const createFixedExpense = (monthId: number, name: string, amount: number) =>
  api.post<FixedExpense>(`/api/months/${monthId}/fixed-expenses`, { name, amount });
export const updateFixedExpense = (id: number, data: { name?: string; amount?: number }) =>
  api.put<FixedExpense>(`/api/fixed-expenses/${id}`, data);
export const deleteFixedExpense = (id: number) => api.delete(`/api/fixed-expenses/${id}`);

export const getDailyExpenses = (monthId: number) =>
  api.get<DailyExpense[]>(`/api/months/${monthId}/daily-expenses`);
export const createDailyExpense = (
  monthId: number,
  date: string,
  description: string,
  amount: number,
  category?: string
) =>
  api.post<DailyExpense>(`/api/months/${monthId}/daily-expenses`, {
    date,
    description,
    amount,
    category,
  });
export const updateDailyExpense = (
  id: number,
  data: { date?: string; description?: string; amount?: number; category?: string }
) => api.put<DailyExpense>(`/api/daily-expenses/${id}`, data);
export const deleteDailyExpense = (id: number) => api.delete(`/api/daily-expenses/${id}`);

export const getBalance = (monthId: number) =>
  api.get<Balance>(`/api/months/${monthId}/balance`);
export const getAnalytics = (monthId: number) =>
  api.get<Analytics>(`/api/months/${monthId}/analytics`);

export const detectCategory = (description: string) =>
  api.post<{ category: string }>('/api/detect-category', { description });

export interface Category {
  id: number;
  name: string;
  keywords: string;
}

export const getCategories = () =>
  api.get<Category[]>('/api/categories');

export default api;
