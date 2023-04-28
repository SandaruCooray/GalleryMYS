import React, {useState, useEffect, useRef} from 'react';
import {StyleSheet, View, Text} from 'react-native';

import Background from '../basic_components/Background';
import Button from '../basic_components/Button';
import BackButton from '../basic_components/BackButton';
import Header from '../basic_components/Header';
import Paragraph from '../basic_components/Paragraph';

import GalleryService from './GalleryService';

export default function GalleryScreen({navigation}) {
  const [galleryName, setGalleryName] = useState('Animals Collection');
  const [collindex, setCollindex] = useState(0);
  var content = (
    <Background>
      <BackButton goBack={navigation.goBack} />
      <Header> Simple Gallery App </Header>
      <Paragraph>
        Task 2. GalleryScreen component use GalleryService component to render
        different collections
      </Paragraph>
      <View style={styles.collections}>
        <Button
          style={styles.collectionsbutton}
          mode="outlined"
          onPress={() => {
            setCollindex(0);
            setGalleryName('Animals Collection');
          }}>
          animals
        </Button>
        <Button
          style={styles.collectionsbutton}
          mode="outlined"
          onPress={() => {
            setCollindex(1);
            setGalleryName('Cars Collection');
          }}>
          cars
        </Button>
        <Button
          style={styles.collectionsbutton}
          mode="outlined"
          onPress={() => {
            setCollindex(2);
            setGalleryName('Nature Collection');
          }}>
          nature
        </Button>
      </View>
      <Text style={styles.collectionsText}> {galleryName} </Text>
      {collindex === 0 && <GalleryService collection={'animals'} />}
      {collindex === 1 && <GalleryService collection={'cars'} />}
      {collindex === 2 && <GalleryService collection={'nature'} />}
    </Background>
  );

  return content;
}

const styles = StyleSheet.create({
  collections: {
    flexDirection: 'row',
    marginTop: 4,
  },
  collectionsbutton: {
    width: 'auto',
    marginVertical: 10,
    paddingVertical: 2,
    margin: 10,
  },

  collectionsText: {
    color: 'black',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 5,
  },
});
