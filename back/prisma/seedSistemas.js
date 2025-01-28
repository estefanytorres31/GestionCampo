import { PrismaClient } from "@prisma/client";
import { createSistema } from "../src/services/SistemaService.js";

const prisma = new PrismaClient();

const sistemas = [
  {
    nombre: "Transmisión Satelital",
    estado: true
  },
  {
    nombre: "Control de Combustible MP",
    estado: true
  },
  {
    nombre: "Control de Combustible MP Electrónico",
    estado: true
  },
  {
    nombre: "Control de Combustible Auxiliares",
    estado: true
  },
  {
    nombre: "Control de Combustible Auxiliares Electrónico",
    estado: true
  },
  {
    nombre: "Gestión Pesca",
    estado: true
  },
  {
    nombre: "Gestión Pesca - PC",
    estado: true
  },
  {
    nombre: "Gestión Frio",
    estado: true
  },
  {
    nombre: "Nivel de Tanques",
    estado: true
  },
  {
    nombre: "Monitoreo de Horometros",
    estado: true
  },
  {
    nombre: "Monitoreo de Temperaturas RSW 1.0",
    estado: true
  },
  {
    nombre: "Monitoreo de Temperaturas RSW 2.0",
    estado: true
  },
  {
    nombre: "Monitoreo de Temperaturas de Gases de Escape",
    estado: true
  },
  {
    nombre: "Control de Bombas Achique",
    estado: true
  },
  {
    nombre: "BNWAS Satelital",
    estado: true
  },
  {
    nombre: "Control de Combustible Panga",
    estado: true
  }
];

async function seedSistemas() {
  try {
    console.log('🚀 Iniciando la creación de sistemas...');
    
    let totalCreados = 0;
    const totalSistemas = sistemas.length;

    for (const sistema of sistemas) {
      try {
        const sistemaNuevo = await createSistema(sistema.nombre);
        totalCreados++;
        console.log(`✅ Sistema creado (${totalCreados}/${totalSistemas}): ${sistema.nombre}`);
        
        if (sistema.estado) {
          console.log(`⭐ Sistema prioritario: ${sistema.nombre}`);
        }

        // Pequeña pausa entre creaciones para evitar sobrecarga
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`❌ Error al crear sistema ${sistema.nombre}:`, error.message);
      }
    }

    console.log(`\n✨ Proceso completado:`);
    console.log(`📊 Total sistemas creados: ${totalCreados}/${totalSistemas}`);
    console.log(`🌟 Sistemas prioritarios: ${sistemas.filter(s => s.estado).length}`);

  } catch (error) {
    console.error('❌ Error general en seedSistemas:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Verificar conexión a la base de datos antes de comenzar
async function verificarPrerequisitos() {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');

    // Verificar si ya existen sistemas
    const sistemasExistentes = await prisma.sistema.count();
    if (sistemasExistentes > 0) {
      console.log(`⚠️ Ya existen ${sistemasExistentes} sistemas en la base de datos`);
      const continuar = true; // Aquí podrías agregar una pregunta al usuario
      if (!continuar) {
        console.log('❌ Proceso cancelado por el usuario');
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Error al verificar prerequisitos:', error);
    return false;
  }
}

// Ejecutar el script
verificarPrerequisitos()
  .then(prerequisitosOk => {
    if (prerequisitosOk) {
      return seedSistemas();
    }
  })
  .then(() => console.log('🏁 Proceso de seed finalizado'))
  .catch(error => console.error('❌ Error en el proceso:', error));