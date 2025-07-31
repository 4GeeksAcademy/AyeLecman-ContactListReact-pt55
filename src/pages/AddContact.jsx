// Import necessary components from react-router-dom and other parts of the application.
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Custom hook for accessing the global state.
import { useState, useCallback, useEffect } from "react";

export const AddContact = () => {
  // Access the global state and dispatch function using the useGlobalReducer hook.
  const { store, dispatch } = useGlobalReducer()

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const addContact = (contactData) => {
    return fetch(`https://playground.4geeks.com/contact/agendas/${store.agenda}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contactData })
    })

      .then(res => {
        if (!res.ok) throw new Error();
        return res;
      })
      .catch(() => setError("Error al agregar contacto"));
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContact = {
      name,
      email,
      phone,
      address
    };

    addContact(newContact).then(() => {
      setName("");
      setEmail("");
      setPhone("");
      setAddress("");
      setSuccess("Contacto agregado correctamente");
      setTimeout(() => setSuccess(""), 5000);
      setError("");
    });
  };

  return (
    <div className="container">
   
        <div className="d-flex align-items-center gap-3 py-4">
          <h1 className="display-5 fw-light m-0">Add contact</h1>
          <i className="bi bi-person-plus fs-3 mt-2"></i>
        </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary" type="submit">
            Submit form
          </button>
        </div>
      </form>

      <Link to="/">
        <button className="btn btn-secondary mt-3">Back home</button>
      </Link>

    </div>
  );
};