import React from "react";

export const Table = ({ columns, data, render }) => {
  return (
    <>
      <table>
        <thead>
          <tr className="bg-gray-200 text-gray-600 rounded-t-lg">
            {columns?.map(({ name, uuid }) => (
              <th key={uuid} className={uuid}>
                {name || uuid}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-300">
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
