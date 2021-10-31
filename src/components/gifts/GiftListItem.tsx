import React, { ComponentProps, memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { Gift } from '../../utils';
import { Icons } from '../Icon';

type Props = {
  gift: Gift;
  mine?: boolean;
  onPress: () => void;
  onDelete?: () => void;
};

const GiftListItem = ({ gift, onPress, mine, onDelete }: Props) => {
  const right: ComponentProps<typeof List.Item>['right'] = (props) => (
    <List.Icon icon={Icons.CHEVRON_RIGHT} {...props} />
  );

  return (
    <List.Item
      title={gift.title}
      description={gift.message}
      descriptionNumberOfLines={1}
      onPress={onPress}
      right={
        mine
          ? (props) => (
              <View style={styles.row}>
                <Pressable onPress={onDelete}>
                  <List.Icon icon={Icons.TRASH} {...props} />
                </Pressable>
                {right(props)}
              </View>
            )
          : right
      }
    />
  );
};

export default memo<Props>(GiftListItem);

const styles = StyleSheet.create({ row: { flexDirection: 'row' } });
