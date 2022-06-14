/* eslint-disable testing-library/prefer-screen-queries */
/* eslint-disable testing-library/render-result-naming-convention */
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { fireEvent, render } from '@testing-library/react';
import ProductItem from '@/components/ProductItem';

test('render the content', (product) => {
  const productitem = {
    name: product.name,
    price: product.price,
    slug: `${product.slug}`,
    brand: product.brand,
    numReviews: product.numReviews,
  };

  const component = render(<ProductItem productitem={productitem} />);

  const el = component.getByText('revisiones');
  expect(el).toBeDefined();
  // expect(component.container).toHaveTextContent('revisiones');

  // console.log(container);
});

test('clicking the button calls event handler once', (product) => {
  const productitem = {
    name: product.name,
    price: product.price,
    slug: `${product.slug}`,
    brand: product.brand,
    numReviews: product.numReviews,
  };

  const component = render(
    <ProductItem productitem={productitem} addToCartHandler={() => {}} />
  );

  const button = component.getByText('Añadir al carrito');
  fireEvent.click(button);
});
