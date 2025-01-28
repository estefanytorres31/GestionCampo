/*
  Warnings:

  - You are about to drop the column `razonSocial` on the `empresas` table. All the data in the column will be lost.
  - The primary key for the `historial_puertos` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `historial_puertos` table. All the data in the column will be lost.
  - You are about to alter the column `descripcion` on the `permisos` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `descripcion` on the `roles` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `contrasena_hash` on the `usuarios` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to drop the `asistencias` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `comentarios_tarea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `desmontaje_montaje` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `embarcaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `empresa_embarcaciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estados_sincronizacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `fotos_tarea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `listas_verificacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mantenimiento_correctivo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mantenimiento_preventivo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mantenimientos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materiales` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `materiales_mantenimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `partes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proyectos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `puertos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sistemas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sistemas_mantenimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tareas_partes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipos_mantenimiento` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[nombre_rol]` on the table `roles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id_historial` to the `historial_puertos` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `asistencias` DROP FOREIGN KEY `asistencias_embarcacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `asistencias` DROP FOREIGN KEY `asistencias_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `comentarios_tarea` DROP FOREIGN KEY `comentarios_tarea_tarea_parte_id_fkey`;

-- DropForeignKey
ALTER TABLE `comentarios_tarea` DROP FOREIGN KEY `comentarios_tarea_usuario_id_fkey`;

-- DropForeignKey
ALTER TABLE `desmontaje_montaje` DROP FOREIGN KEY `desmontaje_montaje_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `empresa_embarcaciones` DROP FOREIGN KEY `empresa_embarcaciones_embarcacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `empresa_embarcaciones` DROP FOREIGN KEY `empresa_embarcaciones_empresa_id_fkey`;

-- DropForeignKey
ALTER TABLE `estados_sincronizacion` DROP FOREIGN KEY `estados_sincronizacion_asistencia_id_fkey`;

-- DropForeignKey
ALTER TABLE `fotos_tarea` DROP FOREIGN KEY `fotos_tarea_tarea_parte_id_fkey`;

-- DropForeignKey
ALTER TABLE `historial_puertos` DROP FOREIGN KEY `historial_puertos_embarcacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `historial_puertos` DROP FOREIGN KEY `historial_puertos_puerto_id_fkey`;

-- DropForeignKey
ALTER TABLE `listas_verificacion` DROP FOREIGN KEY `listas_verificacion_tarea_parte_id_fkey`;

-- DropForeignKey
ALTER TABLE `mantenimiento_correctivo` DROP FOREIGN KEY `mantenimiento_correctivo_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `mantenimiento_preventivo` DROP FOREIGN KEY `mantenimiento_preventivo_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `mantenimientos` DROP FOREIGN KEY `mantenimientos_embarcacion_id_fkey`;

-- DropForeignKey
ALTER TABLE `mantenimientos` DROP FOREIGN KEY `mantenimientos_tipo_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `materiales_mantenimiento` DROP FOREIGN KEY `materiales_mantenimiento_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `materiales_mantenimiento` DROP FOREIGN KEY `materiales_mantenimiento_material_id_fkey`;

-- DropForeignKey
ALTER TABLE `partes` DROP FOREIGN KEY `partes_sistema_id_fkey`;

-- DropForeignKey
ALTER TABLE `proyectos` DROP FOREIGN KEY `proyectos_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `roles_permisos` DROP FOREIGN KEY `roles_permisos_permiso_id_fkey`;

-- DropForeignKey
ALTER TABLE `roles_permisos` DROP FOREIGN KEY `roles_permisos_rol_id_fkey`;

-- DropForeignKey
ALTER TABLE `sistemas_mantenimiento` DROP FOREIGN KEY `sistemas_mantenimiento_mantenimiento_id_fkey`;

-- DropForeignKey
ALTER TABLE `sistemas_mantenimiento` DROP FOREIGN KEY `sistemas_mantenimiento_sistema_id_fkey`;

-- DropForeignKey
ALTER TABLE `tareas_partes` DROP FOREIGN KEY `tareas_partes_parte_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario_roles` DROP FOREIGN KEY `usuario_roles_rol_id_fkey`;

-- DropForeignKey
ALTER TABLE `usuario_roles` DROP FOREIGN KEY `usuario_roles_usuario_id_fkey`;

-- DropIndex
DROP INDEX `historial_puertos_puerto_id_fkey` ON `historial_puertos`;

-- DropIndex
DROP INDEX `roles_permisos_permiso_id_fkey` ON `roles_permisos`;

-- DropIndex
DROP INDEX `usuario_roles_rol_id_fkey` ON `usuario_roles`;

-- AlterTable
ALTER TABLE `empresas` DROP COLUMN `razonSocial`,
    MODIFY `nombre` VARCHAR(191) NOT NULL,
    ALTER COLUMN `actualizado_en` DROP DEFAULT;

-- AlterTable
ALTER TABLE `historial_puertos` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `id_historial` INTEGER NOT NULL AUTO_INCREMENT,
    ALTER COLUMN `actualizado_en` DROP DEFAULT,
    ADD PRIMARY KEY (`id_historial`);

-- AlterTable
ALTER TABLE `permisos` MODIFY `nombre` VARCHAR(191) NOT NULL,
    MODIFY `descripcion` VARCHAR(191) NULL,
    ALTER COLUMN `actualizado_en` DROP DEFAULT;

-- AlterTable
ALTER TABLE `roles` MODIFY `nombre_rol` VARCHAR(191) NOT NULL,
    MODIFY `descripcion` VARCHAR(191) NULL,
    ALTER COLUMN `actualizado_en` DROP DEFAULT;

-- AlterTable
ALTER TABLE `usuarios` MODIFY `nombre_usuario` VARCHAR(191) NOT NULL,
    MODIFY `contrasena_hash` VARCHAR(191) NOT NULL,
    MODIFY `nombre_completo` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL,
    ALTER COLUMN `actualizado_en` DROP DEFAULT;

-- DropTable
DROP TABLE `asistencias`;

-- DropTable
DROP TABLE `comentarios_tarea`;

-- DropTable
DROP TABLE `desmontaje_montaje`;

-- DropTable
DROP TABLE `embarcaciones`;

-- DropTable
DROP TABLE `empresa_embarcaciones`;

-- DropTable
DROP TABLE `estados_sincronizacion`;

-- DropTable
DROP TABLE `fotos_tarea`;

-- DropTable
DROP TABLE `listas_verificacion`;

-- DropTable
DROP TABLE `mantenimiento_correctivo`;

-- DropTable
DROP TABLE `mantenimiento_preventivo`;

-- DropTable
DROP TABLE `mantenimientos`;

-- DropTable
DROP TABLE `materiales`;

-- DropTable
DROP TABLE `materiales_mantenimiento`;

-- DropTable
DROP TABLE `partes`;

-- DropTable
DROP TABLE `proyectos`;

-- DropTable
DROP TABLE `puertos`;

-- DropTable
DROP TABLE `sistemas`;

-- DropTable
DROP TABLE `sistemas_mantenimiento`;

-- DropTable
DROP TABLE `tareas_partes`;

-- DropTable
DROP TABLE `tipos_mantenimiento`;

-- CreateTable
CREATE TABLE `embarcacion` (
    `id_embarcacion` INTEGER NOT NULL AUTO_INCREMENT,
    `empresa_id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `qr_code` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `embarcacion_qr_code_key`(`qr_code`),
    PRIMARY KEY (`id_embarcacion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Puerto` (
    `id_puerto` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `ubicacion` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Puerto_nombre_key`(`nombre`),
    PRIMARY KEY (`id_puerto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sistema` (
    `id_sistema` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_sistema` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `sistema_nombre_sistema_key`(`nombre_sistema`),
    PRIMARY KEY (`id_sistema`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `parte` (
    `id_parte` INTEGER NOT NULL AUTO_INCREMENT,
    `id_sistema` INTEGER NOT NULL,
    `nombre_parte` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `parte_id_sistema_nombre_parte_key`(`id_sistema`, `nombre_parte`),
    PRIMARY KEY (`id_parte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarea` (
    `id_tarea` INTEGER NOT NULL AUTO_INCREMENT,
    `id_parte` INTEGER NOT NULL,
    `descripcion` VARCHAR(191) NOT NULL,
    `duracion_estimada` INTEGER NULL,
    `prioridad` ENUM('baja', 'media', 'alta') NOT NULL DEFAULT 'media',
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_tarea`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `embarcacion_sistema` (
    `id_embarcacion_sistema` INTEGER NOT NULL AUTO_INCREMENT,
    `id_embarcacion` INTEGER NOT NULL,
    `id_sistema` INTEGER NOT NULL,
    `estado_sistema` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `embarcacion_sistema_id_embarcacion_id_sistema_key`(`id_embarcacion`, `id_sistema`),
    PRIMARY KEY (`id_embarcacion_sistema`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipo_trabajo` (
    `id_tipo_trabajo` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_trabajo` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tipo_trabajo_nombre_trabajo_key`(`nombre_trabajo`),
    PRIMARY KEY (`id_tipo_trabajo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_trabajo` (
    `id_orden_trabajo` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tipo_trabajo` INTEGER NOT NULL,
    `id_embarcacion` INTEGER NOT NULL,
    `id_puerto` INTEGER NOT NULL,
    `id_jefe_asigna` INTEGER NOT NULL,
    `fecha_asignacion` DATETIME(3) NOT NULL,
    `estado` ENUM('pendiente', 'en_proceso', 'finalizado') NOT NULL DEFAULT 'pendiente',
    `comentarios` VARCHAR(191) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id_orden_trabajo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_trabajo_usuario` (
    `id_orden_trabajo_usuario` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orden_trabajo` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `rol_en_orden` ENUM('Técnico Principal', 'Ayudante') NULL,
    `observaciones` VARCHAR(191) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `orden_trabajo_usuario_id_orden_trabajo_id_usuario_key`(`id_orden_trabajo`, `id_usuario`),
    PRIMARY KEY (`id_orden_trabajo_usuario`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_trabajo_sistema` (
    `id_orden_trabajo_sistema` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orden_trabajo` INTEGER NOT NULL,
    `id_sistema` INTEGER NOT NULL,
    `id_embarcacion_sistema` INTEGER NOT NULL,
    `estado` ENUM('pendiente', 'en_proceso', 'finalizado') NOT NULL DEFAULT 'pendiente',
    `observaciones` VARCHAR(191) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orden_trabajo_sistema_id_orden_trabajo_id_sistema_key`(`id_orden_trabajo`, `id_sistema`),
    PRIMARY KEY (`id_orden_trabajo_sistema`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_trabajo_parte` (
    `id_orden_trabajo_parte` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orden_trabajo_sistema` INTEGER NOT NULL,
    `id_parte` INTEGER NOT NULL,
    `estado` ENUM('pendiente', 'en_proceso', 'finalizado') NOT NULL DEFAULT 'pendiente',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orden_trabajo_parte_id_orden_trabajo_sistema_id_parte_key`(`id_orden_trabajo_sistema`, `id_parte`),
    PRIMARY KEY (`id_orden_trabajo_parte`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orden_trabajo_tarea` (
    `id_orden_trabajo_tarea` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orden_trabajo_parte` INTEGER NOT NULL,
    `id_tarea` INTEGER NOT NULL,
    `id_sistema` INTEGER NULL,
    `estado` ENUM('pendiente', 'en_proceso', 'finalizado') NOT NULL DEFAULT 'pendiente',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `orden_trabajo_tarea_id_orden_trabajo_parte_id_tarea_key`(`id_orden_trabajo_parte`, `id_tarea`),
    PRIMARY KEY (`id_orden_trabajo_tarea`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tarea_realizada` (
    `id_tarea_realizada` INTEGER NOT NULL AUTO_INCREMENT,
    `id_orden_trabajo_tarea` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `id_tarea` INTEGER NOT NULL,
    `fecha_hora` DATETIME(3) NOT NULL,
    `comentarios` VARCHAR(191) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_tarea_realizada`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asistencia` (
    `id_asistencia` INTEGER NOT NULL AUTO_INCREMENT,
    `id_usuario` INTEGER NOT NULL,
    `id_embarcacion` INTEGER NOT NULL,
    `id_orden_trabajo` INTEGER NULL,
    `id_puerto` INTEGER NULL,
    `fecha_hora` DATETIME(3) NOT NULL,
    `latitud` DECIMAL(10, 6) NULL,
    `longitud` DECIMAL(10, 6) NULL,
    `tipo` ENUM('entrada', 'salida') NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_asistencia`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentario_tarea` (
    `id_comentario_tarea` INTEGER NOT NULL AUTO_INCREMENT,
    `id_tarea_realizada` INTEGER NOT NULL,
    `id_usuario` INTEGER NOT NULL,
    `comentario` VARCHAR(191) NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id_comentario_tarea`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `roles_nombre_rol_key` ON `roles`(`nombre_rol`);

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_email_key` ON `usuarios`(`email`);

-- AddForeignKey
ALTER TABLE `roles_permisos` ADD CONSTRAINT `roles_permisos_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles_permisos` ADD CONSTRAINT `roles_permisos_permiso_id_fkey` FOREIGN KEY (`permiso_id`) REFERENCES `permisos`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_roles` ADD CONSTRAINT `usuario_roles_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usuario_roles` ADD CONSTRAINT `usuario_roles_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `embarcacion` ADD CONSTRAINT `embarcacion_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_puertos` ADD CONSTRAINT `historial_puertos_embarcacion_id_fkey` FOREIGN KEY (`embarcacion_id`) REFERENCES `embarcacion`(`id_embarcacion`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_puertos` ADD CONSTRAINT `historial_puertos_puerto_id_fkey` FOREIGN KEY (`puerto_id`) REFERENCES `Puerto`(`id_puerto`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parte` ADD CONSTRAINT `parte_id_sistema_fkey` FOREIGN KEY (`id_sistema`) REFERENCES `sistema`(`id_sistema`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarea` ADD CONSTRAINT `tarea_id_parte_fkey` FOREIGN KEY (`id_parte`) REFERENCES `parte`(`id_parte`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `embarcacion_sistema` ADD CONSTRAINT `embarcacion_sistema_id_embarcacion_fkey` FOREIGN KEY (`id_embarcacion`) REFERENCES `embarcacion`(`id_embarcacion`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `embarcacion_sistema` ADD CONSTRAINT `embarcacion_sistema_id_sistema_fkey` FOREIGN KEY (`id_sistema`) REFERENCES `sistema`(`id_sistema`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo` ADD CONSTRAINT `orden_trabajo_id_tipo_trabajo_fkey` FOREIGN KEY (`id_tipo_trabajo`) REFERENCES `tipo_trabajo`(`id_tipo_trabajo`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo` ADD CONSTRAINT `orden_trabajo_id_embarcacion_fkey` FOREIGN KEY (`id_embarcacion`) REFERENCES `embarcacion`(`id_embarcacion`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo` ADD CONSTRAINT `orden_trabajo_id_puerto_fkey` FOREIGN KEY (`id_puerto`) REFERENCES `Puerto`(`id_puerto`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo` ADD CONSTRAINT `orden_trabajo_id_jefe_asigna_fkey` FOREIGN KEY (`id_jefe_asigna`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_usuario` ADD CONSTRAINT `orden_trabajo_usuario_id_orden_trabajo_fkey` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `orden_trabajo`(`id_orden_trabajo`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_usuario` ADD CONSTRAINT `orden_trabajo_usuario_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_sistema` ADD CONSTRAINT `orden_trabajo_sistema_id_orden_trabajo_fkey` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `orden_trabajo`(`id_orden_trabajo`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_sistema` ADD CONSTRAINT `orden_trabajo_sistema_id_sistema_fkey` FOREIGN KEY (`id_sistema`) REFERENCES `sistema`(`id_sistema`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_sistema` ADD CONSTRAINT `orden_trabajo_sistema_id_embarcacion_sistema_fkey` FOREIGN KEY (`id_embarcacion_sistema`) REFERENCES `embarcacion_sistema`(`id_embarcacion_sistema`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_parte` ADD CONSTRAINT `orden_trabajo_parte_id_orden_trabajo_sistema_fkey` FOREIGN KEY (`id_orden_trabajo_sistema`) REFERENCES `orden_trabajo_sistema`(`id_orden_trabajo_sistema`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_parte` ADD CONSTRAINT `orden_trabajo_parte_id_parte_fkey` FOREIGN KEY (`id_parte`) REFERENCES `parte`(`id_parte`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_tarea` ADD CONSTRAINT `orden_trabajo_tarea_id_orden_trabajo_parte_fkey` FOREIGN KEY (`id_orden_trabajo_parte`) REFERENCES `orden_trabajo_parte`(`id_orden_trabajo_parte`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_tarea` ADD CONSTRAINT `orden_trabajo_tarea_id_tarea_fkey` FOREIGN KEY (`id_tarea`) REFERENCES `tarea`(`id_tarea`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orden_trabajo_tarea` ADD CONSTRAINT `orden_trabajo_tarea_id_sistema_fkey` FOREIGN KEY (`id_sistema`) REFERENCES `orden_trabajo_sistema`(`id_orden_trabajo_sistema`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarea_realizada` ADD CONSTRAINT `tarea_realizada_id_orden_trabajo_tarea_fkey` FOREIGN KEY (`id_orden_trabajo_tarea`) REFERENCES `orden_trabajo_tarea`(`id_orden_trabajo_tarea`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarea_realizada` ADD CONSTRAINT `tarea_realizada_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tarea_realizada` ADD CONSTRAINT `tarea_realizada_id_tarea_fkey` FOREIGN KEY (`id_tarea`) REFERENCES `tarea`(`id_tarea`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia` ADD CONSTRAINT `asistencia_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia` ADD CONSTRAINT `asistencia_id_embarcacion_fkey` FOREIGN KEY (`id_embarcacion`) REFERENCES `embarcacion`(`id_embarcacion`) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia` ADD CONSTRAINT `asistencia_id_orden_trabajo_fkey` FOREIGN KEY (`id_orden_trabajo`) REFERENCES `orden_trabajo`(`id_orden_trabajo`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencia` ADD CONSTRAINT `asistencia_id_puerto_fkey` FOREIGN KEY (`id_puerto`) REFERENCES `Puerto`(`id_puerto`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario_tarea` ADD CONSTRAINT `comentario_tarea_id_tarea_realizada_fkey` FOREIGN KEY (`id_tarea_realizada`) REFERENCES `tarea_realizada`(`id_tarea_realizada`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentario_tarea` ADD CONSTRAINT `comentario_tarea_id_usuario_fkey` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
