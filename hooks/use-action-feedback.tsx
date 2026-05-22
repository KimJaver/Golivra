import { useCallback, useState } from 'react';

import {
  ActionFeedbackOverlay,
  type ActionFeedbackVariant,
} from '@/components/action-feedback-overlay';

type FeedbackConfig = {
  variant: ActionFeedbackVariant;
  title: string;
  message?: string;
  primaryLabel?: string;
  onPrimary?: () => void;
};

const initial = {
  visible: false,
  variant: 'success' as ActionFeedbackVariant,
  title: '',
  message: undefined as string | undefined,
  primaryLabel: 'OK',
  onPrimary: undefined as (() => void) | undefined,
};

export function useActionFeedback() {
  const [state, setState] = useState(initial);

  const dismiss = useCallback(() => {
    setState((s) => ({ ...s, visible: false }));
  }, []);

  const open = useCallback((config: FeedbackConfig) => {
    setState({
      visible: true,
      variant: config.variant,
      title: config.title,
      message: config.message,
      primaryLabel: config.primaryLabel ?? 'OK',
      onPrimary: config.onPrimary,
    });
  }, []);

  const showSuccess = useCallback(
    (title: string, message?: string, options?: { primaryLabel?: string; onPrimary?: () => void }) => {
      open({
        variant: 'success',
        title,
        message,
        primaryLabel: options?.primaryLabel,
        onPrimary: options?.onPrimary,
      });
    },
    [open],
  );

  const showError = useCallback(
    (title: string, message?: string) => {
      open({ variant: 'error', title, message: message ?? 'Réessayez dans un instant.' });
    },
    [open],
  );

  const showInfo = useCallback(
    (title: string, message?: string) => {
      open({ variant: 'info', title, message });
    },
    [open],
  );

  const FeedbackOverlay = useCallback(
    () => (
      <ActionFeedbackOverlay
        visible={state.visible}
        variant={state.variant}
        title={state.title}
        message={state.message}
        primaryLabel={state.primaryLabel}
        onPrimary={state.onPrimary}
        onDismiss={dismiss}
      />
    ),
    [state, dismiss],
  );

  return { showSuccess, showError, showInfo, dismiss, FeedbackOverlay };
}
