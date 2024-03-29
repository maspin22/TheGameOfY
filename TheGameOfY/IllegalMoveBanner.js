import React, { useEffect, useState } from 'react';
import { View, Text, Animated } from 'react-native';

const IllegalMoveBanner = ({ showBanner }) => {
  const [bannerHeight] = useState(new Animated.Value(0));

  useEffect(() => {
    if (showBanner) {
      // Show the banner
      Animated.timing(bannerHeight, {
        toValue: 30,
        duration: 300,
        useNativeDriver: false,
      }).start();

      // Hide the banner after 3 seconds
      const timer = setTimeout(() => {
        Animated.timing(bannerHeight, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showBanner, bannerHeight]);

  return (
    <Animated.View
      style={{
        height: bannerHeight,
        backgroundColor: 'red',
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        opacity: showBanner ? 1 : 0, // Ensure the component is not clickable when not visible
      }}
    >
      <Text style={{ textAlign: 'center', color: 'white' }}>Illegal Move</Text>
    </Animated.View>
  );
};

export default IllegalMoveBanner;
