import { transactions } from "./../schema/transactions";
import { drizzle } from "drizzle-orm/postgres-js";
import { seed } from "drizzle-seed";
import { eq, desc, sum, and, count, is, gte } from "drizzle-orm";

import postgres from "postgres";
import { categories } from "../schema/categories";
import { transactionTypes } from "../schema/transaction-types";

const queryClient = postgres(process.env.DATABASE_URL!);

async function main() {
  try {
    const db = drizzle(queryClient);

    const existingTransactionTypes = await db.select().from(transactionTypes);
    const existingCategories = await db.select().from(categories);

    if (existingTransactionTypes.length === 0) {
      const transactionTypeData = [
        { name: "Income", description: "Income from work" },
        { name: "Expense", description: "Expense on food" },
        { name: "Transfer", description: "Transfer to savings" },
        { name: "Debt payment", description: "Debt payment" },
        { name: "Loan Received", description: "Loan received from bank" },
      ];

      await seed(db, { transactionTypes }).refine((f) => ({
        transactionTypes: {
          count: transactionTypeData.length,
          columns: {
            name: f.valuesFromArray({
              values: transactionTypeData.map((t) => t.name),
              isUnique: true,
            }),
            description: f.valuesFromArray({
              values: transactionTypeData.map((t) => t.description),
              isUnique: true,
            }),
          },
        },
      }));
      console.log("✅ Successfully seeded transaction types");
    } else {
      console.log("ℹ️ Transaction types already exist in database");
    }

    if (existingCategories.length === 0) {
      const categoryData = [
        { name: "Salary", description: "Monthly salary", transactionTypeId: 1 }, // Income
        { name: "Food", description: "Food and dining", transactionTypeId: 2 }, // Expense
        {
          name: "Transportation",
          description: "Public transport and fuel",
          transactionTypeId: 2,
        }, // Expense
        {
          name: "Utilities",
          description: "Electricity, water, internet",
          transactionTypeId: 2,
        }, // Expense
        {
          name: "Entertainment",
          description: "Movies, games, hobbies",
          transactionTypeId: 2,
        }, // Expense
        {
          name: "Shopping",
          description: "Clothing and personal items",
          transactionTypeId: 2,
        }, // Expense
        {
          name: "Healthcare",
          description: "Medical expenses",
          transactionTypeId: 2,
        }, // Expense
        {
          name: "Education",
          description: "Books and courses",
          transactionTypeId: 2,
        }, // Expense
      ];

      await seed(db, { categories }).refine((f) => ({
        categories: {
          count: categoryData.length,
          columns: {
            name: f.valuesFromArray({
              values: categoryData.map((c) => c.name),
              isUnique: true,
            }),
            description: f.valuesFromArray({
              values: categoryData.map((c) => c.description),
              isUnique: true,
            }),
            transactionTypeId: f.valuesFromArray({
              values: categoryData.map((c) => c.transactionTypeId),
            }),
          },
        },
      }));
      console.log("✅ Successfully seeded categories");
    } else {
      console.log("ℹ️ Categories already exist in database");
    }
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await queryClient.end();
  }
}

main();
