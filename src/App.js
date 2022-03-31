import React, { useState, useEffect, useRef } from "react";
import { MdOutlineDelete } from "react-icons/md";
import Chart from "chart.js/auto";
import { borderColor, backgroundColor } from "./chartColors";

function App() {
  const [charge1, setCharge1] = useState("");
  const [charge2, setCharge2] = useState("");
  const [distance, setDistance] = useState("");
  const [label, setLabel] = useState("");
  const [data, setData] = useState([
    {
      charge1: 0.005,
      charge2: 0.005,
      distance: 100,
      label: "F1",
      force: 22.5,
    },
    {
      charge1: 0.005,
      charge2: 0.005,
      distance: 50,
      label: "F2",
      force: 90,
    },
    {
      charge1: 0.005,
      charge2: 0.005,
      distance: 25,
      label: "F3",
      force: 360,
    },
  ]);
  const [chart, setChart] = useState();
  const canvas = useRef();

  const format = (num) => parseFloat(num.toFixed(5));

  function addMeasurement(e) {
    e.preventDefault();
    let numericalInputs = [charge1, charge2, distance];
    numericalInputs = numericalInputs.map((i) =>
      Function("return " + i.replace("^", "**"))()
    );

    const [q1, q2, d] = numericalInputs;
    const K = 9 * 10 ** 9;
    const force = (K * (q1 * q2)) / d ** 2;

    // addPoint(chart, label, force);
    setData([
      ...data,
      {
        charge1: q1,
        charge2: q2,
        distance: d,
        label,
        force,
      },
    ]);
  }

  useEffect(() => {
    const chartObject = new Chart(canvas.current.getContext("2d"), {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Force",
            data: [],
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: 1,
            tension: 0.25,
          },
          // // {
          // //   label: "Distance",
          // //   data: [],
          // //   backgroundColor: backgroundColor,
          // //   borderColor: borderColor,
          // //   borderWidth: 1,
          // // },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });

    setChart(chartObject);
  }, []);

  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data);
    });
    chart.update();
  }

  function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
      dataset.data.pop();
    });
    chart.update();
  }

  useEffect(() => {
    if (!chart || !data) return;
    console.log("updating chart data");
    removeData(chart);
    data.forEach((d) => {
      addData(chart, d.label, d.force);
    });
  }, [data, chart]);

  return (
    <>
      <h1 className="text-2xl my-6 text-center mx-3 sm:text-3xl font-semibold tracking-wider">
        ElectroStatic Force Calculator
      </h1>

      <section class="md:my-10 lg:h-min">
        <form
          id="form"
          onSubmit={addMeasurement}
          className="w-11/12 px-4 sm:px-6 rounded-md bg-gray-900 relative m-auto py-3 lg:col-span-2"
        >
          <h2>Input</h2>
          <div className="pt-3">
            <p>Charge 1:</p>
            <input
              type="text"
              placeholder="3*10^-6"
              required
              onChange={(e) => setCharge1(e.target.value)}
            />
          </div>
          <div>
            <p>Charge 2:</p>
            <input
              type="text"
              required
              placeholder="-3*10^-6"
              onChange={(e) => setCharge2(e.target.value)}
            />
          </div>
          <div>
            <p>Distance:</p>
            <input
              type="text"
              required
              placeholder="0.19"
              onChange={(e) => setDistance(e.target.value)}
            />
          </div>
          <div>
            <p>Label:</p>
            <input
              id="label-input"
              type="text"
              required
              placeholder="Calculation 1"
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <br />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white px-6 py-2 mb-6 mt-0"
          >
            Calculate
          </button>
        </form>
        <div className="my-5 page-padding md:mt-10 lg:col-span-4 lg:my-0 lg:self-start">
          <h2>Results</h2>
          <p id="result">{data.length < 1 ? "Nothing to see yet!" : ""}</p>
          <canvas ref={canvas} id="chart"></canvas>
        </div>
        <div className="grid w-full page-padding py-4 gap-2 grid-cols-2 pb-8 lg:col-span-6 lg:self-start lg:p-4 lg:grid-cols-5 md:grid-cols-3">
          {data.map((entry, i) => (
            <div className="relative card py-3 bg-blue-300 text-black opacity-80 rounded-md">
              <div
                onClick={() => {
                  removeData(i);
                }}
                className="absolute top-2 right-2 w-5 sm:w-6 cursor-pointer"
              >
                <MdOutlineDelete className="w-full h-auto" />
              </div>
              <h3 className="text-lg sm:text-xl sm:my-1 lg:text-2xl lg:my-2">
                <i>{entry.label}</i>
              </h3>
              <p>
                Charge A: <strong>{format(entry.charge1)}</strong>
              </p>
              <p>
                Charge B: <strong>{format(entry.charge2)}</strong>
              </p>
              <p>
                Distance: <strong>{format(entry.distance)}</strong>
              </p>
              <div className="py-0.5 my-0.5 w-full bg-black md:my-1 lg:my-2"></div>
              <p>
                <span className="">
                  Force: <strong>{format(entry.force)}</strong>
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
      <p className="lg:cols-span-2 lg:justify-center lg:place-self-center md:text-lg lg:text-xl">
        ©2022{" "}
        <a
          className="underline lg:-mt-96"
          target="_blank"
          href="https://hammaadmemon.com"
        >
          Hammaad Memon
        </a>
      </p>
    </>
  );
}

export default App;
