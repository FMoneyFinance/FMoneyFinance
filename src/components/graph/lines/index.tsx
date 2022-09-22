import React, { useState, useEffect } from "react";
import { Area, Axis, Chart, Geom, Line, LineAdvance, Tooltip } from "bizcharts";
import "./index.scss";

function GraphLines({ config }: any) {
  const [priceSelected, setPriceSelected] = useState("14.4");
  const [dateSelected, setDateSelected] = useState("June 13");
  const [indexDateSelected, setIndexDateSelected] = useState(1);

  const width = window.innerWidth;
  const data = [
    {
      month: "June 1",
      city: "Tokyo",
      temperature: 4
    },

    {
      month: "June 4",
      city: "Tokyo",
      temperature: 6
    },

    {
      month: "June 7",
      city: "Tokyo",
      temperature: 8
    },

    {
      month: "June 10",
      city: "Tokyo",
      temperature: 12
    },

    {
      month: "June 13",
      city: "Tokyo",
      temperature: 9
    },

    {
      month: "June 16",
      city: "Tokyo",
      temperature: 7.5
    },

    {
      month: "June 19",
      city: "Tokyo",
      temperature: 9.2
    },

    {
      month: "June 22",
      city: "Tokyo",
      temperature: 3.5
    },

    {
      month: "June 25",
      city: "Tokyo",
      temperature: 9.3
    },

    {
      month: "June 28",
      city: "Tokyo",
      temperature: 0
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setIndexDateSelected(2);
    }, 100);
  }, []);

  const handleChangeToolTip = (e: any) => {
    const values = e.data.items[0] || {};

    setPriceSelected(values.data.temperature || "0");
    setDateSelected(e.data.title || "June 13");
  };

  const Label = ({ item }: any) => {
    return <span>{item.month}</span>;
  };

  const ItemDate = ({ txt, index }: any) => {
    return (
      <div
        className={indexDateSelected == index ? "active" : ""}
        onClick={() => setIndexDateSelected(index)}
      >
        {txt}
      </div>
    );
  };

  return (
    <div className="graphComponent">
      <div className="indicators">
        <div className="left">
          <h2>${priceSelected}</h2>
          <h5>{dateSelected}, 2022, 09:48 PM</h5>
        </div>
        <div className="flex right">
          <ItemDate index={0} txt="24 H" />
          <ItemDate index={1} txt="1 W" />
          <ItemDate index={2} txt="1 M" />
          <ItemDate index={3} txt="1 Y" />
        </div>
      </div>
      <div className="dividor"></div>
      <Chart
        padding={[0, width * -0.04, 0, width * -0.04]}
        autoFit
        height={300}
        width={config?.width || width * 0.6}
        data={data}
        scale={{
          sales: {
            type: "cat"
          }
        }}
      >
        <LineAdvance
          shape="smooth"
          point
          area
          position="month*temperature"
          color="rgba(98, 154, 72, 0.14)"
        >
          <Area
            shape="smooth"
            position="month*temperature"
            color="l (270) 0:rgba(98, 154, 72, 0.05)  1:rgba(98, 154, 72, 0.14)"
          />
        </LineAdvance>
        <Tooltip
          onChange={handleChangeToolTip}
          visible={true}
          showCrosshairs
          showContent={false}
          showMarkers={false}
          domStyles={{
            "g2-tooltip": {
              "background-color": "red",
              "g2-tooltip": "red",
              "g2-tooltip-title": "red",
              "g2-tooltip-list": "red",
              "g2-tooltip-list-item": "red",
              "g2-tooltip-marker": "red",
              "g2-tooltip-value": "red",
              "g2-tooltip-name": "red"
            }
          }}
          crosshairs={{
            line: {
              style: {
                stroke: "#629a48",
                fillOpacity: 1
              }
            }
          }}
        />

        <Axis name="temperature" visible={false} />
        <Axis name="month" visible={false} />
      </Chart>
      <div className="containerLabels">
        {data.map((e) => (
          <Label item={e} />
        ))}
      </div>
    </div>
  );
}

export default GraphLines;
