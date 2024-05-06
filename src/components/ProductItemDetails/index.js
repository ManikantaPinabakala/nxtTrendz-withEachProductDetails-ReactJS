import {Component} from 'react'
import {Link} from 'react-router-dom'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESSFUL',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    mainItemDetails: {},
    quantity: 1,
    similarProductsList: [],
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getUpdatedData = data => ({
    id: data.id,
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    try {
      const url = `https://apis.ccbp.in/products/${id}`
      const jwtToken = Cookies.get('jwt_token')
      const options = {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      }

      const response = await fetch(url, options)

      if (response.ok) {
        const data = await response.json() // TODO: Get similar products
        const updatedData = this.getUpdatedData(data)
        const updatedSimilarProductsList = data.similar_products.map(
          eachSimilarProduct => this.getUpdatedData(eachSimilarProduct),
        )

        this.setState({
          mainItemDetails: updatedData,
          similarProductsList: updatedSimilarProductsList,
          apiStatus: apiStatusConstants.success,
        })
      } else {
        this.setState({apiStatus: apiStatusConstants.failure})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onIncrement = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  onDecrement = () => {
    const {quantity} = this.state

    if (quantity > 1) {
      this.setState(prevState => ({quantity: prevState.quantity - 1}))
    }
  }

  renderProductItemDetails = () => {
    const {mainItemDetails, quantity, similarProductsList} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = mainItemDetails

    return (
      <>
        <div className="main-item-container">
          <img src={imageUrl} alt="product" className="main-item-image" />
          <div className="main-item-details-container">
            <h1 className="main-item-title">{title}</h1>
            <p className="main-item-price">Rs {price}/-</p>
            <div className="rating-outer-container">
              <div className="rating-container">
                <p className="rating-text">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star-image"
                  alt="star"
                />
              </div>
              <p className="reviews-text">{totalReviews} Reviews</p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">
              Available: <p>{availability}</p>
            </p>
            <p className="brand">
              Brand: <p>{brand}</p>
            </p>
            <hr className="horizontal-break" />
            <div className="quantity-container">
              <button
                type="button"
                className="inc-dec-button"
                data-testid="minus"
                onClick={this.onDecrement}
                aria-label="Decrement"
              >
                <BsDashSquare className="inc-dec-icon" />
              </button>
              <p className="quantity-text">{quantity}</p>
              <button
                type="button"
                className="inc-dec-button"
                data-testid="plus"
                onClick={this.onIncrement}
                aria-label="Increment"
              >
                <BsPlusSquare className="inc-dec-icon" />
              </button>
            </div>
            <button type="button" className="add-to-cart-button">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-products-container">
          <h1 className="similar-products-heading">Similar Products</h1>
          <ul className="similar-product-list">
            {similarProductsList.map(eachProduct => (
              <SimilarProductItem
                productDetails={eachProduct}
                key={eachProduct.id}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="product-not-found">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-shopping-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderAppropriateView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-item-details-container">
          {this.renderAppropriateView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
