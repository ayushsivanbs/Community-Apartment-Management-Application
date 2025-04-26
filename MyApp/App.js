import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { RoleProvider } from './components/RoleContext';  // Import the RoleProvider

import LoginScreen from './components/LoginScreen';
import SignupScreen from './components/SignupScreen';
import ProfileSetupScreen from './components/ProfileSetupScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import RoleSelection from './components/RoleSelection';
import DashboardScreen from './components/DashboardScreen';
import MaintenanceRequest from './components/MaintenanceRequest';
import ContactManagement  from './components/ContactManagement';
import CommunityForum from './components/CommunityForum';
import CommentScreen from './components/CommentScreen';
import ViewVisitors from './components/ViewVisitors';
import BiometricsScreen from './components/BiometricsScreen';
import AdminDashboard from './components/AdminDashboard';
import ManageResidents from './components/ManageResidents';
import ContractScreen from './components/ContractScreen';
import FamilyScreen from './components/FamilyScreen';
import PaymentsScreen from './components/PaymentScreen';
import SplashScreen from './components/SplashScreen';
import PaymentPage from './components/PaymentPage';
import ManageAnnouncements from './components/ManageAnnouncements';
import ComplaintsScreen from './components/ComplaintsScreen';
import SecurityAlertsScreen from './components/SecurityAlertsScreen';
import EditResidentScreen from './components/EditResidentScreen';
import EditFamilyMembersScreen from './components/EditFamilyMembersScreen';
import EditRentalAgreementScreen from './components/EditRentalAgreementScreen';
import ResidentListScreen from './components/ResidentListScreen';
import SecurityLogsScreen from './components/SecurityLogsScreen';

const Stack = createStackNavigator();

const App = () => (
  //<RoleProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="RoleSelection" component={RoleSelection} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Maintenance" component={MaintenanceRequest} />
        <Stack.Screen name="ContactManagement" component={ContactManagement} />
        <Stack.Screen name="CommunityForum" component={CommunityForum} />
        <Stack.Screen name="Comments" component={CommentScreen} />
        <Stack.Screen name="Visitors" component={ViewVisitors} />
        <Stack.Screen name="Biometrics" component={BiometricsScreen} />
        <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
        <Stack.Screen name="ManageResidents" component={ManageResidents} />
        <Stack.Screen name="ContractScreen" component={ContractScreen} />
        <Stack.Screen name="FamilyScreen" component={FamilyScreen} />
        <Stack.Screen name="PaymentsScreen" component={PaymentsScreen} />
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="PaymentPage" component={PaymentPage} />
        <Stack.Screen name="ManageAnnouncements" component={ManageAnnouncements} />
        <Stack.Screen name="ViewComplaints" component={ComplaintsScreen} />
        <Stack.Screen name="SecurityAlertsScreen" component={SecurityAlertsScreen} />
        <Stack.Screen name="EditResidentScreen" component={EditResidentScreen} />
        <Stack.Screen name="EditFamilyMembersScreen" component={EditFamilyMembersScreen} />
        <Stack.Screen name="EditRentalAgreementScreen" component={EditRentalAgreementScreen} />
        <Stack.Screen name="ResidentListScreen" component={ResidentListScreen} />
        <Stack.Screen name="SecurityLogsScreen" component={SecurityLogsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  //</RoleProvider>
);

export default App;
