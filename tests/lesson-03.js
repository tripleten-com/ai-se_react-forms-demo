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

console.log("\nLesson 03: Multiple Inputs with One Handler\n");

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

test("ProfileForm uses a single state object containing both name and email", () => {
  const el = findQuerySelector(
    ast,
    "[init.callee.name='useState']"
  );
  const keys =
    el?.[0]?.init?.arguments?.[0]?.properties
      ?.map((p) => p.key?.name)
      .filter(Boolean) ?? [];

  assert(
    keys.includes("name") && keys.includes("email"),
    "ProfileForm.tsx does not use a state object with name and email keys — expected useState({ name: '', email: '' })"
  );
});

test("ProfileForm defines a single handleChange function", () => {
  const fnDecl = findQuerySelector(ast, "FunctionDeclaration[id.name='handleChange']");
  const fnVar = findQuerySelector(ast, "VariableDeclarator[id.name='handleChange']");

  assert(
    fnDecl.length > 0 || fnVar.length > 0,
    "ProfileForm.tsx does not define a handleChange function"
  );
});

test("handleChange uses e.target.name to identify the field", () => {
  const handleChange =
    findQuerySelector(ast, "FunctionDeclaration[id.name='handleChange']")?.[0] ??
    findQuerySelector(ast, "VariableDeclarator[id.name='handleChange']")?.[0]?.init;

  const usesTargetName = findQuerySelector(
    handleChange,
    "MemberExpression[object.property.name='target'][property.name='name']"
  );

  const usesDestructuring = findQuerySelector(
    handleChange,
    "VariableDeclarator ObjectPattern Property[key.name='name']"
  );

  assert(
    usesTargetName.length > 0 || usesDestructuring.length > 0,
    "handleChange does not read e.target.name — it needs this to update the correct field"
  );
});

test("handleChange uses a computed property key to update state", () => {
  const handleChange =
    findQuerySelector(ast, "FunctionDeclaration[id.name='handleChange']")?.[0] ??
    findQuerySelector(ast, "VariableDeclarator[id.name='handleChange']")?.[0]?.init;
  const computedProp = findQuerySelector(handleChange, "ObjectProperty[computed=true]");

  assert(
    computedProp.length > 0,
    "handleChange does not use a computed property key — expected [e.target.name]: e.target.value or [name]: value"
  );
});

test("The name input has a name attribute", () => {
  const el = findQuerySelector(
    ast,
    "JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='name'][value.value='name'])"
  );
  assert(
    el.length > 0,
    'The name input is missing name="name" — the name attribute must match the state object key exactly'
  );
});

test("The email input has a name attribute", () => {
  const el = findQuerySelector(
    ast,
    "JSXOpeningElement[name.name='input']:has(JSXAttribute[name.name='name'][value.value='email'])"
  );
  assert(
    el.length > 0,
    'The email input is missing name="email" — the name attribute must match the state object key exactly'
  );
});

test("Both inputs update independently when typed into", () => {
  const result = checkBehavior(root, "tests/lib/lesson-03.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-03.behavior.test.tsx` for details");
});

console.log(`\n${pass} passed, ${fail} failed`);
if (fail === 0) {
  const code = Buffer.from("cXFkYXFxdTc=", "base64").toString();
  console.log(`\nVerification code: ${code}`);
}
if (fail > 0) process.exit(1);
