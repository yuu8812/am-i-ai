import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const RateChart = ({
  data,
}: {
  data: {
    humanNess: number[];
    humanDetect: number[];
    dates: Date[];
  };
}) => {
  const max = Math.max(...data.humanNess, ...data.humanDetect);
  const min = Math.min(...data.humanNess, ...data.humanDetect);
  const paddingSize = (max - min) / 8;
  return (
    <Line
      className="w-full h-full flex flex-1"
      data={{
        labels: data.dates,
        datasets: [
          {
            data: data.humanDetect,
            borderColor: "#ad0f0f", // 線の色
            borderWidth: 2, // 線の太さ
            fill: false, // 塗りつぶしを無効化
            tension: 0.4, // 曲線を描く
            label: "HumanDetectRate", // 凡例
          },
          {
            data: data.humanNess,
            borderColor: "#404dcb", // 線の色
            borderWidth: 2, // 線の太さ
            fill: false, // 塗りつぶしを無効化
            tension: 0.4, // 曲線を描く
            label: "HumanNessRate", // 凡例
          },
        ],
      }}
      options={{
        layout: {},
        scales: {
          x: {
            display: false, // x軸を非表示
          },
          y: {
            display: false, // y軸を非表示
            min: min - paddingSize,
            max: max + paddingSize,
          },
        },
        plugins: {
          legend: {
            onClick: () => null,
            align: "start",
          },
          tooltip: {
            callbacks: {
              label: function (ctx) {
                return `${ctx.raw}`; // カスタムラベル
              },
              title: function () {
                return ""; // タイトルを空にする
              },
            },
            padding: 10,
            boxPadding: 10,
          },
        },
        elements: {
          point: {
            radius: 4,
          },
        },
      }}
    />
  );
};

export default RateChart;
