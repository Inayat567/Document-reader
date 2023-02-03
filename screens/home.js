import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import FileViewer from 'react-native-file-viewer'
import DocumentPicker from 'react-native-document-picker'

const Home = () => {
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
       onPress={openDocument}
       style={styles.btn}>
        <Text style={styles.btnText}>Open Local File</Text>
      </TouchableOpacity>
      <TouchableOpacity
      onPress={openDocument}
      style={styles.btn}>
        <Text style={styles.btnText}>Read File</Text>
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