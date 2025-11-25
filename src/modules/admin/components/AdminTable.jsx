import React from "react";

export default function AdminTable({ columns, data }) {  return (
    <table className="min-w-full bg-white border border-moa-neutral-200 rounded-lg shadow">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col} className="px-4 py-2 text-left text-moa-neutral-700 font-semibold border-b border-moa-neutral-100">{col}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx} className="hover:bg-moa-neutral-50">
            {columns.map((col) => (
              <td key={col} className="px-4 py-2 border-b border-moa-neutral-100">{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
