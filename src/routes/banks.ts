import express from "express";
import { listOfBanks, writeToFile } from "../main";
import { body } from "express-validator";
import { handleErrors } from "./transactions";
import { Bank } from "../Bank";

const router = express.Router();

router.get("/", (_, res) => {
  return res.status(200).json(listOfBanks);
});

router.get("/:id", ({ params: { id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() == id);
  if (!bank) return res.status(404).json({ error: "bank not found" });
  return res.status(200).json(bank);
});

router.post("/", body("name").exists().notEmpty(), body("id").exists().notEmpty(), body("balance").exists().notEmpty().isNumeric(), handleErrors, ({ body: { name, id, budget } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === id);
  if (bank) return res.status(403).json({ error: "Bank already exists" });
  listOfBanks.push(new Bank(id, name, budget));
  writeToFile();
  return res.status(201).json({ message: `${name} was added!` });
  }
);

export { router as banks };
