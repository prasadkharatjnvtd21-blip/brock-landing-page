import { db } from '@/db';
import { properties } from '@/db/schema';

async function main() {
    const sampleProperties = [
        {
            image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
            price: '₹1.2 Cr',
            priceValue: 12000000,
            title: 'Luxury 3BHK Apartment in Whitefield',
            location: 'Whitefield, Bangalore',
            beds: 3,
            baths: 2,
            sqft: 1850,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
            price: '₹2.8 Cr',
            priceValue: 28000000,
            title: 'Modern Villa with Pool in Gachibowli',
            location: 'Gachibowli, Hyderabad',
            beds: 4,
            baths: 4,
            sqft: 3200,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
            price: '₹3.5 Cr',
            priceValue: 35000000,
            title: 'Sky Penthouse in Powai',
            location: 'Powai, Mumbai',
            beds: 4,
            baths: 3,
            sqft: 2800,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
            price: '₹95 L',
            priceValue: 9500000,
            title: 'Contemporary 2BHK in Noida Extension',
            location: 'Noida Extension, Delhi NCR',
            beds: 2,
            baths: 2,
            sqft: 1200,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
            price: '₹1.8 Cr',
            priceValue: 18000000,
            title: 'Spacious Duplex House in HSR Layout',
            location: 'HSR Layout, Bangalore',
            beds: 3,
            baths: 3,
            sqft: 2400,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        },
        {
            image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
            price: '₹45 L',
            priceValue: 4500000,
            title: 'Modern Studio Apartment in Hinjewadi',
            location: 'Hinjewadi, Pune',
            beds: 1,
            baths: 1,
            sqft: 650,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }
    ];

    await db.insert(properties).values(sampleProperties);
    
    console.log('✅ Properties seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});