import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { listingSubmissions } from '@/db/schema';
import { eq } from 'drizzle-orm';

const VALID_STATUSES = ['pending', 'approved', 'rejected'] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const listingId = parseInt(id);

    // Parse request body
    const body = await request.json();
    const { status } = body;

    // Validate status if provided
    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
          code: 'INVALID_STATUS',
        },
        { status: 400 }
      );
    }

    // Check if listing submission exists
    const existingSubmission = await db
      .select()
      .from(listingSubmissions)
      .where(eq(listingSubmissions.id, listingId))
      .limit(1);

    if (existingSubmission.length === 0) {
      return NextResponse.json(
        {
          error: 'Listing submission not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: { status?: string } = {};

    if (status) {
      updateData.status = status;
    }

    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        {
          error: 'No valid fields to update',
          code: 'NO_UPDATE_FIELDS',
        },
        { status: 400 }
      );
    }

    // Update the listing submission
    const updated = await db
      .update(listingSubmissions)
      .set(updateData)
      .where(eq(listingSubmissions.id, listingId))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('PATCH error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error'),
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        {
          error: 'Valid ID is required',
          code: 'INVALID_ID',
        },
        { status: 400 }
      );
    }

    const listingId = parseInt(id);

    // Check if listing submission exists
    const existingSubmission = await db
      .select()
      .from(listingSubmissions)
      .where(eq(listingSubmissions.id, listingId))
      .limit(1);

    if (existingSubmission.length === 0) {
      return NextResponse.json(
        {
          error: 'Listing submission not found',
          code: 'NOT_FOUND',
        },
        { status: 404 }
      );
    }

    // Delete the listing submission
    const deleted = await db
      .delete(listingSubmissions)
      .where(eq(listingSubmissions.id, listingId))
      .returning();

    return NextResponse.json(
      {
        message: 'Listing submission deleted successfully',
        deleted: deleted[0],
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