import { describe, expect, it } from "vitest";
import { parseRepository } from "../parseRepository";

describe("parseRepository", () => {
  describe("field is undefined", () => {
    it("should return null", () => {
      expect(parseRepository(undefined)).toBeNull();
    });
  });

  describe("field is an object", () => {
    describe("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository({
            type: "git",
            url: "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository({
            type: "git",
            url: "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9.git",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9.git",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("github short format", () => {
      it("should return a valid url string", () => {
        expect(
          parseRepository({
            type: "git",
            url: "github:User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://github.com/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid url string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "github:User0-9/Reposi.tory_0-9",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://github.com/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("gist short format", () => {
      it("should return a valid url string", () => {
        expect(
          parseRepository({
            type: "git",
            url: "gist:11081aaa281",
          })
        ).toEqual("https://gist.github.com/11081aaa281");
      });
    });

    describe("bitbucket short format", () => {
      it("should return a valid url string", () => {
        expect(
          parseRepository({
            type: "git",
            url: "bitbucket:User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://bitbucket.org/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid url string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "bitbucket:User0-9/Reposi.tory_0-9",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://bitbucket.org/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("gitlab short format", () => {
      it("should return a valid url string", () => {
        expect(
          parseRepository({
            type: "git",
            url: "gitlab:User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://gitlab.com/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid url string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "gitlab:User0-9/Reposi.tory_0-9",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://gitlab.com/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("user repository format", () => {
      it("should return a valid url string", () => {
        expect(
          parseRepository({
            type: "git",
            url: "User0-9/Reposi.tory_0-9",
          })
        ).toEqual("https://github.com/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid url string when a directory is provided", () => {
        expect(
          parseRepository({
            type: "git",
            url: "User0-9/Reposi.tory_0-9",
            directory: "packages/some_package",
          })
        ).toEqual(
          "https://github.com/User0-9/Reposi.tory_0-9/tree/master/packages/some_package"
        );
      });
    });

    describe("invalid format", () => {
      it("should return null", () => {
        expect(
          parseRepository({
            type: "git",
            url: "git+ssh://sub.domain0-9.exten.sion&User0-9/Reposi.tory_0-9.git",
            directory: "packages/some_package",
          })
        ).toBeNull();
      });
    });
  });

  describe("field is a string", () => {
    describe("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository(
            "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository(
            "https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });
    });

    describe("git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository(
            "git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9.git"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository(
            "git@sub.domain0-9.exten.sion:User0-9/Reposi.tory_0-9"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });
    });

    describe("git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository(
            "git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository(
            "git+https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });
    });

    describe("git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository(
            "git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository(
            "git://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });
    });

    describe("git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git format", () => {
      it("should return a valid string when .git extension is present", () => {
        expect(
          parseRepository(
            "git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9.git"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });

      it("should return a valid string when .git extension is omitted", () => {
        expect(
          parseRepository(
            "git+ssh://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9"
          )
        ).toEqual("https://sub.domain0-9.exten.sion/User0-9/Reposi.tory_0-9");
      });
    });

    describe("github short format", () => {
      it("should return a valid url string", () => {
        expect(parseRepository("github:User0-9/Reposi.tory_0-9")).toEqual(
          "https://github.com/User0-9/Reposi.tory_0-9"
        );
      });
    });

    describe("gist short format", () => {
      it("should return a valid url string", () => {
        expect(parseRepository("gist:11081aaa281")).toEqual(
          "https://gist.github.com/11081aaa281"
        );
      });
    });

    describe("bitbucket short format", () => {
      it("should return a valid url string", () => {
        expect(parseRepository("bitbucket:User0-9/Reposi.tory_0-9")).toEqual(
          "https://bitbucket.org/User0-9/Reposi.tory_0-9"
        );
      });
    });

    describe("gitlab short format", () => {
      it("should return a valid url string", () => {
        expect(parseRepository("gitlab:User0-9/Reposi.tory_0-9")).toEqual(
          "https://gitlab.com/User0-9/Reposi.tory_0-9"
        );
      });
    });

    describe("user repository format", () => {
      it("should return a valid url string", () => {
        expect(parseRepository("User0-9/Reposi.tory_0-9")).toEqual(
          "https://github.com/User0-9/Reposi.tory_0-9"
        );
      });
    });

    describe("invalid format", () => {
      it("should return null", () => {
        expect(
          parseRepository(
            "git+ssh://sub.domain0-9.exten.sion&User0-9/Reposi.tory_0-9"
          )
        ).toBeNull();
      });
    });
  });
});
