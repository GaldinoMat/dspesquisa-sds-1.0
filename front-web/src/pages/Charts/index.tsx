import React, { useState, useEffect } from "react";
import Filters from "../../components/Filters";
import "./styles.css";
import { barOptions, pieOptions } from "./chart-options";
import Chart from "react-apexcharts";
import axios from "axios";
import { buildBarSeries, getPlatformChartData } from "./helpers";

type pieChartData = {
  labels: string[];
  series: number[];
};

type barChartData = {
  x: string;
  y: number;
};

const initialPieData = {
  labels: [],
  series: []
};

const BASE_URL = "http://localhost:8080";

const Charts = () => {
  const [barChartData, setBarCharData] = useState<barChartData[]>([]);
  const [platformData, setPlatformData] = useState<pieChartData>(initialPieData);
  const [genreData, setGenreData] = useState<pieChartData>(initialPieData);

  useEffect(() => {
    async function getData() {
      const recordsResponse = await axios.get(`${BASE_URL}/records`);
      const gamesResponse = await axios.get(`${BASE_URL}/games`);

      const barData = buildBarSeries(
        gamesResponse.data,
        recordsResponse.data.content
      );
      console.log(barData)
      setBarCharData(barData);

      const platformChartData = getPlatformChartData(
        recordsResponse.data.content
      );
      console.log(setPlatformData.length)
      setPlatformData(platformChartData);
    }
    getData();
  }, []);

  return (
    <div className="page-container">
      <Filters link="/records" linkText="VER TABELA" />
      <div className="chart-container">
        <div className="top-related">
          <h1 className="top-related-title">Jogos mais votados</h1>
          <div className="games-container">
            <Chart
              options={barOptions}
              type="bar"
              width="900"
              height="650"
              series={[{ data: barChartData }]}
            />
          </div>
        </div>
        <div className="charts">
          <div className="platform-chart">
            <h2 className="chart-title">Plataformas</h2>
            <Chart
              options={{ ...pieOptions, labels: platformData?.labels }}
              type="donut"
              series={[platformData?.series]}
              width="350"
            />
          </div>
          <div className="genre-chart">
            <h2 className="chart-title">Gêneros</h2>
            <Chart
              options={{ ...pieOptions, labels: genreData?.labels }}
              type="donut"
              series={genreData?.series}
              width="350"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
