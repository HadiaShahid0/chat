import { describe, it, expect, beforeEach, vi } from "vitest";

import {
  createMessageService,
  getMessagesService,
  markMessagesDeliveredService,
  markMessagesSeenService,
} from "../../services/messageServices";

import Message from "../../models/messageModel";

vi.mock("../../models/messageModel.js", () => ({
  default: {
    create: vi.fn(),
    findAll: vi.fn(),
    update: vi.fn(),
  },
}));

describe("Message Services", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a message successfully", async () => {
    const message = {
      id: 1,
      senderId: 1,
      receiverId: 2,
      text: "hello",
    };
    Message.create.mockResolvedValue(message);

    const createMessage = await createMessageService(1, 2, "hello");
    expect(createMessage).toEqual(message);

    expect(Message.create).toHaveBeenCalledWith({
      senderId: 1,
      receiverId: 2,
      text: "hello",
    });
  });

  it("get all Messages between two users", async () => {
    const message = [
      {
        id: 1,
        senderId: 1,
        receiverId: 2,
        text: "Hello",
      },
      {
        id: 2,
        senderId: 2,
        receiverId: 1,
        text: "Hi",
      },
    ];
    Message.findAll.mockResolvedValue(message);

    const allMessage = await getMessagesService(1, 2);
    expect(allMessage).toEqual(message);
    expect(Message.findAll).toHaveBeenCalled();
  });

  it("mark sent messages as delivered", async () => {
    const messages = [
      {
        id: 1,
        senderId: 1,
        receiverId: 2,
        text: "Hello",
        status: "sent",

        toJSON: vi.fn().mockReturnValue({
          id: 1,
          senderId: 1,
          receiverId: 2,
          text: "Hello",
          status: "sent",
        }),
      },
    ];

    Message.findAll.mockResolvedValue(messages);
    Message.update.mockResolvedValue([1]);

    const markDelivered = await markMessagesDeliveredService(2);
    expect(Message.findAll).toHaveBeenCalledWith({
      where: {
        receiverId: 2,
        status: "sent",
      },
    });

    expect(Message.update).toHaveBeenCalledWith(
      {
        status: "delivered",
      },
      {
        where: {
          receiverId: 2,
          status: "sent",
        },
      },
    );
    expect(markDelivered).toEqual([
      {
        id: 1,
        senderId: 1,
        receiverId: 2,
        text: "Hello",
        status: "delivered",
      },
    ]);
  });

  it("marks messages as seen", async () => {
    const messages = {
      id: 1,
      senderId: 1,
      receiverId: 2,
      text: "Hello",
      status: "delivered",
    };

    Message.findAll.mockResolvedValue(messages);
    Message.update.mockResolvedValue([1]);

    const markSeen = await markMessagesSeenService(2, 1);
    expect(Message.findAll).toHaveBeenCalled();
    expect(Message.update).toHaveBeenCalledWith(
      {
        status: "seen",
      },
      {
        where: {
          senderId: 1,
          receiverId: 2,
          status: expect.any(Object),
        },
      },
    );

    expect(markSeen).toEqual(messages)
  });
});
0