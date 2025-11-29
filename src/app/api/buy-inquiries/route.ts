import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buyInquiries } from '@/db/schema';
import { eq, desc, like, or, and } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, propertyTitle, name, email, phone, budget, message } = body;

    // Validate required fields
    if (!propertyId) {
      return NextResponse.json({ 
        error: "Property ID is required",
        code: "MISSING_PROPERTY_ID" 
      }, { status: 400 });
    }

    if (!propertyTitle || !propertyTitle.trim()) {
      return NextResponse.json({ 
        error: "Property title is required",
        code: "MISSING_PROPERTY_TITLE" 
      }, { status: 400 });
    }

    if (!name || !name.trim()) {
      return NextResponse.json({ 
        error: "Name is required",
        code: "MISSING_NAME" 
      }, { status: 400 });
    }

    if (!email || !email.trim()) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL" 
      }, { status: 400 });
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json({ 
        error: "Phone is required",
        code: "MISSING_PHONE" 
      }, { status: 400 });
    }

    if (!budget || !budget.trim()) {
      return NextResponse.json({ 
        error: "Budget is required",
        code: "MISSING_BUDGET" 
      }, { status: 400 });
    }

    if (!message || !message.trim()) {
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
      budget: budget.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    // Insert new buy inquiry
    const newInquiry = await db.insert(buyInquiries)
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
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination parameters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    
    // Search parameter
    const search = searchParams.get('search');
    
    // Filter parameter
    const propertyIdParam = searchParams.get('propertyId');

    let query = db.select().from(buyInquiries);

    // Build WHERE conditions
    const conditions = [];

    // Property filter
    if (propertyIdParam) {
      const parsedPropertyId = parseInt(propertyIdParam);
      if (!isNaN(parsedPropertyId)) {
        conditions.push(eq(buyInquiries.propertyId, parsedPropertyId));
      }
    }

    // Search filter
    if (search) {
      const searchCondition = or(
        like(buyInquiries.name, `%${search}%`),
        like(buyInquiries.email, `%${search}%`),
        like(buyInquiries.propertyTitle, `%${search}%`),
        like(buyInquiries.budget, `%${search}%`)
      );
      conditions.push(searchCondition);
    }

    // Apply conditions if any exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply ordering, pagination
    const results = await query
      .orderBy(desc(buyInquiries.createdAt))
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