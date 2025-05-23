
// screens/RegisterBusinessScreen.tsx
import React, { FC, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Alert, ScrollView, ActivityIndicator, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS } from '../constants/Colors';
import { User } from './types';
import { RootStackParamList } from '../navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'RegisterBusiness'>;
const API_BASE_URL = 'http://localhost:8000';

const RegisterBusinessScreen: FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState(false);

  const formatPhone = (v:string)=>{
    const d=v.replace(/\D/g,'').slice(0,10);
    if(d.length<4)return d;
    if(d.length<7)return `(${d.slice(0,3)}) ${d.slice(3)}`;
    return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
  };

  const handleRegister = async ()=>{
    if(phone.replace(/\D/g,'').length!==10) return Alert.alert('Invalid Phone');
    if(!name.trim()||!location.trim()||!businessName.trim()) return Alert.alert('Name, Location & Business required');
    setLoading(true);
    try{
      const digits=phone.replace(/\D/g,'');
      const payload:any={ phone_number:`+1${digits}`, name:name.trim(), location:location.trim(), email:email.trim()||undefined, roles:[] , provider_profile:{ business_name:businessName.trim(), rating: rating?parseInt(rating):undefined }};
      const res=await fetch(`${API_BASE_URL}/users/register`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
      if(!res.ok){const err=await res.json();throw new Error(err.detail)};
      const saved=await res.json();
      const user:User={ id:saved.id, phoneNumber:saved.phone_number, name:saved.name, location:saved.location, email:saved.email, roles:saved.roles, provider_profile:saved.provider_profile };
      await AsyncStorage.setItem('user',JSON.stringify(user));
      navigation.replace('Profile',{user});
    }catch(e:any){Alert.alert('Registration Failed',e.message)}finally{setLoading(false)}
  };

  return(
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Register as Business</Text>
      {loading?<ActivityIndicator size="large"/>:(
        <>
          <InputField placeholder="Phone Number" value={phone} onChangeText={t=>setPhone(formatPhone(t))} keyboardType="phone-pad" autoCapitalize="none"/>
          <InputField placeholder="Name" value={name} onChangeText={setName} autoCapitalize="words"/>
          <InputField placeholder="Location" value={location} onChangeText={setLocation} autoCapitalize="words"/>
          <InputField placeholder="Email (optional)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none"/>
          <InputField placeholder="Business Name" value={businessName} onChangeText={setBusinessName} autoCapitalize="words"/>
          <InputField placeholder="Rating (1-5)" value={rating} onChangeText={setRating} keyboardType="numeric"/>
          <PrimaryButton title="Register" onPress={handleRegister}/>
        </>
      )}
      <SecondaryButton title="Back to Login" onPress={()=>navigation.replace('Login')} style={styles.backBtn}/>
    </ScrollView>
  );
};

export default RegisterBusinessScreen;

const styles=StyleSheet.create({
  container:{padding:20,alignItems:'center'},
  header:{fontSize:24,fontWeight:Platform.select({ios:'700',android:'bold'}),color:COLORS.navy,marginBottom:20},
  backBtn:{marginTop:20,width:'70%'},
});
