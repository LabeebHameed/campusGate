import React, { useEffect, useState } from "react";
import { Tabs } from "expo-router";
import { AntDesign, FontAwesome, Octicons, Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { interpolate, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import Animated from "react-native-reanimated";

const Layout = () => {

    const [dimensions, setDimensions] = useState({width: 20, height: 100});

    const buttonWidth = dimensions.width / 4 //Here 4 is the number of buttons in the tab bar

    const scale = useSharedValue(0);
    var isFocused = false

    useEffect(() => {
        scale.value = withSpring(
            typeof isFocused === "boolean" ? (isFocused ? 1 : 0) : isFocused,
            { duration: 350 }
        );
    }, [scale, isFocused]);


    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarStyle: {
                        flexDirection: "row",
                        alignItems: "stretch",
                        justifyContent: "space-around",
                        backgroundColor: "#212529",
                        position: "absolute",
                        bottom: 32,
                        height: 72,
                        marginHorizontal: 40,
                        paddingTop: 16,
                        borderRadius: 40,
                        borderWidth: 1,
                        borderTopWidth: 1,
                        borderColor: "#333",
                        borderTopColor: "#333",
                    },
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarInactiveTintColor: "#999",
                    tabBarActiveTintColor: "#f5f6f7",
                }}
            >
                <Tabs.Screen
                    name="index"
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            isFocused = focused,
                            color = focused ? "#212729" : "#f5f6f7",
                            <View
                                className=" w-16 p-3 items-center h-16 justify-center rounded-full"
                                style={[{ backgroundColor: focused ? "#f5f6f7" : "#212529" }]}>
                                
                                <Octicons name="home" size={24} color={color} />
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="favorites"
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            isFocused = focused,
                            color = focused ? "#212729" : "#f5f6f7",
                            <View
                                className=" w-16 p-3 items-center h-16 justify-center rounded-full"
                                style={{ backgroundColor: focused ? "#f5f6f7" : "#212529", }}>
                                <Octicons name="heart" size={24} color={color} />
                            </View>
                        ),
                    }}
                />

                <Tabs.Screen
                    name="applications"
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            isFocused = focused,
                            color = focused ? "#212729" : "#f5f6f7",
                            <View
                                className=" w-16 p-3 items-center h-16 justify-center rounded-full"
                                style={{ backgroundColor: focused ? "#f5f6f7" : "#212529", }}>
                                <Octicons name="note" size={24} color={color} />
                            </View>
                        ),
                    }}
                />
                <Tabs.Screen
                    name="refferal"
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            isFocused = focused,
                            color = focused ? "#212729" : "#f5f6f7",
                            <View
                                className=" w-16 p-3 items-center h-16 justify-center rounded-full"
                                style={{ backgroundColor: focused ? "#f5f6f7" : "#212529", }}>
                                <Octicons name="apps" size={24} color={color} />
                            </View>
                        ),
                    }}
                />
            </Tabs>
            <StatusBar style="light" />
        </>
    );
};

export default Layout;