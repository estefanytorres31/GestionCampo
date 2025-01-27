-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_rol` VARCHAR(50) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_usuario` VARCHAR(50) NOT NULL,
    `contrasena_hash` VARCHAR(255) NOT NULL,
    `nombre_completo` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NULL,
    `rol_id` INTEGER NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_nombre_usuario_key`(`nombre_usuario`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `embarcaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identificador_barco` VARCHAR(50) NOT NULL,
    `nombre` VARCHAR(100) NOT NULL,
    `datos_qr_code` VARCHAR(255) NOT NULL,
    `ubicacion` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `embarcaciones_identificador_barco_key`(`identificador_barco`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asistencias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuario_id` INTEGER NOT NULL,
    `embarcacion_id` INTEGER NOT NULL,
    `hora_entrada` DATETIME(3) NOT NULL,
    `hora_salida` DATETIME(3) NULL,
    `gps_entrada` VARCHAR(50) NOT NULL,
    `gps_salida` VARCHAR(50) NULL,
    `estado` ENUM('registrado', 'salido') NOT NULL DEFAULT 'registrado',
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `estados_sincronizacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `asistencia_id` INTEGER NOT NULL,
    `esta_sincronizado` BOOLEAN NOT NULL DEFAULT false,
    `sincronizado_en` DATETIME(3) NULL,

    UNIQUE INDEX `estados_sincronizacion_asistencia_id_key`(`asistencia_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tipos_mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_tipo` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mantenimientos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `embarcacion_id` INTEGER NOT NULL,
    `tipo_mantenimiento_id` INTEGER NOT NULL,
    `fecha_programada` DATE NOT NULL,
    `estado` ENUM('Programado', 'En Progreso', 'Completado') NOT NULL DEFAULT 'Programado',
    `observaciones` TEXT NULL,
    `llevar_proximo_abordaje` TEXT NULL,
    `porcentaje_avance` DECIMAL(5, 2) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sistemas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_sistema` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sistemas_mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mantenimiento_id` INTEGER NOT NULL,
    `sistema_id` INTEGER NOT NULL,
    `nota` VARCHAR(255) NULL,
    `falla_encontrada` TEXT NULL,
    `porcentaje_completado` DECIMAL(5, 2) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `partes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sistema_id` INTEGER NOT NULL,
    `nombre_parte` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tareas_partes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `parte_id` INTEGER NOT NULL,
    `descripcion_tarea` VARCHAR(255) NOT NULL,
    `es_checklist` BOOLEAN NOT NULL DEFAULT false,
    `estado` ENUM('Pendiente', 'En Progreso', 'Completada') NOT NULL DEFAULT 'Pendiente',
    `porcentaje_avance` DECIMAL(5, 2) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `listas_verificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_parte_id` INTEGER NOT NULL,
    `completada` BOOLEAN NOT NULL DEFAULT false,
    `comentario` TEXT NULL,
    `url_foto` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comentarios_tarea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_parte_id` INTEGER NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `comentario` TEXT NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fotos_tarea` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tarea_parte_id` INTEGER NOT NULL,
    `url_foto` VARCHAR(255) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre_material` VARCHAR(100) NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `materiales_mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mantenimiento_id` INTEGER NOT NULL,
    `material_id` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL DEFAULT 1,
    `es_proximo` BOOLEAN NOT NULL DEFAULT false,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mantenimiento_preventivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mantenimiento_id` INTEGER NOT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `mantenimiento_preventivo_mantenimiento_id_key`(`mantenimiento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mantenimiento_correctivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mantenimiento_id` INTEGER NOT NULL,
    `fallas` TEXT NULL,
    `causas` TEXT NULL,
    `solucion` TEXT NULL,
    `pendiente` TEXT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `mantenimiento_correctivo_mantenimiento_id_key`(`mantenimiento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `proyectos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mantenimiento_id` INTEGER NOT NULL,
    `porcentaje_proceso` DECIMAL(5, 2) NULL,
    `pendientes` TEXT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `proyectos_mantenimiento_id_key`(`mantenimiento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `desmontaje_montaje` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mantenimiento_id` INTEGER NOT NULL,
    `observaciones` TEXT NULL,
    `llevar_proximo_abordaje` TEXT NULL,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `desmontaje_montaje_mantenimiento_id_key`(`mantenimiento_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios` ADD CONSTRAINT `usuarios_rol_id_fkey` FOREIGN KEY (`rol_id`) REFERENCES `roles`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencias` ADD CONSTRAINT `asistencias_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asistencias` ADD CONSTRAINT `asistencias_embarcacion_id_fkey` FOREIGN KEY (`embarcacion_id`) REFERENCES `embarcaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `estados_sincronizacion` ADD CONSTRAINT `estados_sincronizacion_asistencia_id_fkey` FOREIGN KEY (`asistencia_id`) REFERENCES `asistencias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mantenimientos` ADD CONSTRAINT `mantenimientos_embarcacion_id_fkey` FOREIGN KEY (`embarcacion_id`) REFERENCES `embarcaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mantenimientos` ADD CONSTRAINT `mantenimientos_tipo_mantenimiento_id_fkey` FOREIGN KEY (`tipo_mantenimiento_id`) REFERENCES `tipos_mantenimiento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sistemas_mantenimiento` ADD CONSTRAINT `sistemas_mantenimiento_mantenimiento_id_fkey` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimientos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sistemas_mantenimiento` ADD CONSTRAINT `sistemas_mantenimiento_sistema_id_fkey` FOREIGN KEY (`sistema_id`) REFERENCES `sistemas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `partes` ADD CONSTRAINT `partes_sistema_id_fkey` FOREIGN KEY (`sistema_id`) REFERENCES `sistemas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tareas_partes` ADD CONSTRAINT `tareas_partes_parte_id_fkey` FOREIGN KEY (`parte_id`) REFERENCES `partes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `listas_verificacion` ADD CONSTRAINT `listas_verificacion_tarea_parte_id_fkey` FOREIGN KEY (`tarea_parte_id`) REFERENCES `tareas_partes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentarios_tarea` ADD CONSTRAINT `comentarios_tarea_tarea_parte_id_fkey` FOREIGN KEY (`tarea_parte_id`) REFERENCES `tareas_partes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comentarios_tarea` ADD CONSTRAINT `comentarios_tarea_usuario_id_fkey` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fotos_tarea` ADD CONSTRAINT `fotos_tarea_tarea_parte_id_fkey` FOREIGN KEY (`tarea_parte_id`) REFERENCES `tareas_partes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiales_mantenimiento` ADD CONSTRAINT `materiales_mantenimiento_mantenimiento_id_fkey` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimientos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `materiales_mantenimiento` ADD CONSTRAINT `materiales_mantenimiento_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `materiales`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mantenimiento_preventivo` ADD CONSTRAINT `mantenimiento_preventivo_mantenimiento_id_fkey` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimientos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mantenimiento_correctivo` ADD CONSTRAINT `mantenimiento_correctivo_mantenimiento_id_fkey` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimientos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `proyectos` ADD CONSTRAINT `proyectos_mantenimiento_id_fkey` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimientos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `desmontaje_montaje` ADD CONSTRAINT `desmontaje_montaje_mantenimiento_id_fkey` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimientos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
