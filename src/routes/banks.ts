import express from "express";
import { listOfBanks, writeToFile } from "../main";
import { body } from "express-validator";
import { handleErrors } from "./transactions";
import { Bank } from "../Bank";
import { accounts } from "./accounts";
import { transactions } from "./transactions";

const router = express.Router({mergeParams: true});

router.use("/:bankId/accounts", accounts)
router.use("/:bankId/transactions", transactions)

router.get("/", ({query:{offset, limit}}, res) => {
  if(offset && limit) return res.status(200).json(listOfBanks.slice(Number(offset), Number(offset) + Number(limit)));
  return res.status(200).json(listOfBanks);
});

router.get("/:id", ({ params: { id } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() == id.toLowerCase());
  if (!bank) return res.status(404).json({ error: "bank not found" });
  return res.status(200).json(bank);
});

router.delete("/:id", ({ params: { id } }, res) => {
  const indexBank = listOfBanks.findIndex((bank) => bank.getId() == id.toLowerCase())
  if(indexBank === -1) return res.status(404).json({ error: "bank not found" });
  listOfBanks.splice(indexBank, 1);
  writeToFile();
  return res.status(201).json({message: "bank removed"})
})

router.post("/", body("name").exists().notEmpty(), body("id").exists().notEmpty().toLowerCase(), body("balance").exists().notEmpty().isFloat(), handleErrors, ({ body: { name, id, balance } }, res) => {
  const bank = listOfBanks.find((bank) => bank.getId() === id);
  if (bank) return res.status(403).json({ error: "Bank already exists" });
  listOfBanks.push(new Bank(id, name, balance));
  writeToFile();
  return res.status(201).json({ message: `${name} was added!` });
  }
);

export { router as banks };
