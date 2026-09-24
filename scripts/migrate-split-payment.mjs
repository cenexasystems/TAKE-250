import { neon } from '@neondatabase/serverless';
import fs from 'fs';

async function run() {
  const env = fs.readFileSync('.env.local', 'utf-8');
  const match = env.match(/DATABASE_URL="([^"]+)"/);
  if (!match) {
    console.error('DATABASE_URL not found in .env.local');
    return;
  }
  const dbUrl = match[1];
  const sql = neon(dbUrl);

  console.log('Connecting to database...');
  await sql`
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cash';
  `;
  console.log('payment_method column added or exists.');

  await sql`
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS cash_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00;
  `;
  console.log('cash_amount column added or exists.');

  await sql`
    ALTER TABLE orders 
    ADD COLUMN IF NOT EXISTS gpay_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00;
  `;
  console.log('gpay_amount column added or exists.');

  // Migrate existing historical orders:
  await sql`
    UPDATE orders
    SET 
      payment_method = COALESCE(payment_method, 'cash'),
      cash_amount = CASE 
        WHEN (cash_amount IS NULL OR cash_amount = 0) AND (gpay_amount IS NULL OR gpay_amount = 0) 
        THEN grand_total 
        ELSE cash_amount 
      END,
      gpay_amount = COALESCE(gpay_amount, 0.00)
    WHERE payment_method IS NULL OR (cash_amount = 0 AND gpay_amount = 0 AND grand_total > 0);
  `;
  console.log('Migration complete.');

  const sampleOrders = await sql`
    SELECT id, grand_total, payment_method, cash_amount, gpay_amount 
    FROM orders 
    ORDER BY created_at DESC
    LIMIT 5;
  `;
  console.log('Sample orders:', sampleOrders);
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
