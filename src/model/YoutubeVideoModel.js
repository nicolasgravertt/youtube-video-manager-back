const { ObjectId } = require("mongodb");
const { connect } = require("../db/ConnectMongo");

class YoutubeVideoModel {
  static async getAll() {
    const collection = await connect("YoutubeVideo");

    return collection.find({}).toArray();
  }

  static async getById({ id }) {
    const collection = await connect("YoutubeVideo");
    const objectId = new ObjectId(id);
    return collection.findOne({ _id: objectId });
  }

  static async create({ input }) {
    const collection = await connect("YoutubeVideo");
    const exist = await collection.findOne({ videoUrl: input.videoUrl });
    if (exist) return { error: "Video ya existe" };

    const { insertedId } = await collection.insertOne(input);

    return {
      id: insertedId,
      ...input,
    };
  }

  static async delete({ id }) {
    const collection = await connect("YoutubeVideo");
    const objectId = new ObjectId(id);
    const { deletedCount } = await collection.deleteOne({ _id: objectId });
    return deletedCount > 0;
  }

  static async update({ id, input }) {
    const collection = await connect("YoutubeVideo");
    const objectId = new ObjectId(id);

    const { ok, value } = await collection.findOneAndUpdate(
      { _id: objectId },
      { $set: input },
      { returnNewDocument: true }
    );

    if (!ok) return false;

    return value;
  }
}

module.exports = YoutubeVideoModel;
