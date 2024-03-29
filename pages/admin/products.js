import React, { useEffect, useContext, useReducer, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { getError } from "../../utils/error";
import { Store } from "../../utils/Store";
import Layout from "../../components/Layout";
import { useSnackbar } from "notistack";
import Image from "next/image";
import ReactPaginate from "react-paginate";
import dynamic from "next/dynamic";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, products: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
  }
}

function AdminProducts(props) {
  const router = useRouter();
  const { state } = useContext(Store);
  const { userInfo } = state;
  // ***** INICIO PRODUCTOS por pagina  *****
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [
    { loading, error, products, loadingCreate, loadingDelete, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    products: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get("/api/admin/products", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  // ***** para crear un producto y para eliminarlo ******
  const { enqueueSnackbar } = useSnackbar();
  const createHandler = async () => {
    if (!window.confirm("Está seguro de realizar este paso?")) {
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/admin/products",
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      enqueueSnackbar("Producto creado con exito", { variant: "success" });
      router.push(`/admin/product/${data.product._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  const deleteHandler = async (productId) => {
    if (!window.confirm("Está seguro de realizar esta acción?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/products/${productId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      enqueueSnackbar("Producto eliminado con exito", { variant: "success" });
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };
  // ***** FIN para crear un producto y para eliminarlo ******

  // ***** CONTINUA PRODUCTOS por pagina  *****
  const itemsPerPage = 6;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Cargando items desde ${itemOffset} hasta ${endOffset}`);
    setCurrentItems(products.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(products.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, products]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Layout title="Órdenes">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-screen">
          <div className="w-full h-fit">
            <div className="card p-6">
              <List>
                <Link href="/admin/dashboard" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Administración Dashboard"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/orders" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Órdenes"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/products" passHref>
                  <ListItem selected button component="a">
                    <ListItemText primary="Productos"></ListItemText>
                  </ListItem>
                </Link>
                <Link href="/admin/users" passHref>
                  <ListItem button component="a">
                    <ListItemText primary="Usuarios"></ListItemText>
                  </ListItem>
                </Link>
              </List>
            </div>
          </div>

          <div className="col-span-3">
            <div className="card w-full p-6">
              <ul>
                <li>
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl dark:text-cyan py-4">Productos</h1>
                    {loadingDelete && <CircularProgress />}
                    <button
                      className="bg-yellow dark:text-black rounded-full px-3 py-1 h-fit shadow-xl hover:bg-green"
                      onClick={createHandler}
                    >
                      Crear Producto
                    </button>
                    {loadingCreate && <CircularProgress />}
                  </div>
                </li>

                <li>
                  {loading ? (
                    <CircularProgress />
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div>
                      <div className="w-full dark:bg-transparent bg-gray-100">
                        <div className="w-full text-lg font-bold flex flex-row flex-wrap justify-between invisible md:visible">
                          <div className="py-2">IMAGEN</div>
                          <div className="py-2">NOMBRE</div>
                          <div className="py-2">PRECIO</div>
                          <div className="py-2">CATEGORIA</div>
                          <div className="py-2">CANTIDAD</div>
                          <div className="py-2">RATING</div>
                          <div className="py-2">ACCIONES</div>
                        </div>
                      </div>
                      <div>
                        {currentItems.map((product) => (
                          <div
                            key={product._id}
                            className="card md:flex md:flex-row md:justify-items-stretch md:justify-between px-2 py-6"
                          >
                            <div className="flex justify-between">
                              <span className="md:order-2 visible md:invisible">
                                IMAGEN
                              </span>
                              <Image
                                className="md:order-1"
                                src={product.image}
                                width={100}
                                height={50}
                              />
                            </div>

                            <div className="flex justify-between basis-1/6">
                              <p className="text-2xl text-cyan md:text-base">
                                {product.name}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 dark:bg-transparent bg-sky-200">
                              <span className="md:order-2 visible md:invisible">
                                PRECIO
                              </span>
                              <p className="md:order-1 text-2xl font-semibold">
                                ${product.price}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 dark:bg-transparent bg-sky-100">
                              <p className="md:order-2 mr-4 md:mr-0 text-sm visible md:invisible">
                                CATEGORÍA
                              </p>
                              <p className="md:order-1 text-lg md:text-base">
                                {product.category}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 dark:bg-transparent bg-sky-50">
                              <span className="md:order-2 visible md:invisible">
                                CANTIDAD
                              </span>
                              <p className="md:order-1 text-2xl md:text-base">
                                {product.countInStock}
                              </p>
                            </div>

                            <div className="flex justify-between basis-1/6 dark:bg-transparent bg-gray-100">
                              <span className="md:order-2 visible md:invisible">
                                RATING
                              </span>
                              <p className="md:order-1 text-2xl md:text-base">
                                {product.rating}
                              </p>
                            </div>

                            <div>
                              <Link
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <button className="bg-cyan dark:text-black text-xl font-semibold  md:text-base w-full mt-4 md:mt-0 rounded-full px-3 py-1 shadow-xl hover:bg-green">
                                  Editar
                                </button>
                              </Link>{" "}
                              <Link
                                href={`/admin/product/${product._id}`}
                                passHref
                              >
                                <button
                                  onClick={() => deleteHandler(product._id)}
                                  className="bg-red-400 dark:text-black text-xl font-semibold md:text-base w-full mt-4 md:mt-2 rounded-full px-3 py-1 shadow-xl hover:bg-red-200"
                                >
                                  Eliminar
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
                <li className="bg-orange">
                  <ReactPaginate
                    breakLabel="..."
                    nextLabel=">"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    pageCount={pageCount}
                    previousLabel="<"
                    renderOnZeroPageCount={null}
                    containerClassName="pagination"
                    pageLinkClassName="page-num"
                    previousClassName="page-num"
                    nextLinkClassName="page-num"
                    activeLinkClassName="active"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default dynamic(() => Promise.resolve(AdminProducts), {
  ssr: false,
});
