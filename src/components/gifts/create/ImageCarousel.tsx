import React from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { Surface, useTheme } from 'react-native-paper';
import { getImageFromWrap, StandardWrap } from '../../../utils';

type Props = {
  images: StandardWrap[];
  selected: number;
  onSelect: (n: number) => void;
};

const { width, height } = Dimensions.get('window');
let ITEM_WIDTH = Math.round(width * 0.7);
let ITEM_HEIGHT = ITEM_WIDTH; //Math.round((ITEM_WIDTH * 3) / 4);

if (ITEM_HEIGHT > height * 0.7) {
  ITEM_HEIGHT = Math.round(height * 0.7);
  ITEM_WIDTH = ITEM_HEIGHT; //Math.round((ITEM_HEIGHT * 4) / 3);
}
const marginHorizontal = 10;
const imageWidth = ITEM_WIDTH - marginHorizontal * 2;

export const ImageCarousel = ({ images, selected, onSelect }: Props) => {
  const borderColor = useTheme().colors.primary;
  const renderItem = ({ item, index }) => {
    const isSelected = index === selected;
    const selectedStyle =
      isSelected && StyleSheet.flatten([styles.selectedImage, { borderColor }]);

    return (
      <Pressable onPress={() => onSelect(index === selected ? -1 : index)}>
        <Surface style={styles.imageContainer}>
          <Image
            source={getImageFromWrap(item)}
            resizeMode="cover"
            style={[styles.image, selectedStyle]}
            width={imageWidth}
            height={ITEM_HEIGHT}
          />
        </Surface>
      </Pressable>
    );
  };

  return (
    <View>
      <FlatList
        horizontal
        pagingEnabled
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        snapToAlignment="center"
        snapToOffsets={images.map((_, i) => i * ITEM_WIDTH)}
        decelerationRate={0}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  image: { width: imageWidth, height: ITEM_HEIGHT },
  imageContainer: {
    width: imageWidth,
    height: ITEM_HEIGHT,
    marginHorizontal,
  },
  selectedImage: { borderWidth: 8 },
});
