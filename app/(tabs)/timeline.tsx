import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GameService } from '@/services/GameService';
import { useRouter } from 'expo-router';
import { ArrowLeft, Clock, Sparkles, Heart, AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Challenge, Penalty } from '@/types';

const { width } = Dimensions.get('window');

export default function Timeline() {
  const router = useRouter();
  const [events, setEvents] = useState<(Challenge | Penalty)[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, we'd get the current game ID from context
  // For now, let's just mock fetching "some" game events or empty state
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    // Mock fetching events for a demo
    // In real app: GameService.getGameEvents(game.id)
    // We'll create a dummy getDemoEvents method or just use empty for now if no game
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0F0F0F', '#1F1016', '#0F0F0F']}
        style={StyleSheet.absoluteFill}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Our Journey</Text>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
            {events.length === 0 ? (
                <View style={styles.emptyState}>
                    <Clock size={48} color="rgba(255,255,255,0.1)" />
                    <Text style={styles.emptyText}>Your journey is just beginning...</Text>
                    <Text style={styles.emptySubtext}>Start a game to see your timeline here.</Text>
                </View>
            ) : (
                events.map((event, index) => (
                    <Animated.View 
                        key={event.id} 
                        entering={FadeInDown.delay(index * 100).springify()}
                        style={styles.eventItem}
                    >
                         {/* Render event details here */}
                         <Text style={{color: '#FFF'}}>Event {index}</Text>
                    </Animated.View>
                ))
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
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  headerTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF',
  },
  content: {
      padding: 24,
      paddingBottom: 120, // Space for Dock
  },
  emptyState: {
      alignItems: 'center',
      marginTop: 100,
      gap: 16,
  },
  emptyText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
  },
  emptySubtext: {
      color: '#666',
  },
  eventItem: {
      marginBottom: 16,
  },
});
