import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { List } from 'react-native-paper';
import { Gift } from '../../../utils';
import { Icons } from '../../Icon';

type Props = {
  gift: Gift;
  mine?: boolean;
  onPress: () => void;
  onDelete?: () => void;
};

const GiftListItem = ({ gift, onPress, mine, onDelete }: Props) => {
  return (
    <List.Item
      title={gift.title}
      description={gift.message}
      descriptionNumberOfLines={1}
      onPress={onPress}
      right={(props) => (
        <View style={styles.row}>
          <Pressable onPress={onDelete}>
            <List.Icon icon={mine ? Icons.TRASH : Icons.UNFOLLOW} {...props} />
          </Pressable>
          <List.Icon icon={Icons.CHEVRON_RIGHT} {...props} />
        </View>
      )}
    />
  );
};

export default memo<Props>(GiftListItem);

const styles = StyleSheet.create({ row: { flexDirection: 'row' } });
