import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
import { db } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from "expo-router";

const hobbies = ["読書", "映画鑑賞", "スポーツ", "旅行", "音楽", "料理", "ゲーム", "アート", "プログラミング", "アウトドア"];

const addDocumentWithRoomId = async (emails, roomName, selectedTags, router) => {
  try {
    const roomId = uuidv4();
    await addDoc(collection(db, "chatRoom"), {
      emails: emails, // すでに配列として保持されている
      roomId: roomId,
      roomName: roomName,
      tags: selectedTags
    });
    router.push('/home/chat'); // 成功したらページ遷移
  } catch (e) {
    console.error("Error adding document: ", e);
    Alert.alert("Error", "Failed to add document. Please try again.");
  }
}

const App = () => {
  const [emailInputs, setEmailInputs] = useState(['']);
  const [roomName, setRoomName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const router = useRouter();

  const handleEmailChange = (text, index) => {
    const newEmailInputs = [...emailInputs];
    newEmailInputs[index] = text;
    setEmailInputs(newEmailInputs);
  };

  const addEmailInput = () => {
    setEmailInputs([...emailInputs, '']);
  };

  const toggleTag = (tag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag) 
        ? prevTags.filter(t => t !== tag) 
        : [...prevTags, tag]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>メールアドレス:</Text>
      {emailInputs.map((email, index) => (
        <TextInput
          key={index}
          style={styles.input}
          value={email}
          onChangeText={(text) => handleEmailChange(text, index)}
          placeholder="メールアドレスを入力"
        />
      ))}
      <Button title="メールアドレスを追加" onPress={addEmailInput} />
      <Text style={styles.label}>ルーム名:</Text>
      <TextInput
        style={styles.input}
        value={roomName}
        onChangeText={setRoomName}
        placeholder="ルーム名を入力"
      />
      <Text style={styles.label}>趣味タグ:</Text>
      <View style={styles.tagsContainer}>
        {hobbies.map((hobby) => (
          <View key={hobby} style={styles.tag}>
            <Button
              title={hobby}
              onPress={() => toggleTag(hobby)}
              color={selectedTags.includes(hobby) ? "blue" : "gray"}
            />
          </View>
        ))}
      </View>
      <Button
        title="Add Document"
        onPress={() => addDocumentWithRoomId(emailInputs, roomName, selectedTags, router)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  tag: {
    margin: 5,
  },
});

export default App;


// import React, { useState } from 'react';
// import { View, Text, Button, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';
// import { db } from '../../../firebase';
// import { collection, addDoc } from 'firebase/firestore';
// import { v4 as uuidv4 } from 'uuid';
// import { useRouter } from "expo-router";

// const hobbies = ["読書", "映画鑑賞", "スポーツ", "旅行", "音楽", "料理", "ゲーム", "アート", "プログラミング", "アウトドア"];

// const addDocumentWithRoomId = async (emails, roomName, selectedTags, router) => {
//   try {
//     const roomId = uuidv4();
//     await addDoc(collection(db, "chatRoom"), {
//       emails: emails.split(','), // カンマで区切られたメールアドレスを配列に変換
//       roomId: roomId,
//       roomName: roomName,
//       tags: selectedTags
//     });
//     router.push('/home/chat'); // 成功したらページ遷移
//   } catch (e) {
//     console.error("Error adding document: ", e);
//     Alert.alert("Error", "Failed to add document. Please try again.");
//   }
// }

// const App = () => {
//   const [emails, setEmails] = useState('');
//   const [roomName, setRoomName] = useState('');
//   const [selectedTags, setSelectedTags] = useState([]);
//   const router = useRouter();

//   const toggleTag = (tag) => {
//     setSelectedTags(prevTags => 
//       prevTags.includes(tag) 
//         ? prevTags.filter(t => t !== tag) 
//         : [...prevTags, tag]
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.label}>メールアドレス（カンマ区切り）:</Text>
//       <TextInput
//         style={styles.input}
//         value={emails}
//         onChangeText={setEmails}
//         placeholder="メールアドレスを入力"
//       />
//       <Text style={styles.label}>ルーム名:</Text>
//       <TextInput
//         style={styles.input}
//         value={roomName}
//         onChangeText={setRoomName}
//         placeholder="ルーム名を入力"
//       />
//       <Text style={styles.label}>趣味タグ:</Text>
//       <View style={styles.tagsContainer}>
//         {hobbies.map((hobby) => (
//           <View key={hobby} style={styles.tag}>
//             <Button
//               title={hobby}
//               onPress={() => toggleTag(hobby)}
//               color={selectedTags.includes(hobby) ? "blue" : "gray"}
//             />
//           </View>
//         ))}
//       </View>
//       <Button
//         title="Add Document"
//         onPress={() => addDocumentWithRoomId(emails, roomName, selectedTags, router)}
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   label: {
//     marginBottom: 10,
//     fontSize: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 20,
//     paddingLeft: 8,
//   },
//   tagsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 20,
//   },
//   tag: {
//     margin: 5,
//   },
// });

// export default App;