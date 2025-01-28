-- CreateIndex
CREATE INDEX `idx_rol_id` ON `roles_permisos`(`rol_id`);

-- RenameIndex
ALTER TABLE `roles_permisos` RENAME INDEX `roles_permisos_permiso_id_fkey` TO `idx_permiso_id`;
