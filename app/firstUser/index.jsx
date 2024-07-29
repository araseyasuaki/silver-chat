import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Image, View, Text, ScrollView, StyleSheet, TextInput } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { auth, storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const hobbyTag = ["音楽", "ファッション", "ゲーム", "動物", "旅行", "テクノロジー", "美しさ", "健康", "バッグ", "アクセサリー", "建築", "美術", "スポーツ", "映画", "ドラマ"];

const Index = () => {
  const router = useRouter();
  const [image, setImage] = useState(null);
  const [previousImageUrl, setPreviousImageUrl] = useState(null);
  const [name, setName] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [userText, setUserText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

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
    const fetchPreviousImageUrl = async () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser(user);
        const docSnap = await getDoc(doc(db, "users", user.email));
        if (docSnap.exists()) {
          setPreviousImageUrl(docSnap.data().imageUrl);
        }
      }
    };
    fetchPreviousImageUrl();
  }, []);

  const uploadImage = async () => {
    if (!image) return;

    // 古い画像を削除
    if (previousImageUrl) {
      const previousImageRef = ref(storage, previousImageUrl);
      deleteObject(previousImageRef).catch((error) => {
        console.error('Failed to delete previous image:', error);
      });
    }

    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, 'images/' + new Date().toISOString());

    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log('Uploaded a blob or file!');
      getDownloadURL(snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);

        // Firestoreに名前、タグ、テキスト、画像URLを保存
        await setDoc(doc(db, "users", currentUser.email), {
          name: name,
          tag: selectedTags,
          userText: userText,
          imageUrl: downloadURL
        });
        console.log('Document successfully written!');
        
        // ページ移動
        router.push('/firstUser/choice');
      });
    }).catch((error) => {
      console.error('Upload failed:', error);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imagePickerContainer}>
        <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
          <Text style={styles.pickButtonText}>写真を選択</Text>
        </TouchableOpacity>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <Text style={styles.heading}>趣味タグ:</Text>
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
      {currentUser && (
        <View style={styles.userInfo}>
          <Text>現在ログイン中のユーザー: {currentUser.email}</Text>
        </View>
      )}
      <View>
        <Text>名前:</Text>
        <TextInput value={name} onChangeText={setName} placeholder="名前を入力してください" />
        <Text>テキスト:</Text>
        <TextInput value={userText} onChangeText={setUserText} placeholder="テキストを入力してください" />
      </View>
      <TouchableOpacity style={styles.uploadButton} onPress={uploadImage} disabled={!image || !currentUser}>
        <Text style={styles.uploadButtonText}>送信</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#C995E0',
  },
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pickButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  userInfo: {
    marginTop: 20,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Index;
