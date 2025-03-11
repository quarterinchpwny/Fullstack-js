ALTER TABLE "transaction_type" RENAME TO "transaction_types";--> statement-breakpoint
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_transaction_type_id_transaction_type_id_fk";
--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_transaction_type_id_transaction_types_id_fk" FOREIGN KEY ("transaction_type_id") REFERENCES "public"."transaction_types"("id") ON DELETE no action ON UPDATE no action;