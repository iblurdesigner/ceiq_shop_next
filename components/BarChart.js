import React, { useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function BarChart({ summary }) {
  const initialDates = summary.salesData.map((x) => x._id);
  const initialDataPoints = summary.salesData.map((x) => x.totalSales);

  const [dates, setDates] = useState(initialDates);
  const [dataPoints, setDataPoints] = useState(initialDataPoints);

  console.log(dates, dataPoints);

  const inputRef1 = useRef();
  const inputRef2 = useRef();

  function filterData() {
    const dates2 = [...dates];
    const dataPoints2 = [...dataPoints];

    // slice the array
    const value1 = inputRef1.current.value;
    const value2 = inputRef2.current.value;
    const indexstartdate = dates2.indexOf(value1);
    const indexenddate = dates2.indexOf(value2);
    console.log(indexstartdate);
    console.log(indexenddate);
    // slice the array
    const filterDate = dates2.slice(indexstartdate, indexenddate + 1);
    const filterDataPoints = dataPoints2.slice(
      indexstartdate,
      indexenddate + 1
    );

    console.log(filterDate, filterDataPoints);

    setDates(filterDate);
    setDataPoints(filterDataPoints);
    console.log(dates, dataPoints);
  }

  return (
    <div>
      <div>
        <Bar
          id="myChart"
          data={{
            labels: dates,

            datasets: [
              {
                label: "Sales",
                data: dataPoints,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                ],
                borderColor: [
                  "rgba(255, 99, 132, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(75, 192, 192, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
              },
            ],
          }}
          height={400}
          width={400}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
      <input type="month" ref={inputRef1} />
      <input type="month" ref={inputRef2} />
      <button onClick={filterData}>Filter</button>
    </div>
  );
}

export default BarChart;

// export default function BarChart({ summary }) {
//     const initialDates = summary.salesData.map((x) => x._id);
//     const initialDataPoints = summary.salesData.map((x) => x.totalSales);
//     const [dates, setDates] = useState(initialDates);
//     const [dataPoints, setDataPoints] = useState(initialDataPoints);

//     console.log('inital Dates: ', initialDates);
//     console.log('inital data points: ', initialDataPoints);

//     console.log('Dates y Datapoints', dates, dataPoints);

//     const inputRef1 = useRef();
//     const inputRef2 = useRef();

//     function filterData() {
//       const dates2 = [...dates];
//       const dataPoints2 = [...dataPoints];

//       const value1 = inputRef1.current.value;
//       const value2 = inputRef2.current.value;
//       const indexstartdate = dates2.indexOf(value1);
//       const indexenddate = dates2.indexOf(value2);
//       console.log('indexstartdate: ', indexstartdate);
//       console.log('indexenddate: ', indexenddate);
//       // slice the array
//       const filterDate = dates2.slice(indexstartdate, indexenddate + 1);
//       const filterDataPoints = dataPoints2.slice(
//         indexstartdate,
//         indexenddate + 1
//       );

//       console.log('filterDate, filterDataPoints: ', filterDate, filterDataPoints);

//       setDates(filterDate);
//       setDataPoints(filterDataPoints);
//       console.log('dates, dataPoints: ', dates, dataPoints);
//     }

//     return (
//       <div>
//         <div>
//           <Bar
//             data={{
//               labels: initialDates,
//               datasets: [
//                 {
//                   label: 'Ventas por mes',
//                   backgroundColor: 'rgba(162, 222, 208, 1)',
//                   data: initialDataPoints,
//                 },
//                 // {
//                 //   label: 'Ventas por año',
//                 //   backgroundColor: 'rgba(140, 122, 189, 1)',
//                 //   data: summary.ordersPrice,
//                 // },
//               ],
//             }}
//             options={{
//               legend: { display: true, position: 'right' },
//             }}
//           />
//         </div>
//         <div>
//           <input type="date" ref={inputRef1} />
//           <input type="date" ref={inputRef2} />
//           <button onClick={filterData}>Filtrar</button>
//         </div>
//       </div>
//     );
//   }
