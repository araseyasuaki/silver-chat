import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../../../firebase';
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { chatRoomKey } from '../../../states/emailData';

const ChatScreen = ({ chatRoomId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  // const arase = useRecoilValue(chatRoomKeyValue);

  const chatRoomKeyValue = useRecoilValue(chatRoomKey);
  
  const handleSenda = () => {
    console.log(chatRoomKeyValue)
  }
  // 現在ログインしているユーザーを取得する
  const user = auth.currentUser;

  // Firestoreからメッセージを取得するためのリアルタイムリスナーを設定
  useEffect(() => {

    const messagesRef = collection(db, `chatRoom/${chatRoomKeyValue}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe; // クリーンアップ関数としてリスナーを解除
  }, [chatRoomId]);

  // メッセージ送信処理
  const handleSend = async () => {
    if (message.trim()) {
      await addDoc(collection(db, `chatRoom/${chatRoomKeyValue}/messages`), {
        text: message,
        createdAt: new Date(),
        userId: user.uid,
      });
      setMessage(''); // 送信後に入力フィールドをクリア
    }
  };
  // console.log(arase)
  // メッセージの表示スタイルを設定
  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.userId === user.uid ? styles.myMessage : styles.otherMessage]}>
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{new Date(item.createdAt.seconds * 1000).toLocaleTimeString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        inverted // 最新のメッセージを上に表示
      />
      <TextInput
        style={styles.input}
        placeholder="Type your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send" onPress={handleSend} />
      <Button title="kuso" onPress={handleSenda} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1E1E1',
  },
  messageText: {
    fontSize: 16,
  },
  messageTime: {
    fontSize: 12,
    color: 'gray',
    marginTop: 5,
    alignSelf: 'flex-end',
  },
});

export default ChatScreen;