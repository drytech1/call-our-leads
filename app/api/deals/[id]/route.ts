import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { deals } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedDeal = await db.update(deals)
      .set({
        name: body.name,
        contactId: body.contactId,
        value: body.value,
        stage: body.stage,
        expectedCloseDate: body.expectedCloseDate,
        notes: body.notes,
        daysInStage: body.daysInStage,
        updatedAt: new Date()
      })
      .where(eq(deals.id, parseInt(params.id)))
      .returning()
    
    return NextResponse.json(updatedDeal[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(deals).where(eq(deals.id, parseInt(params.id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to delete deal' }, { status: 500 })
  }
}
