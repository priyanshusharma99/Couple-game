import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { GameService } from '@/services/GameService';
import { Play, Users, Copy, LogOut, Code, RefreshCw, ArrowLeft, Sparkles, Heart, Flame } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Home() {
  const { user, logout, switchUser } = useAuth();
  const { game, createGame, joinGame, leaveGame, isLoading, checkChallenges } = useGame();
  const router = useRouter();
  
  const [joinCode, setJoinCode] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<7 | 15 | 30>(7);
  const [previewCards, setPreviewCards] = useState<{type: 'action' | 'question', content: string}[]>([]); 


  const [quote, setQuote] = useState('');

  const QUOTES = [
    "Love is about how much you love each other every single day.",
    "In all the world, there is no heart for me like yours.",
    "You are my sun, my moon, and all my stars.",
    "The best thing to hold onto in life is each other.",
    "Where there is love there is life."
  ];

  useEffect(() => {
    loadPreview();
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
  }, []);

  const loadPreview = async () => {
    const cards = await GameService.getCardPreview();
    setPreviewCards(cards);
  };

  // Poll for game status if in a game
  useEffect(() => {
      if (user?.currentGameId) {
          checkChallenges();
      }
  }, [user]);

  // Navigate to game dashboard if active
  useEffect(() => {
      if (game?.status === 'active') {
          router.replace('/game');
      }
  }, [game]);

  const handleCreateGame = async () => {
    try {
      const code = await createGame(selectedDuration);
      Alert.alert('Game Created', `Your code is: ${code}`);
    } catch (e) {
      Alert.alert('Error', 'Failed to create game');
    }
  };

  const handleJoinGame = async () => {
    if (!joinCode) {
        Alert.alert('Error', 'Please enter a game code');
        return;
    }
    try {
      await joinGame(joinCode);
    } catch (e) {
      Alert.alert('Error', 'Invalid code or game full');
    }
  };
  
  const copyCode = async () => {
      if (game?.code) {
          await Clipboard.setStringAsync(game.code);
          Alert.alert('Copied', 'Game code copied to clipboard');
      }
  };

  if (game?.status === 'active') {
      return (
        <View style={styles.loadingContainer}>
            <LinearGradient
                colors={['#0F0F0F', '#1A0B14']}
                style={StyleSheet.absoluteFill}
            />
            <ActivityIndicator size="large" color="#FF4D6D" />
            <Text style={styles.loadingText}>Entering Game...</Text>
        </View>
      );
  }

  const getInitials = (name: String) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F0F', '#1F1016', '#0F0F0F']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.header}>
              <View>
                  <Text style={styles.greeting}>Hi {user?.name?.split(' ')[0]}</Text>
                  
                  {user?.streak ? (
                      <View style={styles.streakContainer}>
                        <Flame size={14} color="#FF9E0B" fill="#FF9E0B" />
                        <Text style={styles.streakText}>{user.streak} Day Streak</Text>
                      </View>
                  ) : (
                      <Text style={styles.subtitle}>Ready for connection?</Text>
                  )}
              </View>
              <TouchableOpacity onPress={() => router.push('/profile')} style={styles.profileButton}>
                <LinearGradient
                    colors={['#FF4D6D', '#FF8FA3']}
                    style={styles.profileGradient}
                >
                  <Text style={styles.profileInitials}>{getInitials(user?.name || 'User')}</Text>
                </LinearGradient>
              </TouchableOpacity>
          </Animated.View>


          {/* Love Quote Section */}
          <Animated.View entering={FadeInDown.delay(200).springify()} style={styles.quoteContainer}>
              <LinearGradient
                  colors={['rgba(255, 77, 109, 0.1)', 'rgba(255, 77, 109, 0.05)']}
                  style={styles.quoteGradient}
              >
                  <Text style={styles.quoteIcon}>❝</Text>
                  <Text style={styles.quoteText}>
                    "{quote}"
                  </Text>
                  <Text style={styles.quoteAuthor}>- Daily Love</Text>
              </LinearGradient>
          </Animated.View>

          {game ? (
             <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.cardContainer}>
                 <LinearGradient
                    colors={['rgba(255, 77, 109, 0.1)', 'rgba(255, 77, 109, 0.02)']}
                    style={styles.cardGradient}
                 >
                    <View style={styles.cardHeader}>
                        <Sparkles size={24} color="#FF4D6D" />
                        <Text style={styles.cardTitle}>Waiting for Partner</Text>
                    </View>
                    
                    <Text style={styles.cardDesc}>Share this magical code to begin:</Text>
                    
                    <TouchableOpacity style={styles.codeContainer} onPress={copyCode}>
                        <Text style={styles.codeText}>{game.code}</Text>
                        <Copy size={18} color="#FF4D6D" />
                    </TouchableOpacity>
                    
                    <View style={styles.waitingContainer}>
                        <ActivityIndicator color="#FF4D6D" size="small" />
                        <Text style={styles.waitingText}>Waiting for connection...</Text>
                    </View>

                    <TouchableOpacity style={styles.backButton} onPress={leaveGame}>
                        <ArrowLeft size={16} color="#888" />
                        <Text style={styles.backButtonText}>Back to Dashboard</Text>
                    </TouchableOpacity>
                 </LinearGradient>
             </Animated.View>
          ) : (
             <View style={styles.actionsContainer}>
                {/* Create Game Section */}
                <Animated.View entering={FadeInDown.delay(300).springify()} style={styles.actionCard}>
                     <LinearGradient
                        colors={['#2A1520', '#151515']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionGradient}
                     >
                        <View style={styles.actionHeader}>
                            <View style={styles.iconCircle}>
                                <Play size={24} color="#FF4D6D" fill="#FF4D6D" />
                            </View>
                            <Text style={styles.actionTitle}>Start a Journey</Text>
                        </View>
                        
                        <Text style={styles.actionDesc}>Choose the duration of your challenge:</Text>
                        
                        <View style={styles.durationRow}>
                             {[7, 15, 30].map((d, index) => (
                                <TouchableOpacity 
                                    key={d} 
                                    style={[styles.durationChip, selectedDuration === d && styles.durationChipActive]}
                                    onPress={() => setSelectedDuration(d as any)}
                                >
                                    <Text style={[styles.durationChipText, selectedDuration === d && styles.durationChipTextActive]}>
                                        {d} Days
                                    </Text>
                                </TouchableOpacity>
                             ))}
                        </View>

                        <TouchableOpacity 
                            style={styles.primaryButton}
                            onPress={handleCreateGame}
                            disabled={isLoading}
                        >
                            <Text style={styles.primaryButtonText}>Create Game</Text>
                            <Heart size={18} color="#FFF" fill="#FFF" />
                        </TouchableOpacity>
                     </LinearGradient>
                </Animated.View>

                {/* Join Game Section */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.actionCard}>
                     <LinearGradient
                        colors={['#1A1A1A', '#121212']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.actionGradient}
                     >
                        <View style={styles.actionHeader}>
                            <View style={[styles.iconCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                                <Users size={24} color="#FFF" />
                            </View>
                            <Text style={styles.actionTitle}>Join Partner</Text>
                        </View>
                        
                        <Text style={styles.actionDesc}>Enter the code shared by your partner:</Text>
                        
                        <View style={styles.inputWrapper}>
                            <Code size={18} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="000 000"
                                placeholderTextColor="#444"
                                value={joinCode}
                                onChangeText={setJoinCode}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                        </View>

                        <TouchableOpacity 
                            style={styles.secondaryButton}
                            onPress={handleJoinGame}
                            disabled={isLoading}
                        >
                            <Text style={styles.secondaryButtonText}>Join Game</Text>
                        </TouchableOpacity>
                     </LinearGradient>
                </Animated.View>

                {/* Card Preview Section */}
                <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.previewSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Discover Challenges</Text>
                        <TouchableOpacity onPress={() => router.push('/cards')}>
                            <Text style={styles.seeAllText}>All Cards</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.previewScroll}>
                        {previewCards.map((card, index) => (
                            <View key={index} style={styles.previewCard}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                                    style={styles.previewCardGradient}
                                >
                                    <View style={styles.cardTypeTag}>
                                        {card.type === 'action' ? <Sparkles size={12} color="#FF4D6D" /> : <Heart size={12} color="#3A86FF" />}
                                        <Text style={[styles.cardTagText, {color: card.type === 'action' ? '#FF4D6D' : '#3A86FF'}]}>
                                            {card.type === 'action' ? 'Dare' : 'Question'}
                                        </Text>
                                    </View>
                                    <Text style={styles.previewCardText} numberOfLines={3}>{card.content}</Text>
                                </LinearGradient>
                            </View>
                        ))}
                    </ScrollView>
                </Animated.View>
             </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
  },
  loadingText: {
    color: '#888',
    marginTop: 16,
    fontSize: 16,
  },
  content: {
    padding: 24,
    paddingBottom: 120, // Space for Navigation Dock
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  streakContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: 'rgba(255, 158, 11, 0.1)',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      alignSelf: 'flex-start',
      marginTop: 4,
  },
  streakText: {
      color: '#FF9E0B',
      fontWeight: 'bold',
      fontSize: 12,
  },
  iconButton: {
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  profileButton: {
      shadowColor: '#FF4D6D',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
  },
  profileGradient: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.1)',
  },
  profileInitials: {
      color: '#FFF',
      fontWeight: 'bold',
      fontSize: 16,
  },
  quoteContainer: {
      marginBottom: 32,
      borderRadius: 16,
      overflow: 'hidden',
  },
  quoteGradient: {
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: 'rgba(255, 77, 109, 0.2)',
  },
  quoteIcon: {
      fontSize: 40,
      color: '#FF4D6D',
      opacity: 0.5,
      marginBottom: -10,
      alignSelf: 'flex-start',
  },
  quoteText: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#FFF',
      textAlign: 'center',
      fontStyle: 'italic',
      lineHeight: 32,
      marginBottom: 12,
  },
  quoteAuthor: {
      fontSize: 14,
      color: '#FF4D6D',
      fontWeight: '600',
      opacity: 0.8,
  },
  // Preview Section Styles
  previewSection: {
      marginTop: 24,
      marginBottom: 32,
  },
  sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
      paddingHorizontal: 4,
  },
  sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
  },
  seeAllText: {
      color: '#FF4D6D',
      fontSize: 14,
      fontWeight: '600',
  },
  previewScroll: {
      gap: 12,
      paddingRight: 24,
  },
  previewCard: {
      width: 160,
      height: 120,
      borderRadius: 16,
      overflow: 'hidden',
  },
  previewCardGradient: {
      flex: 1,
      padding: 12,
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  cardTypeTag: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(0,0,0,0.3)',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 8,
  },
  cardTagText: {
      fontSize: 10,
      fontWeight: 'bold',
  },
  previewCardText: {
      color: '#FFF',
      fontSize: 13,
      lineHeight: 18,
      opacity: 0.9,
  },
  cardContainer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 109, 0.2)',
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  cardDesc: {
    fontSize: 14,
    color: '#CCC',
    marginBottom: 24,
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  codeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4D6D',
    letterSpacing: 6,
  },
  waitingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  waitingText: {
    color: '#FF4D6D',
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  backButtonText: {
    color: '#888',
    fontSize: 14,
  },
  actionsContainer: {
    gap: 20,
  },
  actionCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 4,
  },
  actionGradient: {
    padding: 24,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 77, 109, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  actionDesc: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
  },
  durationRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  durationChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },
  durationChipActive: {
    borderColor: '#FF4D6D',
    backgroundColor: 'rgba(255, 77, 109, 0.1)',
  },
  durationChipText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 13,
  },
  durationChipTextActive: {
    color: '#FF4D6D',
  },
  primaryButton: {
    backgroundColor: '#FF4D6D',
    padding: 18,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#FF4D6D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFF',
    fontSize: 18,
    paddingVertical: 16,
    fontWeight: '500',
    letterSpacing: 2,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
