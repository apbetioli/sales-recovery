import client from "../../../lib/db";

module.exports = async (req, res) => {
  try {
    const db = await client.connect();
    const transactions = await db.db(process.env.MONGO_DB).collection("transactions");
    const abandoned = await db.db(process.env.MONGO_DB).collection("abandoned");


    if (req.method == "POST") {
      const data = req.body;
      console.log(data);

      abandoned.deleteMany({ "buyerVO.email": data.email });

      const query = { email: data.email, prod: data.prod };
      const t = await transactions.findOne(query);

      delete data._id;

      if (!t || t.status != "approved" || ["completed", "refunded", "chargeback", "dispute"].includes(data.status)) {

        if (!data.archived)
          data.archived = false;

        const doc = { $set: data }
        const options = { upsert: true };
        const upserted = await transactions.updateOne(query, doc, options);
        res.send(upserted);
      } else {
        res.send(t);
      }

    } else if (req.method == "DELETE") {

      const data = req.body;
      console.log(data);

      const query = { email: data.email, prod: data.prod };
      const t = await transactions.deleteOne(query);

      res.send(t);

    } else {
      const cursor = transactions.find({}, { "sort": { "purchase_date": -1 } });
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
