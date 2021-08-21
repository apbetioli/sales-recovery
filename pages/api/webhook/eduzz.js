import client from "../../../lib/db";

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
