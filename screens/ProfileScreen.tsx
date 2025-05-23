
// screens/ProfileScreen.tsx
import React, { FC, useEffect, useState } from 'react';
import { SafeAreaView, Text, View, StyleSheet, Alert, ActivityIndicator, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Card from '../components/Card';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS } from '../constants/Colors';
import { User } from './types';
import { RootStackParamList } from '../navigation';

type Props=NativeStackScreenProps<RootStackParamList,'Profile'>;
const API_BASE_URL='http://localhost:8000';

const ProfileScreen:FC<Props>=({route,navigation})=>{
  const initial:User=route.params.user;
  const [user,setUser]=useState<User|null>(initial);
  const [loading,setLoading]=useState(false);
  useEffect(()=>{(async()=>{setLoading(true);try{const res=await fetch(`${API_BASE_URL}/users/${initial.id}`);if(res.ok){const f:any=await res.json();const u:User={id:f.id,phoneNumber:f.phone_number,name:f.name,location:f.location,email:f.email,roles:f.roles,client_profile:f.client_profile,provider_profile:f.provider_profile};setUser(u);await AsyncStorage.setItem('user',JSON.stringify(u))}}catch{}finally{setLoading(false)}})()},[]);
  const handleLogout=()=>{Alert.alert('Log Out?','Are you sure?',[{text:'Cancel',style:'cancel'},{text:'Log Out',style:'destructive',onPress:async()=>{await AsyncStorage.removeItem('user');navigation.replace('Login');}}])};
  if(loading||!user)return<ActivityIndicator style={{flex:1,justifyContent:'center'}} size="large"/>;
  return<ScrollView contentContainerStyle={styles.container}><Text style={styles.header}>Your Profile</Text><Card><View style={styles.row}><Text style={styles.label}>Phone:</Text><Text style={styles.value}>{user.phoneNumber}</Text></View><View style={styles.row}><Text style={styles.label}>Name:</Text><Text style={styles.value}>{user.name}</Text></View><View style={styles.row}><Text style={styles.label}>Location:</Text><Text style={styles.value}>{user.location}</Text></View><View style={styles.row}><Text style={styles.label}>Email:</Text><Text style={styles.value}>{user.email??'N/A'}</Text></View><View style={styles.row}><Text style={styles.label}>Roles:</Text><Text style={styles.value}>{user.roles.map(r=>r.name).join(', ')}</Text></View>{user.provider_profile&&<View style={styles.section}><Text style={styles.subHeader}>Provider Details</Text><Text style={styles.row}><Text style={styles.label}>Business:</Text> {user.provider_profile.business_name}</Text><Text style={styles.row}><Text style={styles.label}>Rating:</Text> {user.provider_profile.rating}</Text></View>}</Card><SecondaryButton title="Log Out" onPress={handleLogout} style={styles.logoutBtn}/></ScrollView>;
};
export default ProfileScreen;
const styles=StyleSheet.create({container:{padding:20,alignItems:'center'},header:{fontSize:28,fontWeight:Platform.select({ios:'700',android:'bold'}),color:COLORS.navy,marginBottom:20},row:{flexDirection:'row',justifyContent:'space-between',marginBottom:10},label:{fontWeight:'600',color:COLORS.navy},value:{color:COLORS.navy},section:{marginTop:20},subHeader:{fontSize:20,fontWeight:'600',color:COLORS.navy,marginBottom:10},logoutBtn:{marginTop:20,width:'70%'},});
