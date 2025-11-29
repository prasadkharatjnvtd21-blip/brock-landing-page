import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactInquiries } from '@/db/schema';
import { desc, like, or } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        { 
          error: 'Name is required',
          code: 'MISSING_NAME'
        },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { 
          error: 'Email is required',
          code: 'MISSING_EMAIL'
        },
        { status: 400 }
      );
    }

    if (!phone || !phone.trim()) {
      return NextResponse.json(
        { 
          error: 'Phone is required',
          code: 'MISSING_PHONE'
        },
        { status: 400 }
      );
    }

    if (!message || !message.trim()) {
      return NextResponse.json(
        { 
          error: 'Message is required',
          code: 'MISSING_MESSAGE'
        },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString()
    };

    // Insert into database
    const newInquiry = await db.insert(contactInquiries)
      .values(sanitizedData)
      .returning();

    return NextResponse.json(newInquiry[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
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

    let query = db.select().from(contactInquiries);

    // Apply search filter if provided
    if (search) {
      query = query.where(
        or(
          like(contactInquiries.name, `%${search}%`),
          like(contactInquiries.email, `%${search}%`),
          like(contactInquiries.message, `%${search}%`)
        )
      );
    }

    // Order by most recent first and apply pagination
    const results = await query
      .orderBy(desc(contactInquiries.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json(results, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}