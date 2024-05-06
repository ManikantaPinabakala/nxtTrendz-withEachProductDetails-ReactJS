import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {brand, imageUrl, price, rating, title} = productDetails

  return (
    <li className="similar-product-item">
      <div className="similar-product-container">
        <img
          src={imageUrl}
          alt={`similar product ${title}`}
          className="similar-product-image"
        />
        <h1 className="similar-product-title">{title}</h1>
        <p className="by-brand">by {brand}</p>
        <div className="price-rating-container">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="rating-container">
            <p className="rating-text">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              className="star-image"
              alt="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
