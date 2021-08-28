import client from "../../../lib/db";
import ks from "../../../lib/klicksend";

const statusTag = {
  '1': 'AC_BOLETOU',
  '3': 'AC_COMPROU',
  '4': 'AC_CANCELADA',
  '10': 'AC_EXPIROU',
  '7': 'AC_REEMBOLSADA',
  '11': 'AC_EM_RECUPERACAO',
}

module.exports = async (req, res) => {
  try {
    const db = await client.connect();
    const transactions = await db.db(process.env.MONGO_DB).collection("eduzz");

    if (req.method == "POST") {
      const data = req.body;
      console.log(data);

      if (process.env.EDUZZ_API_KEY && data.api_key != process.env.EDUZZ_API_KEY)
        throw "Invalid API KEY"

      const inserted = await transactions.insertOne(data);

      const lead = {
        email: data.cus_email,
        name: data.cus_name,
        phone: data.cus_cel,
        tag: statusTag['' + data.trans_status]
      }

      console.log(await ks(lead))

      res.send(inserted);

    } else {
      const cursor = transactions.find({}, { "sort": { "trans_createdate": -1 } });
      const list = await cursor.toArray();
      res.send(list)
    }

  } catch (e) {
    console.error(e);
    res
      .status(400)
      .send(e);
  }
};
