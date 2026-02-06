import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sparkles, HelpCircle, Zap } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameService } from '@/services/GameService';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function CardsLibrary() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'actions' | 'questions'>('actions');
  const [cards, setCards] = useState<{actions: string[], questions: string[]}>({ actions: [], questions: [] });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    const data = await GameService.getAllCards();
    setCards(data);
  };

  const displayedCards = activeTab === 'actions' ? cards.actions : cards.questions;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F0F', '#1F1016', '#0F0F0F']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Card Library</Text>
            <View style={{width: 20}} /> 
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'actions' && styles.activeTab]}
                onPress={() => setActiveTab('actions')}
            >
                <Zap size={18} color={activeTab === 'actions' ? '#FFF' : '#888'} />
                <Text style={[styles.tabText, activeTab === 'actions' && styles.activeTabText]}>Dares</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.tab, activeTab === 'questions' && styles.activeTab]}
                onPress={() => setActiveTab('questions')}
            >
                <HelpCircle size={18} color={activeTab === 'questions' ? '#FFF' : '#888'} />
                <Text style={[styles.tabText, activeTab === 'questions' && styles.activeTabText]}>Questions</Text>
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            <View style={styles.grid}>
                {displayedCards.map((content, index) => (
                    <Animated.View 
                        key={index} 
                        entering={FadeInDown.delay(index * 50).springify()}
                        style={styles.card}
                    >
                        <LinearGradient
                            colors={activeTab === 'actions' ? ['rgba(255, 77, 109, 0.15)', 'rgba(255, 77, 109, 0.05)'] : ['rgba(58, 134, 255, 0.15)', 'rgba(58, 134, 255, 0.05)']}
                            style={styles.cardGradient}
                        >
                            <View style={styles.cardIcon}>
                                {activeTab === 'actions' ? (
                                    <Zap size={20} color="#FF4D6D" />
                                ) : (
                                    <HelpCircle size={20} color="#3A86FF" />
                                )}
                            </View>
                            <Text style={styles.cardContent}>{content}</Text>
                        </LinearGradient>
                    </Animated.View>
                ))}
            </View>
            <View style={{height: 40}} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
  },
  headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#FFF',
  },
  tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 24,
      marginBottom: 24,
      gap: 16,
  },
  tab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: 'rgba(255,255,255,0.03)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  activeTab: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#888',
  },
  activeTabText: {
      color: '#FFF',
  },
  content: {
      paddingHorizontal: 24,
      paddingBottom: 120, // Space for Dock
  },
  grid: {
      gap: 16,
  },
  card: {
      borderRadius: 20,
      overflow: 'hidden',
  },
  cardGradient: {
      padding: 24,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
  },
  cardIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.05)',
      justifyContent: 'center',
      alignItems: 'center',
  },
  cardContent: {
      flex: 1,
      fontSize: 16,
      color: '#FFF',
      lineHeight: 24,
  },
});
