// ScrollingLogos.js
import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

const ScrollingLogos = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const brands = [
    {
      name: "LiNing",
      logo: "https://seeklogo.com/images/L/li-ning-logo-0C85E3899B-seeklogo.com.png",
    },
    {
      name: "Nike",
      logo: "https://logos-world.net/wp-content/uploads/2020/04/Nike-Logo.png",
    },
    {
      name: "Puma",
      logo: "https://www.step.org.uk/app/uploads/2018/07/Puma-logo-PNG-Transparent-Background.png",
    },
    {
      name: "Yonex",
      logo: "https://download.logo.wine/logo/Yonex/Yonex-Logo.wine.png",
    },
  ];

  const totalWidth = brands.length * 100;

  useEffect(() => {
    const scrollAnimation = Animated.loop(
      Animated.timing(scrollX, {
        toValue: -totalWidth,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    scrollAnimation.start();

    return () => scrollAnimation.stop();
  }, [scrollX, totalWidth]);

  return (
    <View style={styles.logoContainer}>
      <Animated.View
        style={[
          styles.logoWrapper,
          {
            transform: [{ translateX: scrollX }],
            width: totalWidth * 2,
          },
        ]}
      >
        {[...brands, ...brands].map((brand, index) => (
          <View key={index} style={styles.logo}>
            <Image
              source={{ uri: brand.logo }}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    height: 60,
    overflow: "hidden",
    marginVertical: 20,
  },
  logoWrapper: {
    flexDirection: "row",
  },
  logo: {
    width: 100,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  brandLogo: {
    width: 80,
    height: 40,
  },
});

export default ScrollingLogos;
