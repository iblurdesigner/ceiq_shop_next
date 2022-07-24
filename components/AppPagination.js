// import { useEffect, useState } from 'react';
// import ReactPaginate from 'react-paginate';

// export function AppPagination(products) {
//   const [currentItems, setCurrentItems] = useState([]);
//   const [pageCount, setPageCount] = useState(0);
//   const [itemOffset, setItemOffset] = useState(0);
//   const itemsPerPage = 6;

//   useEffect(() => {
//     const endOffset = itemOffset + itemsPerPage;
//     console.log(`Loading items from ${itemOffset} to ${endOffset}`);
//     setCurrentItems(products.slice(itemOffset, endOffset));
//     setPageCount(Math.ceil(products.length / itemsPerPage));
//   }, [itemOffset, itemsPerPage, products]);

//   const handlePageClick = (event) => {
//     const newOffset = (event.selected * itemsPerPage) % products.length;
//     setItemOffset(newOffset);
//   };

//   return (
//     <>
//       <ReactPaginate
//         breakLabel="..."
//         nextLabel="siguiente >"
//         onPageChange={handlePageClick}
//         pageRangeDisplayed={3}
//         pageCount={pageCount}
//         previousLabel="< anterior"
//         renderOnZeroPageCount={null}
//       />
//     </>
//   );
// }

// const pageSize = 10;
// export default function AppPagination({
//   countProducts,
//   products,
//   setPost,
//   pages,
// }) {
//   const [pagination, setPagination] = useState({
//     count: 0,
//     from: 0,
//     to: pageSize,
//   });

//   const service = {
//     getData: ({ from, to }) => {
//       return new Promise((resolve, reject) => {
//         const data = products.slice(from, to);
//         resolve({
//           count: products.length,
//           data,
//         });
//       });
//     },
//   };

//   useEffect(() => {
//     service
//       .getData({ from: pagination.from, to: pagination.to })
//       .then((response) => {
//         setPagination({ ...pagination, count: response.count });
//         console.log('Resp Data', response.data);
//         setPost(response.data);
//       });
//   }, [pagination.from, pagination.to]);

//   // function divideArray(collec, size) {
//   //   const temp = [];
//   //   for (let i = 0; i < collec.length; i += size) {
//   //     temp.push(collec.slice(i, i + size));
//   //   }
//   //   return temp;
//   // }
//   // console.log('la division...', divideArray(theProducts, 10));
//   console.log('esots post', setPost);

//   const handlePageChange = (event, page) => {
//     const from = (page - 1) * pageSize;
//     const to = (page - 1) * pageSize + pageSize;

//     setPagination({ ...pagination, from, to });
//   };

//   return (
//     <Pagination
//       // count={Math.ceil(pagination.count / pageSize)}
//       onChange={handlePageChange}
//       count={pageSize}
//     />
//   );
// }
