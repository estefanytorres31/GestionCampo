-- AlterTable
ALTER TABLE `sistema` ADD COLUMN `descripcion` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `idx_embarcacion_sistema_embarcacion_id` ON `embarcacion_sistema`(`id_embarcacion`);

-- CreateIndex
CREATE INDEX `idx_embarcacion_sistema_estado_sistema` ON `embarcacion_sistema`(`estado_sistema`);

-- CreateIndex
CREATE INDEX `idx_sistema_estado` ON `sistema`(`estado`);

-- RenameIndex
ALTER TABLE `embarcacion_sistema` RENAME INDEX `embarcacion_sistema_id_sistema_fkey` TO `idx_embarcacion_sistema_sistema_id`;
