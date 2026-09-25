import { describe, it, expect, vi } from "vitest";

import { createMulter } from "../utils/multer.js";

describe("Multer", () => {
  it("creates multer upload successfully", () => {
    const upload = createMulter("profileAvatars");

    expect(upload).toBeDefined();
  });

  it("allows image files", () => {
    const cb = vi.fn();

    const file = {
      mimetype: "image/jpeg",
    };

    // Get the multer configuration
    const upload = createMulter("profileAvatars");

    // Access file filter
    upload.fileFilter?.(null, file, cb);

    expect(cb).toHaveBeenCalledWith(null, true);
  });

  it("rejects non-image files", () => {
    const cb = vi.fn();

    const file = {
      mimetype: "application/pdf",
    };

    const upload = createMulter("profileAvatars");

    upload.fileFilter?.(null, file, cb);

    expect(cb).toHaveBeenCalledWith(
      expect.any(Error),
      false
    );

    expect(cb.mock.calls[0][0].message).toBe(
      "Only image files are allowed."
    );
  });
});