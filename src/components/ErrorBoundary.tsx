import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'motion/react';
import { Icon } from './Icon';
import { handleError, ErrorSeverity } from '../lib/error-handler';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    handleError(error, {
      severity: ErrorSeverity.CRITICAL,
      context: { errorInfo },
      showToast: false, // Don't show toast for full-screen error
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/'; // Hard reset to clear state
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-8 border border-outline-variant/10"
          >
            <div className="w-24 h-24 bg-error-container/10 text-error-container rounded-full flex items-center justify-center mx-auto">
              <Icon name="error_outline" className="text-5xl" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-3xl font-extrabold text-on-surface tracking-tight">Something went wrong</h1>
              <p className="text-on-surface-variant font-body leading-relaxed">
                We encountered an unexpected error. Don't worry, our technical team has been notified.
              </p>
            </div>

            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <div className="p-4 bg-surface-container-low rounded-xl text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-error-container break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="pt-4 flex flex-col gap-3">
              <button 
                onClick={this.handleReset}
                className="w-full bg-primary-container text-on-primary py-4 rounded-2xl font-bold shadow-lg hover:bg-primary transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Icon name="refresh" />
                Reload Application
              </button>
              <button 
                onClick={() => window.history.back()}
                className="w-full py-3 text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Go Back
              </button>
            </div>
            
            <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-widest font-black">
              Error ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </p>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}
