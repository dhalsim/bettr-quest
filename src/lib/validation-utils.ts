import { NavigateFunction } from 'react-router-dom';
import type { ToasterToast } from '@/hooks/use-toast';

interface ValidationOptions {
  toast?: (props: Omit<ToasterToast, 'id'>) => void;
  navigate?: NavigateFunction;
  log?: boolean;
  navigateOnError?: string;
}

export function validateLocationState<T>(
  decodeStateFunction: (input: unknown) => T,
  input: unknown,
  options: ValidationOptions = {}
): T | null {
  const {
    toast,
    navigate,
    log: showLog = true,
    navigateOnError = '/explore'
  } = options;

  try {
    return decodeStateFunction(input);
  } catch (error) {
    if (showLog) {
      console.error('Validation error:', error);
    }

    if (toast) {
      toast({
        title: "Invalid State",
        description: "The page state is invalid. Redirecting to explore page.",
        variant: "destructive",
      });
    }

    if (navigate && navigateOnError) {
      navigate(navigateOnError);
    }

    return null;
  }
} 