import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { DefaultTheme, Snackbar, useTheme } from 'react-native-paper';

type ToastOptions = {
  text?: string;
  color?: keyof typeof DefaultTheme['colors'];
  duration?: number;
};

type ToastContextType = {
  hide: () => void;
  show: (options: Partial<ToastOptions>) => void;
  toast: ToastOptions;
  visible: boolean;
};

const defaultOptions: ToastOptions = {
  color: 'primary',
  duration: 2500,
};

const initialToast: ToastContextType = {
  hide: () => null,
  show: () => null,
  toast: {},
  visible: false,
};

export const ToastContext = createContext(initialToast);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  const toast = useCallback(
    (options: ToastOptions) => {
      console.log('Sending message', options);
      ctx.show(options);
    },
    [ctx]
  );

  return toast;
};

export const ToastProvider: FC = ({ children }) => {
  const [ctx, setCtx] = useState<ToastContextType>({
    visible: false,
    hide: () => null,
    show: () => null,
    toast: {},
  });

  const show = useCallback((options: ToastOptions) => {
    setCtx((old) => ({
      ...old,
      visible: true,
      toast: { ...defaultOptions, ...options },
    }));
  }, []);

  const hide = useCallback(() => {
    setCtx({ ...ctx, visible: false });
  }, [ctx]);

  const theme = useTheme();
  const style = {
    backgroundColor: theme.colors[ctx.toast.color],
  };

  return (
    <ToastContext.Provider
      value={{
        hide,
        show,
        toast: {},
        visible: false,
      }}
    >
      {children}
      <Snackbar
        visible={ctx.visible}
        onDismiss={hide}
        duration={ctx.toast.duration || defaultOptions.duration}
        style={style}
      >
        {ctx.toast.text}
      </Snackbar>
    </ToastContext.Provider>
  );
};
