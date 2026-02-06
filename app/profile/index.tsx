import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User as UserIcon, LogOut, Mail, Heart, Settings, Bell, Moon, Volume2, ChevronRight, Edit2, Calendar, Flame, PlayCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();

  // Mock Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true); // Locked for now

  const handleLogout = () => {
    logout();
    router.replace('/auth/login');
  };

  const getInitials = (name: string) => {
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
        {/* Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity style={styles.editButton}>
                <Edit2 size={20} color="#FFF" />
            </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeInDown.delay(100).springify()} style={styles.content}>
                {/* Avatar Section */}
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={['rgba(255, 77, 109, 0.2)', 'rgba(255, 77, 109, 0.05)']}
                        style={styles.avatarGradient}
                    >
                        {user?.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                        ) : (
                            <Text style={styles.avatarText}>{getInitials(user?.name || 'User')}</Text>
                        )}
                    </LinearGradient>
                </View>

                {/* User Details */}
                <View style={styles.infoContainer}>
                    <Text style={styles.userName}>{user?.name}</Text>
                    
                    <View style={styles.infoRow}>
                        <Mail size={16} color="#888" />
                        <Text style={styles.userEmail}>{user?.email}</Text>
                    </View>

                    <View style={styles.joinDateRow}>
                        <Calendar size={14} color="#666" />
                        <Text style={styles.joinDateText}>Member since Jan 2026</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Heart size={20} color="#FF4D6D" fill="#FF4D6D" />
                            <Text style={styles.statValue}>{user?.partnerId ? 'Connected' : 'Waiting'}</Text>
                            <Text style={styles.statLabel}>Status</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Flame size={20} color="#FF9E0B" fill="#FF9E0B" />
                            <Text style={styles.statValue}>{user?.streak || 0}</Text>
                            <Text style={styles.statLabel}>Streak</Text>
                        </View>
                         <View style={styles.statItem}>
                            <PlayCircle size={20} color="#3A86FF" fill="#3A86FF" />
                            <Text style={styles.statValue}>12</Text>
                            <Text style={styles.statLabel}>Games</Text>
                        </View>
                    </View>
                </View>

                {/* Settings Section */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Settings</Text>
                    
                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, {backgroundColor: 'rgba(58, 134, 255, 0.1)'}]}>
                                <Bell size={20} color="#3A86FF" />
                            </View>
                            <Text style={styles.settingText}>Notifications</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#333", true: "#3A86FF" }}
                            thumbColor={notificationsEnabled ? "#FFF" : "#f4f3f4"}
                            onValueChange={setNotificationsEnabled}
                            value={notificationsEnabled}
                        />
                    </View>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, {backgroundColor: 'rgba(255, 158, 11, 0.1)'}]}>
                                <Volume2 size={20} color="#FF9E0B" />
                            </View>
                            <Text style={styles.settingText}>Sound Effects</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#333", true: "#FF9E0B" }}
                            thumbColor={soundEnabled ? "#FFF" : "#f4f3f4"}
                            onValueChange={setSoundEnabled}
                            value={soundEnabled}
                        />
                    </View>

                     <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, {backgroundColor: 'rgba(255, 255, 255, 0.1)'}]}>
                                <Moon size={20} color="#FFF" />
                            </View>
                            <Text style={styles.settingText}>Dark Mode</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#333", true: "#666" }}
                            thumbColor={darkMode ? "#FFF" : "#f4f3f4"}
                            onValueChange={setDarkMode}
                            value={darkMode}
                            disabled={true} // Always dark for now
                        />
                    </View>
                </View>

                 {/* Support Section */}
                 <View style={styles.sectionContainer}>
                    <Text style={styles.sectionHeader}>Support</Text>
                    <TouchableOpacity style={styles.settingItem}>
                         <View style={styles.settingLeft}>
                            <View style={[styles.settingIcon, {backgroundColor: 'rgba(255, 77, 109, 0.1)'}]}>
                                <Heart size={20} color="#FF4D6D" />
                            </View>
                            <Text style={styles.settingText}>Help & Support</Text>
                        </View>
                        <ChevronRight size={20} color="#666" />
                    </TouchableOpacity>
                 </View>

                {/* Actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <LogOut size={20} color="#FF4D6D" />
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                     <Text style={styles.versionText}>Version 1.0.0</Text>
                </View>
            </Animated.View>
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
  editButton: {
      padding: 8,
  },
  headerTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FFF',
  },
  scrollContent: {
      paddingBottom: 40,
  },
  content: {
      alignItems: 'center',
      paddingTop: 20,
      paddingHorizontal: 24,
  },
  avatarContainer: {
      marginBottom: 20,
      shadowColor: '#FF4D6D',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
  },
  avatarGradient: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'rgba(255, 77, 109, 0.3)',
  },
  avatarImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
  },
  avatarText: {
      fontSize: 40,
      fontWeight: 'bold',
      color: '#FF4D6D',
  },
  infoContainer: {
      alignItems: 'center',
      marginBottom: 32,
      width: '100%',
  },
  userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 4,
  },
  infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 8,
  },
  userEmail: {
      fontSize: 14,
      color: '#888',
  },
  joinDateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 24,
      backgroundColor: 'rgba(255,255,255,0.03)',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
  },
  joinDateText: {
      fontSize: 12,
      color: '#666',
  },
  statsRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 16,
      width: '100%',
  },
  statItem: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.03)',
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#FFF',
      marginTop: 8,
  },
  statLabel: {
      fontSize: 12,
      color: '#888',
      marginTop: 2,
  },
  sectionContainer: {
      width: '100%',
      marginBottom: 24,
  },
  sectionHeader: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF',
      marginBottom: 12,
      marginLeft: 4,
  },
  settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.03)',
      padding: 16,
      borderRadius: 16,
      marginBottom: 10,
  },
  settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
  },
  settingIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
  },
  settingText: {
      fontSize: 15,
      color: '#DDD',
      fontWeight: '500',
  },
  actionsContainer: {
      width: '100%',
      marginTop: 8,
      alignItems: 'center',
      gap: 16,
  },
  logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      backgroundColor: 'rgba(255, 77, 109, 0.1)',
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 77, 109, 0.2)',
      width: '100%',
  },
  logoutText: {
      color: '#FF4D6D',
      fontSize: 16,
      fontWeight: 'bold',
  },
  versionText: {
      color: '#444',
      fontSize: 12,
  },
});
