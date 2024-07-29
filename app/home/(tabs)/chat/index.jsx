import React, { useState, useEffect } from 'react';
import { Text, View, Button, Alert, StyleSheet } from "react-native";
import { db } from '../../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from "expo-router";
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { chatRoomKey } from '../../../states/emailData';

export default function Tab() {
  const setChatRoomKey = useSetRecoilState(chatRoomKey);

  const [documents, setDocuments] = useState([]);

  const chatRoomKeyValue = useRecoilValue(chatRoomKey);
  console.log(chatRoomKeyValue)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, "chatRoom"), where("emails", "array-contains", "23aw0102@jec.ac.jp"));
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDocuments(data);
      } catch (error) {
        console.error("Error fetching documents: ", error);
        Alert.alert("Error", "ドキュメントの取得中にエラーが発生しました。");
      }
    };

    fetchData();
  }, []);

  const handleRoomSelect = (id) => {
    setChatRoomKey(id); // Recoilの状態を更新
  }

  return (
    <View style={styles.container}>
      {documents.length > 0 ? (
        documents.map((doc) => (
          <View key={doc.id} style={styles.card}>
            <Text>Emails: {doc.emails.join(', ')}</Text>
            <Text>Room ID: {doc.roomId}</Text>
            <Text>番号: {doc.id}</Text>
            {doc.tags && doc.tags.length > 0 && (
              <View>
                <Text>Tags:</Text>
                {doc.tags.map((tag, index) => (
                  <Text key={index}>- {tag}</Text>
                ))}
              </View>
            )}
            <Link href='/home/chat/chatRoom' asChild>
              <Button title={doc.roomName} onPress={() => handleRoomSelect(doc.id)} />
            </Link>
          </View>
        ))
      ) : (
        <Text>No documents found</Text>
      )}
      <Link href='/home/createGroupChat' asChild>
        <Button title="グループ作成"/>
      </Link>
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

// import React, { useState, useEffect } from 'react';
// import { Text, View, Button, Alert, StyleSheet } from "react-native";
// import { db } from '../../../firebase';
// import { collection, query, where, getDocs } from 'firebase/firestore';
// import { Link } from "expo-router";
// import { useSetRecoilState, useRecoilValue } from 'recoil';
// import { chatRoomKey } from '../../../states/emailData';

// export default function Tab() {
//   const setChatRoomKey = useSetRecoilState(chatRoomKey);

//   const [documents, setDocuments] = useState([]);

//   const chatRoomKeyValue = useRecoilValue(chatRoomKey);
//   console.log(chatRoomKeyValue)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const q = query(collection(db, "chatRoom"), where("emails", "array-contains", "23aw0102@jec.ac.jp"));
//         const querySnapshot = await getDocs(q);
//         const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
//         setDocuments(data);
//       } catch (error) {
//         console.error("Error fetching documents: ", error);
//         Alert.alert("Error", "ドキュメントの取得中にエラーが発生しました。");
//       }
//     };

//     fetchData();
//   }, []);

//   const handleRoomSelect = (id) => {
//     setChatRoomKey(id); // Recoilの状態を更新
//   }

//   return (
//     <View style={styles.container}>
//       {documents.length > 0 ? (
//         documents.map((doc) => (
//           <View key={doc.id} style={styles.card}>
//             <Text>Emails: {doc.emails.join(', ')}</Text>
//             <Text>Room ID: {doc.roomId}</Text>
//             <Text>番号: {doc.id}</Text>
//             <Link href='/home/chat/chatRoom' asChild>
//               <Button title={doc.roomName} onPress={() => handleRoomSelect(doc.id)} />
//             </Link>
//           </View>
//         ))
//       ) : (
//         <Text>No documents found</Text>
//       )}
//       <Link href='/home/createGroupChat' asChild>
//         <Button title="グループ作成"/>
//       </Link>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   card: {
//     padding: 10,
//     marginVertical: 5,
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//   },
// });