import { Card, TransactionType, Recharge } from "@prisma/client";
import { PaymentDataWithBusinessName } from "./paymentsTypes";

export interface CreateCardSchema {
	employeeId: number;
	type: TransactionType;
}

export interface ActivateCardSchema {
	cardId: number;
	cvc: string;
	password: string;
}

export interface BlockOrUnlockCardSchema {
	cardId: number;
	password: string;
}

export interface CreateVirtualCardSchema {
	originalCardId: number;
	originalCardPassword: string;
}

export type CreateCardData = Omit<Card, "id">;

export type UpdateCardData = Partial<Card>;

export interface BalanceCard {
	balance: number;
	transactions: PaymentDataWithBusinessName[];
	recharges: Recharge[];
}
