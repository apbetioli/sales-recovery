import client from "../../../lib/db";
import ks from "../../../lib/klicksend";

const statusTag = {
  '1': 'AC_BOLETOU',
  '2': 'AC_COMPROU',
  '3': 'AC_CANCELADA',
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

      const query = { cus_email: data.cus_email, product_cod: data.product_cod };

      const doc = { $set: data }
      const options = { upsert: true };
      const upserted = await transactions.updateOne(query, doc, options);

      const lead = {
        email: data.cus_email,
        name: data.cus_name,
        phone: data.cus_cel,
        tag: statusTag['' + data.trans_status]
      }

      console.log(await ks(lead))

      res.send(upserted);

    } else if (req.method == "DELETE") {

      const data = req.body;
      console.log(data);

      const query = { cus_email: data.cus_email, product_cod: data.product_cod };
      const t = await transactions.deleteOne(query);

      res.send(t);

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
