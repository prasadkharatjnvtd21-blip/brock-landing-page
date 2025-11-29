import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { rentInquiries } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID is valid integer
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

    // Check if rent inquiry exists
    const existingInquiry = await db
      .select()
      .from(rentInquiries)
      .where(eq(rentInquiries.id, inquiryId))
      .limit(1);

    if (existingInquiry.length === 0) {
      return NextResponse.json(
        {
          error: 'Rent inquiry not found',
          code: 'INQUIRY_NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the rent inquiry
    const deleted = await db
      .delete(rentInquiries)
      .where(eq(rentInquiries.id, inquiryId))
      .returning();

    return NextResponse.json(
      {
        message: 'Rent inquiry deleted successfully',
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