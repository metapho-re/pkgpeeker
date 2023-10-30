import { describe, expect, it } from "vitest";
import { parseAuthor } from "../parseAuthor";

describe("parseAuthor", () => {
  describe("field is undefined", () => {
    it("should return null", () => {
      expect(parseAuthor(undefined)).toBeNull();
    });
  });

  describe("field is an object", () => {
    it("should return an object with name, email and url properties when name, email and url are provided", () => {
      expect(
        parseAuthor({
          name: "Barney Rubble",
          email: "b@rubble.com",
          url: "http://barnyrubble.tumblr.com/",
        })
      ).toEqual({
        name: "Barney Rubble",
        email: "b@rubble.com",
        url: "http://barnyrubble.tumblr.com/",
      });
    });

    it("should return an object with name and email properties when only name and email are provided", () => {
      expect(
        parseAuthor({
          name: "Barney Rubble",
          email: "b@rubble.com",
        })
      ).toEqual({
        name: "Barney Rubble",
        email: "b@rubble.com",
      });
    });

    it("should return an object with name and url properties when only name and url are provided", () => {
      expect(
        parseAuthor({
          name: "Barney Rubble",
          url: "http://barnyrubble.tumblr.com/",
        })
      ).toEqual({
        name: "Barney Rubble",
        url: "http://barnyrubble.tumblr.com/",
      });
    });

    it("should return an object with name property when only name is provided", () => {
      expect(
        parseAuthor({
          name: "Barney Rubble",
        })
      ).toEqual({
        name: "Barney Rubble",
      });
    });

    it("should support urls whose protocol is not provided", () => {
      expect(
        parseAuthor({
          name: "Barney Rubble",
          url: "barnyrubble.tumblr.com/",
        })
      ).toEqual({
        name: "Barney Rubble",
        url: "http://barnyrubble.tumblr.com/",
      });
    });
  });

  describe("field is a string", () => {
    it("should return an object with name, email and url properties when name, email and url are provided in this order", () => {
      expect(
        parseAuthor(
          "Barney Rubble <b@rubble.com> (http://barnyrubble.tumblr.com/)"
        )
      ).toEqual({
        name: "Barney Rubble",
        email: "b@rubble.com",
        url: "http://barnyrubble.tumblr.com/",
      });
    });

    it("should return an object with name, email and url properties when name, url and email are provided in this order", () => {
      expect(
        parseAuthor(
          "Barney Rubble (http://barnyrubble.tumblr.com/) <b@rubble.com>"
        )
      ).toEqual({
        name: "Barney Rubble",
        email: "b@rubble.com",
        url: "http://barnyrubble.tumblr.com/",
      });
    });

    it("should return an object with name and email properties when only name and email are provided", () => {
      expect(parseAuthor("Barney Rubble <b@rubble.com>")).toEqual({
        name: "Barney Rubble",
        email: "b@rubble.com",
      });
    });

    it("should return an object with name and url properties when only name and url are provided", () => {
      expect(
        parseAuthor("Barney Rubble (http://barnyrubble.tumblr.com/)")
      ).toEqual({
        name: "Barney Rubble",
        url: "http://barnyrubble.tumblr.com/",
      });
    });

    it("should return an object with name property when only name is provided", () => {
      expect(parseAuthor("Barney Rubble")).toEqual({
        name: "Barney Rubble",
      });
    });

    it("should support urls whose protocol is not provided", () => {
      expect(parseAuthor("Barney Rubble (barnyrubble.tumblr.com/)")).toEqual({
        name: "Barney Rubble",
        url: "http://barnyrubble.tumblr.com/",
      });
    });
  });
});
