import client from "../../../lib/db";

module.exports = async (req, res) => {
  try {
    const db = await client.connect();
    const abandoned = await db.db(process.env.MONGO_DB).collection("abandoned");
    const data = req.body;
    const query = { "buyerVO.email": data.email };

    if (req.method == "POST") {

      if (!data.date)
        data.date = new Date().toISOString();

      delete data._id;

      const doc = { $set: data }
      const options = { upsert: true };
      const upserted = await abandoned.updateOne(query, doc, options);
      console.log(upserted);
      res.send(upserted);

    } else if (req.method == "DELETE") {

      const query = { "buyerVO.email": data.buyerVO.email };
      console.log(query)

      const deleted = await abandoned.deleteMany(query);
      console.log(deleted)
      res.send(deleted)

    } else {
      const cursor = abandoned.find({}, { "sort": { "date": -1 } });
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
