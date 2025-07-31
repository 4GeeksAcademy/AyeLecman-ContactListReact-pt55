import { Link } from "react-router-dom";

export const Navbar = () => {

	return (
		<nav className="navbar bg-dark">
			<div className="container-fluid mx-3">
				<Link to="/">
					<span className="navbar-brand fs-3 text-light">Contact List</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-success">Agregar Contacto</button>
					</Link>
				</div>
			</div>
		</nav>
	);
};