document.addEventListener('DOMContentLoaded', function() {
    const restaurantSelect = document.getElementById('restaurant');
    const menuItemSelect = document.getElementById('menu_item');
    const orderForm = document.getElementById('orderForm');
    const orderResult = document.getElementById('orderResult');
    
    restaurantSelect.addEventListener('change', function() {
        const selectedRestaurant = restaurantSelect.value;
        menuItemSelect.innerHTML = '';
        
        fetch('/static/data/restaurants.json')
        .then(response => response.json())
        .then(data => {
            const restaurant = data.find(rest => rest.name === selectedRestaurant);
            if (restaurant) {
                restaurant.menu.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item;
                    option.textContent = item;
                    menuItemSelect.appendChild(option);
                });
            }
        });
    });

    orderForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const selectedRestaurant = restaurantSelect.value;
        const selectedMenuItem = menuItemSelect.value;

        if (selectedRestaurant && selectedMenuItem) {
            fetch('/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    restaurant: selectedRestaurant,
                    menu_item: selectedMenuItem
                })
            })
            .then(response => response.json())
            .then(data => {
                orderResult.textContent = data.message || data.error;
            });
        }
    });
});