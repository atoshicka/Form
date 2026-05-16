import { Link } from "react-router-dom";
import './not-found-styles.css';

export const NotFound = () => {
    return (
        <div className="not-found-container">
            <h1 className="not-found-code">404</h1>
            <p className="not-found-text">page not found</p>
            <Link to="/" className="not-found-link">return</Link>
        </div>
    )
}