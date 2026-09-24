-- ========================================================
-- Neon PostgreSQL Database Schema for Zera Billing POS
-- Run this script in your Neon Console SQL Editor
-- (https://console.neon.tech)
-- ========================================================

-- Enable UUID extension (usually enabled by default in Neon)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL DEFAULT 'Guest',
    phone TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);

-- 2. Products / Catalog Table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT DEFAULT '',
    default_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    category TEXT DEFAULT 'Custom',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- Formatted invoice ID (e.g. INV-2026-ABCDE)
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    source TEXT NOT NULL DEFAULT 'OFFLINE', -- 'ONLINE' | 'OFFLINE'
    status TEXT NOT NULL DEFAULT 'COMPLETED', -- 'COMPLETED' | 'PENDING'
    subtotal NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    discount_type TEXT DEFAULT 'FIXED', -- 'PERCENT' | 'FIXED'
    discount_value NUMERIC(10,2) DEFAULT 0.00,
    discount_amount NUMERIC(10,2) DEFAULT 0.00,
    delivery_fee NUMERIC(10,2) DEFAULT 0.00,
    grand_total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    cash_received NUMERIC(10,2) DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'cash', -- 'cash' | 'gpay' | 'split'
    cash_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    gpay_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 4. Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    snapshot_name TEXT NOT NULL,
    snapshot_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
