import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Headline, List, Subheading } from 'react-native-paper';
import { Icon, Icons } from '../../components';
import { Gift } from '../../utils';
import GiftListItem from './GiftListItem';

type Props = {
  myGifts: Gift[];
  followingGifts: Gift[];
  onNavigateToGift: (giftId: string) => void;
  onDeleteGift: (gift: Gift) => void;
};

const ViewAll = ({
  myGifts,
  followingGifts,
  onNavigateToGift,
  onDeleteGift,
}: Props) => {
  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Created by me</List.Subheader>
        {myGifts.length === 0 ? (
          <View style={styles.center}>
            <Headline style={styles.center}>Create something exciting</Headline>
            <Subheading style={styles.center}>
              Tap the <Icon name={Icons.PLUS} /> below.
            </Subheading>
          </View>
        ) : (
          myGifts.map((gift) => {
            return (
              <GiftListItem
                key={gift.id}
                gift={gift}
                onPress={() => onNavigateToGift(gift.id)}
                onDelete={() => onDeleteGift(gift)}
                mine
              />
            );
          })
        )}
      </List.Section>
      {followingGifts.length > 0 ? (
        <List.Section>
          <List.Subheader>Shared with me</List.Subheader>
          {followingGifts.map((gift) => {
            return (
              <GiftListItem
                key={gift.id}
                gift={gift}
                onPress={() => onNavigateToGift(gift.id)}
              />
            );
          })}
        </List.Section>
      ) : undefined}
    </View>
  );
};

export default memo<Props>(ViewAll);

const styles = StyleSheet.create({
  center: { textAlign: 'center', justifyContent: 'center' },
  container: { flex: 1 },
});
