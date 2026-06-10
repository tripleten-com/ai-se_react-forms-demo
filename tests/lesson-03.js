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

console.log("\nLesson 03: Multiple Inputs with One Handler\n");

runGates(root);

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm uses a single state object containing both name and email", () => {
  assert(
    form.includes("name:") && form.includes("email:"),
    "ProfileForm.tsx does not use a state object with name and email keys — expected useState({ name: '', email: '' })"
  );
});

test("ProfileForm defines a single handleChange function", () => {
  assert(
    form.includes("handleChange"),
    "ProfileForm.tsx does not define a handleChange function"
  );
});

test("handleChange uses e.target.name to identify the field", () => {
  assert(
    form.includes("e.target.name") || form.includes("target.name"),
    "handleChange does not read e.target.name — it needs this to update the correct field"
  );
});

test("handleChange uses a computed property key to update state", () => {
  assert(
    form.includes("[e.target.name]") || form.includes("[name]"),
    "handleChange does not use a computed property key — expected [e.target.name]: e.target.value or [name]: value"
  );
});

test("The name input has a name attribute", () => {
  assert(
    form.includes('name="name"'),
    'The name input is missing name="name" — the name attribute must match the state object key exactly'
  );
});

test("The email input has a name attribute", () => {
  assert(
    form.includes('name="email"'),
    'The email input is missing name="email" — the name attribute must match the state object key exactly'
  );
});

test("Both inputs update independently when typed into", () => {
  const result = checkBehavior(root, "tests/lib/lesson-03.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-03.behavior.test.tsx` for details");
});

summary("cXFkYXFxdTc=");
