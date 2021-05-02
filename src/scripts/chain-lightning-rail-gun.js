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

const damageRoll = (numberOfDice, numberOfSides) => {
  const results = rollDice(numberOfDice, numberOfSides).sort((a, b) => {
    if (a.value < b.value) {
      return -1;
    }

    if (a.value > b.value) {
      return 1;
    }

    return 0;
  });

  const resultsArray = [];

  for (let i = 0; i < numberOfDice; i += 1) {
    let currentIteration = results.filter((dice, index) => numberOfDice - (index + i) > 0);
    const total = currentIteration.reduce((sum, dice) => {
      return sum + dice.value;
    }, 0);

    resultsArray.push(`
      <div class="cluster">
        <div>
          ${currentIteration.map((dice) => {
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
    `);
  }

  return resultsArray.join('');
};

document.addEventListener('click', (event) => {
  if (event.target.matches('[data-roll]')) {
    const type = event.target.dataset.roll;
    let resultsDiv = document.querySelector(`[data-results="${type}"]`);
    let results;

    if (type === 'mixed-success') {
      const [ numberOfDice, numberOfSides ] = mixedSuccessDamage.split('d');
      results = damageRoll(Number(numberOfDice), Number(numberOfSides));
      resultsDiv.innerHTML = results;
    } else if (type === 'success') {
      const [ numberOfDice, numberOfSides ] = successDamage.split('d');
      results = damageRoll(Number(numberOfDice), Number(numberOfSides));
      resultsDiv.innerHTML = results;
    } else if (type === 'critical-success') {
      const [ numberOfDice, numberOfSides ] = criticalSuccessDamage.split('d');
      results = damageRoll(Number(numberOfDice), Number(numberOfSides));
      resultsDiv.innerHTML = results;
    }
  }
});
