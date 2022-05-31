import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../utils/auth';
import Product from '../../../../models/Product';
import db from '../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const products = await Product.find({});
  await db.disconnect();
  res.send(products);
});

handler.post(async (req, res) => {
  await db.connect();
  const newProduct = new Product({
    name: 'nombre del producto',
    slug: 'ejemplo-slug-' + Math.random(),
    image: '/images/surgical-skin-1.jpg',
    price: 0,
    category: 'colocar la categoría',
    brand: 'colocar la marca',
    countInStock: 0,
    description: 'colocar la descripción',
    rating: 0,
    numReviews: 0,
    code: '001',
  });

  const product = await newProduct.save();
  await db.disconnect();
  res.send({ message: 'Producto creado', product });
});

export default handler;
