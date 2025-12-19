"use client"

import { useState, useEffect } from "react"
import { FaEye, FaTrash } from "react-icons/fa"
import axios from "axios"
import { enqueueSnackbar } from "notistack"
import { Link } from "react-router-dom"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { MdOpenInNew } from "react-icons/md"
import Dropdown from "../components/common/Dropdown"
import ConfirmDialog from "../components/common/ConfirmDialog"
import Loader from "../utils/Loader"
import SearchInput from "../components/common/SearchInput"

function AdminProducts({ pre }) {
    const [products, setProducts] = useState([])
    const [filterType, setFilterType] = useState("All")
    const [filteredProducts, setFilteredProducts] = useState([])
    const [showProductDetailsModel, setShowProductDetailsModel] = useState(false)
    const [openedProduct, setOpenedProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [confirmDialog, setConfirmDialog] = useState({
        open: false,
        title: "",
        message: "",
        onConfirm: null,
    })
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchType, setSearchType] = useState("title") // Default search type

    const productFilters = ["All", "InStock", "LowStock", "OutOfStock", "Discounted", "Boosted"]
    const searchFilters = ["Title", "ID", "Seller"]
    const searchTypeMap = {
        Title: "title",
        ID: "id",
        "Seller": "seller",
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        setLoading(true)
        const token = localStorage.getItem("adminToken")
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/all/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (response.data.success) setProducts(response.data.allProducts)
        } catch (e) {
            // enqueueSnackbar(e.response?.data?.error || "Something went wrong!", { variant: "error" })
        }
        setLoading(false)
    }

    useEffect(() => {
        let filtered = products

        if (filterType !== "All") {
            switch (filterType) {
                case "InStock":
                    filtered = filtered.filter((product) => product.stock > 0)
                    break
                case "LowStock":
                    filtered = filtered.filter((product) => product.stock > 0 && product.stock <= 10)
                    break
                case "OutOfStock":
                    filtered = filtered.filter((product) => product.stock === 0)
                    break
                case "Discounted":
                    filtered = filtered.filter((product) => product.discountPercent > 0)
                    break
                case "Boosted":
                    filtered = filtered.filter(
                        (product) => product.boostExpiryDate && new Date(product.boostExpiryDate) > new Date(),
                    )
                    break
                default:
                    break
            }
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            switch (searchType) {
                case "title":
                    filtered = filtered.filter((product) => product.title.toLowerCase().includes(query))
                    break
                case "id":
                    filtered = filtered.filter((product) => product._id.toLowerCase().includes(query))
                    break
                case "seller":
                    filtered = filtered.filter((product) => product.sellerId?.userId?.username.toLowerCase().includes(query))
                    break
                default:
                    break
            }
        }

        setFilteredProducts(filtered)
    }, [filterType, products, searchQuery, searchType])

    const handleOpenProductDetails = (product) => {
        setOpenedProduct(product)
        setShowProductDetailsModel(true)
    }

    const handleDeleteProduct = (productId) => {
        setConfirmDialog({
            open: true,
            title: "Delete Product",
            message: "Are you sure you want to delete this product? This action cannot be undone.",
            onConfirm: () => confirmDeleteProduct(productId),
        })
    }

    const confirmDeleteProduct = async (productId) => {
        setDeleteLoading(true)
        const token = localStorage.getItem("adminToken")
        try {
            const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/v1/products/seller/product/${productId}`, {
                headers: { Authorization: `Admin ${token}` },
            })
            if (response.data.success) {
                setProducts(products.filter((product) => product._id !== productId))
                enqueueSnackbar("Product deleted successfully", { variant: "success" })
            }
        } catch (e) {
            enqueueSnackbar(e.response?.data?.error || "Failed to delete product", { variant: "error" })
        }
        setDeleteLoading(false)
        setConfirmDialog({ ...confirmDialog, open: false })
    }

    const productElems = loading ? (
        <Loader type="simpleMini" />
    ) : filteredProducts.length > 0 ? (
        filteredProducts.map((product, index) => (
            <div key={index} className="requestRow row">
                <div className="titleField field">
                    <p className="title">{product.title}</p>
                </div>
                <Link to={`/sellers/${product.sellerId?._id}`} className="sellerField field">
                    {product.sellerId?.userId?.username + " >"}
                </Link>
                <p className="field">{product.category}</p>
                <p className="priceField field">${product.salesPrice}</p>
                <p className="stockField field">{product.stock}</p>
                <p className="ratingField field">{product.rating.toFixed(1)}</p>
                <p className="soldField field">{product.sold}</p>
                <div className="actionsField field">
                    <FaEye className="icon" onClick={() => handleOpenProductDetails(product)} />
                    <FaTrash className="icon delete" onClick={() => handleDeleteProduct(product._id)} />
                    <MdOpenInNew
                        className="icon"
                        onClick={() => window.open(`${process.env.REACT_APP_FRONTEND_URL}/productDetails/` + product._id, "_blank")}
                    />
                </div>
            </div>
        ))
    ) : (
        <div className="row">Nothing to show here...</div>
    )

    return (
        <div className="adminProductsDiv">
            <div className="adminProductsContent">
                <div className="tableDiv">
                    <div className="tableContent">
                        <div className="upper">
                            <h2 className="secondaryHeading">
                                <span>{pre === "dashboard" ? "Products" : filterType} </span>
                                {pre === "dashboard" ? "Management" : "Products"}
                            </h2>
                            <div className="upperRight">
                                <SearchInput
                                    searchType={searchType} 
                                    setSearchType={setSearchType} 
                                    searchQuery={searchQuery} 
                                    setSearchQuery={setSearchQuery} 
                                    searchFilters={searchFilters}
                                    searchTypeMap={searchTypeMap}
                                    placeholder={`Search by ${searchType === "id" ? "ID" : searchType === "seller" ? "Seller Username" : "Title"}`}
                                />
                                <Dropdown options={productFilters} selected={filterType} onSelect={setFilterType} />
                                {pre === "dashboard" && (
                                    <Link to="/products" className="secondaryBtn">
                                        View All {">"}
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="header">
                            <p className="title">Title</p>
                            <p>Seller</p>
                            <p>Category</p>
                            <p>Price</p>
                            <p>Stock</p>
                            <p>Rating</p>
                            <p>Sold</p>
                            <p>Actions</p>
                        </div>
                        <div className="rows">{productElems}</div>
                    </div>
                </div>
            </div>

            {showProductDetailsModel && (
                <div className="popupDiv addNewModelDiv">
                    <div className="popupContent">
                        <div className="form">
                            <h2 className="secondaryHeading">
                                Product <span>Details</span>
                            </h2>

                            <div className="rows">
                                <div className="row">
                                    <div>ID</div>
                                    <div className="fw600">{openedProduct._id}</div>
                                </div>
                                <div className="row">
                                    <div>Title</div>
                                    <div className="fw600">{openedProduct.title}</div>
                                </div>
                                <div className="row">
                                    <div>Description</div>
                                    <div className="fw600">{openedProduct.description}</div>
                                </div>
                                <div className="row">
                                    <div>Category</div>
                                    <div className="fw600">{openedProduct.category}</div>
                                </div>
                            </div>

                            <div className="horizontalLine"></div>

                            <h2 className="secondaryHeading">
                                Price <span>Details</span>
                            </h2>
                            <div className="rows">
                                <div className="row">
                                    <div>Base Price</div>
                                    <div className="fw600">${openedProduct.price}</div>
                                </div>
                                {openedProduct.discountPercent > 0 && (
                                    <>
                                        <div className="row">
                                            <div>Discount</div>
                                            <div className="fw600">{openedProduct.discountPercent}%</div>
                                        </div>
                                        <div className="row">
                                            <div>Discount Expiry</div>
                                            <div className="fw600">{new Date(openedProduct.discountExpiryDate).toLocaleDateString()}</div>
                                        </div>
                                    </>
                                )}
                                <div className="row">
                                    <div>Sales Price</div>
                                    <div className="fw600">${openedProduct.salesPrice}</div>
                                </div>
                                <div className="row">
                                    <div>Shipping Fees</div>
                                    <div className="fw600">${openedProduct.shippingFees}</div>
                                </div>
                                <div className="row">
                                    <div>Seller Earnings</div>
                                    <div className="fw600">${openedProduct.amountToGet}</div>
                                </div>
                            </div>

                            <div className="horizontalLine"></div>

                            <h2 className="secondaryHeading">
                                Performance <span>Metrics</span>
                            </h2>
                            <div className="rows">
                                <div className="row">
                                    <div>Stock</div>
                                    <div className="fw600">{openedProduct.stock}</div>
                                </div>
                                <div className="row">
                                    <div>Units Sold</div>
                                    <div className="fw600">{openedProduct.sold}</div>
                                </div>
                                <div className="row">
                                    <div>Rating</div>
                                    <div className="fw600">
                                        {openedProduct.rating.toFixed(1)} ({openedProduct.noOfReviews} reviews)
                                    </div>
                                </div>
                                {openedProduct.boostExpiryDate && (
                                    <div className="row">
                                        <div>Boost Status</div>
                                        <div className="fw600">
                                            Boosted until {new Date(openedProduct.boostExpiryDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="horizontalLine"></div>

                            <h2 className="secondaryHeading">
                                Product <span>Images</span>
                            </h2>
                            <div className="productImages">
                                {openedProduct.productImages.map((image, index) => (
                                    <img key={index} src={image || "/placeholder.svg"} alt={`Product ${index + 1}`} />
                                ))}
                            </div>

                            <div className="buttonsDiv">
                                <button className="secondaryBtn" type="button" onClick={() => setShowProductDetailsModel(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="popupCloseBtn">
                        <IoIosCloseCircleOutline className="icon" onClick={() => setShowProductDetailsModel(false)} />
                    </div>
                </div>
            )}

            <ConfirmDialog
                open={confirmDialog.open}
                title={confirmDialog.title}
                message={confirmDialog.message}
                onConfirm={confirmDialog.onConfirm}
                onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
                isLoading={deleteLoading}
            />
        </div>
    )
}

export default AdminProducts