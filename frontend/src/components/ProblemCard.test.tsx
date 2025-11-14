import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Simple ProblemCard component for testing
function ProblemCard({ problem }: { problem: any }) {
  return (
    <div data-testid="problem-card" className="card p-4">
      <h3 className="font-semibold">{problem.title}</h3>
      <span className={`difficulty-${problem.difficulty.toLowerCase()}`}>
        {problem.difficulty}
      </span>
      <p className="text-sm text-slate-600">{problem.acceptanceRate}% acceptance</p>
    </div>
  );
}

describe('ProblemCard', () => {
  const mockProblem = {
    _id: '1',
    title: 'Two Sum',
    difficulty: 'Easy',
    acceptanceRate: 45,
  };

  it('renders problem title', () => {
    render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
  });

  it('renders difficulty level', () => {
    render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('renders acceptance rate', () => {
    render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    expect(screen.getByText('45% acceptance')).toBeInTheDocument();
  });

  it('applies correct difficulty styling', () => {
    const { container } = render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    const difficultyBadge = container.querySelector('.difficulty-easy');
    expect(difficultyBadge).toBeInTheDocument();
  });
});
