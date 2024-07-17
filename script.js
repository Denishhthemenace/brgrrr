// Define available ingredients with their prices and colors
const ingredients = [
    { name: 'Patty', price: 80, color: '#8B4513' },
    { name: 'Cheese', price: 20, color: '#FFD700' },
    { name: 'Lettuce', price: 10, color: '#90EE90' },
    { name: 'Tomato', price: 10, color: '#FF6347' },
    { name: 'Onion', price: 10, color: '#570987' },
];

// DOM elements
const ingredientSelector = document.getElementById('ingredient-selector');
const burgerIngredients = document.getElementById('ingredients');
const selectedIngredientsList = document.getElementById('selected-ingredients');
const totalPriceElement = document.getElementById('total-price');
const orderButton = document.getElementById('order-button');
const burgerPreview = document.getElementById('burger-preview');

// State
let selectedIngredients = [];
const MAX_INGREDIENTS = 6;

// Create ingredient buttons
ingredients.forEach(ingredient => {
    const button = document.createElement('button');
    button.textContent = `${ingredient.name} - ₹${ingredient.price}`;
    button.addEventListener('click', () => addIngredient(ingredient));
    ingredientSelector.appendChild(button);
});

// Add ingredient to the burger
const addIngredient = (ingredient) => {
    if (selectedIngredients.length < MAX_INGREDIENTS) {
        selectedIngredients.push(ingredient);
        updateBurgerPreview();
        updateOrderSummary();
        updateIngredientButtons();
    }
};

// Update burger preview
const updateBurgerPreview = () => {
    burgerIngredients.innerHTML = '';
    
    selectedIngredients.forEach((ingredient, index) => {
        const element = document.createElement('div');
        element.style.backgroundColor = ingredient.color;
        element.classList.add('ingredient');
        element.textContent = ingredient.name;
        element.draggable = true;
        element.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', index));
        element.addEventListener('dragover', (e) => e.preventDefault());
        element.addEventListener('drop', (e) => moveIngredient(e, index));

        const removeButton = document.createElement('button');
        removeButton.textContent = 'X';
        removeButton.classList.add('remove-ingredient');
        removeButton.addEventListener('click', () => removeIngredient(index));
        element.appendChild(removeButton);

        burgerIngredients.appendChild(element);
    });

    // Show max ingredients message
    const maxIngredientsMessage = document.getElementById('max-ingredients-message') || document.createElement('div');
    maxIngredientsMessage.id = 'max-ingredients-message';
    maxIngredientsMessage.textContent = selectedIngredients.length >= MAX_INGREDIENTS ? 
        `Maximum ${MAX_INGREDIENTS} ingredients reached!` : '';
    burgerPreview.parentNode.insertBefore(maxIngredientsMessage, burgerPreview.nextSibling);
};

// Move ingredient
const moveIngredient = (e, toIndex) => {
    e.preventDefault();
    const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const ingredient = selectedIngredients.splice(fromIndex, 1)[0];
    selectedIngredients.splice(toIndex, 0, ingredient);
    updateBurgerPreview();
    updateOrderSummary();
};

// Remove ingredient
const removeIngredient = (index) => {
    selectedIngredients.splice(index, 1);
    updateBurgerPreview();
    updateOrderSummary();
    updateIngredientButtons();
};

// Update order summary
const updateOrderSummary = () => {
    selectedIngredientsList.innerHTML = '';
    let total = 0;

    selectedIngredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.textContent = `${ingredient.name} - ₹${ingredient.price}`;
        selectedIngredientsList.appendChild(li);
        total += ingredient.price;
    });

    totalPriceElement.textContent = total;
};

// Update ingredient buttons
const updateIngredientButtons = () => {
    const buttons = ingredientSelector.getElementsByTagName('button');
    for (let button of buttons) {
        button.disabled = selectedIngredients.length >= MAX_INGREDIENTS;
    }
};

// Place order
orderButton.addEventListener('click', () => {
    if (selectedIngredients.length === 0) {
        alert('Please add at least one ingredient to your burger!');
    } else {
        const total = selectedIngredients.reduce((sum, ingredient) => sum + ingredient.price, 0);
        alert(`Thank you for your order! Your total is ₹${total}.`);
        selectedIngredients = [];
        updateBurgerPreview();
        updateOrderSummary();
        updateIngredientButtons();
    }
});

// Initial update
updateBurgerPreview();
updateIngredientButtons();