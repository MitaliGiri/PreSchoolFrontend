import React, { useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  useWindowDimensions,
  StatusBar,
} from "react-native";
import Video from "react-native-video";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';

export default function VideoScreen({ route, navigation }) {
  const { videoUrl } = route.params || {};
  const videoRef = useRef(null);
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  // (Backend): videoUrl will be passed here is a full HTTP/HTTPS link
  // Example: "http://<server-address>/uploads/lesson1.mp4"
  const fixedUrl = useMemo(() => {
    if (!videoUrl) return videoUrl;
    if (Platform.OS === "android" && videoUrl.includes("localhost")) {
      return videoUrl.replace("localhost", "10.0.2.2");
    }
    return videoUrl;
  }, [videoUrl]);

  // Extracting file name from URL for header display
  const fileName = useMemo(() => {
    try {
      if (!videoUrl) return "";
      const parts = videoUrl.split("/").filter(Boolean);
      return parts[parts.length - 1];
    } catch {
      return "";
    }
  }, [videoUrl]);

  function handleBack() {
    navigation.navigate("Chat");
  }

  function handleEnd() {
    navigation.navigate("Chat");
  }

  function handleError(err) {
    //  If this errors appears, check if the video URL is valid & accessible
    console.warn("Video playback error:", err);
  }

  return (
    <View style={styles.outer}>
      <StatusBar 
        barStyle={isLandscape ? "light-content" : "dark-content"} 
        backgroundColor={isLandscape ? "#000000" : "#ffffff"} 
      />
      
      {/* Header */}
      {!isLandscape && (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>

            <View style={styles.headerCenter}>
              <View style={styles.headerTitleRow}>
                <Text style={styles.headerTitle}>Learning Video</Text>
                <Text style={styles.betaBadge}>BETA</Text>
              </View>
              <View style={styles.statusRow}>
                <View style={styles.playingIndicator} />
                <Text style={styles.headerSubtitle}>
                  {fileName ? fileName : "Video Player"}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.headerRight}>
              <Text style={styles.menuDots}>⋮</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      )}

      {/* Enhanced Video Container with gradient frame when not in landscape */}
      {!isLandscape ? (
        <LinearGradient
          colors={['#ffffff', '#f8fbff', '#f0f7ff']}
          style={styles.gradientContainer}
        >
          <View style={styles.videoWrapper}>
            <View style={styles.videoContainer}>
              <Video
                ref={videoRef}
                source={{ uri: fixedUrl }} 
                //  Must be a valid video file URL (.mp4, .mov, etc.)
                style={styles.video}
                controls={true}
                resizeMode="contain"
                onEnd={handleEnd}
                onError={handleError}
              />
            </View>
            
            {/* Video Info Card */}
            <View style={styles.videoInfoCard}>
              <View style={styles.videoIconContainer}>
                <Text style={styles.videoIcon}>🎥</Text>
              </View>
              <View style={styles.videoInfo}>
                <Text style={styles.videoTitle}>Educational Content</Text>
                <Text style={styles.videoDescription}>
                  {fileName ? `Playing: ${fileName}` : "Learning video content"}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      ) : (
        // Full-screen video for landscape
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={{ uri: fixedUrl }} 
            //  Must be a valid video file URL (.mp4, .mov, etc.)
            style={styles.video}
            controls={true}
            resizeMode="contain"
            onEnd={handleEnd}
            onError={handleError}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  
  // SafeArea and Header
  safeArea: {
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
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
  playingIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
    marginRight: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    flex: 1,
  },
  headerRight: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
  },
  menuDots: {
    fontSize: 20,
    color: '#6b7280',
    fontWeight: 'bold',
  },

  // Video Container
  gradientContainer: {
    flex: 1,
  },
  videoWrapper: {
    flex: 1,
    padding: 16,
  },
  videoContainer: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  video: {
    flex: 1,
    backgroundColor: "#000",
  },

  // Video Info Card
  videoInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(15, 103, 253, 0.1)',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  videoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  videoIcon: {
    fontSize: 20,
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f67fd',
    marginBottom: 4,
  },
  videoDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
});