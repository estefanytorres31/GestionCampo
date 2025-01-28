import { createEmbarcacion } from "../src/services/EmbarcacionService.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const empresasBarcos = {
  'Exalmar': [
    'Mariangella', 'Ancash 2', 'Cuzco 4', 'Don Alfredo', 'Creta',
    'Rodas', 'Carmencita', 'Caribe'
  ],
  'Austral': [
    'Estela de Oro II', 'Vea', 'Marina', 'Resbalosa II', 'Estela de Plata II',
    'Simon', 'Piti', 'Kiana'
  ],
  'Centinela': [
    'Blandi', 'Polar I', 'Susan VI', 'Santa Adela II', 'Maria 1',
    'Mary', 'Corintia'
  ],
  'Diamante': [
    'Patricia', 'Corina', 'Gabriela V', 'Polar VII', 'Alexandra',
    'Natalia', 'Graciela'
  ],
  'Tasa': [
    'Tasa 17', 'Tasa 21', 'Tasa 22', 'Tasa 23', 'Tasa 31', 'Tasa 32',
    'Tasa 34', 'Tasa 35', 'Tasa 36', 'Tasa 37', 'Tasa 38', 'Tasa 41',
    'Tasa 42', 'Tasa 43', 'Tasa 44', 'Tasa 51', 'Tasa 52', 'Tasa 53',
    'Tasa 54', 'Tasa 55', 'Tasa 56', 'Tasa 57', 'Tasa 58', 'Tasa 59',
    'Tasa 61', 'Tasa 71', 'Tasa 111', 'Tasa 210', 'Tasa 218', 'Tasa 310',
    'Tasa 314', 'Tasa 315', 'Tasa 411', 'Tasa 412', 'Tasa 413', 'Tasa 414',
    'Tasa 416', 'Tasa 417', 'Tasa 418', 'Tasa 419', 'Tasa 420', 'Tasa 424',
    'Tasa 425', 'Tasa 426', 'Tasa 427'
  ]
};

async function seedEmbarcaciones() {
  try {
    // First, make sure all empresas exist
    const empresas = await prisma.empresa.findMany({
      where: {
        nombre: {
          in: Object.keys(empresasBarcos)
        }
      }
    });

    // Create a map of empresa names to their IDs
    const empresaIdMap = empresas.reduce((acc, empresa) => {
      acc[empresa.nombre] = empresa.id;
      return acc;
    }, {});

    // Keep track of progress
    let totalCreated = 0;
    const totalToCreate = Object.values(empresasBarcos).flat().length;

    // Create embarcaciones for each empresa
    for (const [empresaNombre, barcos] of Object.entries(empresasBarcos)) {
      const empresaId = empresaIdMap[empresaNombre];
      
      if (!empresaId) {
        console.error(`⚠️ Empresa ${empresaNombre} not found in database`);
        continue;
      }

      console.log(`\n📦 Creating vessels for ${empresaNombre}...`);
      
      // Create vessels sequentially to avoid overwhelming the system
      for (const nombreBarco of barcos) {
        try {
          const embarcacion = await createEmbarcacion(nombreBarco, empresaId);
          totalCreated++;
          console.log(`✅ Created vessel (${totalCreated}/${totalToCreate}): ${nombreBarco}`);
        } catch (error) {
          console.error(`❌ Error creating vessel ${nombreBarco}:`, error.message);
        }
        
        // Add a small delay between creations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      console.log(`✨ Completed vessels for ${empresaNombre}`);
    }

    console.log(`\n🎉 Successfully created ${totalCreated} out of ${totalToCreate} vessels`);
  } catch (error) {
    console.error('❌ Error in seedEmbarcaciones:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Function to verify database connection and empresas before starting
async function verifyPrerequisites() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Check if empresas exist
    const empresasCount = await prisma.empresa.count();
    if (empresasCount === 0) {
      console.log('⚠️ No empresas found in database. Creating them...');
      
      // Create the empresas
      const empresasToCreate = [
        { nombre: 'Exalmar', estado: true },
        { nombre: 'Austral', estado: true },
        { nombre: 'Centinela', estado: true },
        { nombre: 'Diamante', estado: true },
        { nombre: 'Tasa', estado: true }
      ];

      for (const empresa of empresasToCreate) {
        await prisma.empresa.create({
          data: {
            ...empresa,
            creado_en: new Date(),
            actualizado_en: new Date()
          }
        });
      }
      console.log('✅ Empresas created successfully');
    } else {
      console.log('✅ Empresas found in database');
    }

    return true;
  } catch (error) {
    console.error('❌ Prerequisites check failed:', error);
    return false;
  }
}

// Run the seeding function with prerequisites check
verifyPrerequisites()
  .then(prerequisitesOk => {
    if (prerequisitesOk) {
      return seedEmbarcaciones();
    } else {
      console.error('❌ Prerequisites not met. Please check your database configuration.');
    }
  })
  .then(() => console.log('🏁 Seeding process completed'))
  .catch(error => console.error('❌ Seeding failed:', error));