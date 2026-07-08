import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Required fields based on GestivaOne API
    const { client_name, client_email, product_name, amount, quantity } = body;

    if (!client_name || !client_email || !product_name || !amount || !quantity) {
      return NextResponse.json(
        { success: false, message: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GESTIVA_API_KEY;

    if (!apiKey) {
      console.error('API Key de Gestiva no configurada en el servidor.');
      return NextResponse.json(
        { success: false, message: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    const response = await fetch('https://uhbmoslwucdhwrkgdleo.supabase.co/functions/v1/crear-factura-bot/api/invoices/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify({
        client_name,
        client_email,
        product_name,
        amount,
        quantity,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error desde GestivaOne API:', data);
      return NextResponse.json(
        { success: false, message: data.message || 'Error al generar la factura en GestivaOne' },
        { status: response.status }
      );
    }

    console.log('✅ GestivaOne Factura Generada:', data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error interno al procesar la factura:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
