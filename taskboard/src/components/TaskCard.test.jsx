import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from './TaskCard';

vi.mock('../db/taskSync', () => ({
  resolveConflict: vi.fn().mockResolvedValue(undefined),
}));

const baseTask = {
  id: '1',
  title: 'Write tests',
  description: 'Cover the move endpoint',
  assignee: 'Nimali',
  assigneeEmail: 'nimali@nsbm.lk',
  priority: 'high',
  date: '2026-09-10',
};

describe('TaskCard', () => {
  it('renders the task title, assignee, and priority', () => {
    render(<TaskCard task={baseTask} onDelete={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Write tests' })).toBeInTheDocument();
    expect(screen.getByText('Nimali')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('calls onDelete with the task id when the delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    render(<TaskCard task={baseTask} onDelete={onDelete} />);

    await user.click(screen.getByRole('button', { name: '×' }));

    expect(onDelete).toHaveBeenCalledWith('1');
  });

  it('shows the move button only when the current user is the assignee', () => {
    const onMove = vi.fn();
    const { rerender } = render(
      <TaskCard
        task={baseTask}
        onDelete={vi.fn()}
        onMove={onMove}
        moveLabel="Move to Doing"
        showMove
        currentUser={{ email: 'nimali@nsbm.lk' }}
      />
    );

    expect(screen.getByRole('button', { name: 'Move to Doing' })).toBeInTheDocument();

    rerender(
      <TaskCard
        task={baseTask}
        onDelete={vi.fn()}
        onMove={onMove}
        showMove={false}
        currentUser={{ email: 'someone-else@nsbm.lk' }}
      />
    );

    expect(screen.queryByRole('button', { name: 'Move to Doing' })).not.toBeInTheDocument();
    expect(screen.getByText('Only assigned employee can move this task')).toBeInTheDocument();
  });

  it('shows a conflict banner when the task has an unresolved conflict', () => {
    const conflictTask = {
      ...baseTask,
      status: 'doing',
      conflict: true,
      conflictStatus: 'done',
    };

    render(<TaskCard task={conflictTask} onDelete={vi.fn()} />);

    expect(screen.getByText(/Someone else updated this task/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Okay, got it' })).toBeInTheDocument();
  });
});
