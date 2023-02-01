import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SignIn from "../pages/SignIn";

const Pilha = createNativeStackNavigator();


function AuthRoutes(){
    return(
        <Pilha.Navigator>
            <Pilha.Screen name="SignIn" component={SignIn} options={{ headerShown: false}}/>
        </Pilha.Navigator>
    )
}

export default AuthRoutes;