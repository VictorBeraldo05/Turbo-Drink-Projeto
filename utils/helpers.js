export function currency(n) {
  return `R$ ${n.toFixed(2).replace('.', ',')}`;
}