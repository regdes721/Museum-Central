import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from 'react-router-dom'
import { thunkLoadMuseums, uploadImage } from "../../redux/museums";
import { thunkCreateProduct } from "../../redux/products";
import './CreateProductPage.css'

export default function CreateProductPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [museum_id, setMuseumId] = useState("")
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [quantity, setQuantity] = useState("");
    const [image, setImage] = useState("");
    const [errors, setErrors] = useState({});
    const sessionUser = useSelector(state => state.session.user)
    const museumsObj = useSelector(state => state.museums.allMuseums);
    const museums = Object.values(museumsObj)
    let userMuseums
    if (museums) {
        userMuseums = museums.filter((museum) => museum.owner_id === sessionUser.id)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setErrors({})
        const priceRegex = /^\d{1,7}(\.\d{1,2})?$/;
        if (price && !priceRegex.test(price)) {
            setErrors({ price: "Price is invalid" })
            return
        }
        let returnImage
        if (image) {
          const formData = new FormData();
          formData.append("image", image);
          // aws uploads can be a bit slow—displaying
          // some sort of loading message is a good idea
          returnImage = await dispatch(uploadImage(formData));
        }
        const form = {
            museum_id,
            name,
            description,
            price,
            category,
            dimensions,
            quantity,
        }
        if (returnImage) form.image_url = returnImage.url
        const handleProductCreation = async (product) => {
            const productData = await dispatch(thunkCreateProduct(product))
            if (!productData.errors) {
                navigate(`/products/${productData.id}/details`)
            }
            setErrors(productData.errors)
        }
        handleProductCreation(form)
    }

    useEffect(() => {
        dispatch(thunkLoadMuseums())
    }, [dispatch])

    useEffect(() => {
        if (!sessionUser) { navigate("/") }
    }, [sessionUser, navigate]);

    if (userMuseums.length === 0) return (
        <h1 className="all-museums-container font-text">Only logged in users that have created at least one museum can create Products.
        <br></br>
        <br></br>
        <a href="/museums/new" className="no-underline nav-menu">Click here to create a museum</a></h1>
    )

    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data" className='create-museum-container'>
            <h1 className="font-header all-museums-header-title">Create a Product</h1>
            <div>
                <h2 className='font-text'>
                    Museum
                </h2>
                <select value={museum_id} onChange={(e) => setMuseumId(e.target.value)}>
                    <option value="" disabled>{`(Select one)`}</option>
                    {userMuseums.map((museum) => (
                        <option value={museum.id}>{museum.name}</option>
                    ))}
                </select>
                {errors.museum_id && <p className="red">{errors.museum_id}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Name
                </h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className='create-museum-input'
                    required
                />
                {errors.name && <p className="red">{errors.name}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Description
                </h2>
                <textarea
                    type="text"
                    rows="13" cols="70"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                {errors.description && <p className="red">{errors.description}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Price
                </h2>
                <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className='create-museum-input'
                    required
                />
                {errors.price && <p className="red">{errors.price}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Category
                </h2>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="" disabled>{`(Select one)`}</option>
                    <option value="Posters & stationery">Posters & stationery</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Decoration">Decoration</option>
                    <option value="Books">Books</option>
                    <option value="Kids">Kids</option>
                    <option value="Fashion & Accessories">Fashion & Accessories</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Engravings">Engravings</option>
                    <option value="Sculpture">Sculpture</option>
                    <option value="Print on demand">Print on demand</option>
                </select>
                {errors.category && <p className="red">{errors.category}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Dimensions
                </h2>
                <input
                    type="text"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="Ex: 21 cm x 15 cm"
                    className='create-museum-input'
                    required
                />
                {errors.dimensions && <p className="red">{errors.dimensions}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Quantity
                </h2>
                <select value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                    <option value="" disabled>{`(Select one)`}</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                </select>
                {errors.quantity && <p className="red">{errors.quantity}</p>}
            </div>
            <div>
                <h2 className='font-text'>
                    Product Preview Image
                </h2>
                <input
                    type="file" className='server-creation-file-upload'accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])} />
                {errors.image_url && <p className="red">{errors.image_url}</p>}
            </div>
            <button type="submit" className="create-product-button">SAVE</button>
        </form>
    )
}
