import React from "react";
import Image from "next/image";
import Link from "next/link";
import Carousel from "react-material-ui-carousel";
export const config = {
  unstable_runtimeJS: false,
};
function CarouselC({ featuredProducts }) {
  return (
    <Carousel animation="slide" className="rounded-lg">
      {featuredProducts.map((product) => (
        <Link key={product._id} href={`/product/${product.slug}`} passHref>
          <a>
            <Image
              src={product.featuredImage}
              placeholder="blur"
              blurDataURL={product.featuredImage}
              quality={90}
              alt={product.name}
              title={product.name}
              description={product.description}
              width={1500}
              height={400}
              priority={false}
            ></Image>
          </a>
        </Link>
      ))}
    </Carousel>
  );
}

function areEqual(prevProps, nextProps) {
  return prevProps.product === nextProps.product;
}

export default React.memo(CarouselC, areEqual);
