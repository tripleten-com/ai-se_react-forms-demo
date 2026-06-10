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

console.log("\nLesson 07: Pre-Filling Fields from Data\n");

runGates(root);

const form = normalize(read("src/components/ProfileForm/ProfileForm.tsx"));

test("ProfileForm.tsx exists", () => {
  assert(form !== null, "src/components/ProfileForm/ProfileForm.tsx not found");
});

test("ProfileForm imports getProfile from the API", () => {
  assert(
    form.includes("getProfile"),
    'ProfileForm.tsx does not import "getProfile" from ../../utils/api'
  );
});

test("ProfileForm imports useEffect", () => {
  assert(
    form.includes("useEffect"),
    'ProfileForm.tsx does not import "useEffect" from React'
  );
});

test("ProfileForm has a useEffect call", () => {
  assert(
    form.includes("useEffect("),
    "ProfileForm.tsx does not call useEffect"
  );
});

test("The useEffect calls getProfile", () => {
  assert(
    form.includes("getProfile("),
    "The useEffect does not call getProfile() — this is how the stored profile is read on mount"
  );
});

test("The useEffect calls setValues with the profile data", () => {
  assert(
    form.includes("setValues("),
    "The useEffect does not call setValues() — call it with the result of getProfile() to pre-fill the form"
  );
});

test("ProfileForm declares an isLoadingProfile state variable", () => {
  assert(
    form.includes("isLoadingProfile") || form.includes("isLoading"),
    "ProfileForm.tsx does not declare an isLoadingProfile state variable"
  );
});

test("ProfileForm shows a loading state while the profile is being fetched", () => {
  const result = checkBehavior(root, "tests/lib/lesson-07.behavior.test.tsx");
  assert(result.ok, "Behavioral tests failed — run `npm test -- tests/lib/lesson-07.behavior.test.tsx` for details");
});

summary("ZjJsZWxhcng=");
