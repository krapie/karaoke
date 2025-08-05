import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  loading?: boolean;
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: 'text-red-400',
          confirmButton: 'danger' as const,
        };
      case 'warning':
        return {
          icon: 'text-yellow-400',
          confirmButton: 'secondary' as const,
        };
      case 'info':
        return {
          icon: 'text-blue-400',
          confirmButton: 'primary' as const,
        };
      default:
        return {
          icon: 'text-red-400',
          confirmButton: 'danger' as const,
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {/* Icon and Title */}
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 mr-3 ${styles.icon}`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-white">
              {title}
            </h3>
          </div>
          
          {/* Message */}
          <p className="text-gray-300 mb-6">
            {message}
          </p>
          
          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              variant={styles.confirmButton}
              onClick={onConfirm}
              loading={loading}
              disabled={loading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
