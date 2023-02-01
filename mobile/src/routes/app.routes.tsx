import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "../pages/Dashboard";
import Order from "../pages/Order";
import FinishOrder from "../pages/FinishOrder";

const Pilha = createNativeStackNavigator<ListaParamsPilha>();

export type ListaParamsPilha = {
    Dashboard: undefined;
    Order: {
        number: number | string;
        order_id: string;
    };
    FinishOrder: {
        number: number | string;
        order_id: string
    };
}

function AppRoutes() {
    return (
        <Pilha.Navigator>
            <Pilha.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
            <Pilha.Screen name="Order" component={Order} options={{ headerShown: false }} />
            <Pilha.Screen name="FinishOrder" component={FinishOrder}
                options={
                    {
                        title: 'Finalizando',
                        headerStyle: { backgroundColor: '#1d1d2e' },
                        headerTintColor: '#fff'
                    }
                }
            />
        </Pilha.Navigator>
    )
}

export default AppRoutes;