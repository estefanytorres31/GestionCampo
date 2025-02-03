import React from "react";

export const Table = ({ columns, data }) => {
  return (
    <table className="w-full border-collapse border-blue-500">
      <thead>
        <tr className="bg-blue-400 text-white">
          {columns.map(({ name, uuid }) => (
            <th key={uuid} className=" p-2">
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr key={row.id || rowIndex} className=" ">
              {columns.map(({ uuid }) => (
                <td key={`${row.id || rowIndex}-${uuid}`} className="  p-2">
                  {row[uuid] !== undefined ? row[uuid] : "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center p-2">
              No hay datos disponibles.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};