import { Button } from "@/components/Button";
import { Table } from "@/components/Table";

export const Dashboard = () => {
  // Definimos las columnas
  const columns = [
    { name: "Cliente", uuid: "cliente" },
    { name: "Embarcación", uuid: "embarcacion" },
    { name: "Técnico", uuid: "tecnico" },
    { name: "Hora de Entrada", uuid: "horaEntrada" },
    { name: "Coordenadas Entrada", uuid: "coordenadasEntrada" },
    { name: "Hora de Salida", uuid: "horaSalida" },
    { name: "Coordenadas Salida", uuid: "coordenadasSalida" },
    { name: "Asignado por", uuid: "asignadoPor" },
    { name: "Materiales Próximos", uuid: "materiales" },
    { name: " ", uuid: "btn" },
  ];

  // Creamos datos mock
  const data = [
    {
      id: 1,
      cliente: "Cliente A",
      embarcacion: "Embarcación Alfa",
      tecnico: "Técnico 1",
      horaEntrada: "2025-01-27 08:00",
      coordenadasEntrada: "18.4567, -69.9876",
      horaSalida: "2025-01-27 14:00",
      coordenadasSalida: "18.4567, -69.9876",
      asignadoPor: "Gerente X",
      materiales: "Cables, herramientas básicas",
      btn: <Button width="w-min">detalles</Button>
    },
    {
      id: 2,
      cliente: "Cliente B",
      embarcacion: "Embarcación Beta",
      tecnico: "Técnico 2",
      horaEntrada: "2025-01-27 09:00",
      coordenadasEntrada: "18.7890, -70.1234",
      horaSalida: "2025-01-27 15:30",
      coordenadasSalida: "18.7890, -70.1234",
      asignadoPor: "Gerente Y",
      materiales: "Sensores, equipo de seguridad",
      btn: <Button width="w-min">detalles</Button>
    },
    {
      id: 3,
      cliente: "Cliente C",
      embarcacion: "Embarcación Gamma",
      tecnico: "Técnico 3",
      horaEntrada: "2025-01-27 10:00",
      coordenadasEntrada: "19.3456, -70.5678",
      horaSalida: "2025-01-27 16:00",
      coordenadasSalida: "19.3456, -70.5678",
      asignadoPor: "Gerente Z",
      materiales: "Repuestos, manuales técnicos",
      btn: <Button width="w-min">detalles</Button>
    },
  ];
  return (
    <>
      <main className="flex flex-col justify-start items-start h-full w-full overflow-x-auto">
        {/* Div que simula el encabezado */}
        <div className="w-full bg-[#83A6CE] leading-normal rounded-t-lg">
        </div>
        <Table columns={columns} data={data} />
      </main>
    </>
  );
};
