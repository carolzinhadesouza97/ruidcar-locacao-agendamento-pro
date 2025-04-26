
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { MercadoPagoConfig, Preference } from "https://esm.sh/mercadopago@2.0.6"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { workshopName, appointmentData, diagnosticValue } = await req.json()

    const client = new MercadoPagoConfig({
      accessToken: Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN')!,
    })

    const preference = new Preference(client)
    const result = await preference.create({
      items: [
        {
          title: `Diagnóstico - ${workshopName}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: diagnosticValue,
        },
      ],
      back_urls: {
        success: `${req.headers.get('origin')}/payment-success`,
        failure: `${req.headers.get('origin')}/payment-failure`,
      },
      auto_return: 'approved',
      external_reference: JSON.stringify(appointmentData),
    })

    return new Response(
      JSON.stringify({ 
        preferenceId: result.id,
        initPoint: result.init_point 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error creating payment preference:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
