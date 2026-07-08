const testInvoice = async () => {
  try {
    const res = await fetch('http://localhost:3000/api/invoices', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_name: "Test Direct Script",
        client_email: "test@example.com",
        product_name: "Servicio Directo de Prueba",
        amount: 50000,
        quantity: 1
      })
    });
    
    console.log("Status:", res.status);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Fetch failed:", err);
  }
};

testInvoice();
