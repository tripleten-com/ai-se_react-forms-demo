import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { checkCompiles, checkBuilds, checkBehavior, normalize, parseFileContent, findQuerySelector } from "./lib/utils.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

function read(relPath) {
  try {
    return readFileSync(join(root, relPath), "utf8");
  } catch {
    return null;
  }
}

let pass = 0;
let fail = 0;

function test(label, fn) {
  try {
    fn();
    console.log(`✅ ${label}`);
    pass++;
  } catch (err) {
    console.log(`❌ ${label} — ${err.message}`);
    fail++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

console.log("\nLesson 02: Controlled Inputs\n");

const compiled = checkCompiles(root);
if (!compiled.ok) {
  console.log("❌ TypeScript compilation failed — fix all type errors before running tests\n");
  console.log(compiled.output);
  process.exit(1);
}
console.log("✅ Project compiles without type errors");

const built = checkBuilds(root);
if (!built.ok) {
  console.log("❌ Vite build failed — the app does not run without errors\n");
  console.log(built.output);
  process.exit(1);
}
console.log("✅ App builds and runs without errors\n");

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));
const ast = parseFileContent(join(root, "src/components/ProfileForm/ProfileForm.tsx"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm imports useState", () => {
  const el = findQuerySelector(ast, "ImportDeclaration[source.value='react'][specifiers.0.imported.name='useState']");
  assert(
    el.length > 0,
    'ProfileForm.tsx does not import "useState" from React'
  );
});

test("ProfileForm declares a state variable for the name field", () => {
  const el = findQuerySelector(ast, "VariableDeclaration[declarations.0.id.elements.0.name='name'][declarations.0.init.callee.name='useState']");
  assert(
    el.length > 0,
    "ProfileForm.tsx does not declare a useState variable for the name field"
  );
});

test("The name input has a value prop", () => {
  const el = findQuerySelector(ast, "JSXOpeningElement[name.name='input']");
  const attr = el?.[0]?.attributes?.find(attr => attr.name?.name === 'value' && attr.value?.expression?.name === 'name');
  assert(
    attr !== undefined,
    "The name input does not have a value prop — it needs value={name} to become a controlled input"
  );
});

test("The name input has an onChange handler", () => {
  const el = findQuerySelector(ast, "JSXOpeningElement[name.name='input']");
  const attr = el?.[0]?.attributes?.find(attr => attr.name?.name === 'onChange');
  assert(
    attr !== undefined,
    "The name input does not have an onChange handler — without it React locks the input"
  );
});

test("onChange calls the state setter with e.target.value", () => {
  const el = findQuerySelector(ast, "JSXOpeningElement[name.name='input']");
  const attrEl = findQuerySelector(el?.[0], "JSXAttribute[name.name='onChange']");
  const evtName = attrEl?.[0]?.value?.expression?.params?.[0]?.name;
  const targetEl = findQuerySelector(
    attrEl?.[0],
    `JSXExpressionContainer:has([object.object.name='${evtName}'][object.property.name='target'][property.name='value'])`
  );
  assert(
    !!targetEl,
    "onChange does not use e.target.value to update state"
  );
});

test("Controlled name input updates its displayed value when typed into", () => {
  const result = checkBehavior(root, "tests/lib/lesson-02.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-02.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("M205ZHp6b2Q=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
