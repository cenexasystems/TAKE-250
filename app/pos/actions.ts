"use server";

import { getDb } from "@/lib/db";

export async function verifyPasscode(enteredPasscode: string): Promise<{ success: boolean; role?: 'staff' | 'admin' }> {
  const adminPasscode = process.env.ADMIN_PASSCODE || "sulficker11";
  const staffPasscode = process.env.STAFF_PASSCODE || process.env.NEXT_PUBLIC_STAFF_PASSCODE || "staff123";

  const cleanEntered = (enteredPasscode || "").replace(/\s/g, "").toLowerCase();
  const cleanAdmin = adminPasscode.replace(/\s/g, "").toLowerCase();
  const cleanStaff = staffPasscode.replace(/\s/g, "").toLowerCase();

  // Support direct password matching (handles spaces like "admin 123") or credential format ("admin:admin 123")
  if (
    cleanEntered === cleanAdmin ||
    cleanEntered === `admin:${cleanAdmin}` ||
    cleanEntered === `admin/${cleanAdmin}`
  ) {
    return { success: true, role: 'admin' };
  }

  if (
    cleanEntered === cleanStaff ||
    cleanEntered === `staff:${cleanStaff}` ||
    cleanEntered === `staff/${cleanStaff}`
  ) {
    return { success: true, role: 'staff' };
  }

  return { success: false };
}

// ========================================================
// Products / Catalog Actions (Neon PostgreSQL)
// ========================================================

export async function fetchProductsAction() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        id, 
        name, 
        description, 
        default_price::float AS default_price, 
        category 
      FROM products 
      ORDER BY name ASC;
    `;
    return { success: true, data: rows };
  } catch (error: any) {
    console.error("fetchProductsAction error:", error.message);
    return { success: false, error: error.message, data: [] };
  }
}

export async function createProductAction(item: {
  name: string;
  description?: string;
  default_price?: number;
  category?: string;
}) {
  try {
    const sql = getDb();
    const rows = await sql`
      INSERT INTO products (name, description, default_price, category)
      VALUES (
        ${item.name}, 
        ${item.description || ''}, 
        ${item.default_price || 0}, 
        ${item.category || 'Custom'}
      )
      RETURNING 
        id, 
        name, 
        description, 
        default_price::float AS default_price, 
        category;
    `;
    return { success: true, data: rows[0] };
  } catch (error: any) {
    console.error("createProductAction error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function updateProductAction(
  id: string,
  item: {
    name: string;
    description?: string;
    default_price?: number;
  }
) {
  try {
    const sql = getDb();
    const rows = await sql`
      UPDATE products
      SET 
        name = ${item.name}, 
        description = ${item.description || ''}, 
        default_price = ${item.default_price || 0}
      WHERE id = ${id}
      RETURNING 
        id, 
        name, 
        description, 
        default_price::float AS default_price, 
        category;
    `;
    return { success: true, data: rows[0] };
  } catch (error: any) {
    console.error("updateProductAction error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteProductAction(id: string) {
  try {
    const sql = getDb();
    await sql`DELETE FROM products WHERE id = ${id};`;
    return { success: true };
  } catch (error: any) {
    console.error("deleteProductAction error:", error.message);
    return { success: false, error: error.message };
  }
}

// ========================================================
// Orders & Customers Actions (Neon PostgreSQL)
// ========================================================

export async function checkOrderIdExistsAction(id: string): Promise<{ exists: boolean }> {
  try {
    const sql = getDb();
    const rows = await sql`SELECT id FROM orders WHERE id = ${id} LIMIT 1;`;
    return { exists: rows.length > 0 };
  } catch (error: any) {
    console.error("checkOrderIdExistsAction error:", error.message);
    return { exists: false };
  }
}

export async function createOrderAction(payload: {
  id: string;
  customerName: string;
  customerPhone: string;
  source: "ONLINE" | "OFFLINE";
  status?: string;
  subtotal: number;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  discountAmount: number;
  deliveryFee: number;
  grandTotal: number;
  cashReceived: number;
  paymentMethod?: "cash" | "gpay" | "split";
  cashAmount?: number;
  gpayAmount?: number;
  items: Array<{
    snapshot_name: string;
    snapshot_price: number;
    quantity: number;
    product_id?: string;
  }>;
}) {
  try {
    const sql = getDb();

    // 1. Upsert customer
    const custPhone = payload.customerPhone.trim();
    const custRows = await sql`
      INSERT INTO customers (name, phone)
      VALUES (${payload.customerName || 'Guest'}, ${custPhone})
      ON CONFLICT (phone)
      DO UPDATE SET name = EXCLUDED.name
      RETURNING id, name, phone;
    `;
    const customerId = custRows[0]?.id;

    const pMethod = payload.paymentMethod || "cash";
    const cAmount = payload.cashAmount !== undefined
      ? payload.cashAmount
      : (pMethod === "gpay" ? 0 : payload.grandTotal);
    const gAmount = payload.gpayAmount !== undefined
      ? payload.gpayAmount
      : (pMethod === "gpay" ? payload.grandTotal : 0);

    // 2. Insert order
    await sql`
      INSERT INTO orders (
        id, 
        customer_id, 
        source, 
        status, 
        subtotal, 
        discount_type, 
        discount_value, 
        discount_amount, 
        delivery_fee, 
        grand_total, 
        cash_received,
        payment_method,
        cash_amount,
        gpay_amount
      ) VALUES (
        ${payload.id}, 
        ${customerId || null}, 
        ${payload.source}, 
        ${payload.status || 'COMPLETED'}, 
        ${payload.subtotal}, 
        ${payload.discountType}, 
        ${payload.discountValue}, 
        ${payload.discountAmount}, 
        ${payload.deliveryFee}, 
        ${payload.grandTotal}, 
        ${payload.cashReceived},
        ${pMethod},
        ${cAmount},
        ${gAmount}
      );
    `;

    // 3. Insert order items
    for (const item of payload.items) {
      await sql`
        INSERT INTO order_items (
          order_id, 
          snapshot_name, 
          snapshot_price, 
          quantity, 
          product_id
        ) VALUES (
          ${payload.id}, 
          ${item.snapshot_name}, 
          ${item.snapshot_price}, 
          ${item.quantity}, 
          ${item.product_id || null}
        );
      `;
    }

    return { success: true, orderId: payload.id };
  } catch (error: any) {
    console.error("createOrderAction error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function fetchOrdersAction() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        o.id,
        o.customer_id,
        o.source,
        o.status,
        o.subtotal::float AS subtotal,
        o.discount_type,
        o.discount_value::float AS discount_value,
        o.discount_amount::float AS discount_amount,
        o.delivery_fee::float AS delivery_fee,
        o.grand_total::float AS grand_total,
        o.cash_received::float AS cash_received,
        COALESCE(o.payment_method, 'cash') AS payment_method,
        COALESCE(o.cash_amount::float, CASE WHEN o.payment_method = 'gpay' THEN 0 ELSE o.grand_total::float END) AS cash_amount,
        COALESCE(o.gpay_amount::float, CASE WHEN o.payment_method = 'gpay' THEN o.grand_total::float ELSE 0 END) AS gpay_amount,
        o.created_at,
        json_build_object('name', c.name, 'phone', c.phone) AS customers,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', oi.id,
                'snapshot_name', oi.snapshot_name,
                'snapshot_price', oi.snapshot_price::float,
                'quantity', oi.quantity,
                'product_id', oi.product_id
              )
            )
            FROM order_items oi
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS order_items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC;
    `;
    return { success: true, data: rows };
  } catch (error: any) {
    console.error("fetchOrdersAction error:", error.message);
    return { success: false, error: error.message, data: [] };
  }
}

export async function fetchOrderByIdAction(id: string) {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT 
        o.id,
        o.customer_id,
        o.source,
        o.status,
        o.subtotal::float AS subtotal,
        o.discount_type,
        o.discount_value::float AS discount_value,
        o.discount_amount::float AS discount_amount,
        o.delivery_fee::float AS delivery_fee,
        o.grand_total::float AS grand_total,
        o.cash_received::float AS cash_received,
        COALESCE(o.payment_method, 'cash') AS payment_method,
        COALESCE(o.cash_amount::float, CASE WHEN o.payment_method = 'gpay' THEN 0 ELSE o.grand_total::float END) AS cash_amount,
        COALESCE(o.gpay_amount::float, CASE WHEN o.payment_method = 'gpay' THEN o.grand_total::float ELSE 0 END) AS gpay_amount,
        o.created_at,
        json_build_object('name', c.name, 'phone', c.phone) AS customers,
        COALESCE(
          (
            SELECT json_agg(
              json_build_object(
                'id', oi.id,
                'snapshot_name', oi.snapshot_name,
                'snapshot_price', oi.snapshot_price::float,
                'quantity', oi.quantity,
                'product_id', oi.product_id
              )
            )
            FROM order_items oi
            WHERE oi.order_id = o.id
          ),
          '[]'::json
        ) AS order_items
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      WHERE o.id = ${id}
      LIMIT 1;
    `;
    if (rows.length === 0) {
      return { success: false, error: "Order not found" };
    }
    return { success: true, data: rows[0] };
  } catch (error: any) {
    console.error("fetchOrderByIdAction error:", error.message);
    return { success: false, error: error.message };
  }
}

export async function deleteOrderAction(id: string) {
  try {
    const sql = getDb();
    // Delete order items first (foreign key constraint)
    await sql`DELETE FROM order_items WHERE order_id = ${id};`;
    // Then delete the order itself
    await sql`DELETE FROM orders WHERE id = ${id};`;
    return { success: true };
  } catch (error: any) {
    console.error("deleteOrderAction error:", error.message);
    return { success: false, error: error.message };
  }
}
