export default function handler(req, res) {
  if (req.method === "GET") {
    res.status(200).json({
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    });
  } else {
    res.status(405).end("Metodo no aceptado");
  }
}
