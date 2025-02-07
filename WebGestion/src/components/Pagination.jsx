import Button from "./Button";

const Pagination = ({ pagination, setPage }) => {
  return (
    <div className="flex justify-between items-center">
      <Button
        disabled={pagination.page === 1}
        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        className="disabled:opacity-50"
      >
        Anterior
      </Button>

      <span>
        Página {pagination.page} de {pagination.totalPages}
      </span>

      <Button
        disabled={pagination.page >= pagination.totalPages}
        onClick={() => setPage((prev) => prev + 1)}
        className="disabled:opacity-50"
      >
        Siguiente
      </Button>
    </div>
  );
};

export default Pagination;