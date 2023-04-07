export const AppRoutes = {
  home: '',
  inventory: {
    base: 'inventory',
    products: 'products',
    categories: 'categories',
    clients: 'clients',
    transactions: {
      base: 'transactions',
      purchases: {
        base: 'purchases',
        new: 'new',
        edit: 'edit',
        return: 'return',
      },
    },
  },
};
