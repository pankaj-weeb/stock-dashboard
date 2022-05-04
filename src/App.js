import React, { useState, useEffect, useMemo } from "react";
import Table from "./Table";
import "./App.css";
import axios from 'axios';
import styled from 'styled-components'



function App() {
  // data state to store the TV Maze API data. Its initial value is an empty array
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [fullData, setFullData] = useState();
  const [size, setSize] = useState(0);
  const [mainStrikePrice, setMainStrikePrice] = useState(0);
  const [mainStrikePriceIndex, setMainStrikePriceIndex] = useState(0);


  const Styles = styled.div`
  padding: 1rem;

  .strike-price {
    background-color: white;
    font-size: 1.5vw
  }

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

  const callBlock = ({ values }) => {
    // Loop through the array and create a badge-like component instead of a comma-separated string
    return (
      <>
        {values.map((genre, idx) => {
          return (
            <span key={idx} className="badge">
              {genre}
            </span>
          );
        })}
      </>
    );
  };

  const columns = useMemo(
    () => [
      {
        // first group - TV Show
        Header: "CALL",
        // First group columns
        columns: [

          {
            Header: "LTP",
            accessor: "CE.lastPrice"
          },
          {
            Header: "OI",
            accessor: "CE.openInterest"
          }
          , {
            Header: "COI",
            accessor: "CE.changeinOpenInterest"
          }
        ]
      },
      {
        // first group - TV Show
        Header: "STRIKE",
        // First group columns
        columns: [
          {
            Header: "PRICE",
            accessor: "PE.strikePrice",
            className: 'strike-price',
            style: {
              fontWeight: 'bolder',
            },
          },
        ]
      },
      {
        // first group - TV Show
        Header: "PUT",
        // First group columns
        columns: [
          {
            Header: "LTP",
            accessor: "PE.lastPrice"
          },
          {
            Header: "OI",
            accessor: "PE.openInterest"
          },
          {
            Header: "COI",
            accessor: "PE.changeinOpenInterest"
          }
        ]
      },
    ],
    []
  );


  useEffect(() => {
    console.log('MAIN STRIKE PRICE CHANGED TO', fullData)
    if (data) {
      // var parseDataArr = parseData()
      // console.log('parseDataArr : ', JSON.stringify(parseDataArr));
      // setData(parseDataArr)
    }
  }, [mainStrikePrice])


  const getData = () => {
    (async () => {
      try {
        console.log("Data call");
        const header = {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'data'
        }
        const result = await axios.get("https://solid-cars-look-106-223-7-6.loca.lt/api", {
          headers: header
        });
        if (result.data) {
          console.log("Data result", result.data.records.data.length);
          var mainValue = result.data.records.underlyingValue;
          setMainStrikePrice(mainValue)
          setSize(result.data.records.data.length)
          setFullData(result.data)
          setData(parseData(result.data.filtered.data, mainValue));
        }
        setError('');
      } catch (e) {
        setError(JSON.stringify(e));
        console.log("ERROR :", e.message);
      }
    })();
  }
  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    setInterval(() => {
      console.log('GET DATA : ')
      getData();
    }, 10000);
  }, []);

  const parseData = (arrData, mainValue) => {
    var res = [];
    console.log('start parseData : ', JSON.stringify(data))
    if (arrData && arrData.length > 0) {
      var index = 0;
      var diff = 1000000;
      arrData.forEach((item, i) => {
        console.log('item  diff: ', Math.abs(item.strikePrice - mainValue))

        if (Math.abs(item.strikePrice - mainValue) < diff) {
          diff = Math.abs(item.strikePrice - mainValue);
          index = i;

        }
      })
      setMainStrikePriceIndex(index)
      var startIndex = index - 11;
      var endIndex = index + 10;
      for (var k = startIndex; k < endIndex; k++) {
        res.push(arrData[k]);
      }
      console.log('Index  res: ', index, res.length, JSON.stringify(res))
    }
    return res;
  }


  console.log('RENDERINGGGGGGGGGG: ', data.length)
  return (

    <div
      className="App">
      <div
        className="rows"
        style={{
          backgroundColor: '#ADD8E6',
          // display: 'flex',
          //  justifyContent: 'center',
          // alignItems: 'center',
          padding: 50,
        }}
      >
        {error.length > 0 && < div className='row Error'> <strong >ERROR :  </strong> {error}</div>}
        <div className='row'> <strong>Total Data :  </strong> {size}</div>
        <div className='row' > <strong>Main Strike Price :  </strong>{mainStrikePrice}</div>
        <div className='row' ><strong>Updated at :  </strong>{new Date().toLocaleString('en-us')
        }</div>

        <div
          style={{
            backgroundColor: '#ADD8E6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Styles>
            <Table
              columns={columns}
              data={data}
              getCellProps={(cellInfo, celli) => ({
                style: celli == 3 ? {
                  fontSize: window.innerWidth * 0.02,
                  backgroundColor: cellInfo.value == data[11].strikePrice ? `hsl(${120 * ((120 - cellInfo.value) / 120) * -1 +
                    120}, 100%, 67%)` : 'white',
                } : {
                  fontSize: window.innerWidth * 0.02,
                },
              })}
            />
          </Styles>
        </div>
      </div>
    </div >
  );
}

export default App;