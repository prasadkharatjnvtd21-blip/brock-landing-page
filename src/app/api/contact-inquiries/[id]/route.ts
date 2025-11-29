import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { contactInquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const { id } = params;

    // Validate ID is a valid integer
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const inquiryId = parseInt(id);

    // Check if contact inquiry exists
    const existingInquiry = await db
      .select()
      .from(contactInquiries)
      .where(eq(contactInquiries.id, inquiryId))
      .limit(1);

    if (existingInquiry.length === 0) {
      return NextResponse.json(
        {
          error: 'Contact inquiry not found',
          code: 'INQUIRY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the contact inquiry
    const deleted = await db
      .delete(contactInquiries)
      .where(eq(contactInquiries.id, inquiryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Contact inquiry deleted successfully',
        inquiry: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error as Error).message,
      },
      { status: 500 }
    );
  }
}