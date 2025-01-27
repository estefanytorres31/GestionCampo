/*
  Warnings:

  - You are about to alter the column `estado` on the `asistencias` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `TinyInt`.
  - You are about to alter the column `estado` on the `mantenimientos` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `asistencias` ADD COLUMN `estadoAsistencia` ENUM('registrado', 'salido') NOT NULL DEFAULT 'registrado',
    MODIFY `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `embarcaciones` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `mantenimientos` ADD COLUMN `estadoMantenimiento` ENUM('Programado', 'En Progreso', 'Completado') NOT NULL DEFAULT 'Programado',
    MODIFY `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `permisos` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `roles_permisos` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `sistemas` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `tipos_mantenimiento` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `usuario_roles` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `estado` BOOLEAN NOT NULL DEFAULT true;
