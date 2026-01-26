import { Link } from 'react-router-dom';
import { Coins, TrendingUp, PiggyBank, Tags } from 'lucide-react';
import LeprecoinLogo from '../components/LeprecoinLogo';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="flex items-center justify-center gap-4 mb-6">
          <LeprecoinLogo size={64} />
          <h1 className="text-5xl font-bold text-primary">Leprecoin</h1>
        </div>

        <p className="text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
          Smart personal finance tracker that helps you manage your daily budget,
          track expenses, and achieve your savings goals.
        </p>

        <div className="flex items-center justify-center gap-4 mb-16">
          <Link
            to="/login"
            className="px-6 py-3 bg-white border-2 border-primary text-primary rounded-button font-medium hover:bg-gray-50 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-primary text-white rounded-button font-medium hover:bg-primary-dark transition-colors"
          >
            Get Started
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="card p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Coins className="w-6 h-6 text-income" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Daily Budget</h3>
            <p className="text-text-secondary">
              Automatically calculates your daily spending limit based on income,
              fixed expenses, and savings goals.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <PiggyBank className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Savings Goals</h3>
            <p className="text-text-secondary">
              Set a percentage of your income to save each month and watch your
              savings grow over time.
            </p>
          </div>

          <div className="card p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Tags className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart Categories</h3>
            <p className="text-text-secondary">
              Automatically categorizes your expenses based on keywords and
              shows spending analytics by category.
            </p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="mt-16 card p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <TrendingUp className="w-6 h-6 text-income" />
            <h2 className="text-2xl font-semibold">Track Your Progress</h2>
          </div>
          <p className="text-text-secondary max-w-xl mx-auto">
            See how your spending compares to your budget each day. Stay on track
            with visual indicators showing whether you're under or over budget.
          </p>
        </div>
      </div>
    </div>
  );
}
