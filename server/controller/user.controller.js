const BaseError = require("../errors/base.error");
const { CONST } = require("../lib/contstants");
const messageModel = require("../models/message.model");
const userModel = require("../models/user.model");

class UserController {
  // [GET]
  async getMessages(req, res, next) {
    try {
      const user = "67606562873d6a47f7fde4a9";
      const { contactId } = req.params;

      const messages = await messageModel
        .find({
          $or: [
            { sender: user, receiver: contactId },
            { sender: contactId, receiver: user },
          ],
        })
        .populate({ path: "sender", select: "email" })
        .populate({ path: "receiver", select: "email" });

      await messageModel.updateMany(
        { sender: contactId, receiver: user, status: "SENT" },
        { status: CONST.READ }
      );

      res.status(200).json({ messages });
    } catch (error) {
      next(error);
    }
  }
  async getContacts(req, res, next) {
    try {
      const userId = "67606562873d6a47f7fde4a9";
      const user = await userModel.findById(userId).populate("contacts");

      if (!user) {
        throw BaseError.NotFound("User not found");
      }

      const allContacts = user.contacts.map((contact) => contact.toObject());
      for (const contact of allContacts) {
        const lastMessage = await messageModel
          .findOne({
            $or: [
              { sender: userId, receiver: contact._id },
              { sender: contact._id, receiver: userId },
            ],
          })
          .populate({ path: "sender" })
          .populate({ path: "receiver" })
          .sort({ createdAt: -1 });

        contact.lastMessage = lastMessage;
      }

      return res.status(200).json({ contacts: allContacts });
    } catch (error) {
      next(error);
    }
  }

  // [POST]
  async createMessage(req, res, next) {
    try {
      const newMessage = await messageModel.create(req.body);
      const currentMessage = await messageModel
        .findById(newMessage._id)
        .populate({ path: "sender", select: "email" })
        .populate({ path: "receiver", select: "email" });
      res.status(201).json({ newMessage: currentMessage });
    } catch (error) {
      next(error);
    }
  }
  async createContact(req, res, next) {
    try {
      const { email } = req.body;
      const userId = "67606562873d6a47f7fde4a9";
      const user = await userModel.findById(userId);
      const contact = await userModel.findOne({ email });
      if (!contact) throw BaseError.BadRequest("User not found ");
      if (user.email === contact.email)
        throw BaseError.BadRequest("You cannot add yourself as a contact");
      const existingContact = await userModel.findOne({
        _id: userId,
        contacts: contact._id,
      });
      if (existingContact)
        throw BaseError.BadRequest("Contact already exis ts");

      await userModel.findByIdAndUpdate(userId, {
        $push: { contacts: contact._id },
      });
      const addedCOntact = await userModel.findByIdAndUpdate(
        contact._id,
        {
          $push: { contacts: userId },
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ message: "Contact added sucsesfully", contact: addedCOntact });
    } catch (error) {
      next(error);
    }
  }
  async createReaction(req, res, next) {
    try {
      const { messageId, reaction } = req.body;
      const updatedMessage = await messageModel.findByIdAndUpdate(
        messageId,
        { reaction },
        { new: true }
      );
      res.status(201).json({ updatedMessage });
    } catch (error) {
      next(error);
    }
  }

  //PUT
  async updateMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      const { text } = req.body;
      const updatedMessage = await messageModel.findByIdAndUpdate(
        messageId,
        { text },
        { new: true }
      );
      res.status(200).json({ updatedMessage });
    } catch (error) {
      next(error);
    }
  }
  async updateProfile(req, res, next) {
    try {
      const { userId, ...payload } = req.body;
      await userModel.findByIdAndUpdate(userId, payload);
      res.status(200).json({ message: "Profile is updated" });
    } catch (error) {
      next(error);
    }
  }

  //Delete
  async deleteMessage(req, res, next) {
    try {
      const { messageId } = req.params;
      await messageModel.findOneAndDelete(messageId);
      res.status(200).json({ message: "Message is deleted" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
