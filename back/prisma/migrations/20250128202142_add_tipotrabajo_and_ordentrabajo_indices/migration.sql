/*
  Warnings:

  - Added the required column `actualizado_en` to the `orden_trabajo_usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orden_trabajo_usuario` ADD COLUMN `actualizado_en` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `idx_orden_trabajo_sistema_orden_trabajo` ON `orden_trabajo_sistema`(`id_orden_trabajo`);

-- CreateIndex
CREATE INDEX `idx_orden_trabajo_sistema_estado` ON `orden_trabajo_sistema`(`estado`);

-- CreateIndex
CREATE INDEX `idx_orden_trabajo_usuario_orden_trabajo` ON `orden_trabajo_usuario`(`id_orden_trabajo`);

-- RenameIndex
ALTER TABLE `orden_trabajo_sistema` RENAME INDEX `orden_trabajo_sistema_id_embarcacion_sistema_fkey` TO `idx_orden_trabajo_sistema_embarcacion_sistema`;

-- RenameIndex
ALTER TABLE `orden_trabajo_sistema` RENAME INDEX `orden_trabajo_sistema_id_sistema_fkey` TO `idx_orden_trabajo_sistema_sistema`;

-- RenameIndex
ALTER TABLE `orden_trabajo_usuario` RENAME INDEX `orden_trabajo_usuario_id_usuario_fkey` TO `idx_orden_trabajo_usuario_usuario`;
