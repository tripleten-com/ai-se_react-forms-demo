import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  runGates,
  test,
  assert,
  summary,
  checkBehavior,
  normalize,
} from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(join(root, relPath), "utf8");
  } catch {
    return null;
  }
}

console.log("\nLesson 02: Controlled Inputs\n");

runGates(root);

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm imports useState", () => {
  assert(
    form.includes("useState"),
    'ProfileForm.tsx does not import "useState" from React'
  );
});

test("ProfileForm declares a state variable for the name field", () => {
  assert(
    form.includes("useState(") && form.includes("name"),
    "ProfileForm.tsx does not declare a useState variable for the name field"
  );
});

test("The name input has a value prop", () => {
  assert(
    form.includes('value={'),
    "The name input does not have a value prop — it needs value={name} to become a controlled input"
  );
});

test("The name input has an onChange handler", () => {
  assert(
    form.includes("onChange"),
    "The name input does not have an onChange handler — without it React locks the input"
  );
});

test("onChange calls the state setter with e.target.value", () => {
  assert(
    form.includes("e.target.value"),
    "onChange does not use e.target.value to update state"
  );
});

test("Controlled name input updates its displayed value when typed into", () => {
  const result = checkBehavior(root, "tests/lib/lesson-02.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-02.behavior.test.tsx` for details");
});

summary("M205ZHp6b2Q=");
