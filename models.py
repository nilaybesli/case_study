from app import db

class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))

class Product(db.Model):
    product_id = db.Column(db.Integer, primary_key=True)
    product_name = db.Column(db.String(50))
    category = db.Column(db.String(50))
    price = db.Column(db.Numeric)

class Duration(db.Model):
    duration_id = db.Column(db.Integer, primary_key=True)
    duration_name = db.Column(db.String(50))
    month = db.Column(db.Integer)
    year = db.Column(db.Integer)

class Sales(db.Model):
    sales_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customer.customer_id'))
    product_id = db.Column(db.Integer, db.ForeignKey('product.product_id'))
    duration_id = db.Column(db.Integer, db.ForeignKey('duration.duration_id'))
    amount = db.Column(db.Numeric)

    customer = db.relationship('Customer', backref=db.backref('sales', lazy=True))
    product = db.relationship('Product', backref=db.backref('sales', lazy=True))
    duration = db.relationship('Duration', backref=db.backref('sales', lazy=True))
