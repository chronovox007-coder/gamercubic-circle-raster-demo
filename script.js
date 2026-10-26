const widthInput = document.querySelector("#width");
const depthInput = document.querySelector("#depth");
const planInput = document.querySelector("#plan");
const thicknessInput = document.querySelector("#thickness");
const thicknessWrap = document.querySelector("#thickness-wrap");
const form = document.querySelector("#controls");
const gridElement = document.querySelector("#grid");
const centerElement = document.querySelector("#center");
const countElement = document.querySelector("#count");
const sizeElement = document.querySelector("#size");
const methodElement = document.querySelector("#method");

function clampInteger(value, minimum, maximum) {
  const parsed = Number.parseInt(value, 10);
  return Math.min(maximum, Math.max(minimum, Number.isFinite(parsed) ? parsed : minimum));
}

function createFilledEllipse(width, depth) {
  const centerX = (width - 1) / 2;
  const centerZ = (depth - 1) / 2;
  const radiusX = width / 2;
  const radiusZ = depth / 2;

  return Array.from({ length: depth }, function (_, z) {
    return Array.from({ length: width }, function (__, x) {
      const normalizedX = (x - centerX) / radiusX;
      const normalizedZ = (z - centerZ) / radiusZ;
      return normalizedX * normalizedX + normalizedZ * normalizedZ <= 1;
    });
  });
}

function erodeFourNeighbors(mask) {
  const depth = mask.length;
  const width = mask[0].length;

  return mask.map(function (row, z) {
    return row.map(function (occupied, x) {
      if (!occupied) return false;
      return (
        z > 0 &&
        z < depth - 1 &&
        x > 0 &&
        x < width - 1 &&
        mask[z - 1][x] &&
        mask[z + 1][x] &&
        mask[z][x - 1] &&
        mask[z][x + 1]
      );
    });
  });
}

function createOutline(filled, thickness) {
  let interior = filled.map(function (row) {
    return row.slice();
  });

  for (let step = 0; step < thickness; step += 1) {
    interior = erodeFourNeighbors(interior);
  }

  return filled.map(function (row, z) {
    return row.map(function (occupied, x) {
      return occupied && !interior[z][x];
    });
  });
}

function render() {
  const width = clampInteger(widthInput.value, 3, 64);
  const depth = clampInteger(depthInput.value, 3, 64);
  const thickness = clampInteger(thicknessInput.value, 1, 6);
  const filled = createFilledEllipse(width, depth);
  const mask = planInput.value === "filled" ? filled : createOutline(filled, thickness);
  const count = mask.flat().filter(Boolean).length;
  const centerX = (width - 1) / 2;
  const centerZ = (depth - 1) / 2;

  widthInput.value = String(width);
  depthInput.value = String(depth);
  thicknessInput.value = String(thickness);
  thicknessWrap.hidden = planInput.value === "filled";

  gridElement.replaceChildren();
  gridElement.style.gridTemplateColumns = "repeat(" + width + ", 1fr)";
  gridElement.style.setProperty("--grid-ratio", width + " / " + depth);
  gridElement.setAttribute(
    "aria-label",
    width + " by " + depth + " " + planInput.value + " block plan using " + count + " blocks"
  );

  mask.forEach(function (row) {
    row.forEach(function (occupied) {
      const cell = document.createElement("span");
      cell.className = occupied ? "cell on" : "cell";
      cell.setAttribute("aria-hidden", "true");
      gridElement.append(cell);
    });
  });

  centerElement.textContent = "(" + centerX + ", " + centerZ + ")";
  countElement.textContent = count.toLocaleString();
  sizeElement.textContent = width + " × " + depth;
  methodElement.textContent =
    "Each cell is tested against an ellipse centered at ((width − 1) / 2, (depth − 1) / 2). " +
    "Using width / 2 and depth / 2 as half-cell-aware radii keeps odd and even footprints symmetric. " +
    (planInput.value === "filled"
      ? "The preview shows the complete filled mask."
      : "The outline removes cells that survive " + thickness + " four-neighbor erosion pass" +
        (thickness === 1 ? "." : "es."));
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  render();
});

[widthInput, depthInput, planInput, thicknessInput].forEach(function (control) {
  control.addEventListener("input", render);
  control.addEventListener("change", render);
});

render();
