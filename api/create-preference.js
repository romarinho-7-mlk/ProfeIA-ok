import { MercadoPagoConfig, Preference } from 'mercadopago';

// Configuração do Mercado Pago
// O Access Token deve ser adicionado nas variáveis de ambiente da Vercel
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export default async function handler(req, res) {
    // Apenas permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { planName, planPrice, email } = req.body;

    if (!planName || !planPrice) {
        return res.status(400).json({ error: 'Dados do plano ausentes' });
    }

    if (!process.env.MP_ACCESS_TOKEN) {
        console.error('ERRO: MP_ACCESS_TOKEN não configurado.');
        return res.status(500).json({ error: 'Configuração do servidor incompleta. Configure o MP_ACCESS_TOKEN.' });
    }

    try {
        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: planName.toLowerCase().replace(/\s/g, '-'),
                        title: `ProfeIA - Plano ${planName}`,
                        unit_price: Number(planPrice),
                        quantity: 1,
                        currency_id: 'BRL',
                    }
                ],
                payer: {
                    email: email || 'test_user_123@testuser.com', // Email opcional do usuário logado
                },
                back_urls: {
                    success: `${req.headers.origin}/?payment=success`,
                    failure: `${req.headers.origin}/?payment=failure`,
                    pending: `${req.headers.origin}/?payment=pending`,
                },
                auto_return: 'approved',
                notification_url: 'https://profeia.vercel.app/api/webhook-mp', // Futuro endpoint de webhook
            }
        });

        // Retorna o init_point (link de checkout)
        return res.status(200).json({ id: result.id, initPoint: result.init_point });
    } catch (error) {
        console.error('Erro ao criar preferência MP:', error);
        return res.status(500).json({
            error: 'Erro ao gerar link de pagamento',
            details: error.message
        });
    }
}
