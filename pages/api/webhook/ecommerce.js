import client from "../../../lib/db";

module.exports = async (req, res) => {
  try {
    const db = await client.connect();
    const sales = await db.db(process.env.MONGO_DB).collection("sales");

    if (req.method == "POST") {
      const data = req.body;
      console.log(data)

      const query = { _id: data._id };
      delete data._id;

      const doc = { $set: data }
      const options = { upsert: true };
      const upserted = await sales.updateOne(query, doc, options);
      res.send(upserted);

    } else {
      const cursor = sales.find({}, {});
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
