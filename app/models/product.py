from .db import db, environment, SCHEMA, add_prefix_for_prod
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin
from sqlalchemy.sql import func
from .cart_product import CartProduct
from .wishlist_product import WishlistProduct
from .order_product import order_products

class Product(db.Model, UserMixin):
    __tablename__ = 'products'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    museum_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("museums.id")), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String, nullable=False)
    price = db.Column(db.Float, nullable=False)
    category = db.Column(db.String, nullable=False)
    num_sold = db.Column(db.Integer, default = 0)
    dimensions = db.Column(db.String, nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), default=func.now())

    # relationship attributes
    museum = db.relationship("Museum", back_populates="products")
    product_images = db.relationship("ProductImage", back_populates = "product", cascade="all, delete")

    cart = db.relationship(
        "Cart",
        secondary=CartProduct.__table__,
        back_populates="products"
    )

    wishlist = db.relationship(
        "Wishlist",
        secondary=WishlistProduct.__table__,
        back_populates="products"
    )

    order = db.relationship(
        "Order",
        secondary=order_products,
        back_populates="products"
    )

    def to_dict(self, museum=False):
        dictionary = {
            'id': self.id,
            'museum_id': self.museum_id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'category': self.category,
            'num_sold': self.num_sold,
            'dimensions': self.dimensions,
            'quantity': self.quantity,
            'created_at': self.created_at,
            'product_images': [product_image.to_dict() for product_image in self.product_images]
        }

        if museum:
            dictionary['museum'] = self.museum.to_dict()
        return dictionary
