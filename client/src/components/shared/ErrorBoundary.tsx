import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
    // TODO: Send to observability service (Datadog)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-danger-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-danger-500" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            Something went wrong
          </h2>
          <p className="text-sm text-[var(--text-secondary)] mb-6 max-w-md">
            An unexpected error occurred. Please try again or contact support if the problem persists.
          </p>
          <Button onClick={this.handleRetry} variant="secondary" size="md">
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 p-4 bg-surface-900 text-red-400 rounded-lg text-xs text-left max-w-lg overflow-auto">
              {this.state.error.message}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
