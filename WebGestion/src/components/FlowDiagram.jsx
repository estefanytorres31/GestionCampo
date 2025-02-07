import React from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { ParentNode, CustomNode } from "./CustomNodes";

const nodeTypes = {
  parentNode: ParentNode,
  custom: CustomNode,
};

const FlowDiagram = ({ detalle }) => {
  // Generar nodos base a partir de "detalle"
  const nodesList = [
    {
      id: "1",
      type: "parentNode",
      position: { x: -200, y: -250 },
      data: {
        label: detalle.codigo,
        subtext: `Fecha: ${new Date(detalle.fecha_asignacion).toLocaleDateString()}`,
      },
    },
    {
      id: "2",
      type: "custom",
      position: { x: -150, y: 100 },
      data: {
        label: "Empresa",
        subtext: detalle.embarcacion?.empresa?.nombre || "Sin información",
      },
    },
    {
      id: "3",
      type: "custom",
      position: { x: 150, y: 100 },
      data: {
        label: "Embarcación",
        subtext: detalle.embarcacion?.nombre || "Sin información",
      },
    },
    {
      id: "4",
      type: "custom",
      position: { x: 100, y: 250 },
      data: {
        label: "Puerto",
        subtext: detalle.puerto?.nombre || "Sin información",
      },
    },
    {
      id: "5",
      type: "custom",
      position: { x: 500, y: 50 },
      data: {
        label: "Jefe Asigna",
        subtext: detalle.jefe_asigna?.nombre_completo || "Sin información",
      },
    },
    {
      id: "6",
      type: "custom",
      position: { x: 600, y: -100 },
      data: {
        label: "Tipo de trabajo",
        subtext: detalle.tipo_trabajo?.nombre_trabajo || "Sin información",
      },
    },
  ];

  // Conexiones (edges) para los nodos base, todos conectados al nodo Código (id "1")
  const edgesList = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      animated: true,
      style: { stroke: "var(--border-color)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
    },
    {
      id: "e1-3",
      source: "1",
      target: "3",
      animated: true,
      style: { stroke: "var(--border-color)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
    },
    {
      id: "e1-4",
      source: "1",
      target: "4",
      animated: true,
      style: { stroke: "var(--border-color)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
    },
    {
      id: "e1-5",
      source: "1",
      target: "5",
      animated: true,
      style: { stroke: "var(--border-color)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
    },
    {
      id: "e1-6",
      source: "1",
      target: "6",
      animated: true,
      style: { stroke: "var(--border-color)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
    },
  ];

  // Procesar los usuarios en orden_trabajo_usuario
  const ordenUsuarios = detalle.orden_trabajo_usuario || [];
  const responsableItem = ordenUsuarios.find(
    (u) => u.rol_en_orden === "Responsable"
  );
  const ayudanteItems = ordenUsuarios.filter(
    (u) => u.rol_en_orden === "Ayudante"
  );

  if (responsableItem) {
    // Nodo para el usuario Responsable (id "7")
    nodesList.push({
      id: "7",
      type: "custom",
      position: { x: 50, y: 450 },
      data: {
        label: "Responsable",
        subtext: responsableItem.usuario?.nombre_completo || "Sin información",
      },
    });
    edgesList.push({
      id: "e1-7",
      source: "1",
      target: "7",
      animated: true,
      style: { stroke: "var(--border-color)", strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
    });

    // Nodos para cada Ayudante, conectados al Responsable (ids "8-0", "8-1", etc.)
    ayudanteItems.forEach((ayudante, index) => {
      const helperNodeId = `8-${index}`;
      nodesList.push({
        id: helperNodeId,
        type: "custom",
        position: { x: 300 + index * 200, y: 450 },
        data: {
          label: "Ayudante",
          subtext: ayudante.usuario?.nombre_completo || "Sin información",
        },
      });
      edgesList.push({
        id: `e1-${helperNodeId}`,
        source: "7",
        target: helperNodeId,
        animated: true,
        style: { stroke: "var(--border-color)", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "var(--border-color)" },
      });
    });
  }

  // Usar hooks para que React Flow administre el estado de nodos y edges
  const [nodes, setNodes, onNodesChange] = useNodesState(nodesList);
  const [edges, setEdges, onEdgesChange] = useEdgesState(edgesList);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
      >
        {/* Opcionalmente, puedes activar Background, Controls o MiniMap */}
        {/* <Background color="var(--border-color)" gap={16} /> */}
        {/* <Controls /> */}
        {/* <MiniMap nodeStrokeColor={() => "var(--border-color)"} /> */}
      </ReactFlow>
    </div>
  );
};

export default FlowDiagram;
