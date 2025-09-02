Project: ShopKart 🛒
ShopKart is a basic e-commerce product listing website that allows users to browse products, filter them by category and price, and view product details. This project was built to demonstrate proficiency in creating dynamic web pages, handling data, and building a full-stack application.

Features ✨
Product Categories: A homepage displays different product categories like electronics, clothing, and accessories.

Dynamic Product Listing: Clicking on a category displays a grid of products with thumbnails, names, and prices.

Filtering: Users can filter products by price range or other relevant attributes to refine their search.

Product Details Page: A dedicated page shows detailed information for each product.

Responsive Design: The website is fully responsive and provides a seamless experience across various devices.

User-Friendly Interface: Styled with Tailwind CSS to provide a clean and attractive user interface.

Technology Stack 💻
This project is a full-stack application built with the following technologies:

Frontend:

React.js: A JavaScript library for building the user interface.

Tailwind CSS: A utility-first CSS framework for rapid styling.

Backend:

Django: A high-level Python web framework for the backend logic and API.

Django REST Framework (DRF): Used to build the RESTful API endpoints for the frontend to consume.

Database:

SQLite3: A lightweight, file-based database for local development and simplicity.

Installation and Setup 🛠️
To run this project locally, follow these steps:

Prerequisites
Python: Ensure Python 3.x is installed.

Node.js & npm: Ensure Node.js and npm are installed for the React frontend.

Backend Setup (Django)
Clone the repository:

git clone [https://github.com/omkarnarveer/shopkart-project.git](https://github.com/omkarnarveer/shopkart-project.git)
cd shopkart-project/backend

Create and activate a virtual environment:

python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate

Install the required Python packages:

pip install -r requirements.txt

Run database migrations:

python manage.py makemigrations
python manage.py migrate

Start the Django development server:

python manage.py runserver

The backend API will be running at http://127.0.0.1:8000.

Frontend Setup (React)
Navigate to the frontend directory:

cd ../frontend

Install the npm packages:

npm install

Start the React development server:

npm start

The frontend will be available at http://localhost:3000.

Project Structure 📂
shopkart-project/

backend/: Contains the Django project.

shopkart/: Django app with models, views, and URLs.

db.sqlite3: The database file.

frontend/: Contains the React application.

src/: React components, CSS, and logic.

Acknowledgments 🙏
Special thanks to Django, React, and Tailwind CSS communities for providing excellent open-source tools. 
