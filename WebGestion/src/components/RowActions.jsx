import Button from "@/components/Button";
import { MdEdit, MdDelete } from "react-icons/md";

const RowActions = ({ row, onEdit, onDelete }) => {
  return (
    <>
      <Button color="icon" onClick={() => onEdit(row)}>
        <MdEdit size={20} className="min-w-max" />
      </Button>
      <Button color="icon" onClick={() => onDelete(row)}>
        <MdDelete size={20} className="min-w-max" />
      </Button>
    </>
  );
};

export default RowActions;
