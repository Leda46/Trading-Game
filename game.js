const cities = {
  'Port Royal': {
      resources: { gold: 100, silver: 50, rum: 30 },
  },
  'Tortuga': {
      resources: { gold: 120, silver: 40, rum: 35 },
  },
  'Nassau': {
      resources: { gold: 90, silver: 60, rum: 25 },
  },
};

let currentCity = 'Port Royal';
let inventory = { gold: 0, silver: 0, rum: 0 };
let balance = 500;
let maxWeight = 50; // Maximum weight limit
let currentWeight = 0;

function calculateWeight() {
  currentWeight = inventory.gold * 2 + inventory.silver * 1 + inventory.rum * 3; // Example weights
  if (currentWeight > maxWeight) {
      logActivity('You are over the weight limit! Sell items or lose $10 per turn.');
      balance -= 10; // Penalty for exceeding weight limit
      updateBalanceDisplay();
  }
}



document.getElementById('rocking-switch').addEventListener('change', function () {
const gameContainer = document.getElementById('game-container');
if (this.checked) {
gameContainer.classList.add('rocking');
} else {
gameContainer.classList.remove('rocking');
}
});

function endGame(result) {
// Freeze the game
document.querySelectorAll('button').forEach(button => button.disabled = true);

// Display result
const resultMessage = document.createElement('div');
resultMessage.id = 'game-result';
resultMessage.textContent = result === 'win' ? '🎉 Victory! You’ve become a rich merchant!' : '💀 Game Over. Better luck next time!';
document.body.appendChild(resultMessage);

// Add Restart Option
const restartButton = document.createElement('button');
restartButton.id = 'restart-button';
restartButton.textContent = 'Restart Game';
restartButton.onclick = () => location.reload(); // Simple page reload to restart
document.body.appendChild(restartButton);
}
function renderMarketplace() {
  const resourcesDiv = document.getElementById('resources');
  resourcesDiv.innerHTML = '';

  for (const [resource, price] of Object.entries(cities[currentCity].resources)) {
      const resourceDiv = document.createElement('div');
      resourceDiv.classList.add('resource');

      resourceDiv.innerHTML = `
          <span>${resource} - $<span id="price-${resource}">${price}</span></span>
          <div>
              <input type="number" id="quantity-buy-${resource}" min="1" value="1" />
              <button onclick="buyResource('${resource}')">Buy</button>
          </div>
          <div>
              <input type="number" id="quantity-sell-${resource}" min="1" value="1" />
              <button onclick="sellResource('${resource}')">Sell</button>
          </div>
      `;

      resourcesDiv.appendChild(resourceDiv);
  }
}

function renderInventory() {
  const inventoryDiv = document.getElementById('inventory-items');
  inventoryDiv.innerHTML = '';

  for (const [item, amount] of Object.entries(inventory)) {
      const itemDiv = document.createElement('div');
      itemDiv.textContent = `${item}: ${amount}`;
      inventoryDiv.appendChild(itemDiv);
  }
}

function logActivity(message) {
  const logEntries = document.getElementById('log-entries');
  const logItem = document.createElement('li');
  logItem.textContent = message;
  logEntries.appendChild(logItem);
}

function updateGoldBalance() {
  document.getElementById('gold-balance').textContent = balance;
}

function buyResource(resource) {
  const quantity = parseInt(document.getElementById(`quantity-buy-${resource}`).value);
  const pricePerUnit = parseInt(document.getElementById(`price-${resource}`).textContent);
  const totalCost = pricePerUnit * quantity;

  if (balance >= totalCost) {
      balance -= totalCost;
      inventory[resource] = (inventory[resource] || 0) + quantity;
      cities[currentCity].resources[resource] = randomPrice(); // Recalculate resource price randomly
      renderMarketplace();
      renderInventory();
      updateGoldBalance();
      calculateWeight();
      logActivity(`Bought ${quantity} ${resource} for $${totalCost}.`);
      
  } else {
      logActivity(`Not enough money to buy ${quantity} ${resource}.`);
  }
  checkVictory();
}

function sellResource(resource) {
  const quantity = parseInt(document.getElementById(`quantity-sell-${resource}`).value);
  

  if (inventory[resource] >= quantity) {
      const pricePerUnit = parseInt(document.getElementById(`price-${resource}`).textContent);
      const totalRevenue = pricePerUnit * quantity;

      inventory[resource] -= quantity;
      balance += totalRevenue;
      renderMarketplace();
      renderInventory();
      updateGoldBalance();
      calculateWeight();
      logActivity(`Sold ${quantity} ${resource} for $${totalRevenue}.`);
  } else {
      logActivity(`Not enough ${resource} in inventory to sell ${quantity}.`);
  }
  checkVictory();
}

function randomPrice() {
  const minPrice = 80;
  const maxPrice = 150;
  return Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice; // Random price between 80 and 150
}

function travelEvent() {
  const events = [
      { description: 'Pirates attacked! Lost $50.', effect: () => { balance -= 50; } },
      { description: 'Found hidden treasure! Gained $100.', effect: () => { balance += 100; } },
      { description: 'A storm slowed you down. Nothing happened.', effect: () => {} },
  ];

  const event = events[Math.floor(Math.random() * events.length)];
  logActivity(event.description);
  event.effect();
  updateGoldBalance();
}

function travelTo(city) {
  currentCity = city;
  document.getElementById('current-city').textContent = city;
  renderMarketplace();
  logActivity(`Traveled to ${city}.`);
  travelEvent(); // Trigger an event after traveling
}



const victoryAmount = 5000;

function checkVictory() {
  if (balance >= victoryAmount) {
      logActivity('Congratulations! You’ve won the game by becoming rich!');
      endGame('win');
  }
}




// Initial rendering
renderMarketplace();
renderInventory();
updateGoldBalance();
  



