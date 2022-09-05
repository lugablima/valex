import { connection } from "../db/postgres";

export interface Payment {
  id: number;
  cardId: number;
  businessId: number;
  timestamp: Date;
  amount: number;
}
export type PaymentWithBusinessName = Payment & { businessName: string };
export type PaymentInsertData = Omit<Payment, "id" | "timestamp">;

export async function findByCardId(cardId: number) {
  const result = await connection.query<PaymentWithBusinessName, [number]>(
    `SELECT p.id, p."cardId", p."businessId", b.name as "businessName", to_char(p.timestamp, 'DD/MM/YYYY') AS timestamp, p.amount
    FROM payments p
    JOIN businesses b ON b.id = p."businessId"
    WHERE "cardId" = $1`,
    [cardId]
  );

  return result.rows;
}

export async function insert(paymentData: PaymentInsertData) {
  const { cardId, businessId, amount } = paymentData;

  connection.query<any, [number, number, number]>(
    `INSERT INTO payments ("cardId", "businessId", amount) VALUES ($1, $2, $3)`,
    [cardId, businessId, amount]
  );
}
