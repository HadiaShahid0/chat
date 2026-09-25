import { describe, it, vi, expect, beforeEach } from "vitest";

import { getMessagesService } from "../../services/messageServices";

import { getMessages } from "../../controllers/messageController/messageController";

vi.mock("../../services/messageServices.js", () => ({
  getMessagesService: vi.fn(),
}));

describe("Message Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("gets messages successfully", async () => {
    const req = {
      user: {
        id: 1,
      },
      params: {
        userId: 2,
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    const messages = [
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
    getMessagesService.mockResolvedValue(messages);

    await getMessages(req, res);
    expect(getMessagesService).toHaveBeenCalledWith(1, 2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      messages,
    });
  });

  it("returns error when getting messages fails", async () => {
    const req = {
      user: {
        id: 1,
      },
      params: {
        userId: 2,
      },
    };
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    getMessagesService.mockRejectedValue(new Error("Database error"));
    await getMessages(req, res);
    expect(getMessagesService).toHaveBeenCalledWith(1, 2);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Failed to get messages.",
    });
  });
});
