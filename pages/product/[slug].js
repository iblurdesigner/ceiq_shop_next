import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/Layout';
import data from '../../utils/data';

export default function ProductScreen() {
  const { query } = useRouter();
  const { slug } = query;
  const product = data.products.find((x) => x.slug === slug);
  if (!product) {
    return <div>Producto no encontrado</div>;
  }
  return (
    <Layout title={product.name} description={product.description}>
      <div className="py-2">
        <Link href="/">Regresar a productos</Link>
      </div>
      <div className="grid md:grid-cols-4 md:gap-3">
        <div className="md:col-span-2">
          <Image
            src={product.image}
            alt={product.name}
            width={500}
            height={500}
            layout="responsive"
          ></Image>
        </div>
        <div>
          <ul>
            <li>
              <h1 className="text-lg">{product.name}</h1>
            </li>
            <li>Categoría: {product.category}</li>
            <li>Marca: {product.brand}</li>
            <li>
              Calificaciones: {product.rating} estrellas ({product.numReviews}{' '}
              revisiones)
            </li>
            <li>Descripción: {product.description}</li>
          </ul>
        </div>
        <div>
          <div className="card p-5">
            <div className="mb-2 flex justify-between">
              <div>Precio</div>
              <div>${product.price}</div>
            </div>
            <div className="mb-2 flex justify-between">
              <div>Estado</div>
              <div>
                {product.countInStock > 0 ? 'En stock' : 'No disponible'}
              </div>
            </div>
            <button className="primary-button w-full">Añadir al carrito</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
