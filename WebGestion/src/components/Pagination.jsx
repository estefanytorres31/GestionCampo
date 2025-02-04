const Pagination = ({ pagination, setPage }) => {
  return (
    <div className="flex justify-between items-center">
      <button
        disabled={pagination.page === 1}
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <span>
        Página {pagination.page} de {pagination.totalPages}
      </span>

      <button
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="bg-blue-900 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
};

export default Pagination;