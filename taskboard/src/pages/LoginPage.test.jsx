import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginPage from './LoginPage';

describe('LoginPage', () => {
  it('renders labelled email and password fields', () => {
    render(<LoginPage onLogin={vi.fn()} />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('submits the typed email and password to onLogin', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn().mockResolvedValue(undefined);
    render(<LoginPage onLogin={onLogin} />);

    await user.type(screen.getByLabelText('Email'), 'nimali@nsbm.lk');
    await user.type(screen.getByLabelText('Password'), 'pass123');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(onLogin).toHaveBeenCalledWith('nimali@nsbm.lk', 'pass123');
  });

  it('shows an error message when login fails', async () => {
    const user = userEvent.setup();
    const onLogin = vi.fn().mockRejectedValue(new Error('Invalid email or password'));
    render(<LoginPage onLogin={onLogin} />);

    await user.type(screen.getByLabelText('Email'), 'nimali@nsbm.lk');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(await screen.findByText('Invalid email or password')).toBeInTheDocument();
  });

  it('calls onNavigateToRegister when the register link is clicked', async () => {
    const user = userEvent.setup();
    const onNavigateToRegister = vi.fn();
    render(<LoginPage onLogin={vi.fn()} onNavigateToRegister={onNavigateToRegister} />);

    await user.click(screen.getByText('Register here'));

    expect(onNavigateToRegister).toHaveBeenCalledTimes(1);
  });
});
