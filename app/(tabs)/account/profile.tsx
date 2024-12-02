import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ScrollView } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { useUserStore } from '@/store';

const profilePage = () => {
  const user = useUserStore(st => st.user_metadata)
  const userEmail = useUserStore(st => st.email)
  return (
    <>
      <ScrollView
        style={{ paddingHorizontal: "3%" }}
        contentContainerStyle={{ paddingTop: "10%" }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderBottomColor: 'black',
            borderBottomWidth: 1,
          }}
        >
          <Ionicons
            name='person'
            size={150}
          />
          <Text
            style={{ fontSize: 60, fontWeight: 'bold', marginBottom: 40 }}
          >{user.full_name}
          </Text>
        </View>

        <View style={{
          paddingHorizontal: "5%",
          paddingVertical: "10%",
        }}>
        <Text
            style={{ fontSize: 20, marginBottom: 20 }}
          >Full Name: <Text style={{fontWeight: 'bold'}}>{user.full_name}</Text>
          </Text>
        <Text
            style={{ fontSize: 20, marginBottom: 20 }}
          >Email Address: <Text style={{fontWeight: 'bold'}}>{userEmail}</Text>
          </Text>
        <Text
            style={{ fontSize: 20, marginBottom: 20 }}
          >Location: <Text style={{fontWeight: 'bold'}}>{user.location.city}, {user.location.state}, {user.location.street}</Text>
          </Text>
        <Text
            style={{ fontSize: 20, marginBottom: 20 }}
          >Role: <Text style={{fontWeight: 'bold'}}>{user.role}</Text>
          </Text>
        </View>
      </ScrollView>
    </>
  )
}

export default profilePage;