import qrcode from "qrcode-terminal";
import { Client } from "whatsapp-web.js";
import xlsx from "xlsx";
import "dotenv/config";

const workbook = xlsx.readFile("./cod gordo.xlsx");

let worksheet = {};

for (const sheetName of workbook.SheetNames) {
  worksheet[sheetName] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
}
const sheet1 = worksheet.Planilha1;

const client = new Client();

const personContacts = [];
async function getPersonContacts(contacts) {
  console.log("Gerando contatos...");
  for (let i = contacts.length - 1; i >= 0; i--) {
    if (contacts[i].isMyContact) {
      personContacts.push(contacts[i]);
    }
  }
}

async function sendMessages(contacts) {
  try {
    await getPersonContacts(contacts);
    console.log("Contatos gerados...");
    console.log(contacts.length, personContacts.length);
    for (let i = 0; i < sheet1.length; i++) {
      for (let j = 0; j < personContacts.length; j++) {
        if (
          sheet1[i].Tutor !== undefined &&
          sheet1[i].Tutor.trim() === personContacts[j].name
        ) {
          console.log(`Calculando serviços de ${sheet1[i].Tutor}`);
          const servicos = [];
          if (sheet1[i].Quantidade)
            servicos.push(
              `${sheet1[i].Quantidade} passeios totalizando R$ ${sheet1[i].passeio}`
            );
          if (sheet1[i].Quantidade_1)
            servicos.push(
              `${sheet1[i].Quantidade_1} pet sitters totalizando R$ ${sheet1[i].petSitter}`
            );
          if (sheet1[i].Quantidade_2)
            servicos.push(
              `${sheet1[i].Quantidade_2} hospedagens totalizando R$ ${sheet1[i].hospedagem}`
            );
          if (sheet1[i].Quantidade_3)
            servicos.push(
              `${sheet1[i].Quantidade_3} banhos totalizando R$ ${sheet1[i].banho}`
            );
          if (sheet1[i].Quantidade_4)
            servicos.push(
              `${sheet1[i].Quantidade_4} adestramentos totalizando R$ ${sheet1[i].adestramento}`
            );
          if (sheet1[i].Quantidade_5)
            servicos.push(
              `${sheet1[i].Quantidade_5} day care totalizando R$${sheet1[i].dayCare}`
            );
          if (sheet1[i].Quantidade_6)
            servicos.push(
              `${sheet1[i].Quantidade_6} transportes totalizando R$ ${sheet1[i].transporte}`
            );
          console.log(
            `Para ${sheet1[i].Clientes} foram realizados ${servicos.join(
              ", "
            )}. Total: R$ ${sheet1[i].total}`
          );
          if (servicos.length) {
            await client.sendMessage(
              personContacts[j].id._serialized,
              `Para ${sheet1[i].Clientes} foram realizados ${servicos.join(
                ", "
              )}. Total: R$ ${sheet1[i].total}`
            );
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
}

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", async () => {
  try {
    console.log();
    console.log("Client is ready!");
    const contacts = await client.getContacts();
    await sendMessages(contacts);
  } catch (err) {
    console.log(err);
  }
});

client.initialize();

/* sheet1.forEach((linha) => {
  const servicos = [];
  if (linha.Quantidade)
    servicos.push(
      `${linha.Quantidade} passeios totalizando R$ ${linha.passeio}`
    );
  if (linha.Quantidade_1)
    servicos.push(
      `${linha.Quantidade_1} pet sitters totalizando R$ ${linha.petSitter}`
    );
  if (linha.Quantidade_2)
    servicos.push(
      `${linha.Quantidade_2} hospedagens totalizando R$ ${linha.hospedagem}`
    );
  if (linha.Quantidade_3)
    servicos.push(`${linha.Quantidade_3} banhos totalizando R$ ${linha.banho}`);
  if (linha.Quantidade_4)
    servicos.push(
      `${linha.Quantidade_4} adestramentos totalizando R$ ${linha.adestramento}`
    );
  if (linha.Quantidade_5)
    servicos.push(
      `${linha.Quantidade_5} day care totalizando R$${linha.dayCare}`
    );
  if (linha.Quantidade_6)
    servicos.push(
      `${linha.Quantidade_6} transportes totalizando R$ ${linha.transporte}`
    );
  console.log(
    `Para ${linha.Clientes} foram realizados ${servicos.join(
      ", "
    )}. Total: R$ ${linha.total}`
  );
}); */
