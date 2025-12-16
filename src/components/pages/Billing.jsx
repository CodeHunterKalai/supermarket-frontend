const processBarcode = async (barcode) => {
  if (!barcode.trim()) return;

  try {
    const response = await productAPI.getByBarcode(barcode.trim());
    const product = response.data;

    if (product.status === "Out of Stock") {
      showAlert("danger", `${product.name} is out of stock`);
      return;
    }

    setBillItems((prevItems) => {
      const existingItem = prevItems.find(
        (item) => item.barcode === product.barcode
      );

      if (existingItem) {
        if (existingItem.quantity >= product.quantity) {
          showAlert(
            "warning",
            `Cannot add more. Only ${product.quantity} units available`
          );
          return prevItems;
        }

        showAlert("success", `Added 1 more ${product.name}`);

        return prevItems.map((item) =>
          item.barcode === product.barcode
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      showAlert("success", `Added ${product.name} to bill`);

      return [
        ...prevItems,
        {
          barcode: product.barcode,
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity: 1,
          availableStock: product.quantity,
        },
      ];
    });
  } catch (error) {
    showAlert("danger", "Product not found with barcode: " + barcode);
  }
};
