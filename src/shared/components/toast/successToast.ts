import { toast } from 'sonner';

/**
 * Show a success toast notification.
 * @param formName - The name of the form being updated (e.g., "Profile", "Settings")
 */
export function showSuccessToast(formName: string) {
  toast.success(`Successfully Updating ${formName}`);
}

