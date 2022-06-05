import React, { useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import db from "../utils/db";
import Product from "../models/Product";
import ProductItem from "../components/ProductItem";
import { Store } from "../utils/Store";
import axios from "axios";
import {
  Box,
  Button,
  MenuItem,
  Select,
  Rating,
  Pagination,
} from "@mui/material";
import ButtonCloseUi from "../components/ButtonCloseUi";

const PAGE_SIZE = 3;

const prices = [
  {
    name: "$1 a $50",
    value: "1-50",
  },
  {
    name: "$51 a $200",
    value: "51-200",
  },
  {
    name: "$201 a $1000",
    value: "201-1000",
  },
];

const ratings = [1, 2, 3, 4, 5];

export default function Search(props) {
  const router = useRouter();
  const {
    query = "all",
    category = "all",
    brand = "all",
    price = "all",
    rating = "all",
    sort = "featured",
  } = router.query;

  const { products, countProducts, categories, brands, pages } = props;

  const filterSearch = ({
    page,
    category,
    brand,
    sort,
    min,
    max,
    searchQuery,
    price,
    rating,
  }) => {
    const path = router.pathname;
    const { query } = router;
    if (page) query.page = page;
    if (searchQuery) query.searchQuery = searchQuery;
    if (sort) query.sort = sort;
    if (category) query.category = category;
    if (brand) query.brand = brand;
    if (price) query.price = price;
    if (rating) query.rating = rating;
    // eslint-disable-next-line no-unused-expressions
    if (min) query.min ? query.min : query.min === 0 ? 0 : min;
    // eslint-disable-next-line no-unused-expressions
    if (max) query.max ? query.max : query.max === 0 ? 0 : max;

    router.push({
      pathname: path,
      query,
    });
  };
  const categoryHandler = (e) => {
    filterSearch({ category: e.target.value });
  };
  const pageHandler = (e, page) => {
    filterSearch({ page });
  };
  const brandHandler = (e) => {
    filterSearch({ brand: e.target.value });
  };
  const sortHandler = (e) => {
    filterSearch({ sort: e.target.value });
  };
  const priceHandler = (e) => {
    filterSearch({ price: e.target.value });
  };
  const ratingHandler = (e) => {
    filterSearch({ rating: e.target.value });
  };

  const { state, dispatch } = useContext(Store);
  const addToCartHandler = async (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Lo sentimos. El producto ya no está en stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };
  return (
    <Layout title="Búsqueda">
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
        <div>
          <ul>
            <li className="mb-6">
              <Box className="w-full">
                <p className="text-xl font-light mb-2">Categorías</p>
                <Select
                  className="w-full h-10"
                  value={category}
                  onChange={categoryHandler}
                >
                  <MenuItem value="all">Todo</MenuItem>
                  {categories &&
                    categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </li>
            <li className="mb-6">
              <Box>
                <p className="text-xl font-light mb-2">Marcas</p>
                <Select
                  value={brand}
                  onChange={brandHandler}
                  className="w-full h-10"
                >
                  <MenuItem value="all">Todas</MenuItem>
                  {brands &&
                    brands.map((brand) => (
                      <MenuItem key={brand} value={brand}>
                        {brand}
                      </MenuItem>
                    ))}
                </Select>
              </Box>
            </li>
            <li className="mb-6">
              <Box>
                <p className="text-xl font-light mb-2">Precios</p>
                <Select
                  value={price}
                  onChange={priceHandler}
                  className="w-full h-10"
                >
                  <MenuItem value="all">Todos</MenuItem>
                  {prices.map((price) => (
                    <MenuItem key={price.value} value={price.value}>
                      {price.name}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </li>
            <li className="mb-6">
              <Box>
                <p className="text-xl font-light mb-2">Calificaciones</p>
                <Select
                  value={rating}
                  onChange={ratingHandler}
                  className="w-full h-10"
                >
                  <MenuItem value="all">Todo</MenuItem>
                  {ratings.map((rating) => (
                    <MenuItem dispaly="flex" key={rating} value={rating}>
                      <Rating value={rating} readOnly />
                      <span className="text-xs"> o más</span>
                    </MenuItem>
                  ))}
                </Select>
              </Box>
            </li>
          </ul>
        </div>
        <div className="col-span-3">
          <div className="flex justify-between items-center">
            <div className="bg-gray-200 rounded-full py-2 px-4 text-blue">
              {products.length === 0 ? "No hay" : countProducts} Resultados
              {query !== "all" && query !== "" && " : " + query}
              {category !== "all" && " : " + category}
              {brand !== "all" && " : " + brand}
              {price !== "all" && " : Price " + price}
              {rating !== "all" && " de " + rating + " estrellas o más"}
              {(query !== "all" && query !== "") ||
              category !== "all" ||
              brand !== "all" ||
              rating !== "all" ||
              price !== "all" ? (
                <Button
                  onClick={() => router.push("/search")}
                  className="bg-green"
                >
                  <ButtonCloseUi />
                </Button>
              ) : null}
            </div>
            <div className="flex justify-between items-center">
              <p className="text-lg mr-4">Ordenar por</p>
              <Select value={sort} onChange={sortHandler} className="h-8">
                <MenuItem value="featured">Filtrado por:</MenuItem>
                <MenuItem value="lowest">Precio: bajo a alto</MenuItem>
                <MenuItem value="highest">Precio: alto a bajo</MenuItem>
                <MenuItem value="toprated">Revisiones de producto</MenuItem>
                <MenuItem value="newest">Artículos recientes</MenuItem>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-3 mt-6">
            {products.map((product) => (
              <ProductItem
                product={product}
                key={product.slug}
                addToCartHandler={addToCartHandler}
              ></ProductItem>
            ))}
          </div>
          <Pagination
            defaultPage={parseInt(query.page || "1")}
            count={pages}
            onChange={pageHandler}
            className="mt-6"
          ></Pagination>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  await db.connect();
  const pageSize = query.pageSize || PAGE_SIZE;
  const page = query.page || 1;
  const category = query.category || "";
  const brand = query.brand || "";
  const price = query.price || "";
  const rating = query.rating || "";
  const sort = query.sort || "";
  const searchQuery = query.query || "";

  //   criterios de busqueda

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};
  const categoryFilter = category && category !== "all" ? { category } : {};
  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};

  // 10-50  filtrar por preecios
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  //  busquedas por ordenes
  const order =
    sort === "featured"
      ? { featured: -1 }
      : sort === "lowest"
      ? { price: 1 }
      : sort === "highest"
      ? { price: -1 }
      : sort === "toprated"
      ? { rating: -1 }
      : sort === "newest"
      ? { createdAt: -1 }
      : { _id: -1 };

  const categories = await Product.find().distinct("category");
  const brands = await Product.find().distinct("brand");
  const productDocs = await Product.find(
    {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...brandFilter,
      ...ratingFilter,
    },
    "-reviews"
  )
    .sort(order)
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .lean();

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...categoryFilter,
    ...priceFilter,
    ...brandFilter,
    ...ratingFilter,
  });
  await db.disconnect();

  const products = productDocs.map(db.convertDocToObj);

  return {
    props: {
      products,
      countProducts,
      page,
      pages: Math.ceil(countProducts / pageSize),
      categories,
      brands,
    },
  };
}
