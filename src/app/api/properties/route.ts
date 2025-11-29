import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, like, or, desc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single property by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const property = await db
        .select()
        .from(properties)
        .where(eq(properties.id, parseInt(id)))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json(
          { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
          { status: 404 }
        );
      }

      return NextResponse.json(property[0], { status: 200 });
    }

    // List properties with pagination and search
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const availableFor = searchParams.get('availableFor');

    let query = db.select().from(properties).orderBy(desc(properties.createdAt));

    if (search || availableFor) {
      const conditions = [];
      
      if (search) {
        const searchTerm = `%${search}%`;
        conditions.push(
          or(
            like(properties.title, searchTerm),
            like(properties.location, searchTerm),
            like(properties.description, searchTerm),
            like(properties.categories, searchTerm)
          )
        );
      }
      
      if (availableFor) {
        conditions.push(
          or(
            eq(properties.availableFor, availableFor),
            eq(properties.availableFor, 'both')
          )
        );
      }

      if (conditions.length > 0) {
        query = db
          .select()
          .from(properties)
          .where(conditions.length === 1 ? conditions[0] : or(...conditions))
          .orderBy(desc(properties.createdAt));
      }
    }

    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error: any) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = ['image', 'price', 'priceValue', 'title', 'location', 'beds', 'baths', 'sqft'];
    const missingFields = requiredFields.filter(field => !(field in body) || body[field] === null || body[field] === undefined || body[field] === '');

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error: `Missing required fields: ${missingFields.join(', ')}`,
          code: 'MISSING_REQUIRED_FIELDS'
        },
        { status: 400 }
      );
    }

    // Validate numeric fields
    const numericFields = ['priceValue', 'beds', 'baths', 'sqft'];
    for (const field of numericFields) {
      if (isNaN(parseInt(body[field]))) {
        return NextResponse.json(
          {
            error: `${field} must be a valid integer`,
            code: 'INVALID_NUMERIC_FIELD'
          },
          { status: 400 }
        );
      }
    }

    // Validate availableFor field
    if (body.availableFor && !['buy', 'rent', 'both'].includes(body.availableFor)) {
      return NextResponse.json(
        {
          error: 'availableFor must be "buy", "rent", or "both"',
          code: 'INVALID_AVAILABLE_FOR'
        },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const now = new Date().toISOString();
    const propertyData: any = {
      image: body.image.trim(),
      price: body.price.trim(),
      priceValue: parseInt(body.priceValue),
      title: body.title.trim(),
      location: body.location.trim(),
      beds: parseInt(body.beds),
      baths: parseInt(body.baths),
      sqft: parseInt(body.sqft),
      availableFor: body.availableFor || 'buy',
      description: body.description?.trim() || null,
      amenities: body.amenities || null,
      gallery: body.gallery || null,
      categories: body.categories?.trim() || null,
      createdAt: now,
      updatedAt: now
    };

    const newProperty = await db
      .insert(properties)
      .values(propertyData)
      .returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error: any) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Prepare update data
    const updates: any = {
      updatedAt: new Date().toISOString()
    };

    // Add fields to update if present in body
    if (body.image !== undefined) updates.image = body.image.trim();
    if (body.price !== undefined) updates.price = body.price.trim();
    if (body.priceValue !== undefined) {
      const priceValue = parseInt(body.priceValue);
      if (isNaN(priceValue)) {
        return NextResponse.json(
          { error: 'priceValue must be a valid integer', code: 'INVALID_PRICE_VALUE' },
          { status: 400 }
        );
      }
      updates.priceValue = priceValue;
    }
    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.beds !== undefined) {
      const beds = parseInt(body.beds);
      if (isNaN(beds)) {
        return NextResponse.json(
          { error: 'beds must be a valid integer', code: 'INVALID_BEDS' },
          { status: 400 }
        );
      }
      updates.beds = beds;
    }
    if (body.baths !== undefined) {
      const baths = parseInt(body.baths);
      if (isNaN(baths)) {
        return NextResponse.json(
          { error: 'baths must be a valid integer', code: 'INVALID_BATHS' },
          { status: 400 }
        );
      }
      updates.baths = baths;
    }
    if (body.sqft !== undefined) {
      const sqft = parseInt(body.sqft);
      if (isNaN(sqft)) {
        return NextResponse.json(
          { error: 'sqft must be a valid integer', code: 'INVALID_SQFT' },
          { status: 400 }
        );
      }
      updates.sqft = sqft;
    }
    if (body.availableFor !== undefined) {
      if (!['buy', 'rent', 'both'].includes(body.availableFor)) {
        return NextResponse.json(
          { error: 'availableFor must be "buy", "rent", or "both"', code: 'INVALID_AVAILABLE_FOR' },
          { status: 400 }
        );
      }
      updates.availableFor = body.availableFor;
    }
    if (body.description !== undefined) updates.description = body.description?.trim() || null;
    if (body.amenities !== undefined) updates.amenities = body.amenities;
    if (body.gallery !== undefined) updates.gallery = body.gallery;
    if (body.categories !== undefined) updates.categories = body.categories?.trim() || null;

    const updatedProperty = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedProperty[0], { status: 200 });
  } catch (error: any) {
    console.error('PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'PROPERTY_NOT_FOUND' },
        { status: 404 }
      );
    }

    const deletedProperty = await db
      .delete(properties)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      {
        message: 'Property deleted successfully',
        property: deletedProperty[0]
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}