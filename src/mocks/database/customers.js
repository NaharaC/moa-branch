export const customersDb = {
  users: [
    {
      id: "usr-001",
      firstName: "Camila",
      lastName: "López",
      email: "camila.lopez@example.com",
      phone: "+56 9 8765 4321",
      createdAt: "2023-08-12T16:25:00Z",
    },
    {
      id: "usr-002",
      firstName: "Diego",
      lastName: "Pizarro",
      email: "diego.pizarro@example.com",
      phone: "+56 9 9988 7766",
      createdAt: "2024-01-04T10:12:00Z",
    },
  ],
  addresses: [
    {
      id: "addr-001",
      userId: "usr-001",
      label: "Casa",
      street: "Av. Italia 1024",
      commune: "Providencia",
      city: "Santiago",
      region: "RM",
      country: "Chile",
      postalCode: "7500000",
      isDefault: true,
    },
    {
      id: "addr-002",
      userId: "usr-002",
      label: "Estudio",
      street: "José Manuel Infante 456",
      commune: "Providencia",
      city: "Santiago",
      region: "RM",
      country: "Chile",
      postalCode: "7500000",
      isDefault: true,
    },
  ],
  wishlists: [
    {
      id: "wish-001",
      userId: "usr-001",
      name: "Proyecto Loft",
      productIds: [201, 103, 102],
      updatedAt: "2024-04-10T14:22:00Z",
    },
  ],
  carts: [
    {
      id: "cart-001",
      userId: "usr-002",
      currency: "CLP",
      items: [
        { productId: 101, variantId: "nogal", quantity: 4 },
        { productId: 102, variantId: "lino-natural", quantity: 2 },
      ],
      updatedAt: "2024-04-18T09:30:00Z",
    },
  ],
};
