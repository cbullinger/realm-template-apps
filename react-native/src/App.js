import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AppProvider, UserProvider, useUser} from '@realm/react';

import {appId, baseUrl} from '../realm';
import {LogoutButton} from './LogoutButton';
import {WelcomeView} from './WelcomeView';
import {TasksView} from './TasksView';
import RealmContext from './RealmContext';
const {RealmProvider} = RealmContext

const Stack = createStackNavigator();

const AppWrapper = () => {
  return (
    <AppProvider id={appId} baseUrl={baseUrl}>
      <UserProvider fallback={WelcomeView}>
        <App />
      </UserProvider>
    </AppProvider>
  );
};

const App = () => {
  // :state-start: partition-based-sync
  const user = useUser();
  // :state-end:
  return (
    <>
      {/* After login, user will be automatically populated in realm configuration */}
      <RealmProvider
        // :state-start: partition-based-sync
        sync={{partitionValue: user?.id}}
        // :state-end:
        // :state-uncomment-start: flexible-sync
        // sync={{flexible: true}}
        // :state-uncomment-end:
        fallback={() => (
          <View style={styles.activityContainer}>
            <ActivityIndicator size="large" />
          </View>
        )}>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen
                name="Tasks"
                component={TasksView}
                options={{
                  headerLeft: () => {
                    return <LogoutButton />;
                  },
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Built with the Atlas Device Sync Template
            </Text>
          </View>
        </SafeAreaProvider>
      </RealmProvider>
    </>
  );
};

const styles = StyleSheet.create({
  footerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  footer: {
    margin: 40,
  },
  activityContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});

export default AppWrapper;
