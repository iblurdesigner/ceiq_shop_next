import Layout from '../components/Layout';
import ProductItem from '../components/ProductItem';
// import data from '../utils/data';
import db from '../utils/db';
import Product from '../models/Product';

export default function Home(props) {
  // Ya no necesitaremos pedir desde la base de datos estatica si no mediante las props
  const { products } = props;
  return (
    <Layout title="Pagina de inicio">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductItem product={product} key={product.slug}></ProductItem>
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find({}).lean();
  await db.disconnect();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}
