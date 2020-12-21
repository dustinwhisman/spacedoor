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

const addBonus = (bonus) => {
  if (bonus == null) {
    return '';
  }

  if (bonus > 0) {
    return ` + ${bonus}`;
  }

  if (bonus < 0) {
    return ` - ${Math.abs(bonus)}`;
  }

  return ' + 0';
};

const commonRoll = (numberOfDice, numberOfSides, type, bonus) => {
  const results = rollDice(numberOfDice, numberOfSides);
  const total = results.reduce((sum, dice) => {
    return sum + dice.value;
  }, 0);

  if (type !== 'health') {
    return `
      <div class="cluster">
        <div>
          ${results.map((dice) => {
            return `<div class="dice">${dice.value}</div>`;
          }).join('+')}
          ${addBonus(bonus)}
          <div>
            =
          </div>
          <div class="total">
            ${total + (bonus || 0)}
          </div>
        </div>
      </div>
    `;
  } else {
    return `
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

const rollWithAdvantage = (bonus) => {
  const results = rollDice(3, 6);
  const total = results.reduce((sum, dice) => {
    if (dice.isMin) {
      return sum;
    }

    return sum + dice.value;
  }, 0);

  return `
    <div class="cluster">
      <div>
        ${results.map((dice) => {
          return `<div class="dice${dice.isMin ? ' not-counted' : ''}">${dice.value}</div>`;
        }).join('+')}
        ${addBonus(bonus)}
        <div>
          =
        </div>
        <div class="total">
          ${total + (bonus || 0)}
        </div>
      </div>
    </div>
  `;
};

const rollWithDisadvantage = (bonus) => {
  const results = rollDice(3, 6);
  const total = results.reduce((sum, dice) => {
    if (dice.isMax) {
      return sum;
    }

    return sum + dice.value;
  }, 0);

  return `
    <div class="cluster">
      <div>
        ${results.map((dice) => {
          return `<div class="dice${dice.isMax ? ' not-counted' : ''}">${dice.value}</div>`;
        }).join('+')}
        ${addBonus(bonus)}
        <div>
          =
        </div>
        <div class="total">
          ${total + (bonus || 0)}
        </div>
      </div>
    </div>
  `;
};

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-roll]')) {
    const type = event.target.dataset.roll;
    let resultsDiv = document.querySelector(`[data-results="${type}"]`);
    let results;

    if (type === 'normal' || type === 'health') {
      results = commonRoll(2, 6, type);
      resultsDiv.innerHTML = results;
      return;
    }

    if (type === 'advantage') {
      resultsDiv = document.querySelector('[data-results=advantage]');
      results = rollWithAdvantage();
      resultsDiv.innerHTML = results;
      return;
    }

    if (type === 'disadvantage') {
      resultsDiv = document.querySelector('[data-results=disadvantage]');
      results = rollWithDisadvantage();
      resultsDiv.innerHTML = results;
      return;
    }

    const [ numberOfDice, numberOfSides ] = type.split('d');
    results = commonRoll(Number(numberOfDice), Number(numberOfSides), type);
    resultsDiv.innerHTML = results;
  }

  if (event.target.matches('[data-custom-roll]')) {
    const type = event.target.dataset.customRoll;
    const bonus = Number(event.target.dataset.bonus);
    let resultsDiv = document.querySelector(`[data-results=${event.target.dataset.stat}]`);
    let results;

    if (type === 'normal') {
      results = commonRoll(2, 6, type, bonus);
      resultsDiv.innerHTML = results;
      return;
    }

    if (type === 'advantage') {
      results = rollWithAdvantage(bonus);
      resultsDiv.innerHTML = results;
      return;
    }

    if (type === 'disadvantage') {
      results = rollWithDisadvantage(bonus);
      resultsDiv.innerHTML = results;
      return;
    }
  }
});
