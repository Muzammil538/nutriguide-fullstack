# app.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import math
import random

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Database of predefined meal plans
MEAL_PLANS = {
    "monday": [
        {"time": "Breakfast", "food": "Oatmeal with berries and nuts", "quantity": "1 bowl (250g)"},
        {"time": "Mid-morning", "food": "Apple and almonds", "quantity": "1 apple, 10 almonds"},
        {"time": "Lunch", "food": "Grilled chicken salad with mixed vegetables", "quantity": "300g"},
        {"time": "Afternoon", "food": "Greek yogurt with honey", "quantity": "150g"},
        {"time": "Dinner", "food": "Baked salmon with quinoa and steamed broccoli", "quantity": "150g salmon, 100g quinoa, 100g broccoli"}
    ],
    "tuesday": [
        {"time": "Breakfast", "food": "Whole grain toast with avocado and eggs", "quantity": "2 slices, 1/2 avocado, 2 eggs"},
        {"time": "Mid-morning", "food": "Banana and peanut butter", "quantity": "1 banana, 1 tbsp peanut butter"},
        {"time": "Lunch", "food": "Lentil soup with whole grain bread", "quantity": "300ml soup, 1 slice bread"},
        {"time": "Afternoon", "food": "Carrot sticks with hummus", "quantity": "100g carrots, 50g hummus"},
        {"time": "Dinner", "food": "Turkey stir-fry with brown rice and vegetables", "quantity": "150g turkey, 100g rice, 150g mixed vegetables"}
    ],
    "wednesday": [
        {"time": "Breakfast", "food": "Smoothie with spinach, banana, and protein powder", "quantity": "350ml"},
        {"time": "Mid-morning", "food": "Orange and walnuts", "quantity": "1 orange, 10 walnuts"},
        {"time": "Lunch", "food": "Quinoa bowl with roasted vegetables and chickpeas", "quantity": "350g"},
        {"time": "Afternoon", "food": "Cottage cheese with pineapple", "quantity": "100g cottage cheese, 100g pineapple"},
        {"time": "Dinner", "food": "Grilled lean beef with sweet potato and green beans", "quantity": "150g beef, 150g sweet potato, 100g green beans"}
    ],
    "thursday": [
        {"time": "Breakfast", "food": "Greek yogurt parfait with granola and berries", "quantity": "200g yogurt, 50g granola, 100g berries"},
        {"time": "Mid-morning", "food": "Pear and cheese", "quantity": "1 pear, 30g cheese"},
        {"time": "Lunch", "food": "Tuna wrap with mixed salad", "quantity": "1 whole grain wrap, 100g tuna, 100g salad"},
        {"time": "Afternoon", "food": "Trail mix", "quantity": "50g"},
        {"time": "Dinner", "food": "Vegetable curry with brown rice", "quantity": "300g curry, 100g rice"}
    ],
    "friday": [
        {"time": "Breakfast", "food": "Scrambled eggs with spinach and mushrooms", "quantity": "3 eggs, 50g spinach, 50g mushrooms"},
        {"time": "Mid-morning", "food": "Kiwi and cashews", "quantity": "2 kiwis, 15 cashews"},
        {"time": "Lunch", "food": "Mediterranean salad with feta and olives", "quantity": "300g"},
        {"time": "Afternoon", "food": "Rice cakes with avocado", "quantity": "2 rice cakes, 1/4 avocado"},
        {"time": "Dinner", "food": "Baked cod with roasted vegetables and quinoa", "quantity": "150g cod, 200g vegetables, 100g quinoa"}
    ],
    "saturday": [
        {"time": "Breakfast", "food": "Whole grain pancakes with berries and yogurt", "quantity": "3 pancakes, 100g berries, 50g yogurt"},
        {"time": "Mid-morning", "food": "Grapes and cheese", "quantity": "100g grapes, 30g cheese"},
        {"time": "Lunch", "food": "Grilled vegetable and chicken sandwich", "quantity": "2 slices whole grain bread, 100g chicken, 100g vegetables"},
        {"time": "Afternoon", "food": "Mango slices", "quantity": "1 mango"},
        {"time": "Dinner", "food": "Shrimp pasta with tomato sauce and salad", "quantity": "150g shrimp, 100g pasta, 100g salad"}
    ],
    "sunday": [
        {"time": "Breakfast", "food": "Vegetable omelet with whole grain toast", "quantity": "3 eggs, 100g vegetables, 1 slice toast"},
        {"time": "Mid-morning", "food": "Peach and pistachios", "quantity": "1 peach, 20 pistachios"},
        {"time": "Lunch", "food": "Roast chicken with potatoes and vegetables", "quantity": "150g chicken, 150g potatoes, 150g vegetables"},
        {"time": "Afternoon", "food": "Dark chocolate and berries", "quantity": "30g chocolate, 100g berries"},
        {"time": "Dinner", "food": "Grilled fish with asparagus and quinoa", "quantity": "150g fish, 100g asparagus, 100g quinoa"}
    ],
    "low": [
        {"time": "Breakfast", "food": "Salt-rich oatmeal with dried fruits", "quantity": "250g"},
        {"time": "Mid-morning", "food": "Salted crackers with cheese", "quantity": "6 crackers, 30g cheese"},
        {"time": "Lunch", "food": "Chicken soup with vegetables and extra salt", "quantity": "350ml"},
        {"time": "Afternoon", "food": "Salted nuts mix", "quantity": "50g"},
        {"time": "Dinner", "food": "Fish with olive oil, potatoes with salt", "quantity": "150g fish, 150g potatoes"}
    ],
    "high": [
        {"time": "Breakfast", "food": "Low-sodium oatmeal with fresh fruits", "quantity": "250g"},
        {"time": "Mid-morning", "food": "Unsalted rice cakes with natural peanut butter", "quantity": "2 rice cakes, 1 tbsp peanut butter"},
        {"time": "Lunch", "food": "Grilled chicken with herbs and steamed vegetables", "quantity": "150g chicken, 200g vegetables"},
        {"time": "Afternoon", "food": "Fresh fruit salad", "quantity": "200g"},
        {"time": "Dinner", "food": "Baked white fish with lemon, quinoa, and asparagus", "quantity": "150g fish, 100g quinoa, 100g asparagus"}
    ],
    "ulcer": [
        {"time": "Breakfast", "food": "Non-acidic oatmeal with banana", "quantity": "250g"},
        {"time": "Mid-morning", "food": "Chamomile tea with honey and plain crackers", "quantity": "250ml tea, 4 crackers"},
        {"time": "Lunch", "food": "Steamed white fish with rice and cooked carrots", "quantity": "150g fish, 100g rice, 100g carrots"},
        {"time": "Afternoon", "food": "Low-fat yogurt (avoid citrus flavors)", "quantity": "150g"},
        {"time": "Dinner", "food": "Chicken breast with mashed potatoes and steamed zucchini", "quantity": "150g chicken, 150g potatoes, 100g zucchini"}
    ],
    "fasting": [
        {"time": "Pre-dawn", "food": "Oatmeal with dates, nuts, and yogurt", "quantity": "250g oatmeal, 3 dates, 20g nuts, 100g yogurt"},
        {"time": "Hydration", "food": "Water with lemon and mint", "quantity": "500ml"},
        {"time": "Breaking fast", "food": "Dates and water", "quantity": "3 dates, 250ml water"},
        {"time": "Main meal", "food": "Lentil soup, grilled chicken with vegetables, and brown rice", "quantity": "200ml soup, 150g chicken, 150g vegetables, 100g rice"},
        {"time": "Later evening", "food": "Fruits, nuts, and green tea", "quantity": "200g fruits, 30g nuts, 250ml tea"}
    ]
}

# Database of motivational messages
MOTIVATIONAL_MESSAGES = [
    "Small daily improvements lead to stunning results over time.",
    "Your body is a reflection of your lifestyle. Nurture it with good food and exercise.",
    "The food you eat can either be the fastest form of medicine or the slowest form of poison.",
    "Take care of your body. It's the only place you have to live.",
    "Let food be thy medicine and medicine be thy food.",
    "Your health is an investment, not an expense.",
    "The greatest wealth is health.",
    "Health is not valued until sickness comes.",
    "A healthy outside starts from the inside.",
    "You are what you eat, so don't be fast, cheap, easy, or fake.",
    "Eating well is a form of self-respect.",
    "Every time you eat or drink, you are either feeding disease or fighting it.",
    "Your diet is a bank account. Good food choices are good investments.",
    "The first wealth is health.",
    "Our bodies are our gardens, our wills are our gardeners."
]

@app.route('/')
def index():
    return jsonify({
        "message": "Welcome to NutriGuide API! Use /api/analyze to get personalized nutrition plans."
    })

@app.route('/api/analyze', methods=['POST'])
def analyze():
    try:
        data = request.json
        
        # Extract input data with defaults
        height = float(data.get('height', 170)) / 100  # Convert to meters
        weight = float(data.get('weight', 70))
        bp = data.get('bp', 'normal')
        glucose = data.get('glucose', 'normal')
        day = data.get('day', 'monday').lower()
        
        # Calculate BMI
        bmi = round(weight / (height ** 2), 2)
        
        # Determine BMI category
        if bmi < 18.5:
            bmi_category = "Underweight - Consider consulting a nutritionist for weight gain strategies"
        elif bmi < 25:
            bmi_category = "Normal weight - Keep up the healthy lifestyle!"
        elif bmi < 30:
            bmi_category = "Overweight - Small dietary changes could help reach a healthier weight"
        else:
            bmi_category = "Obese - Consider consulting a healthcare provider for a personalized plan"
        
        # Select meal plan based on health conditions or day
        if bp == "low":
            selected_plan = MEAL_PLANS["low"]
        elif bp == "high":
            selected_plan = MEAL_PLANS["high"]
        elif glucose == "high":
            # Diabetic meal plan (using a modified version of a regular day)
            selected_plan = [
                {"time": meal["time"], 
                "food": meal["food"].replace("with", "with low-sugar"), 
                "quantity": meal["quantity"]}
                for meal in MEAL_PLANS[day]
            ]
        elif day == "ulcer" or day == "fasting":
            selected_plan = MEAL_PLANS[day]
        else:
            selected_plan = MEAL_PLANS[day]
        
        # Get random motivational message
        motivation = random.choice(MOTIVATIONAL_MESSAGES)
        
        return jsonify({
            "bmi": bmi,
            "bmi_category": bmi_category,
            "motivation": motivation,
            "meal_plan": selected_plan
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    


@app.route('/api/nutrition_composition', methods=['POST', 'OPTIONS'])
def nutrition_composition():
    if request.method == 'OPTIONS':
        # Preflight request
        return '', 200

    try:
        data = request.json
        bmi = float(data.get('bmi', 25))

        if 18.5 <= bmi < 25:
            return jsonify({
                "diet_type": "balanced",
                "composition": {
                    "carbs": 30,
                    "proteins": 30,
                    "fats": 20,
                    "vitamins": 10,
                    "minerals": 10
                },
                "recommendation": "Your diet shows excellent balance across macronutrients. This balanced approach helps maintain energy levels, supports muscle health, and provides necessary vitamins and minerals."
            })
        else:
            return jsonify({
                "diet_type": "unbalanced",
                "composition": {
                    "carbs": 24.2,
                    "proteins": 19.6,
                    "fats": 15.7,
                    "vitamins": 16.3,
                    "minerals": 24.2
                },
                "recommendation": "Your current diet shows an imbalance in nutrient distribution. For optimal health, consider adjusting your intake toward the recommended balance, with more emphasis on quality carbohydrates and proteins, while maintaining appropriate levels of healthy fats and micronutrients."
            })

    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
    app.run()