import { Link } from 'react-router-dom'

function NotFound() {
    return (
        <div className='notFoundDiv'>
            <div className="notFoundImgDiv">
                <img src="/assets/images/notFound.png" alt="404 Error" loading='lazy' />
            </div>
            <p>Oops! Page Not Found</p>
            <Link to="/" className="primaryBtn">Back To Dashboard</Link>
        </div>
    )
}

export default NotFound