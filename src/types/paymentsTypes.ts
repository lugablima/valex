import { Payment } from "@prisma/client";

export interface PaymentSchema {
	cardId: number;
	password: string;
	businessId: number;
	amount: number;
}
export type PaymentDataWithBusinessName = Payment & { businessName: string };
