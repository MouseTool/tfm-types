import { promises as fsp } from "fs";
import { parse } from "../src/index";

test("aaaaa", async () => {
  let r = parse((await fsp.readFile("./tests/luahelp.txt")).toString());
  await fsp.writeFile("./tests/out.txt", JSON.stringify(r, null, 2));

  expect(r.tree.children[0].name).toEqual("assert")
});
