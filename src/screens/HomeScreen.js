import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  Animated,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get("window");

// Ads images (Add our company ads here)
const ads = [
  require("../../assets/ads/ad1.png"),
  require("../../assets/ads/ad2.png"),
  require("../../assets/ads/ad3.png"),
];

const HomeScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-280)).current; //drawer width = 280

  // Auto scroll effect
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Open drawer
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  // Close drawer
  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -280, //  match drawer width
      duration: 300,
      useNativeDriver: true,
    }).start(() => setDrawerOpen(false));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header*/}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>PreSchool Learning</Text>
            <Text style={styles.betaBadge}>BETA</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.headerSubtitle}>AI Learning Platform • Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.burger} onPress={openDrawer}>
          <Text style={styles.burgerText}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Gradient Background */}
      <LinearGradient
        colors={['#ffffff', '#f8fbff', '#f0f7ff']}
        style={styles.gradientBackground}
      >
        {/* Ads Carousel */}
        <View style={styles.carouselContainer}>
          <View style={styles.carouselWrapper}>
            <FlatList
              data={ads}
              ref={flatListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.adImageContainer}>
                  <Image source={item} style={styles.adImage} />
                </View>
              )}
            />
            
            {/* Carousel indicators */}
            <View style={styles.indicatorContainer}>
              {ads.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.indicator,
                    { backgroundColor: currentIndex === index ? '#0f67fd' : 'rgba(255, 255, 255, 0.5)' }
                  ]}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeIcon}>
              <Text style={styles.welcomeEmoji}>🎓</Text>
            </View>
            <Text style={styles.welcomeTitle}>Welcome to PreSchool Learning</Text>
            <Text style={styles.welcomeSubtitle}>
              Start your child's learning journey with our AI-powered educational assistant
            </Text>
          </View>
        </View>

        {/* Chat Button Section  */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => navigation.navigate("Chat")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0f67fd', '#0d5beb']}
              style={styles.chatButtonGradient}
            >
              <View style={styles.chatButtonContent}>
                <View style={styles.chatIcon}>
                  <Text style={styles.chatIconText}>💬</Text>
                </View>
                <View style={styles.chatTextContainer}>
                  <Text style={styles.chatButtonText}>Start Learning Chat</Text>
                  <Text style={styles.chatButtonSubtext}>Ask questions & learn together</Text>
                </View>
                <Text style={styles.chatButtonArrow}>→</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.hintText}>
            🌟 Ask questions about math, science, reading and more!
          </Text>
        </View>
      </LinearGradient>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <TouchableOpacity style={styles.overlay} onPress={closeDrawer} activeOpacity={1} />
      )}

      {/* Drawer */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.drawerHeader}>
          <View style={styles.drawerProfile}>
            <Text style={styles.drawerProfileText}>👤</Text>
          </View>
          <View>
            <Text style={styles.drawerWelcome}>Welcome Back!</Text>
            <Text style={styles.drawerUsername}>Young Learner</Text>
          </View>
        </View>

        <View style={styles.drawerDivider} />

        <TouchableOpacity style={styles.drawerItem} onPress={() => {}}>
          <View style={styles.drawerIconContainer}>
            <Text style={styles.drawerIcon}>👤</Text>
          </View>
          <Text style={styles.drawerText}>My Profile</Text>
          <Text style={styles.drawerArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => {}}>
          <View style={styles.drawerIconContainer}>
            <Text style={styles.drawerIcon}>📚</Text>
          </View>
          <Text style={styles.drawerText}>Learning Resources</Text>
          <Text style={styles.drawerArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.drawerItem} onPress={() => {}}>
          <View style={styles.drawerIconContainer}>
            <Text style={styles.drawerIcon}>🛠</Text>
          </View>
          <Text style={styles.drawerText}>Help & Support</Text>
          <Text style={styles.drawerArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#ffffff' 
  },
  
  //Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#f8fbff',
  },
  backButtonText: {
    fontSize: 20,
    color: '#0f67fd',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0f67fd',
    marginRight: 8,
  },
  betaBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0f67fd',
    backgroundColor: '#e6f3ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  burger: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
  },
  burgerText: {
    fontSize: 20,
    color: '#0f67fd',
    fontWeight: '600',
  },

  // Enhanced gradient background
  gradientBackground: {
    flex: 1,
  },

  // Enhanced Carousel
  carouselContainer: { 
    marginTop: 20,
    paddingHorizontal: 16,
  },
  carouselWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  adImageContainer: {
    width: width - 32,
    height: 200,
    backgroundColor: '#ffffff',
  },
  adImage: { 
    width: width - 32, 
    height: 200, 
    resizeMode: "cover",
  },
  indicatorContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },

  // Welcome Section
  welcomeSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcomeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(15, 103, 253, 0.1)',
  },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeEmoji: {
    fontSize: 28,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0f67fd',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 22,
  },

  //Button Section
  buttonSection: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  chatButton: {
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#0f67fd',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 16,
  },
  chatButtonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
  },
  chatButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  chatIconText: {
    fontSize: 16,
  },
  chatTextContainer: {
    alignItems: 'center',
  },
  chatButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: '700',
    marginBottom: 2,
  },
  chatButtonSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  chatButtonArrow: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  hintText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },

  //Drawer
  overlay: { 
    position: "absolute", 
    top: 0, 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: "rgba(0,0,0,0.4)" 
  },
  drawer: { 
    position: "absolute", 
    top: 0, 
    bottom: 0, 
    left: 0, 
    width: 280, 
    backgroundColor: "white", 
    elevation: 10, 
    shadowColor: "#000", 
    shadowOpacity: 0.3, 
    shadowRadius: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  drawerProfile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0f67fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  drawerProfileText: {
    fontSize: 20,
    color: 'white',
  },
  drawerWelcome: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  drawerUsername: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  drawerItem: { 
    flexDirection: "row", 
    alignItems: "center", 
    paddingVertical: 16, 
    paddingHorizontal: 20, 
    borderBottomColor: "#f8f9fa", 
    borderBottomWidth: 1 
  },
  drawerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fbff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  drawerIcon: {
    fontSize: 18,
  },
  drawerText: { 
    fontSize: 16, 
    color: "#374151",
    fontWeight: '500',
    flex: 1,
  },
  drawerArrow: {
    fontSize: 16,
    color: '#9ca3af',
  },
});