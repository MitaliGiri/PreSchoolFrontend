import React from "react";
import { Button, View, Text, StyleSheet, TouchableOpacity, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

import HomeScreen from "./src/screens/HomeScreen";
import ChatScreen from "./src/screens/ChatScreen";
import VideoScreen from "./src/screens/VideoScreen";

const Stack = createNativeStackNavigator();

// Enhanced Role Selection Screen
const RoleSelectionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <LinearGradient
        colors={['#ffffff', '#f8fbff', '#f0f7ff']}
        style={styles.gradientBackground}
      >
        <View style={styles.roleContainer}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoEmoji}>🎓</Text>
            </View>
            <Text style={styles.title}>Welcome to PreSchool</Text>
            <Text style={styles.subtitle}>Choose your teaching experience to get started</Text>
          </View>

          {/* Cards Section */}
          <View style={styles.cardsContainer}>
            <TouchableOpacity 
              style={styles.roleCard}
              onPress={() => {}}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#fafbff']}
                style={styles.cardGradient}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIcon}>
                    <Text style={styles.cardEmoji}>👨‍🏫</Text>
                  </View>
                  <Text style={styles.cardTitle}>Experienced Teacher</Text>
                  <Text style={styles.cardDescription}>
                    For educators with extensive classroom experience
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.roleCard}
              onPress={() => navigation.navigate("Home")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#ffffff', '#f8fbff']}
                style={[styles.cardGradient, styles.governmentCardGradient]}
              >
                <View style={styles.cardContent}>
                  <View style={styles.cardIcon}>
                    <Text style={styles.cardEmoji}>🏛️</Text>
                  </View>
                  <Text style={styles.cardTitle}>Government Teacher</Text>
                  <Text style={styles.cardDescription}>
                    For educators in government institutions
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              AI-powered learning assistant for modern education
            </Text>
            <View style={styles.betaBadgeContainer}>
              <Text style={styles.betaBadge}>BETA</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="RoleSelection">
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Chat" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Video" component={VideoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gradientBackground: {
    flex: 1,
  },
  roleContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#0f67fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logoEmoji: {
    fontSize: 36,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0f67fd',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  roleCard: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 24,
    minHeight: 140,
  },
  governmentCardGradient: {
    borderWidth: 2,
    borderColor: '#e8f2ff',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(15, 103, 253, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardEmoji: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f67fd',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 12,
  },
  betaBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  betaBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f67fd',
    backgroundColor: '#e6f3ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
});