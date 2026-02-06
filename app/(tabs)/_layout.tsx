import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform } from 'react-native';
import { Home, Layers, Clock } from 'lucide-react-native';


const TabIcon = ({ icon: Icon, color, focused }: { icon: any, color: string, focused: boolean }) => (
    <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
        <Icon size={24} color={focused ? '#FFF' : 'rgba(255,255,255,0.5)'} strokeWidth={2.5} />
    </View>
);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarItemStyle: styles.tabBarItem,
        tabBarBackground: () => (
             <View style={styles.backgroundContainer} />
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Home} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Layers} color={color} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          tabBarIcon: ({ color, focused }) => <TabIcon icon={Clock} color={color} focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 0,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    height: 70, // Reduced height
    paddingTop: 0,
    paddingBottom: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  tabBarItem: {
      height: 55, // Adjusted for new height
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 5, // Slight push down for optical balancing
  },
  backgroundContainer: {
      flex: 1,
      borderTopLeftRadius: 24, // Slightly reduced radius
      borderTopRightRadius: 24,
      overflow: 'hidden',
      backgroundColor: '#18181B', // Solid dark gray
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.1)',
      borderBottomWidth: 0,
  },
  iconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
  },
  iconContainerFocused: {
      backgroundColor: 'rgba(255, 77, 109, 0.2)',
      borderWidth: 1,
      borderColor: 'rgba(255, 77, 109, 0.4)',
  }
});
