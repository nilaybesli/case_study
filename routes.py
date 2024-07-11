from flask import request, jsonify, render_template
from app import app, db
from models import Customer, Product, Duration, Sales

@app.route('/sales', methods=['POST'])
def add_sale():
    data = request.get_json()
    new_sale = Sales(
        customer_id=data.get('customer_id'),
        product_id=data.get('product_id'),
        duration_id=data.get('duration_id'),
        amount=data.get('amount')
    )
    db.session.add(new_sale)
    db.session.commit()
    return jsonify({'message': 'Sale added successfully'}), 201

@app.route('/sales-data', methods=['GET'])
def get_sales_data():
    row_dimension = request.args.get('row_dimension')
    column_dimension = request.args.get('column_dimension')

    sales_query = Sales.query
    if row_dimension == 'customer':
        sales_query = sales_query.join(Customer, Sales.customer_id == Customer.customer_id)
    if row_dimension == 'product':
        sales_query = sales_query.join(Product, Sales.product_id == Product.product_id)
    if row_dimension == 'duration':
        sales_query = sales_query.join(Duration, Sales.duration_id == Duration.duration_id)

    if column_dimension == 'customer':
        sales_query = sales_query.join(Customer, Sales.customer_id == Customer.customer_id)
    if column_dimension == 'product':
        sales_query = sales_query.join(Product, Sales.product_id == Product.product_id)
    if column_dimension == 'duration':
        sales_query = sales_query.join(Duration, Sales.duration_id == Duration.duration_id)

    sales_data = sales_query.all()
    result = []
    for sale in sales_data:
        sale_info = {
            'customer_id': sale.customer.name if sale.customer else None,
            'product_id': sale.product.product_name if sale.product else None,
            'duration_id': sale.duration.duration_name if sale.duration else None,
            'amount': sale.amount
        }
        result.append(sale_info)
    return jsonify(result)

@app.route('/customer', methods=['GET'])
def get_customers():
    customers = Customer.query.all()
    return jsonify([{'id': c.customer_id, 'name': c.name} for c in customers])

@app.route('/product', methods=['GET'])
def get_products():
    products = Product.query.all()
    return jsonify([{'id': p.product_id, 'name': p.product_name} for p in products])

@app.route('/duration', methods=['GET'])
def get_durations():
    durations = Duration.query.all()
    return jsonify([{'id': d.duration_id, 'name': d.duration_name} for d in durations])

@app.route('/')
def index():
    return render_template('index.html')
