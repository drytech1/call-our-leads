"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, Users, Calendar, DollarSign, Search, Plus, Edit, Trash, X, ArrowUp, Menu, Bell } from 'lucide-react'

interface Contact {
  id: number
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  stripeCustomerId?: string
  createdAt: string
}

interface Deal {
  id: number
  name: string
  contactId: number
  value: string
  stage: string
  expectedCloseDate: string
  notes: string
  createdAt: string
  daysInStage: number
}

async function fetchContacts(): Promise<Contact[]> {
  const res = await fetch('/api/contacts')
  if (!res.ok) throw new Error('Failed to fetch contacts')
  return res.json()
}

async function createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
  const res = await fetch('/api/contacts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contact)
  })
  if (!res.ok) throw new Error('Failed to create contact')
  return res.json()
}

async function updateContact(id: number, updates: Partial<Contact>): Promise<Contact> {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error('Failed to update contact')
  return res.json()
}

async function deleteContact(id: number): Promise<void> {
  const res = await fetch(`/api/contacts/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete contact')
}

async function fetchDeals(): Promise<Deal[]> {
  const res = await fetch('/api/deals')
  if (!res.ok) throw new Error('Failed to fetch deals')
  return res.json()
}

async function createDeal(deal: Omit<Deal, 'id' | 'createdAt' | 'daysInStage'>): Promise<Deal> {
  const res = await fetch('/api/deals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(deal)
  })
  if (!res.ok) throw new Error('Failed to create deal')
  return res.json()
}

async function updateDeal(id: number, updates: Partial<Deal>): Promise<Deal> {
  const res = await fetch(`/api/deals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  })
  if (!res.ok) throw new Error('Failed to update deal')
  return res.json()
}

async function deleteDeal(id: number): Promise<void> {
  const res = await fetch(`/api/deals/${id}`, {
    method: 'DELETE'
  })
  if (!res.ok) throw new Error('Failed to delete deal')
}

export default function CRMApplication() {
  const [activeSection, setActiveSection] = useState('dashboard')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [deals, setDeals] = useState<Deal[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterState, setFilterState] = useState('all')
  const [filterCity, setFilterCity] = useState('all')
  const [showContactModal, setShowContactModal] = useState(false)
  const [showDealModal, setShowDealModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null)

  const pipelineStages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)
      const [contactsData, dealsData] = await Promise.all([
        fetchContacts(),
        fetchDeals()
      ])
      setContacts(contactsData)
      setDeals(dealsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const addContact = async (contact: Omit<Contact, 'id' | 'createdAt'>) => {
    try {
      const newContact = await createContact(contact)
      setContacts([...contacts, newContact])
      setShowContactModal(false)
      setEditingContact(null)
    } catch (error) {
      console.error('Failed to add contact:', error)
      alert('Failed to add contact')
    }
  }

  const updateContactData = async (id: number, updates: Partial<Contact>) => {
    try {
      const updatedContact = await updateContact(id, updates)
      setContacts(contacts.map(c => c.id === id ? updatedContact : c))
      setShowContactModal(false)
      setEditingContact(null)
    } catch (error) {
      console.error('Failed to update contact:', error)
      alert('Failed to update contact')
    }
  }

  const deleteContactData = async (id: number) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteContact(id)
        setContacts(contacts.filter(c => c.id !== id))
        setSelectedContact(null)
      } catch (error) {
        console.error('Failed to delete contact:', error)
        alert('Failed to delete contact')
      }
    }
  }

  const addDeal = async (deal: Omit<Deal, 'id' | 'createdAt' | 'daysInStage'>) => {
    try {
      const newDeal = await createDeal(deal)
      setDeals([...deals, newDeal])
      setShowDealModal(false)
      setEditingDeal(null)
    } catch (error) {
      console.error('Failed to add deal:', error)
      alert('Failed to add deal')
    }
  }

  const updateDealData = async (id: number, updates: Partial<Deal>) => {
    try {
      const updatedDeal = await updateDeal(id, updates)
      setDeals(deals.map(d => d.id === id ? updatedDeal : d))
      setShowDealModal(false)
      setEditingDeal(null)
    } catch (error) {
      console.error('Failed to update deal:', error)
      alert('Failed to update deal')
    }
  }

  const deleteDealData = async (id: number) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      try {
        await deleteDeal(id)
        setDeals(deals.filter(d => d.id !== id))
      } catch (error) {
        console.error('Failed to delete deal:', error)
        alert('Failed to delete deal')
      }
    }
  }

  const moveDeal = async (dealId: number, newStage: string) => {
    try {
      const deal = deals.find(d => d.id === dealId)
      if (deal) {
        await updateDealData(dealId, { stage: newStage, daysInStage: 0 })
      }
    } catch (error) {
      console.error('Failed to move deal:', error)
    }
  }

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesState = filterState === 'all' || contact.state === filterState
    const matchesCity = filterCity === 'all' || contact.city === filterCity
    return matchesSearch && matchesState && matchesCity
  })

  const getContactById = (id: number) => contacts.find(c => c.id === id)
  const getDealsByContact = (contactId: number) => deals.filter(d => d.contactId === contactId)
  const totalPipelineValue = deals.reduce((sum, deal) => sum + parseFloat(deal.value), 0)
  const activeDealCount = deals.filter(d => !['Closed Won', 'Closed Lost'].includes(d.stage)).length
  const wonDeals = deals.filter(d => d.stage === 'Closed Won')
  const lostDeals = deals.filter(d => d.stage === 'Closed Lost')
  const winRate = deals.length > 0 ? (wonDeals.length / (wonDeals.length + lostDeals.length) * 100) : 0
  const averageDealSize = wonDeals.length > 0 ? wonDeals.reduce((sum, d) => sum + parseFloat(d.value), 0) / wonDeals.length : 0
  const getDealsByStage = (stage: string) => deals.filter(d => d.stage === stage)
  const getStageValue = (stage: string) => getDealsByStage(stage).reduce((sum, deal) => sum + parseFloat(deal.value), 0)

  const handleDragStart = (deal: Deal) => {
    setDraggedDeal(deal)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (stage: string) => {
    if (draggedDeal) {
      moveDeal(draggedDeal.id, stage)
      setDraggedDeal(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading CRM...</p>
        </div>
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={() => setShowContactModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDealCount}</div>
            <p className="text-xs text-gray-500 mt-1">In pipeline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Total opportunity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <ArrowUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-500 mt-1">Conversion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Latest additions to your CRM</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {contacts.slice(0, 5).map(contact => (
                <div key={contact.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => {
                    setSelectedContact(contact)
                    setActiveSection('contacts')
                  }}>
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pipeline Overview</CardTitle>
            <CardDescription>Deals by stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pipelineStages.filter(s => !s.includes('Closed')).map(stage => {
                const stageDeals = getDealsByStage(stage)
                const stageValue = getStageValue(stage)
                return (
                  <div key={stage} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{stage}</p>
                      <p className="text-sm text-gray-500">{stageDeals.length} deals</p>
                    </div>
                    <span className="font-bold text-green-600">${stageValue.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderContacts = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={() => {
          setEditingContact(null)
          setShowContactModal(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {Array.from(new Set(contacts.map(c => c.state))).map(state => (
                  <SelectItem key={state} value={state}>{state}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCity} onValueChange={setFilterCity}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {Array.from(new Set(contacts.map(c => c.city))).map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Phone</th>
                  <th className="text-left p-3 font-medium">City</th>
                  <th className="text-left p-3 font-medium">State</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map(contact => (
                  <tr key={contact.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{contact.name}</td>
                    <td className="p-3">{contact.email}</td>
                    <td className="p-3">{contact.phone}</td>
                    <td className="p-3">{contact.city}</td>
                    <td className="p-3">{contact.state}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}>
                          View
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {
                          setEditingContact(contact)
                          setShowContactModal(true)
                        }}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteContactData(contact.id)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedContact && (
        <ContactDetailView
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onEdit={() => {
            setEditingContact(selectedContact)
            setShowContactModal(true)
            setSelectedContact(null)
          }}
          onDelete={() => deleteContactData(selectedContact.id)}
          deals={getDealsByContact(selectedContact.id)}
        />
      )}
    </div>
  )

  const renderPipeline = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sales Pipeline</h1>
        <Button onClick={() => {
          setEditingDeal(null)
          setShowDealModal(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPipelineValue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Deal Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageDealSize.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{winRate.toFixed(1)}%</div>
          </CardContent>
        </Card>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ minWidth: 'max-content' }}>
          {pipelineStages.map(stage => (
            <div
              key={stage}
              className="flex-shrink-0 w-80"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(stage)}
            >
              <Card className={`${stage === 'Closed Won' ? 'border-green-500' : stage === 'Closed Lost' ? 'border-red-500' : 'border-blue-500'} border-t-4`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">{stage}</CardTitle>
                  <CardDescription>
                    {getDealsByStage(stage).length} deals • ${getStageValue(stage).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {getDealsByStage(stage).map(deal => {
                    const contact = getContactById(deal.contactId)
                    return (
                      <div
                        key={deal.id}
                        draggable
                        onDragStart={() => handleDragStart(deal)}
                        className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md cursor-move transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{deal.name}</h4>
                          <Button variant="ghost" size="sm" onClick={() => {
                            setEditingDeal(deal)
                            setShowDealModal(true)
                          }}>
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{contact?.name}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-green-600">${parseFloat(deal.value).toLocaleString()}</span>
                          <span className="text-xs text-gray-500">{deal.daysInStage} days</span>
                        </div>
                      </div>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-gray-50">
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b flex items-center justify-between">
          {sidebarOpen && <h2 className="text-xl font-bold text-blue-600">CRM Pro</h2>}
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Dashboard' },
            { id: 'contacts', icon: Users, label: 'Contacts' },
            { id: 'pipeline', icon: Calendar, label: 'Pipeline' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="h-5 w-5" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection === 'contacts' && renderContacts()}
          {activeSection === 'pipeline' && renderPipeline()}
        </main>
      </div>

      {showContactModal && (
        <ContactModal
          contact={editingContact}
          onSave={(contact) => {
            if (editingContact) {
              updateContactData(editingContact.id, contact)
            } else {
              addContact(contact)
            }
          }}
          onClose={() => {
            setShowContactModal(false)
            setEditingContact(null)
          }}
        />
      )}

      {showDealModal && (
        <DealModal
          deal={editingDeal}
          contacts={contacts}
          onSave={(deal) => {
            if (editingDeal) {
              updateDealData(editingDeal.id, deal)
            } else {
              addDeal(deal)
            }
          }}
          onClose={() => {
            setShowDealModal(false)
            setEditingDeal(null)
          }}
        />
      )}
    </div>
  )
}

function ContactDetailView({
  contact,
  onClose,
  onEdit,
  onDelete,
  deals
}: {
  contact: Contact
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
  deals: Deal[]
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{contact.name}</CardTitle>
              <CardDescription>{contact.email}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span>{contact.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span>{contact.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">City:</span>
                  <span>{contact.city}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">State:</span>
                  <span>{contact.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Zip Code:</span>
                  <span>{contact.zipCode}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Active Deals:</span>
                  <span>{deals.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Deal Value:</span>
                  <span className="font-bold text-green-600">
                    ${deals.reduce((sum, d) => sum + parseFloat(d.value), 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Deals</h3>
            <div className="space-y-2">
              {deals.map(deal => (
                <div key={deal.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{deal.name}</p>
                    <p className="text-sm text-gray-500">{deal.stage}</p>
                  </div>
                  <span className="font-bold text-green-600">
                    ${parseFloat(deal.value).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={onEdit} className="flex-1">
              <Edit className="mr-2 h-4 w-4" />
              Edit Contact
            </Button>
            <Button variant="outline" onClick={onDelete} className="flex-1">
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ContactModal({
  contact,
  onSave,
  onClose
}: {
  contact: Contact | null
  onSave: (contact: Omit<Contact, 'id' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    address: contact?.address || '',
    city: contact?.city || '',
    state: contact?.state || '',
    zipCode: contact?.zipCode || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{contact ? 'Edit Contact' : 'Add New Contact'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Contact</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function DealModal({
  deal,
  contacts,
  onSave,
  onClose
}: {
  deal: Deal | null
  contacts: Contact[]
  onSave: (deal: Omit<Deal, 'id' | 'createdAt' | 'daysInStage'>) => void
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: deal?.name || '',
    contactId: deal?.contactId || 0,
    value: deal?.value || '0',
    stage: deal?.stage || 'Lead',
    expectedCloseDate: deal?.expectedCloseDate || '',
    notes: deal?.notes || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const pipelineStages = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{deal ? 'Edit Deal' : 'Add New Deal'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="dealName">Deal Name</Label>
              <Input
                id="dealName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="contact">Contact</Label>
              <Select value={formData.contactId.toString()} onValueChange={(value) => setFormData({ ...formData, contactId: parseInt(value) })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a contact" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map(contact => (
                    <SelectItem key={contact.id} value={contact.id.toString()}>{contact.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="value">Deal Value</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="stage">Stage</Label>
                <Select value={formData.stage} onValueChange={(value) => setFormData({ ...formData, stage: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {pipelineStages.map(stage => (
                      <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
              <Button type="submit">Save Deal</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
