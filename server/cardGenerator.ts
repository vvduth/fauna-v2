import { ALL_ANIMALS } from './src/constants/animals';

// Use native fetch (available in Node.js 18+)
// If you're using Node.js < 18, you'll need to install node-fetch

/**
 * Seed all animal cards by hitting the research API in batches
 * Considers AI rate limits and provides progress tracking
 */
async function seedAllAnimalCards(): Promise<void> {
    console.log('🎯 Starting animal card seeding process...');
    console.log(`📊 Total animals to research: ${ALL_ANIMALS.length}`);
    
    // Configuration for batch processing
    const BATCH_SIZE = 5; // Small batch size to respect AI rate limits
    const DELAY_BETWEEN_BATCHES = 3000; // 3 seconds delay between batches
    const API_BASE_URL = 'http://localhost:5000';
    
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{animal: string, error: string}> = [];
    
    // Calculate total batches
    const totalBatches = Math.ceil(ALL_ANIMALS.length / BATCH_SIZE);
    console.log(`📦 Processing in ${totalBatches} batches of ${BATCH_SIZE} animals each`);
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
        const startIndex = batchIndex * BATCH_SIZE;
        const endIndex = Math.min(startIndex + BATCH_SIZE, ALL_ANIMALS.length);
        const batch = ALL_ANIMALS.slice(startIndex, endIndex);
        
        console.log(`\n🔄 Processing batch ${batchIndex + 1}/${totalBatches} (animals ${startIndex + 1}-${endIndex})`);
        
        // Process each animal in the current batch
        for (let i = 0; i < batch.length; i++) {
            const animal = batch[i];
            const animalIndex = startIndex + i + 1;
            
            try {
                console.log(`  🔬 [${animalIndex}/${ALL_ANIMALS.length}] Researching: ${animal.name} (${animal.scientificName})`);
                
                // Make API call to research single animal
                const response = await fetch(`${API_BASE_URL}/api/animals/research`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        animalName: animal.name,
                        scientificName: animal.scientificName
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    successCount++;
                    console.log(`    ✅ Success: ${animal.name} (ID: ${result.data.animalCard.id})`);
                } else {
                    const errorData = await response.json();
                    errorCount++;
                    errors.push({
                        animal: animal.name,
                        error: errorData.error || 'Unknown API error'
                    });
                    console.log(`    ❌ Failed: ${animal.name} - ${errorData.error || 'Unknown error'}`);
                }
                
            } catch (error) {
                errorCount++;
                errors.push({
                    animal: animal.name,
                    error: error instanceof Error ? error.message : 'Network error'
                });
                console.log(`    ❌ Failed: ${animal.name} - ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
            
            // Small delay between individual requests to avoid overwhelming the AI service
            if (i < batch.length - 1) {
                await delay(500); // 0.5 second delay between requests in the same batch
            }
        }
        
        // Progress summary after each batch
        console.log(`📈 Batch ${batchIndex + 1} complete - Success: ${successCount}, Errors: ${errorCount}`);
        
        // Delay between batches (except for the last batch)
        if (batchIndex < totalBatches - 1) {
            console.log(`⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`);
            await delay(DELAY_BETWEEN_BATCHES);
        }
    }
    
    // Final summary
    console.log('\n🏁 Animal card seeding process completed!');
    console.log(`📊 Final Results:`);
    console.log(`   ✅ Successfully researched: ${successCount} animals`);
    console.log(`   ❌ Failed to research: ${errorCount} animals`);
    console.log(`   📈 Success rate: ${((successCount / ALL_ANIMALS.length) * 100).toFixed(1)}%`);
    
    if (errors.length > 0) {
        console.log('\n❌ Failed animals:');
        errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error.animal}: ${error.error}`);
        });
    }
    
    // Check final database stats
    try {
        console.log('\n📊 Checking database statistics...');
        const statsResponse = await fetch(`${API_BASE_URL}/api/animals/stats`);
        if (statsResponse.ok) {
            const stats = await statsResponse.json();
            console.log(`   🎯 Total cards in database: ${stats.data.statistics.totalCards}`);
        }
    } catch (error) {
        console.log('   ⚠️  Could not fetch database statistics');
    }
}

/**
 * Utility function to add delays
 * @param ms - Milliseconds to wait
 */
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main function to run the seeding process
 */
async function main() {
    try {
        console.log('🚀 Starting Fauna Animal Card Generator');
        console.log('📅 Started at:', new Date().toISOString());
        
        // Check if server is running
        try {
            const healthCheck = await fetch('http://localhost:5000/');
            if (!healthCheck.ok) {
                throw new Error('Server not responding');
            }
            console.log('✅ Server is running and accessible');
        } catch (error) {
            console.error('❌ Cannot connect to server at http://localhost:5000');
            console.error('   Make sure your server is running with: npm run dev');
            process.exit(1);
        }
        
        // Start the seeding process
        await seedAllAnimalCards();
        
        console.log('\n🎉 All done! Your animal cards are ready for the game.');
        console.log('📅 Completed at:', new Date().toISOString());
        
    } catch (error) {
        console.error('💥 Fatal error during seeding process:', error);
        process.exit(1);
    }
}

// Run the main function if this script is executed directly
if (require.main === module) {
    main().catch(error => {
        console.error('💥 Unhandled error:', error);
        process.exit(1);
    });
}