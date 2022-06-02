import nc from 'next-connect';
import { isAdmin, isAuth } from '../../../../../utils/auth';
import User from '../../../../../models/User';
import db from '../../../../../utils/db';

const handler = nc();
handler.use(isAuth, isAdmin);

handler.get(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  await db.disconnect();
  res.send(user);
});

handler.put(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    user.name = req.body.name;
    user.isAdmin = Boolean(req.body.isAdmin);
    // user.slug = req.body.slug;
    // user.price = req.body.price;
    // user.category = req.body.category;
    // user.image = req.body.image;
    // user.brand = req.body.brand;
    // user.rating = req.body.rating;
    // user.numReviews = req.body.numReviews;
    // user.countInStock = req.body.countInStock;
    // user.description = req.body.description;
    await user.save();
    await db.disconnect();
    res.send({ message: 'El usero se ha actualizado con éxito' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'No se encuentra el Usero' });
  }
});

handler.delete(async (req, res) => {
  await db.connect();
  const user = await User.findById(req.query.id);
  if (user) {
    await user.remove();
    await db.disconnect();
    res.send({ message: 'Usero eliminado' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'No se encuentra el Usero' });
  }
});

export default handler;
