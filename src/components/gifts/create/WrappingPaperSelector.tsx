import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Card, Modal, Portal } from 'react-native-paper';
import { StandardWrap } from '../../../utils';
import { ImageCarousel } from './ImageCarousel';

type Props = {
  selected?: StandardWrap;
  onSelect: (w: StandardWrap) => void;
  visible: boolean;
  onRequestClose: () => void;
};

const images = Object.values(StandardWrap);

export const WrappingPaperSelector = ({
  selected,
  visible,
  onSelect,
  onRequestClose,
}: Props) => {
  const [tmpSelected, setTmpSelected] = useState<number>(-1);
  useEffect(() => {
    if (visible) {
      setTmpSelected(images.indexOf(selected));
    }
  }, [selected, visible]);

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onRequestClose}>
        <Card>
          <Card.Title title="Choose your wrapping paper" />
          <Card.Content style={styles.noPadding}>
            <ImageCarousel
              images={images}
              onSelect={setTmpSelected}
              selected={tmpSelected}
            />
          </Card.Content>
          <Card.Actions style={styles.right}>
            <Button onPress={onRequestClose}>Cancel</Button>
            <Button
              disabled={tmpSelected < 0}
              onPress={() => {
                onSelect(images[tmpSelected]);
                onRequestClose();
              }}
            >
              Ok
            </Button>
          </Card.Actions>
        </Card>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  noPadding: { paddingHorizontal: 0 },
  right: { justifyContent: 'flex-end' },
});
