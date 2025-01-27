import React from "react";

export const Table = ({ columns, data, render }) => {
  return (
    <>
      <table>
        <thead>
          <tr>
            {columns?.map(({ name, uuid }) => (
              <th key={uuid} className={uuid}>
                {name || uuid}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map(({ uuid }) => (
                <td key={uuid} className={uuid}>
                  {render && render[uuid] ? render[uuid](row) : row[uuid]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
