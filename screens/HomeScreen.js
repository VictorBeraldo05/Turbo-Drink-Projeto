import { useMemo } from 'react';
import { View, Text, FlatList, TextInput, ScrollView } from 'react-native';
import { COLORS } from '../utils/colors';
import { styles } from '../utils/styles';
import BrandMark from '../components/BrandMark';
import Chip from '../components/Chip';
import ProductCard from '../components/ProductCard';


export default function HomeScreen({ query, onQuery, categories, cat, onCat, products, onAdd }) {
    // Filtra produtos por categoria e busca
    const filteredProducts = useMemo(() => {
      return products.filter((p) => {
        const matchesCat = !cat || String(p.cat) === String(cat); // 'cat' da tabela products
        const matchesQuery = !query || p.name.toLowerCase().includes(query.toLowerCase());
        return matchesCat && matchesQuery;
      });
    }, [products, cat, query]);
  
    return (
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        data={filteredProducts}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={
          <>
            <View style={styles.banner}>
              <View style={{ flex: 1 }}>
                <Text style={styles.bannerTitle}>Bem-vindo à Turbo Drink</Text>
                <Text style={styles.bannerSub}>Entrega rápida para matar sua sede</Text>
              </View>
              <BrandMark size={72} />
            </View>
  
            <TextInput
              value={query}
              onChangeText={onQuery}
              placeholder="Buscar itens (ex: Heineken, Vodka...)"
              placeholderTextColor={COLORS.muted}
              style={styles.search}
            />
  
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 8 }}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
              <Chip label={'Tudo'} active={!cat} onPress={() => onCat(null)} />
              {categories.map((c) => (
                <Chip key={c.id} label={c.name} active={String(cat) === String(c.id)} onPress={() => onCat(c.id)} />
              ))}
            </ScrollView>
  
            <Text style={styles.sectionTitle}>Itens populares</Text>
          </>
        }
        renderItem={({ item }) => <ProductCard item={item} onAdd={() => onAdd(item)} />}
        ListEmptyComponent={
          <Text style={{ color: COLORS.muted, padding: 16 }}>Nenhum item encontrado.</Text>
        } 
      />
    );
  }