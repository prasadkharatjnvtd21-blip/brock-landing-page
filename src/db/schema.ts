import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';

export const properties = sqliteTable('properties', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  image: text('image').notNull(),
  price: text('price').notNull(),
  priceValue: integer('price_value').notNull(),
  title: text('title').notNull(),
  location: text('location').notNull(),
  beds: integer('beds').notNull(),
  baths: integer('baths').notNull(),
  sqft: integer('sqft').notNull(),
  availableFor: text('available_for').notNull().default('buy'),
  description: text('description'),
  amenities: text('amenities', { mode: 'json' }),
  gallery: text('gallery', { mode: 'json' }),
  categories: text('categories'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

export const contactInquiries = sqliteTable('contact_inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});

export const buyInquiries = sqliteTable('buy_inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull(),
  propertyTitle: text('property_title').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  budget: text('budget').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});

export const rentInquiries = sqliteTable('rent_inquiries', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  propertyId: integer('property_id').notNull(),
  propertyTitle: text('property_title').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  moveInDate: text('move_in_date').notNull(),
  message: text('message').notNull(),
  createdAt: text('created_at').notNull(),
});

export const listingSubmissions = sqliteTable('listing_submissions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  propertyType: text('property_type').notNull(),
  location: text('location').notNull(),
  price: text('price').notNull(),
  description: text('description').notNull(),
  status: text('status').notNull().default('pending'),
  createdAt: text('created_at').notNull(),
});