import React, {
  createContext,
  FC,
  useCallback,
  useContext,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Dialog, Paragraph, Portal } from 'react-native-paper';

export type PromptOptions = {
  title?: string;
  message?: string;
  actions: { text: string; onPress?: () => void }[];
  vertical?: boolean;
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
  const [ctx, setCtx] = useState<PromptContextType>(initialPrompt);

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

  const isVertical = ctx.prompt.vertical;

  const actions = ctx.prompt.actions.map((action, i) => {
    const onPress = () => {
      hide();
      action.onPress && action.onPress();
    };
    const btn = (
      <Button key={i} onPress={onPress}>
        {action.text}
      </Button>
    );

    if (isVertical) {
      return (
        <View key={i} style={styles.row}>
          <View style={styles.flex} />
          {btn}
        </View>
      );
    } else {
      return btn;
    }
  });

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
          <Dialog.Actions style={ctx.prompt.vertical && styles.vertical}>
            {ctx.prompt.vertical ? <View>{actions}</View> : actions}
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PromptContext.Provider>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  row: { flexDirection: 'row' },
  vertical: { justifyContent: 'flex-end' },
});
