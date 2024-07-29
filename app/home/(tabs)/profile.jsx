import { useState, useEffect } from 'react';
import { Button, Image, View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const hobbyTag = ["音楽", "ファッション", "ゲーム", "動物", "旅行", "テクノロジー", "美しさ", "健康", "バッグ", "アクセサリー", "建築", "美術", "スポーツ", "映画", "ドラマ"];

const FirstUser = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [userEmail, setUserEmail] = useState(null);
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [userText, setUserText] = useState('');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (userEmail) {
        try {
          const docSnap = await getDoc(doc(db, 'users', userEmail));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setImageUrl(data.imageUrl);
            setName(data.name);
            setSelectedTags(data.tag || []);
            setUserText(data.userText);
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        }
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        setUserEmail(user.email);
      }
    });

    fetchUserData(); // 最初のレンダリング時に実行
    return () => unsubscribe(); // クリーンアップ関数を返す
  }, [userEmail]);

  const uploadImage = async () => {
    let downloadURL = imageUrl; // 初期値は現在の imageUrl に設定

    if (image) {
      const response = await fetch(image);
      const blob = await response.blob();
      const storageRef = ref(storage, 'images/' + new Date().toISOString());
      const snapshot = await uploadBytes(storageRef, blob);
      downloadURL = await getDownloadURL(snapshot.ref);

      // 古い画像を削除
      if (imageUrl) {
        const previousImageRef = ref(storage, imageUrl);
        deleteObject(previousImageRef).catch((error) => {
          console.error('Failed to delete previous image:', error);
        });
      }
    }

    // Firestoreに名前、タグ、テキスト、画像URLを保存
    await setDoc(doc(db, 'users', userEmail), {
      imageUrl: downloadURL,
      name: name,
      tag: selectedTags,
      userText: userText,
    });

    // Firestoreから最新のユーザーデータを取得
    const fetchUserData = async () => {
      if (userEmail) {
        try {
          const docSnap = await getDoc(doc(db, 'users', userEmail));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setImageUrl(data.imageUrl);
            setName(data.name);
            setSelectedTags(data.tag || []);
            setUserText(data.userText);
          }
        } catch (error) {
          console.error('Error fetching document: ', error);
        }
      }
    };
    fetchUserData();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imagePickerContainer}>
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : imageUrl ? (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        ) : (
          <Text>No image available</Text>
        )}
      </View>

      <Text>Name:</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} />

      <Text>Tag:</Text>
      <View style={styles.tagContainer}>
        {hobbyTag.map((hobby) => (
          <TouchableOpacity
            key={hobby}
            style={[
              styles.tagButton,
              selectedTags.includes(hobby) && styles.tagButtonSelected
            ]}
            onPress={() => toggleTag(hobby)}
          >
            <Text style={[
              styles.tagButtonText,
              selectedTags.includes(hobby) && styles.tagButtonTextSelected
            ]}>{hobby}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>User Text:</Text>
      <TextInput value={userText} onChangeText={setUserText} style={styles.input} />

      <Button title="送信" onPress={uploadImage} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tagButton: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    margin: 5,
    backgroundColor: 'transparent',
  },
  tagButtonSelected: {
    backgroundColor: '#000',
  },
  tagButtonText: {
    color: '#000',
  },
  tagButtonTextSelected: {
    color: '#fff',
  },
});

export default FirstUser;

// import React, { useState, useEffect } from 'react';
// import { Button, Image, View, Text, StyleSheet } from 'react-native';
// import { auth, db } from '../../../firebase';
// import { doc, getDoc } from 'firebase/firestore';
// import { Link } from 'expo-router';

// const FirstUser = () => {
//   const [imageUrl, setImageUrl] = useState(null);
//   const [userEmail, setUserEmail] = useState(null);
//   const [name, setName] = useState('');
//   const [tag, setTag] = useState([]);
//   const [userText, setUserText] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (userEmail) {
//         try {
//           const docSnap = await getDoc(doc(db, 'users', userEmail));
//           if (docSnap.exists()) {
//             const data = docSnap.data();
//             setImageUrl(data.imageUrl);
//             setName(data.name);
//             setTag(data.tag);
//             setUserText(data.userText);
//           }
//         } catch (error) {
//           console.error('Error fetching document: ', error);
//         }
//       }
//     };

//     const unsubscribe = auth.onAuthStateChanged(user => {
//       if (user) {
//         setUserEmail(user.email);
//         fetchUserData(); // ユーザーがログインしている場合にデータをフェッチ
//       }
//     });

//     return () => unsubscribe(); // クリーンアップ関数を返す
//   }, [userEmail]);

//   return (
//     <View style={styles.container}>
//       <Image source={{ uri: imageUrl }} style={styles.image} />
//       <Text style={styles.label}>名前:</Text>
//       <Text style={styles.value}>{name}</Text>
//       <Text style={styles.label}>タグ:</Text>
//       <View style={styles.tagContainer}>
//         {tag.map((t, index) => (
//           <Text key={index} style={styles.tag}>{t}</Text>
//         ))}
//       </View>
//       <Text style={styles.label}>ユーザーテキスト:</Text>
//       <Text style={styles.value}>{userText}</Text>
//       <Link href='/home/profile/edit' asChild>
//         <Button title='編集'/>
//       </Link>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   image: {
//     width: 200,
//     height: 200,
//     borderRadius: 100,
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 16,
//     marginBottom: 15,
//   },
//   tagContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: 15,
//   },
//   tag: {
//     backgroundColor: '#007AFF',
//     color: '#fff',
//     borderRadius: 15,
//     paddingVertical: 5,
//     paddingHorizontal: 10,
//     margin: 5,
//     fontSize: 14,
//   },
// });

// export default FirstUser;
