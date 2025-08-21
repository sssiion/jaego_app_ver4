// App.js
import React from 'react';

import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {  createStackNavigator} from '@react-navigation/stack';

import CategoryExpiryScreen from './screens/CategoryExpiryScreen.js';
import CategoryConsumeScreen from './screens/CategoryConsumeScreen.js';
import UrgentProductsScreen from './screens/UrgentProductsScreen.js';
import CategoryProductsScreen  from './screens/CategoryProductsScreen.js';
import ProductDetailScreen  from './screens/ProductDetailScreen.js';
import BatchEditScreen from './screens/BatchEditScreen.js'
import MyPager from './screens/MyPager';

const Stack = createStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator  >
        <Stack.Screen
          name="myapp"
          component={MyPager}
                      />
        <Stack.Screen
          name="CategoryExpiry"
          component={CategoryExpiryScreen}
          options={{ title: '유통기한별 상품 분류' }}
        />
        <Stack.Screen
          name="CategoryConsume"
          component={CategoryConsumeScreen}
          options={{ title: '소비기한별 상품 분류' }}
        />
        <Stack.Screen
          name="UrgentProducts"
          component={UrgentProductsScreen}
          options={{ title: '임박 상품 모음' }}
        />
        <Stack.Screen
          name="CategoryProducts"
          component={CategoryProductsScreen}

        />

        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{ title: '제품 상세' }}
        />
        <Stack.Screen name="BatchEdit" component={BatchEditScreen} options={{ title: '유통기한/수량 수정' }} />

      </Stack.Navigator>


    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  pager: { flex: 1 }
});
