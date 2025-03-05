// === State ===
const bank = [1, 2, 3, 4, 5];
const odds = [9, 11, 13];
const evens = [14, 16];

/** Adds the given number to the bank */
function addNumberToBank(n) {
  // Guard against non-number inputs
  if (typeof n !== "number") return;

  // Add the input number to the end of the bank array in state
  bank.push(n);

  // We need to render because state has changed!
  render();
}

function moveNumberFromBank() {
  // This is an example of a guard case because
  // it "guards" the function from running when we
  // don't want it to.
  if (bank.length === 0) return;

  // Grab first item from bank
  const n = bank.shift();
  // % 2 is remainder when you divide n by 2
  if (n % 2 === 0) {
    evens.push(n);
  } else {
    odds.push(n);
  }
  render();
}

// === Components ===

/** Form that allows user to add a number or move numbers */
function NumberFormA() {
  const $form = document.createElement("form");

  $form.innerHTML = `
    <label>
      Add a number to the bank
      <input name="number" type="number" />
    </label>
    <button id="add" type="button">Add number</button>
    <button id="sort1">Sort 1</button>
    <button id="sortAll">Sort All</button>
  `;

  // This fails because the add button does not exist in the document.
  // const $add = document.querySelector("#add");

  // Grab the add button from the form
  const $add = $form.querySelector("#add");
  // When the add button is clicked, I need to
  $add.addEventListener("click", () => {
    // grab the input from the user
    const data = new FormData($form);
    const number = data.get("number");
    // take that input and add it to the bank
    addNumberToBank(Number(number));
  });

  const $sort1 = $form.querySelector("#sort1");
  // If you have an arrow function that just calls
  // another function w/ no arguments, you can just
  // use the name of that function instead of the arrow
  $sort1.addEventListener("click", moveNumberFromBank);

  const $sortAll = $form.querySelector("#sortAll");
  $sortAll.addEventListener("click", () => {
    // Move ALL the numbers from the bank
    while (bank.length > 0) {
      moveNumberFromBank();
    }

    // We need to lock in the length because otherwise
    // the bank.length will change as we're moving through the loop
    // const n = bank.length;
    // for (let i = 0; i < n; i++) {
    //   moveNumberFromBank();
    // }
  });

  return $form;
}

/** Form that allows user to add a number or move numbers */
function NumberForm() {
  const $form = document.createElement("form");

  $form.innerHTML = `
    <label>
      Add a number to the bank
      <input name="number" type="number" />
    </label>
    <button value="add">Add number</button>
    <button value="sort1">Sort 1</button>
    <button value="sortAll">Sort All</button>
  `;

  $form.addEventListener("submit", (event) => {
    event.preventDefault();

    // event.submitter is the button that submitted the form
    // .value gets us the value of that button
    const action = event.submitter.value;

    // Do something different depending on which button was clicked
    if (action === "add") {
      const data = new FormData($form);
      const number = data.get("number");
      addNumberToBank(+number);
    } else if (action === "sort1") {
      moveNumberFromBank();
    } else if (action === "sortAll") {
      while (bank.length > 0) {
        moveNumberFromBank();
      }
    }
  });

  return $form;
}

// Numbers (PascalCase) is the component
// numbers (camelCase) is the JS variable w/ data e.g. an array
// $numbers ($) is the DOM element used to render the numbers array
function Numbers(numbers) {
  const $numbers = document.createElement("p");
  $numbers.classList.add("numbers");

  /*
  // Map over each number in the array `numbers`
  // Convert each number into a span `$numbers`
  const $numberSpans = numbers.map((number) => {
    const $number = document.createElement("span");
    $number.textContent = number;
    return $number;
  });
  */

  // Goal: take our array of numbers and transform them into an array of <span>s
  const $numberSpans = [];
  for (const number of numbers) {
    const $number = document.createElement("span");
    $number.textContent = number;
    $numberSpans.push($number);
  }

  $numbers.replaceChildren(...$numberSpans);

  return $numbers;
}

function NumberList(title, numbers) {
  const $section = document.createElement("section");

  $section.innerHTML = `
    <h2>${title}</h2>
    <Numbers></Numbers>
  `;

  $section.querySelector("Numbers").replaceWith(Numbers(numbers));

  return $section;
}

// === Render ===
function render() {
  const $app = document.querySelector("#app");
  $app.innerHTML = `
    <h1>Odds and Events</h1>
    <NumberForm></NumberForm>
    <NumberList id="bank"></NumberList>
    <NumberList id="odds"></NumberList>
    <NumberList id="evens"></NumberList>
  `;
  $app.querySelector("NumberForm").replaceWith(NumberForm());
  $app.querySelector("NumberList#bank").replaceWith(NumberList("Bank", bank));
  $app.querySelector("NumberList#odds").replaceWith(NumberList("Odds", odds));
  $app
    .querySelector("NumberList#evens")
    .replaceWith(NumberList("Evens", evens));
}

render();
