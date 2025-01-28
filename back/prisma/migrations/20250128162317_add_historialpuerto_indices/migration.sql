-- CreateIndex
CREATE INDEX `idx_embarcacion` ON `historial_puertos`(`embarcacion_id`);

-- CreateIndex
CREATE INDEX `idx_fecha_salida` ON `historial_puertos`(`fecha_salida`);

-- RenameIndex
ALTER TABLE `historial_puertos` RENAME INDEX `historial_puertos_puerto_id_fkey` TO `idx_puerto`;
