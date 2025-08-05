import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button, Card } from '../ui';

interface YorkieErrorBoundaryProps {
  children: React.ReactNode;
}

interface YorkieErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class YorkieErrorBoundary extends React.Component<YorkieErrorBoundaryProps, YorkieErrorBoundaryState> {
  constructor(props: YorkieErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): YorkieErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Yorkie Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <div className="p-6">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Connection Error
              </h2>
              <p className="text-gray-400 mb-4">
                Failed to connect to Yorkie. Please check your API key and internet connection.
              </p>
              <div className="text-xs text-gray-500 mb-6 p-3 bg-gray-800 rounded border">
                {this.state.error?.message || 'Unknown error'}
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={this.handleReset}
                  className="w-full"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.reload()}
                  className="w-full"
                >
                  Reload Page
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
