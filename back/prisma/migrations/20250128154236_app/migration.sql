-- CreateTable
CREATE TABLE `permisos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `permisos_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(191) NOT NULL,
    `descripcion` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `roles_nombre_rol_key`(`nombre_rol`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles_permisos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `rol_id` INTEGER NOT NULL,
    `permiso_id` INTEGER NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `roles_permisos_rol_id_permiso_id_key`(`rol_id`, `permiso_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` VARCHAR(191) NOT NULL,
    `contrasena_hash` VARCHAR(191) NOT NULL,
    `nombre_completo` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_nombre_usuario_key`(`nombre_usuario`),
    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuario_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `rol_id` INTEGER NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuario_roles_usuario_id_rol_id_key`(`usuario_id`, `rol_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `empresas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `historial_puertos` (
    `id_historial` INTEGER NOT NULL AUTO_INCREMENT,
    `embarcacion_id` INTEGER NOT NULL,
    `puerto_id` INTEGER NOT NULL,
    `fecha_llegada` DATETIME(3) NOT NULL,
    `fecha_salida` DATETIME(3) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL,

    UNIQUE INDEX `historial_puertos_embarcacion_id_puerto_id_fecha_llegada_key`(`embarcacion_id`, `puerto_id`, `fecha_llegada`),
    PRIMARY KEY (`id_historial`)
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
