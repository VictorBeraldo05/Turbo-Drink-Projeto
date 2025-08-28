import React from "react";
import { Image } from "react-native";

export default function BrandMark({ size = 40 }) {
  return (
    <Image
      source={require("../assets/TurboDrink.png")}
      style={{ width: size, height: size, resizeMode: 'cover', borderRadius: 40 }}
    />
  );
}