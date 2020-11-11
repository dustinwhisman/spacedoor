const rollDice = (numberOfDice, numberOfSides) => {
  let minValue = Infinity;
  let maxValue = 0;
  const roll = Array.apply(null, Array(numberOfDice)).map((a) => {
    const value = Math.ceil(Math.random() * numberOfSides);
    if (value < minValue) {
      minValue = value;
    }

    if (value > maxValue) {
      maxValue = value;
    }

    return value;
  });

  let minValueAssigned = false;
  let maxValueAssigned = false;

  return roll.map((value) => {
    let isMin = false;
    let isMax = false;

    if (value === minValue && !minValueAssigned) {
      isMin = true;
      minValueAssigned = true;
    }

    if (value === maxValue && !maxValueAssigned) {
      isMax = true;
      maxValueAssigned = true;
    }

    return {
      isMin,
      isMax,
      value,
    };
  });
};

const commonRoll = (numberOfDice, numberOfSides, type) => {
  const results = rollDice(numberOfDice, numberOfSides);
  const total = results.reduce((sum, dice) => {
    return sum + dice.value;
  }, 0);

  const resultsDiv = document.querySelector(`[data-results="${type}"]`);
  if (type !== 'health') {
    resultsDiv.innerHTML = `
      <div class="cluster">
        <div>
          ${results.map((dice) => {
            return `<div class="dice">${dice.value}</div>`;
          }).join('+')}
          <div>
            =
          </div>
          <div class="total">
            ${total}
          </div>
        </div>
      </div>
    `;
  } else {
    resultsDiv.innerHTML = `
      <div class="cluster">
        <div>
          ${results.map((dice) => {
            return `<div class="dice">${dice.value}</div>`;
          }).join('')}
        </div>
      </div>
    `;
  }
};

const rollWithAdvantage = () => {
  const results = rollDice(3, 6);
  const total = results.reduce((sum, dice) => {
    if (dice.isMin) {
      return sum;
    }

    return sum + dice.value;
  }, 0);

  const resultsDiv = document.querySelector('[data-results=advantage]');
  resultsDiv.innerHTML = `
    <div class="cluster">
      <div>
        ${results.map((dice) => {
          return `<div class="dice${dice.isMin ? ' not-counted' : ''}">${dice.value}</div>`;
        }).join('+')}
        <div>
          =
        </div>
        <div class="total">
          ${total}
        </div>
      </div>
    </div>
  `;
};

const rollWithDisadvantage = () => {
  const results = rollDice(3, 6);
  const total = results.reduce((sum, dice) => {
    if (dice.isMax) {
      return sum;
    }

    return sum + dice.value;
  }, 0);

  const resultsDiv = document.querySelector('[data-results=disadvantage]');
  resultsDiv.innerHTML = `
    <div class="cluster">
      <div>
        ${results.map((dice) => {
          return `<div class="dice${dice.isMax ? ' not-counted' : ''}">${dice.value}</div>`;
        }).join('+')}
        <div>
          =
        </div>
        <div class="total">
          ${total}
        </div>
      </div>
    </div>
  `;
};

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-roll]')) {
    const type = event.target.dataset.roll;

    if (type === 'normal' || type === 'health') {
      commonRoll(2, 6, type);
      return;
    }

    if (type === 'advantage') {
      rollWithAdvantage();
      return;
    }

    if (type === 'disadvantage') {
      rollWithDisadvantage();
      return;
    }

    const [ numberOfDice, numberOfSides ] = type.split('d');
    commonRoll(Number(numberOfDice), Number(numberOfSides), type);
  }
});
