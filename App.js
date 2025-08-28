import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar } from "react-native";
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
import { Alert } from "react-native";

import Header from "./components/Header";
import TabBar from "./components/TabBar";
import CartModal from "./modals/CartModal";
import CheckoutModal from "./modals/CheckoutModal";

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOGIN);
  const [user, setUser] = useState(null);
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('');
  const [cart, setCart] = useState([]); // {id, qty}
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orders, setOrders] = useState([]); // {id, items, total, status, createdAt}
  const [activeOrder, setActiveOrder] = useState(null);
  const [address, setAddress] = useState('Av. Paulista, 1000');
  const [payment, setPayment] = useState('Pix');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      console.error('Erro ao buscar categorias:', error);
    } else {
      console.log('Categorias do banco:', data); // 👈 veja no console
      setCategories(data);
    }
  }

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      console.error('Erro ao buscar produtos:', error);
    } else {
      setProducts(data);
    }
  }

  // Derived

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
      if (f)
        return prev.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...prev, { id: p.id, qty: 1 }];
    });
    setCartOpen(true);
  }
  function changeQty(id, delta) {
    setCart((prev) =>
      prev
        .map((x) => (x.id === id ? { ...x, qty: x.qty + delta } : x))
        .filter((x) => x.qty > 0)
    );
  }

  function handleLogin(email) {
    setUser({
      name: email || 'Cliente Turbo',
      email: email || 'cliente@turbodrink.app',
    });
    setScreen(SCREENS.HOME);
  }

  function placeOrder() {
    if (!cartDetailed.length) {
      Alert.alert('Carrinho vazio');
      return;
    }
    const id = Math.floor(Math.random() * 900000 + 100000);
    const order = {
      id,
      items: cartDetailed,
      subtotal,
      delivery,
      total,
      address,
      payment,
      status: 'recebido',
      createdAt: new Date().toISOString(),
    };
    setOrders([order, ...orders]);
    setActiveOrder(order);
    setCart([]);
    setCartOpen(false);
    setCheckoutOpen(false);
    setScreen(SCREENS.TRACK);
    // Simulate status updates
    setTimeout(
      () => setActiveOrder((o) => (o ? { ...o, status: 'preparando' } : o)),
      2500
    );
    setTimeout(
      () => setActiveOrder((o) => (o ? { ...o, status: 'a caminho' } : o)),
      6000
    );
    setTimeout(
      () => setActiveOrder((o) => (o ? { ...o, status: 'entregue' } : o)),
      10000
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="light-content" />
      {!user && screen === SCREENS.LOGIN && (
        <LoginScreen onLoginSuccess={handleLogin} 
        onSignupNavigate={() => setScreen(SCREENS.SIGNUP)}/>
      )}
    {!user && screen === SCREENS.SIGNUP && (
      <SignupScreen
        onSignup={(dados) => {
          // aqui você poderia salvar num backend
          setUser({ name: dados.nome, email: dados.email });
          setScreen(SCREENS.HOME);
        }}
        onBack={() => setScreen(SCREENS.LOGIN)}
      />
    )}
      {user && (
        <>
          <Header
            onOpenCart={() => setCartOpen(true)}
            cartCount={cart.reduce((s, x) => s + x.qty, 0)}
          />
          {screen === SCREENS.HOME && (
            <HomeScreen
              query={query}
              onQuery={setQuery}
              categories={categories}
              cat={cat}
              onCat={setCat}
              products={products}
              onAdd={addToCart}
            />
          )}
          {screen === SCREENS.ORDERS && (
            <OrdersScreen
              orders={orders}
              onOpen={(ord) => {
                setActiveOrder(ord);
                setScreen(SCREENS.TRACK);
              }}
            />
          )}
          {screen === SCREENS.PROFILE && (
            <ProfileScreen
              user={user}
              address={address}
              setAddress={setAddress}
              payment={payment}
              setPayment={setPayment}
            />
          )}
          {screen === SCREENS.TRACK && activeOrder && (
            <TrackScreen
              order={activeOrder}
              onBackHome={() => setScreen(SCREENS.HOME)}
            />
          )}

          <TabBar current={screen} onChange={setScreen} />

          <CartModal
            open={cartOpen}
            items={cartDetailed}
            subtotal={subtotal}
            delivery={delivery}
            total={total}
            onClose={() => setCartOpen(false)}
            onMinus={(id) => changeQty(id, -1)}
            onPlus={(id) => changeQty(id, +1)}
            onCheckout={() => setCheckoutOpen(true)}
          />

          <CheckoutModal
            open={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            address={address}
            setAddress={setAddress}
            payment={payment}
            setPayment={setPayment}
            total={total}
            onConfirm={placeOrder}
          />
        </>
      )}
    </SafeAreaView>
  );
}