from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        first_name='Demo', last_name='Lition', username='Demo', email='demo@aa.io', location='123 Disney Dr, Chronopolis, KA, 12345', mobile_number='1234567890', password='password')
    marnie = User(
        first_name='Marnie', last_name='Smith',username='marnie', email='marnie@aa.io', location='1 Main St, Awesome, CA, 98765', mobile_number='9876543210', password='password')
    bobbie = User(
        first_name='Bobbie', last_name='Test',username='bobbie', email='bobbie@aa.io', location='777 Lucky Ave, Clover, LN, 77777', mobile_number='7777777777', password='password')

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(bobbie)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
