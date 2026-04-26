import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { contacts } from '@/lib/db/schema'

export async function GET() {
  try {
    const allContacts = await db.select().from(contacts)
    return NextResponse.json(allContacts)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const newContact = await db.insert(contacts).values({
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      stripeCustomerId: body.stripeCustomerId
    }).returning()
    
    return NextResponse.json(newContact[0])
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 })
  }
}
