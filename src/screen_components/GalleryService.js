import React, {useEffect, useState, useRef} from 'react';
import {Snackbar} from 'react-native-paper';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';

const {width} = Dimensions.get('window');
const SPACING = 20;
const THUMB_SIZE = 80;

export default function GalleryService({collection}) {
  const carouselRef = useRef(null);
  const flatListRef = useRef(null);

  const [indexSelected, setIndexSelected] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const handleOnLoad = () => {
    setIsLoading(false);
  };

  const onSelect = indexSelect => {
    setIndexSelected(indexSelect);

    flatListRef?.current?.scrollToOffset({
      offset: indexSelect * THUMB_SIZE,
      animated: true,
    });
  };

  const onTouchThumbnail = touched => {
    if (touched === indexSelected) {
      return;
    }

    carouselRef?.current?.snapToItem(touched);
  };

  const [imagesData, setImagesData] = useState([]);

  const [imgLoad, setImgLoad] = useState(true);

  const [visible, setVisible] = useState(false);

  const [snackbarsmsg, setsnakbarmsg] = useState('');

  const onToggleSnackBar = () => setVisible(!visible);

  const onDismissSnackBar = () => setVisible(false);

  const timeoutPromise = timeout => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timed out after ${timeout} ms`));
      }, timeout);
    });
  };
  const fetchWithTimeout = (url, options, timeout = 5000) => {
    return Promise.race([fetch(url, options), timeoutPromise(timeout)]);
  };
  useEffect(() => {
    setIsLoading(true);
    setIndexSelected(0);
    onSelect(0);
    carouselRef?.current?.snapToItem(0);
    const getImages = async () => {
      try {
        const params = {
          collection: collection,
        };

        const queryString = Object.keys(params)
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
          )
          .join('&');

        const response = await fetchWithTimeout(
          `http://192.168.8.102:5000/images?${queryString}`,
          {
            method: 'GET',
          },
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.length > 0) {
          setImgLoad(false);
          setImagesData(data);
        } else {
          setsnakbarmsg(' No Images data found');
          setVisible(true);
        }
      } catch (error) {
        setsnakbarmsg(' Errror', error.toString());
        setVisible(true);
        console.error(error.toString());
      }
    };
    getImages();
  }, [collection]);

  var SnackbarCom = (
    <Snackbar
      visible={visible}
      onDismiss={onDismissSnackBar}
      action={{
        label: 'Undo',
        onPress: () => {
          // Do something
        },
      }}>
      {snackbarsmsg}
    </Snackbar>
  );

  var content = (
    <>
      {SnackbarCom}
      {imgLoad ? (
        <ActivityIndicator
          size="large"
          style={{
            transform: [
              {
                scaleX: 3,
              },
              {
                scaleY: 3,
              },
            ],
          }}
          color="#00ff00"
        />
      ) : (
        <>
          <View style={styles.carouselview}>
            {imagesData.length > 0 && (
              <Carousel
                ref={carouselRef}
                layout="default"
                data={imagesData}
                sliderWidth={width}
                itemWidth={width}
                onSnapToItem={index => onSelect(index)}
                renderItem={({item, index}) => (
                  <View key={index}>
                    {isLoading && (
                      <ActivityIndicator
                        size="large"
                        style={{
                          transform: [
                            {
                              scaleX: 1.5,
                            },
                            {
                              scaleY: 1.5,
                            },
                          ],
                        }}
                        color="#00ff00"
                      />
                    )}
                    <Image
                      key={index}
                      style={styles.carouselviewimage}
                      resizeMode="contain"
                      source={{
                        uri: `data:image/jpeg;base64,${item.image}`,
                      }}
                      onLoad={handleOnLoad}
                    />
                  </View>
                )}
              />
            )}
            <Pagination
              inactiveDotColor="gray"
              dotColor={'green'}
              activeDotIndex={indexSelected}
              dotsLength={imagesData.length}
              animatedDuration={150}
              inactiveDotScale={1}
            />
          </View>
          <View style={styles.paginationIndexView}>
            <Text style={styles.paginationIndexText}>
              {indexSelected + 1}/{imagesData.length}
            </Text>
          </View>
          <FlatList
            ref={flatListRef}
            horizontal={true}
            data={imagesData}
            style={styles.flatlistview}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: SPACING,
            }}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() => onTouchThumbnail(index)}
                activeOpacity={0.9}>
                <View key={index}>
                  {isLoading && (
                    <ActivityIndicator
                      size="large"
                      style={{
                        transform: [
                          {
                            scaleX: 1,
                          },
                          {
                            scaleY: 1,
                          },
                        ],
                      }}
                      color="#00ff00"
                    />
                  )}
                  <Image
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                      width: THUMB_SIZE,
                      height: THUMB_SIZE,
                      marginRight: SPACING,
                      borderRadius: 16,
                      borderWidth: index === indexSelected ? 6 : 0.75,
                      borderColor: index === indexSelected ? 'green' : 'white',
                    }}
                    source={{
                      uri: `data:image/jpeg;base64,${item.image}`,
                    }}
                    onLoad={handleOnLoad}
                  />
                </View>
              </TouchableOpacity>
            )}
          />
        </>
      )}
    </>
  );

  return content;
}

const styles = StyleSheet.create({
  carouselview: {
    flex: 1 / 2,
    marginTop: 20,
  },
  carouselviewimage: {
    width: '100%',
    height: '100%',
  },

  paginationIndexView: {
    marginTop: 10,
    paddingHorizontal: 32,
    alignSelf: 'flex-end',
  },
  paginationIndexText: {
    color: 'black',
    fontSize: 15,
  },

  flatlistview: {
    position: 'absolute',
    bottom: 50,
  },
});
