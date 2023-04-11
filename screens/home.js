import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid, FlatList, } from 'react-native'
import React, {useState, useEffect } from 'react'
import FileViewer from 'react-native-file-viewer'
import DocumentPicker from 'react-native-document-picker'
import SQLite  from 'react-native-sqlite-storage'
import Permissions from 'react-native-permissions';

const Home = () => {
  const [permission, setPermission] = useState(null);
  const db = SQLite.openDatabase({ name: 'mydatabase.db' });
  const [myDocuments, setMyDocuments] = useState([]);

 useEffect(() => {
  checkPermission();
  }, []);
  
useEffect(()=>{
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS files (id INTEGER PRIMARY KEY AUTOINCREMENT, file_uri TEXT)',
      [],
      () => {
        console.log('Table created successfully');
      },
      (tx, error) => {
        console.error('Error creating table', error);
      },
    );
  });
  fetchDocument();
}, []);


const checkPermission = async () => {
  try {
    const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
    if (!granted) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Permission Request',
          message: 'App needs access to your storage',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the storage');
        setPermission("granted");
      } else {
        setPermission("Denied")
        console.log('Storage permission denied');
      }
    }
  } catch (err) {
    console.warn(err);
  }
};


const saveDocument = async ()=>{
  try {
    const res = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    // console.log((res[0].uri).replace("content://", "file://"));
    try {
      db.transaction(tx => {
        console.log(res[0].uri);
        tx.executeSql(
          'INSERT INTO files (file_uri) VALUES (?)',
          [(res[0].uri).replace("content://com.coloros.filemanager/file_share", "file://")],
          (tx, results) => {
            console.log('File URI saved to database');
          },
          (tx, error) => {
            console.error('Error saving file URI to database', error);
          },
        );
      });
    } catch (error) {
      console.error('Error saving file URI to database', error);
    }
    // await FileViewer.open(res[0].uri);
  } catch (e) {
    console.log(e);
  }
}
const fetchDocument = async ()=>{
  db.transaction(tx => {
    tx.executeSql(
      'SELECT file_uri FROM files',
      [],
      (tx, results) => {
        for (let i = 0; i < results.rows.length; i++) {
          const fileUri = results.rows.item(i).file_uri;
          console.log(fileUri);
          myDocuments.length = 0;
          myDocuments.push(fileUri);
          setMyDocuments(myDocuments);
          // FileViewer.open(fileUri)
          //   .then(() => {
          //     console.log('File is opened');
          //   })
          //   .catch(error => {
          //     console.log('Error opening file', error);
          //   });
        }
      },
      (tx, error) => {
        console.error('Error retrieving file URI from database', error);
      },
    );
  });
}
const openDocument = async () =>{
  try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      console.log(res[0].uri);
      await FileViewer.open(res[0].uri);
    } catch (e) {
      console.log(e);
  }
}

  return (
    <SafeAreaView style = {styles.container}>
        <Text style={styles.title}>Document Reader</Text>
      <TouchableOpacity
       onPress={saveDocument}
       style={styles.btn}>
        <Text style={styles.btnText}>Save File</Text>
      </TouchableOpacity>
      {console.log(typeof(myDocuments) + "   test")}
      <FlatList 
        data={myDocuments}
      // key={myDocuments}
        renderItem={(item)=>{
          <TouchableOpacity>
            <Text>{item.item}jgk</Text>
          </TouchableOpacity>
        }}
      />
      {/* <TouchableOpacity
      onPress={fetchDocument}
      style={styles.btn}>
        <Text style={styles.btnText}>Fetch File</Text>
      </TouchableOpacity> */}
      <TouchableOpacity
      onPress={openDocument}
      style={styles.btn}>
        <Text style={styles.btnText}>Open Local File</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title:{
        fontSize: 30,
        fontWeight: 'bold',
        color: 'green',
        marginBottom: '30%',
    },
    btn:{
        marginVertical: 20,
        backgroundColor: 'green',
        paddingHorizontal: 20,
        paddingVertical:10,
        borderRadius: 10,
    },
    btnText:{
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold'
    },
})