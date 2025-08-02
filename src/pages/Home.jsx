
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { useCallback, useEffect, useState } from "react";
import avatar1 from "../assets/img/avatar_1_circular.png";
import avatar2 from "../assets/img/avatar_2_circular.png";
import avatar3 from "../assets/img/avatar_3_circular.png";
import avatar4 from "../assets/img/avatar_4_circular.png";
import avatar5 from "../assets/img/avatar_5_circular.png";
import avatar6 from "../assets/img/avatar_6_circular.png";
import avatar7 from "../assets/img/avatar_7_circular.png";
import avatar8 from "../assets/img/avatar_8_circular.png";
import avatar9 from "../assets/img/avatar_9_circular.png";
import avatar10 from "../assets/img/avatar_10_circular.png";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	const avatars = [
		avatar1, avatar2, avatar3, avatar4, avatar5,
		avatar6, avatar7, avatar8, avatar9, avatar10
	];

	const getAvatarById = (id) => {
		return avatars[id % avatars.length];
	};

	//CONFIGURACIONES PARA CARGAR AGENDA////////////////////////////////////////////////////////////////
	const [error, setError] = useState("");

	const loadAgenda = useCallback(() => {
		fetch(`https://playground.4geeks.com/contact/agendas/${store.agenda}`)
			.then(res => {
				if (!res.ok) {
					return fetch(`https://playground.4geeks.com/contact/agendas/${store.agenda}`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify([])
					});
				}
				return res;
			})
			.then(res => res.json())
			.then(data => {
				dispatch({
					type: "load_contacts",
					payload: data.contacts
				});
			})
			.catch(() => setError("Error al verificar o crear usuario"));
	}, [dispatch, store.agenda]);

	useEffect(() => {
		loadAgenda();
	}, [loadAgenda]);

	//CONFIGURACIONES PARA EDITAR CONTACTO////////////////////////////////////////////////////////////////
	const [selectedContact, setSelectedContact] = useState(null);
	const [success, setSuccess] = useState("");
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		address: ""
	});

	const handleEditClick = (contact) => {
		setSelectedContact(contact);
		setFormData({
			name: contact.name,
			email: contact.email,
			phone: contact.phone,
			address: contact.address
		});
	};

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handleSaveChanges = () => {
		if (!selectedContact) return;

		fetch(`https://playground.4geeks.com/contact/agendas/${store.agenda}/contacts/${selectedContact.id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				...formData,
				agenda_slug: store.agenda
			})
		})
			.then(res => {
				if (!res.ok) throw new Error();
				return res.json();
			})
			.then(() => {
				loadAgenda();
				setSelectedContact(null);
				setSuccess("Contact successfully updated");
				setTimeout(() => setSuccess(""), 3000);
			})
			.catch(() => setError("Error al editar contacto"));
	};

	//CONFIGURACIONES PARA DELETE////////////////////////////////////////////////////////////////
	const [contactoAEliminar, setContactoAEliminar] = useState(null);

	const handleDeleteContact = (contactId) => {

		fetch(`https://playground.4geeks.com/contact/agendas/${store.agenda}/contacts/${contactId}`, {
			method: "DELETE"
		})
			.then(res => {
				if (!res.ok) throw new Error();
				loadAgenda();
				setSuccess("Contact successfully deleted");
				setTimeout(() => setSuccess(""), 5000);
			})
			.catch(() => setError("Error al borrar contacto"));
	};


	//RETURN////////////////////////////////////////////////////////////////////////////////////
	return (
		<div className="container-fluid p-0">

			<div className="container-fluid bg-dark text-white py-4 my-1">
				<div className="d-flex flex-wrap justify-content-center align-items-center gap-4">
					<h1 className="display-5 fw-light">{store.agenda}'s contacts</h1>
					<i className="bi bi-person-vcard fs-3 mt-2"></i>
				</div>
			</div>

			{error && <p className="text-danger">{error}</p>}
			{success && <div className="alert alert-success text-center mx-auto w-auto">{success}</div>}

			<ul className="list-group px-3 px-md-5 w-100">
				{store && store.contacts?.map((contact) => (
					<li key={contact.id} className="list-group-item d-flex flex-wrap align-items-center justify-content-between gap-3 p-1 mt-5 mt-md-0 p-md-3 lh-lg">
						<div className="row align-items-center">
							<div className="col-12 col-md-12 d-flex align-items-center p-0 py-md-3">
								<img
									src={getAvatarById(contact.id)}
									alt="Avatar"
									className="ms-0 mx-md-5"
									style={{ width: "80px", height: "80px" }}
								/>
								<div className="text-start ms-3">
									<h5 className="mb-1">{contact.name}</h5>
									<p className="mb-1">
										<i className="bi bi-geo-alt"></i> {contact.address}<br />
										<i className="bi bi-telephone"></i> {contact.phone}<br />
										<i className="bi bi-envelope"></i> {contact.email}
									</p>
								</div>
							</div>
						</div>

						<div className="col-12 col-md-2 d-flex justify-content-end align-items-center gap-2">
							<button
								className="btn btn-light btn-sm border-0 bg-transparent"
								onClick={() => handleEditClick(contact)}
								data-bs-toggle="offcanvas"
								data-bs-target="#offcanvasTop"
							>
								<i className="bi bi-pencil text-dark fs-5"></i>
							</button>
							<button
								className="btn btn-light btn-sm border-0 bg-transparent delete-btn"
								data-bs-toggle="modal"
								data-bs-target="#exampleModal"
								onClick={() => setContactoAEliminar(contact.id)}
							>
								<i className="bi bi-trash text-danger fs-5"></i>
							</button>
						</div>
					</li>
				))}
			</ul>

			<div className="offcanvas offcanvas-top pt-5 px-5"
				tabIndex="-1"
				id="offcanvasTop"
				style={{ height: "70vh" }}>
				<div className="offcanvas-header">
					<h2 className="offcanvas-title" id="offcanvasTopLabel">Edit contact</h2>
					{success && <div className="alert alert-success">{success}</div>}
					<button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
				</div>
				<div className="offcanvas-body">
					<div className="mb-3">
						<label className="form-label">Name</label>
						<input className="form-control" name="name" value={formData.name} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label className="form-label">Email</label>
						<input className="form-control" name="email" value={formData.email} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label className="form-label">Phone</label>
						<input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
					</div>
					<div className="mb-3">
						<label className="form-label">Address</label>
						<input className="form-control" name="address" value={formData.address} onChange={handleChange} />
					</div>
					<button className="btn btn-primary mt-3 mx-auto d-block" onClick={handleSaveChanges}>
						Save changes
					</button>
				</div>
			</div>

			<div
				className="modal fade"
				id="exampleModal"
				tabIndex="-1"
			>
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h1 className="modal-title fs-5" id="exampleModalLabel">Confirm delete</h1>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
						</div>
						<div className="modal-body">
							Are you sure you want to delete this contact?
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
								Cancel
							</button>
							<button
								type="button"
								className="btn btn-danger"
								data-bs-dismiss="modal"
								onClick={() => {
									if (contactoAEliminar !== null) handleDeleteContact(contactoAEliminar);
								}}
							>
								Yes, delete!
							</button>
						</div>
					</div>
				</div>
			</div>

		</div>
	);
}; 