import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const Sign = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [changeBtn, setChangeBtn] = useState(true);
  const router = useRouter();

  // ログアウト処理
  useEffect(() => {
    const SignOut = async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error('Sign out error:', error);
      }
    };
    SignOut();
  }, []);

  const authChange = async () => {
    if (!email || !password) {
      Alert.alert('エラー', 'メールアドレスとパスワードを入力してください。');
      return;
    }

    try {
      // ログインと新規作成
      if (changeBtn) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      // プロフィール設定画面
      const profileData = await getDoc(doc(db, 'users', email));
      if (profileData.exists()) {
        router.push('/home');
      } else {
        router.push('/firstUser');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      Alert.alert('エラー', '認証に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={authChange}>
        <Text style={styles.buttonText}>{changeBtn ? 'ログイン' : '新規作成'}</Text>
      </TouchableOpacity>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleText} onPress={() => setChangeBtn(!changeBtn)}>
          {changeBtn ? '新規アカウント作成' : 'ログイン'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#C995E0',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  button: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  toggleText: {
    color: 'blue',
  },
});

export default Sign;
