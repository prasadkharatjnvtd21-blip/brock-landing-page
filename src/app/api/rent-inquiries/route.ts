import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentInquiries } from '@/db/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, propertyTitle, name, email, phone, moveInDate, message } = body;

    // Validate required fields
    if (!propertyId) {
      return NextResponse.json({ 
        error: "Property ID is required",
        code: "MISSING_PROPERTY_ID" 
      }, { status: 400 });
    }

    if (!propertyTitle || propertyTitle.trim() === '') {
      return NextResponse.json({ 
        error: "Property title is required",
        code: "MISSING_PROPERTY_TITLE" 
      }, { status: 400 });
    }

    if (!name || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!email || email.trim() === '') {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    if (!phone || phone.trim() === '') {
      return NextResponse.json({ 
        error: "Phone is required",
        code: "MISSING_PHONE" 
      }, { status: 400 });
    }

    if (!moveInDate || moveInDate.trim() === '') {
      return NextResponse.json({ 
        error: "Move-in date is required",
        code: "MISSING_MOVE_IN_DATE" 
      }, { status: 400 });
    }

    if (!message || message.trim() === '') {
      return NextResponse.json({ 
        error: "Message is required",
        code: "MISSING_MESSAGE" 
      }, { status: 400 });
    }

    // Validate propertyId is a valid integer
    const parsedPropertyId = parseInt(propertyId);
    if (isNaN(parsedPropertyId)) {
      return NextResponse.json({ 
        error: "Property ID must be a valid integer",
        code: "INVALID_PROPERTY_ID" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedData = {
      propertyId: parsedPropertyId,
      propertyTitle: propertyTitle.trim(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      moveInDate: moveInDate.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    // Insert new rent inquiry
    const newInquiry = await db.insert(rentInquiries)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newInquiry[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Search parameter
    const search = searchParams.get('search');
    
    // Filter parameter
    const propertyIdParam = searchParams.get('propertyId');

    // Build query
    let query = db.select().from(rentInquiries);

    // Apply filters
    const conditions = [];

    // Search across multiple fields
    if (search) {
      const searchTerm = `%${search}%`;
      conditions.push(
        or(
          like(rentInquiries.name, searchTerm),
          like(rentInquiries.email, searchTerm),
          like(rentInquiries.propertyTitle, searchTerm),
          like(rentInquiries.moveInDate, searchTerm)
        )
      );
    }

    // Filter by propertyId
    if (propertyIdParam) {
      const parsedPropertyId = parseInt(propertyIdParam);
      if (!isNaN(parsedPropertyId)) {
        conditions.push(eq(rentInquiries.propertyId, parsedPropertyId));
      }
    }

    // Apply all conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Order by most recent first and apply pagination
    const results = await query
      .orderBy(desc(rentInquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}