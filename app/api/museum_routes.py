from flask import Blueprint, session, jsonify
from flask_login import login_required
from app.models import db, Museum
from ..forms import MuseumForm

museum_routes = Blueprint('museums', __name__)


@museum_routes.route('/')
def museums():
    """
    Query for all museums and returns them in a list of museum dictionaries
    """
    museums = Museum.query.all()
    return {'museums': [museum.to_dict() for museum in museums]}

@museum_routes.route('/<int:museumId>')
def museum(museumId):
    """
    Query for a user by id and returns that user in a dictionary
    """
    museum = Museum.query.get(museumId)
    return museum.to_dict()

@museum_routes.route('', methods=['POST'])
@login_required
def create_museum():
    form = MuseumForm()
    if form.validate_on_submit():
        data = form.data
        new_museum = Museum(
            owner_id = int(session['_user_id']),
            name = data['name'],
            description = data['description'],
            image_url = data['image_url'],
            store_name = data['store_name'],
            store_address = data['store_address'],
            phone_number = data['phone_number'],
            email = data['email'],
            museum_website = data['museum_website']
        )
        db.session.add(new_museum)
        db.session.commit()
        return new_museum.to_dict()
    return {'errors': form.errors}, 401

@museum_routes.route('/<int:museumId>', methods=['DELETE'])
@login_required
def delete_museum(museumId):
    museum = Museum.query.get(museumId)
    if museum and int(session['_user_id']) == museum.to_dict()['owner_id']:
        db.session.delete(museum)
        db.session.commit()
        return {'message': 'Successfully deleted'}
    if not museum:
        return {'errors': {'message': "Musuem couldn't be found"}}
    return {'errors': {'message': 'Unauthorized'}}, 403
