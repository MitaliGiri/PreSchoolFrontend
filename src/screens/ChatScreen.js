import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
  StatusBar,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

// Global store (resets when app restarts)
let globalMessages = [];

export default function ChatScreen({ navigation }) {
  const [messages, setMessages] = useState(globalMessages);
  const [input, setInput] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const flatListRef = useRef(null); // for auto-scrolling

  useEffect(() => {
    globalMessages = messages;
  }, [messages]);

  // Keyboard visibility listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  //  Auto-scroll when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      // Small delay to ensure the message is rendered before scrolling
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);

    // 
    const currentInput = input;
    setInput('');

      // Replace the dummy endpoint below with the actual backend endpoint
    try {
      const response = await axios.post('http://10.0.2.2:5000/chat', {
        message: currentInput,
      });

      const botMessage = {
        id: (Date.now() + 1).toString(), // Ensure unique ID
        text: response.data.reply,
        sender: 'bot',
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Error: Could not connect to server.',
        sender: 'bot',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleLinkPress = url => {
    if (url.toLowerCase().endsWith('.mp4')) {
      navigation.navigate('Video', { videoUrl: url });
    } else {
      Linking.openURL(url);
    }
  };

  const renderMessage = ({ item }) => {
    const parts = item.text.split(/(\s+)/).map((part, index) => {
      const isLink = /\S+\.\S+/.test(part);
      if (isLink) {
        let url = part.startsWith('http') ? part : `https://${part}`;
        return (
          <Text
            key={index}
            style={styles.linkText}
            onPress={() => handleLinkPress(url)}
          >
            {part}
          </Text>
        );
      }
      return <Text key={index}>{part}</Text>;
    });

    //  Separate rendering for user vs bot messages
    if (item.sender === 'user') {
      return (
        <View style={styles.userMessageContainer}>
          <View style={styles.userBubble}>
            <Text style={styles.userText}>{parts}</Text>
            <Text style={styles.userTimestamp}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.botMessageContainer}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>🤖</Text>
          </View>
          <View style={styles.botBubble}>
            <Text style={styles.botText}>{parts}</Text>
            <Text style={styles.botTimestamp}>
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              const state = navigation.getState();
              const lastRoute = state.routes[state.routes.length - 2];
              if (lastRoute && lastRoute.name === 'Video') {
                navigation.navigate('Home');
              } else {
                navigation.goBack();
              }
            } else {
              navigation.navigate('Home');
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle}>PreSchool Chat</Text>
            <Text style={styles.betaBadge}>BETA</Text>
          </View>
          <View style={styles.statusRow}>
            <View style={styles.onlineIndicator} />
            <Text style={styles.headerSubtitle}>AI Learning Assistant • Online</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerRight}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* Gradient Chat Area */}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fbff', '#f0f7ff']}
          style={styles.gradientBackground}
        >
          <FlatList
            ref={flatListRef} //  for auto-scrolling
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 10,
            }}
            onContentSizeChange={() => {
              // Auto-scroll when content size changes (new messages)
              if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: true });
              }
            }}
            onLayout={() => {
              // Auto-scroll when FlatList layout changes
              if (flatListRef.current && messages.length > 0) {
                flatListRef.current.scrollToEnd({ animated: false });
              }
            }}
          />
        </LinearGradient>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={input}
                onChangeText={setInput}
                placeholder="Ask me anything about learning..."
                placeholderTextColor="#9ca3af"
                multiline
                textAlignVertical="center"
                onSubmitEditing={sendMessage} // Allow Enter to send
                blurOnSubmit={false}
              />
              <TouchableOpacity 
                onPress={sendMessage} 
                style={[
                  styles.sendButton,
                  input.trim() ? styles.sendButtonActive : styles.sendButtonInactive
                ]}
                disabled={!input.trim()}
              >
                <LinearGradient
                  colors={input.trim() ? ['#0f67fd', '#0d5beb'] : ['#e5e7eb', '#e5e7eb']}
                  style={styles.sendButtonGradient}
                >
                  <Text style={[
                    styles.sendText,
                    { color: input.trim() ? '#ffffff' : '#9ca3af' }
                  ]}>
                    ➤
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            {!isKeyboardVisible && (
              <Text style={styles.inputHint}>
                💡 Try asking about math, science, or educational videos!
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  messagesList: {
    padding: 20,
    flexGrow: 1,
  },
  
  //  Separate styles for user and bot message containers
  userMessageContainer: {
    alignItems: 'flex-end', // Align to right
    marginVertical: 6,
    paddingLeft: '20%', // Add left padding to push right
  },
  botMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 6,
    paddingRight: '20%', // Add right padding 
  },
  
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  botAvatarText: {
    fontSize: 16,
  },
  
  //  Simplified bubble styles
  userBubble: {
    maxWidth: '100%', // Use full available width
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    backgroundColor: '#0f67fd',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  botBubble: {
    maxWidth: '100%', // Use full available width  
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8f2ff',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  
  userText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  botText: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  
  userTimestamp: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  botTimestamp: {
    fontSize: 11,
    color: '#9ca3af',
    alignSelf: 'flex-end',
    marginTop: 2,
  },
  
  linkText: {
    color: '#0f67fd',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  inputArea: {
    backgroundColor: '#ffffff',
    borderTopWidth: 0.5,
    borderTopColor: '#f0f0f0',
  },
  inputWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8fbff',
    borderRadius: 28,
    paddingHorizontal: 6,
    paddingVertical: 6,
    minHeight: 52,
    borderWidth: 1,
    borderColor: '#e8f2ff',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#374151',
    maxHeight: 120,
    backgroundColor: 'transparent',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 4,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    elevation: 4,
    shadowColor: '#0f67fd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sendButtonInactive: {},
  sendText: {
    fontSize: 18,
    fontWeight: '600',
  },
  inputHint: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 8,
  },
});