import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { buyInquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const id = params.id;

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

    // Check if buy inquiry exists
    const existingInquiry = await db
      .select()
      .from(buyInquiries)
      .where(eq(buyInquiries.id, inquiryId))
      .limit(1);

    if (existingInquiry.length === 0) {
      return NextResponse.json(
        {
          error: 'Buy inquiry not found',
          code: 'INQUIRY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the buy inquiry
    const deleted = await db
      .delete(buyInquiries)
      .where(eq(buyInquiries.id, inquiryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Buy inquiry deleted successfully',
        inquiry: deleted[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}