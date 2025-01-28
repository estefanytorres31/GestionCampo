/*
  Warnings:

  - The values [en_proceso,finalizado] on the enum `orden_trabajo_tarea_estado` will be removed. If these variants are still used in the database, this will fail.
  - The values [en_proceso,finalizado] on the enum `orden_trabajo_tarea_estado` will be removed. If these variants are still used in the database, this will fail.
  - The values [en_proceso,finalizado] on the enum `orden_trabajo_tarea_estado` will be removed. If these variants are still used in the database, this will fail.
  - The values [en_proceso,finalizado] on the enum `orden_trabajo_tarea_estado` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `orden_trabajo` MODIFY `estado` ENUM('pendiente', 'en_progreso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE `orden_trabajo_parte` MODIFY `estado` ENUM('pendiente', 'en_progreso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE `orden_trabajo_sistema` MODIFY `estado` ENUM('pendiente', 'en_progreso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente';

-- AlterTable
ALTER TABLE `orden_trabajo_tarea` MODIFY `estado` ENUM('pendiente', 'en_progreso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente';

-- CreateIndex
CREATE INDEX `idx_orden_trabajo_estado` ON `orden_trabajo`(`estado`);

-- CreateIndex
CREATE INDEX `idx_tipo_trabajo_estado` ON `tipo_trabajo`(`estado`);

-- RenameIndex
ALTER TABLE `orden_trabajo` RENAME INDEX `orden_trabajo_id_embarcacion_fkey` TO `idx_orden_trabajo_embarcacion_id`;

-- RenameIndex
ALTER TABLE `orden_trabajo` RENAME INDEX `orden_trabajo_id_jefe_asigna_fkey` TO `idx_orden_trabajo_jefe_asigna_id`;

-- RenameIndex
ALTER TABLE `orden_trabajo` RENAME INDEX `orden_trabajo_id_puerto_fkey` TO `idx_orden_trabajo_puerto_id`;

-- RenameIndex
ALTER TABLE `orden_trabajo` RENAME INDEX `orden_trabajo_id_tipo_trabajo_fkey` TO `idx_orden_trabajo_tipo_trabajo_id`;
