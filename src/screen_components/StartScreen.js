import React from 'react';
import Background from '../basic_components/Background';
import Header from '../basic_components/Header';
import Button from '../basic_components/Button';
import Paragraph from '../basic_components/Paragraph';

export default function StartScreen({navigation}) {
  var content = (
    <Background>
      <Header> TASK 2 </Header>
      <Paragraph>Open Gallery to Explore Collections</Paragraph>
      <Button
        mode="elevated"
        onPress={() => navigation.navigate('GalleryScreen')}>
        Open Gallery
      </Button>
      <Paragraph> © 2023 Sandaru Cooray (MYS) All rights reserved. </Paragraph>
    </Background>
  );

  return content;
}
