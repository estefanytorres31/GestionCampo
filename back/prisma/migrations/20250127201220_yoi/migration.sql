-- CreateTable
CREATE TABLE `puertos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `ubicacion` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `puertos_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `razonSocial` VARCHAR(255) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `empresas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_puertos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `embarcacion_id` INTEGER NOT NULL,
    `puerto_id` INTEGER NOT NULL,
    `fecha_llegada` DATETIME(3) NOT NULL,
    `fecha_salida` DATETIME(3) NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `historial_puertos_embarcacion_id_puerto_id_fecha_llegada_key`(`embarcacion_id`, `puerto_id`, `fecha_llegada`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empresa_embarcaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `embarcacion_id` INTEGER NOT NULL,
    `empresa_id` INTEGER NOT NULL,
    `fecha_asignacion` DATETIME(3) NOT NULL,
    `estado` BOOLEAN NOT NULL DEFAULT true,
    `creado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizado_en` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `empresa_embarcaciones_embarcacion_id_empresa_id_key`(`embarcacion_id`, `empresa_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `historial_puertos` ADD CONSTRAINT `historial_puertos_embarcacion_id_fkey` FOREIGN KEY (`embarcacion_id`) REFERENCES `embarcaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_puertos` ADD CONSTRAINT `historial_puertos_puerto_id_fkey` FOREIGN KEY (`puerto_id`) REFERENCES `puertos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresa_embarcaciones` ADD CONSTRAINT `empresa_embarcaciones_embarcacion_id_fkey` FOREIGN KEY (`embarcacion_id`) REFERENCES `embarcaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `empresa_embarcaciones` ADD CONSTRAINT `empresa_embarcaciones_empresa_id_fkey` FOREIGN KEY (`empresa_id`) REFERENCES `empresas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
