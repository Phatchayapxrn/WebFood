from flask import Flask, render_template, request, jsonify 
from datetime import datetime
import json

app = Flask(__name__)


def load_restaurant_data():
    with open('data/restaurants.json', 'r', encoding='utf-8') as file:
        return json.load(file)

@app.route('/') 
def index():
    
    current_time = datetime.now().time()
    is_lunch_time = current_time >= datetime.strptime('12:00', '%H:%M').time() and current_time <= datetime.strptime('23:00', '%H:%M').time()
    
    
    restaurants = load_restaurant_data()
    
    return render_template('index.html', restaurants=restaurants, is_lunch_time=is_lunch_time)

@app.route('/order', methods=['POST'])  
def order():
    data = request.json
    if data:
        restaurant_name = data.get('restaurant')
        menu_item = data.get('menu_item')
        return jsonify({"message": f"ส่งคำสั่งซื้อไปยัง {restaurant_name} เรียบร้อยแล้ว"})
    return jsonify({"error": "ข้อมูลไม่ถูกต้อง"}), 400

@app.route('/menu/<restaurant_name>')  
def get_menu(restaurant_name):
    
    restaurants = load_restaurant_data()
    
    for restaurant in restaurants:
        if restaurant['name'] == restaurant_name:
            return jsonify(restaurant['menu'])
    return jsonify([])  
if __name__ == '__main__':app.run(debug=True)