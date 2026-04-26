import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const contact = await db.select().from(contacts).where(eq(contacts.id, parseInt(params.id)))
    
    if (contact.length === 0) {
      return NextResponse.json({ error: 'Contact not found' }, { status: 404 })
    }
    
    return NextResponse.json(contact[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const updatedContact = await db.update(contacts)
      .set({
        name: body.name,
        email: body.email,
        phone: body.phone,
        address: body.address,
        city: body.city,
        state: body.state,
        zipCode: body.zipCode,
        stripeCustomerId: body.stripeCustomerId,
        updatedAt: new Date()
      })
      .where(eq(contacts.id, parseInt(params.id)))
      .returning()
    
    return NextResponse.json(updatedContact[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.delete(contacts).where(eq(contacts.id, parseInt(params.id)))
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to delete contact' }, { status: 500 })
  }
}
