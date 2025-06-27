import { ALL_ANIMALS } from './constants/animals';

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
 * Seed image URLs for all animal cards using Serper API
 * Fetches illustration images and updates the database
 */
async function seedAnimalImageUrls(): Promise<void> {
    console.log('🖼️ Starting animal image seeding process...');
    
    // Configuration for image processing
    const API_BASE_URL = 'http://localhost:5000';
    const SERPER_API_KEY = 'fee361226d07b0b99d25fcb4294130dee7bca355';
    const DELAY_BETWEEN_REQUESTS = 1000; // 1 second delay to respect rate limits
    
    let successCount = 0;
    let errorCount = 0;
    const errors: Array<{id: string, scientificName: string, error: string}> = [];
    
    try {
        // Fetch all animal cards from the server
        console.log('🔎 Fetching all animal cards from the server...');
        const response = await fetch(`${API_BASE_URL}/api/animals/cards/all`);
        
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data.success || !data.data.cards) {
            throw new Error('Failed to get valid animal cards data');
        }
        
        const animalCards = data.data.cards;
        console.log(`✅ Fetched ${animalCards.length} animal cards`);
        console.log('📊 Starting image URL updates...');
        
        // Process each animal card
        for (let i = 0; i < animalCards.length; i++) {
            const card = animalCards[i];
            const cardIndex = i + 1;
            
            try {
                console.log(`\n🔍 [${cardIndex}/${animalCards.length}] Searching image for: ${card.scientificName}`);
                console.log(`   📋 Card ID: ${card.id}`);
                
                // Prepare search query for illustration
                const searchQuery = `${card.scientificName} illustration`;
                console.log(`   🔎 Search query: "${searchQuery}"`);
                
                // Make request to Serper API for image search
                const serperResponse = await fetch('https://google.serper.dev/images', {
                    method: 'POST',
                    headers: {
                        'X-API-KEY': SERPER_API_KEY,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        q: searchQuery
                    })
                });
                
                if (!serperResponse.ok) {
                    throw new Error(`Serper API responded with status ${serperResponse.status}`);
                }
                
                const imageResults = await serperResponse.json();
                console.log(`   📸 Found ${imageResults.images?.length || 0} images`);
                
                // Check if we have any image results
                if (!imageResults.images || imageResults.images.length === 0) {
                    throw new Error('No images found for this animal');
                }
                
                // Get the first image URL
                const firstImageUrl = imageResults.images[0].imageUrl;
                console.log(`   🖼️  Selected image URL: ${firstImageUrl}`);
                
                // Update the animal card with the image URL
                const updateResponse = await fetch(`${API_BASE_URL}/api/animals/cards/${card.id}/image`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageUrl: firstImageUrl
                    })
                });
                
                if (!updateResponse.ok) {
                    const errorData = await updateResponse.json();
                    throw new Error(errorData.error || 'Failed to update image URL');
                }
                
                const updateResult = await updateResponse.json();
                
                if (updateResult.success) {
                    successCount++;
                    console.log(`   ✅ Successfully updated image URL for ${card.scientificName}`);
                } else {
                    throw new Error(updateResult.error || 'Update failed');
                }
                
            } catch (error) {
                errorCount++;
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                errors.push({
                    id: card.id,
                    scientificName: card.scientificName,
                    error: errorMessage
                });
                console.log(`   ❌ Failed to update image for ${card.scientificName}: ${errorMessage}`);
            }
            
            // Rate limiting delay (except for the last request)
            if (i < animalCards.length - 1) {
                console.log(`   ⏳ Waiting ${DELAY_BETWEEN_REQUESTS / 1000} second before next request...`);
                await delay(DELAY_BETWEEN_REQUESTS);
            }
        }
        
        // Final summary
        console.log('\n🏁 Animal image seeding process completed!');
        console.log(`📊 Final Results:`);
        console.log(`   ✅ Successfully updated images: ${successCount} animals`);
        console.log(`   ❌ Failed to update images: ${errorCount} animals`);
        console.log(`   📈 Success rate: ${((successCount / animalCards.length) * 100).toFixed(1)}%`);
        
        if (errors.length > 0) {
            console.log('\n❌ Failed to update images for:');
            errors.forEach((error, index) => {
                console.log(`   ${index + 1}. ${error.scientificName} (ID: ${error.id}): ${error.error}`);
            });
        }
        
    } catch (error) {
        console.error('❌ Fatal error during image seeding process:', error);
        throw error;
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
        //await seedAllAnimalCards();
        await seedAnimalImageUrls()
        
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