import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, Text, View, Image } from "react-native";
import { supabase } from "./supabase";
import { COLORS } from "./utils/colors";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import AdditionalInfoForm from "./screens/AdditionalInfoForm";
import HomeScreen from "./screens/HomeScreen";
import OrdersScreen from "./screens/OrdersScreen";
import ProfileScreen from "./screens/ProfileScreen";
import TrackScreen from "./screens/TrackScreen";
import { SCREENS } from "./utils/constants";
import EditProfileScreen from "./screens/EditProfileScreen";
import { Alert } from "react-native";

import Header from "./components/Header";
import TabBar from "./components/TabBar";
import CartModal from "./modals/CartModal";
import CheckoutModal from "./modals/CheckoutModal";

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [user, setUser] = useState(null);
  const [showAdditionalForm, setShowAdditionalForm] = useState(false);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [activeOrder, setActiveOrder] = useState(null);
  const [address, setAddress] = useState('Av. Paulista, 1000');
  const [payment, setPayment] = useState('Pix');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.user) {
        const loggedUser = data.session.user;
        
        // Verifica se existe na tabela usuarios
        const { data: usuarioData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', loggedUser.id)
          .single();
        
        if (!usuarioData) {
          setUser(loggedUser);
          setShowAdditionalForm(true);
        } else {
          setUser(loggedUser);
          setScreen(SCREENS.HOME);
        }
      }

      await fetchCategories();
      await fetchProducts();
      setLoadingData(false);
    };
    init();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (!error) setCategories(data);
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (!error) setProducts(data);
  }

  const cartDetailed = cart.map((ci) => ({
    ...products.find((p) => p.id === ci.id),
    qty: ci.qty,
  }));
  const subtotal = cartDetailed.reduce((s, it) => s + it.price * it.qty, 0);
  const delivery = cartDetailed.length ? 8.9 : 0;
  const total = subtotal + delivery;

  function addToCart(p) {
    setCart((prev) => {
      const f = prev.find((x) => x.id === p.id);
      if (f) return prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: p.id, qty: 1 }];
    });
    setCartOpen(true);
  }

  function changeQty(id, delta) {
    setCart((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x)).filter((x) => x.qty > 0)
    );
  }

  function handleLogin(loggedUser) {
    setUser(loggedUser);
    setScreen(SCREENS.HOME);
  }

  function placeOrder() {
    if (!cartDetailed.length) { Alert.alert('Carrinho vazio'); return; }
    const id = Math.floor(Math.random() * 900000 + 100000);
    const order = {
      id, items: cartDetailed, subtotal, delivery, total,
      address, payment, status: 'recebido', createdAt: new Date().toISOString(),
    };
    setOrders([order, ...orders]);
    setActiveOrder(order);
    setCart([]);
    setCartOpen(false);
    setCheckoutOpen(false);
    setScreen(SCREENS.TRACK);

    setTimeout(() => setActiveOrder((o) => o ? { ...o, status: 'preparando' } : o), 2500);
    setTimeout(() => setActiveOrder((o) => o ? { ...o, status: 'a caminho' } : o), 6000);
    setTimeout(() => setActiveOrder((o) => o ? { ...o, status: 'entregue' } : o), 10000);
  }

  if (loadingData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar barStyle="light-content" />
        <Image source={require('./assets/TurboDrink.png')} style={{ width: 150, height: 150 }} />
        <Text style={{ color: COLORS.text, marginTop: 20 }}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" />

      {!user && screen === SCREENS.LOGIN && (
        <LoginScreen onLoginSuccess={handleLogin} onSignupNavigate={() => setScreen(SCREENS.SIGNUP)} />
      )}
      {!user && screen === SCREENS.SIGNUP && (
        <SignupScreen
          onSignup={(dados) => { setUser({ name: dados.nome, email: dados.email }); setScreen(SCREENS.HOME); }}
          onBack={() => setScreen(SCREENS.LOGIN)}
        />
      )}

      {user && showAdditionalForm && (
        <AdditionalInfoForm user={user} onComplete={() => { setShowAdditionalForm(false); setScreen(SCREENS.HOME); }} />
      )}

      {user && !showAdditionalForm && (
        <>
          <Header onOpenCart={() => setCartOpen(true)} cartCount={cart.reduce((s, x) => s + x.qty, 0)} />

          {screen === SCREENS.HOME && (
            categories.length > 0 && products.length > 0 ? (
              <HomeScreen query={query} onQuery={setQuery} categories={categories} cat={cat} onCat={setCat} products={products} onAdd={addToCart} />
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: COLORS.text }}>Carregando produtos...</Text>
              </View>
            )
          )}

          {screen === SCREENS.ORDERS && (
            <OrdersScreen orders={orders} onOpen={(ord) => { setActiveOrder(ord); setScreen(SCREENS.TRACK); }} />
          )}

          {screen === SCREENS.PROFILE && (
            <ProfileScreen 
              user={user} 
              onLogout={async () => {
                await supabase.auth.signOut();
                setUser(null);
                setScreen(SCREENS.LOGIN);
              }}
              onEditProfile={() => setScreen(SCREENS.EDIT_PROFILE)} 
            />
          )}

          {screen === SCREENS.EDIT_PROFILE && (
            <EditProfileScreen 
              user={user} 
              onBack={() => setScreen(SCREENS.PROFILE)} // volta para o perfil
            />
          )}

          {screen === SCREENS.TRACK && activeOrder && (
            <TrackScreen order={activeOrder} onBackHome={() => setScreen(SCREENS.HOME)} />
          )}

          <TabBar current={screen} onChange={setScreen} />

          <CartModal open={cartOpen} items={cartDetailed} subtotal={subtotal} delivery={delivery} total={total} onClose={() => setCartOpen(false)} onMinus={(id) => changeQty(id, -1)} onPlus={(id) => changeQty(id, +1)} onCheckout={() => setCheckoutOpen(true)} />

          <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} address={address} setAddress={setAddress} payment={payment} setPayment={setPayment} total={total} onConfirm={placeOrder} />
        </>
      )}
    </SafeAreaView>
  );
}
