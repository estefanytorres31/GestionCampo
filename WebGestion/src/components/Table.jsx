// Table.jsx
import React from "react";

const Table = ({ columns, data, render = {}, loading, error }) => {
  return (
    <table
      className="table w-full border-collapse"
      style={{ background: "inherit" }}
    >
      <thead>
        <tr
          style={{
            background: "var(--table-header-bg)",
            color: "var(--table-header-text)",
          }}
        >
          {columns.map(({ name, uuid }) => (
            <th key={uuid} className={`p-2 text-left ${uuid}`}>
              {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan={columns.length} className="text-center p-6 h-32">
              <div className="flex h-full w-full justify-center items-center">
                <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="span-jetbrains ml-3 text-[--primary-text]">
                  Cargando datos...
                </span>
              </div>
            </td>
          </tr>
        ) : error ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center p-4 text-red-500"
            >
              Error: {error}
            </td>
          </tr>
        ) : data.length > 0 ? (
          data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="transition" /* Se mantiene la transición */
            >
              {columns.map(({ uuid }) => (
                <td
                  key={`${row.id || rowIndex}-${uuid}`}
                  className={`p-2 ${uuid}`}
                >
                  {render[uuid]
                    ? render[uuid](row)
                    : row[uuid] !== undefined
                    ? row[uuid]
                    : "-"}
                </td>
              ))}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={columns.length} className="text-center p-4">
              No hay datos disponibles.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
