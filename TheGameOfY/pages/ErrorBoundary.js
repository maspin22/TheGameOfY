import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        console.error("Error caught by Error Boundary: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
          return (
            <div>
              <h2>Something went wrong.</h2>
              {this.state.error && <p>{this.state.error.toString()}</p>}
              {this.state.errorInfo && (
                <details style={{ whiteSpace: 'pre-wrap' }}>
                  {this.state.errorInfo.componentStack}
                </details>
              )}
            </div>
          );
        }
        return this.props.children;
      }
}


export default ErrorBoundary;