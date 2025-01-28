-- CreateIndex
CREATE INDEX `idx_permiso_estado` ON `permisos`(`estado`);

-- CreateIndex
CREATE INDEX `idx_rol_estado` ON `roles`(`estado`);

-- CreateIndex
CREATE INDEX `idx_roles_permisos_estado` ON `roles_permisos`(`estado`);

-- RenameIndex
ALTER TABLE `roles_permisos` RENAME INDEX `idx_permiso_id` TO `idx_roles_permisos_permiso_id`;

-- RenameIndex
ALTER TABLE `roles_permisos` RENAME INDEX `idx_rol_id` TO `idx_roles_permisos_rol_id`;
