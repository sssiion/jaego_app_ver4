import {React,useState,useEffect} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import CategoryExpiryScreen from './CategoryExpiryScreen.js';
import CategoryConsumeScreen from './CategoryConsumeScreen.js';
import UrgentProductsScreen from './UrgentProductsScreen.js';



export default function MyPager({navigation}) {

  return (
    <PagerView style={styles.pagerView} initialPage={0}>
      <View key="1" style={styles.page}>
        <CategoryConsumeScreen navigation={navigation} type={String("소비")}  />
      </View>
      <View key="2" style={styles.page}>
        <CategoryConsumeScreen navigation={navigation} type={String("유통")} />
      </View>
      <View key="3" style={styles.page}>
        <UrgentProductsScreen navigation={navigation}/>
      </View>
    </PagerView>
  );
}

const styles = StyleSheet.create({
  pagerView: { flex: 1 },
  page: { backgroundColor: '#fff' },
  text: { fontSize: 24, fontWeight: 'bold' }
});
