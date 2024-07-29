import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ChatRoomList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = collection(db, "chatRoom");
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        setError("ドキュメントの取得中にエラーが発生しました。");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={documents}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Emails: {item.emails.join(', ')}</Text>
            <Text>Room ID: {item.roomId}</Text>
            <Text>番号: {item.id}</Text>
            {item.tags && item.tags.length > 0 && (
              <View>
                <Text>Tags:</Text>
                {item.tags.map((tag, index) => (
                  <Text key={index}>- {tag}</Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
});
