import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { listingSubmissions } from '@/db/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, propertyType, location, price, description, status } = body;

    // Validate required fields
    if (!name || !email || !phone || !propertyType || !location || !price || !description) {
      return NextResponse.json(
        {
          error: 'Missing required fields. Required: name, email, phone, propertyType, location, price, description',
          code: 'MISSING_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Validate non-empty fields
    if (
      name.trim() === '' ||
      email.trim() === '' ||
      phone.trim() === '' ||
      propertyType.trim() === '' ||
      location.trim() === '' ||
      price.trim() === '' ||
      description.trim() === ''
    ) {
      return NextResponse.json(
        {
          error: 'All required fields must be non-empty',
          code: 'EMPTY_REQUIRED_FIELDS',
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      propertyType: propertyType.trim(),
      location: location.trim(),
      price: price.trim(),
      description: description.trim(),
      status: status?.trim() || 'pending',
      createdAt: new Date().toISOString(),
    };

    // Insert into database
    const newSubmission = await db
      .insert(listingSubmissions)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newSubmission[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const statusFilter = searchParams.get('status');

    let query = db.select().from(listingSubmissions);

    // Build WHERE conditions
    const conditions = [];

    // Search condition
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(listingSubmissions.name, searchTerm),
          like(listingSubmissions.email, searchTerm),
          like(listingSubmissions.location, searchTerm),
          like(listingSubmissions.propertyType, searchTerm),
          like(listingSubmissions.description, searchTerm)
        )
      );
    }

    // Status filter
    if (statusFilter) {
      conditions.push(eq(listingSubmissions.status, statusFilter));
    }

    // Apply conditions if any
    if (conditions.length > 0) {
      query = query.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply ordering, limit, and offset
    const results = await query
      .orderBy(desc(listingSubmissions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}