import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

type PromptOptions = {
  title?: string;
  message?: string;
  actions: { text: string; onPress?: () => void }[];
};

type PromptContextType = {
  hide: () => void;
  show: (options: PromptOptions) => void;
  prompt: PromptOptions;
  visible: boolean;
};

const initialPrompt: PromptContextType = {
  hide: () => null,
  show: () => null,
  prompt: { actions: [] },
  visible: false,
};

export const PromptContext = createContext(initialPrompt);

export const usePrompt = () => {
  const ctx = useContext(PromptContext);
  const prompt = useCallback(
    (options: PromptOptions) => {
      ctx.show(options);
    },
    [ctx]
  );

  return prompt;
};

export const PromptProvider: FC = ({ children }) => {
  const [ctx, setCtx] = useState<PromptContextType>({
    visible: false,
    hide: () => null,
    show: () => null,
    prompt: { actions: [] },
  });

  const show = useCallback((options: PromptOptions) => {
    setCtx((old) => ({
      ...old,
      visible: true,
      prompt: options,
    }));
  }, []);

  const hide = useCallback(() => {
    setCtx({ ...ctx, visible: false });
  }, [ctx]);

  return (
    <PromptContext.Provider
      value={{
        hide,
        show,
        prompt: { actions: [] },
        visible: false,
      }}
    >
      {children}
      <Portal>
        <Dialog visible={ctx.visible} onDismiss={hide}>
          {ctx.prompt.title ? (
            <Dialog.Title>{ctx.prompt.title}</Dialog.Title>
          ) : null}
          {ctx.prompt.message ? (
            <Dialog.Content>
              <Paragraph>{ctx.prompt.message}</Paragraph>
            </Dialog.Content>
          ) : null}
          <Dialog.Actions>
            {ctx.prompt.actions.map((action, i) => {
              const onPress = () => {
                action.onPress && action.onPress();
                hide();
              };
              return (
                <Button key={i} onPress={onPress}>
                  {action.text}
                </Button>
              );
            })}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PromptContext.Provider>
  );
};
