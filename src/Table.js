import React from "react";
import { useTable } from "react-table";

const defaultPropGetter = () => ({})


export default function Table({
    columns,
    data,
    getCellProps = defaultPropGetter,
}) {
    // Use the useTable Hook to send the columns and data to build the table
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
        rows, // rows for the table based on the data passed
        prepareRow // Prepare the row (this function needs to be called for each row before getting the row props)
    } = useTable({
        columns,
        data
    });

    /* 
      Render the UI for your table
      - react-table doesn't have UI, it's headless. We just need to put the react-table props from the Hooks, and it will do its magic automatically
    */
    return (
        <table
            style={{
                backgroundColor: '#00FFFF',
                alignSelf: "center",
                border: 'solid 1px black',
                marginTop: 40,
                borderRadius: '5px',
                borderSpacing: 0
            }}
            {...getTableProps()}>
            <thead

            >
                {headerGroups.map(headerGroup => (
                    <tr
                        {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th
                                style={{
                                    //paddingRight: window.innerWidth * 0.01,
                                    //paddingLeft: window.innerWidth * 0.01,
                                    textAlign: "center",
                                    color: 'Blue',
                                    backgroundColor: 'white',
                                    fontSize: window.innerWidth * 0.02,
                                    border: 'solid 1px black',
                                }}
                                {...column.getHeaderProps()}>{column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody
                {...getTableBodyProps()}>
                {rows.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr
                            {...row.getRowProps()}>
                            {row.cells.map((cell, celli) => {
                                return <td
                                    style={{
                                        textAlign: "center",
                                        color: 'black',
                                        width: window.innerWidth * 0.12,
                                        border: 'solid 1px gray',
                                        fontSize: window.innerWidth * 0.015,

                                    }}
                                    {...cell.getCellProps([
                                        {
                                            className: cell.column.className,
                                            style: cell.column.style,
                                        },
                                        getCellProps(cell, celli),
                                    ])}>{cell.render("Cell")}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table >
    );
}