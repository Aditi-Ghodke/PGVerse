import { useOutletContext } from "react-router-dom";  // to receive context from AdminLayout
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getAllUsers,
  getUserById,
  registerOwner,
  getAllOwners,
  deleteOwnerById,
  getOwnerById,
} from "../../api/adminApi";

const AdminDashboard = () => {
  const { token } = useAuth();
  const { view } = useOutletContext();  // get `view` from AdminLayout

  const [users, setUsers] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newOwner, setNewOwner] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    aadharCard: "",
  });

  // Load data when `view` changes
  useEffect(() => {
    setSelected(null);
    setShowAddForm(false);

    if (view === "users") {
      getAllUsers(token).then(setUsers);
    } else if (view === "owners") {
      getAllOwners(token).then(setOwners);
    } else if (view === "addOwner") {
      setShowAddForm(true);
    }
  }, [view, token]);

  const viewDetails = async (id, type) => {
    const data =
      type === "USER" ? await getUserById(id, token) : await getOwnerById(id, token);
    setSelected(data);
    setShowAddForm(false);
  };

  const handleDelete = async (id) => {
    await deleteOwnerById(id, token);
    getAllOwners(token).then(setOwners);
    setSelected(null);
  };

  const handleAddOwnerSubmit = async (e) => {
    e.preventDefault();
    await registerOwner(newOwner, token);
    getAllOwners(token).then(setOwners);
    setShowAddForm(false);
    setNewOwner({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      aadharCard: "",
    });
  };

  return (
    <div>
      {showAddForm && (
        <form
          onSubmit={handleAddOwnerSubmit}
          className="max-w-md space-y-4 bg-gray-100 p-4 rounded shadow mb-6"
        >
          <h2 className="text-lg font-bold">Add New Owner</h2>
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border"
            value={newOwner.name}
            onChange={(e) => setNewOwner({ ...newOwner, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border"
            value={newOwner.email}
            onChange={(e) => setNewOwner({ ...newOwner, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border"
            value={newOwner.password}
            onChange={(e) => setNewOwner({ ...newOwner, password: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            className="w-full p-2 border"
            value={newOwner.phone}
            onChange={(e) => setNewOwner({ ...newOwner, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full p-2 border"
            value={newOwner.address}
            onChange={(e) => setNewOwner({ ...newOwner, address: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Aadhar Card"
            className="w-full p-2 border"
            value={newOwner.aadharCard}
            onChange={(e) => setNewOwner({ ...newOwner, aadharCard: e.target.value })}
            required
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
            Create Owner
          </button>
        </form>
      )}

      {(view === "users" || view === "owners") && (
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(view === "users" ? users : owners).map((item) => {
              const id = item.userId || item.ownerId;
              return (
                <tr key={id} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.email}</td>
                  <td className="px-4 py-2">{item.phone}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() =>
                        viewDetails(id, view === "users" ? "USER" : "OWNER")
                      }
                      className="bg-blue-400 text-white px-2 py-1 rounded"
                    >
                      View
                    </button>
                    {view === "owners" && (
                      <button
                        onClick={() => handleDelete(id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {selected && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Details</h2>
          <p>
            <strong>Name:</strong> {selected.name}
          </p>
          <p>
            <strong>Email:</strong> {selected.email}
          </p>
          <p>
            <strong>Phone:</strong> {selected.phone}
          </p>
          <p>
            <strong>Address:</strong> {selected.address}
          </p>
          {selected.role && (
            <p>
              <strong>Role:</strong> {selected.role}
            </p>
          )}
          {selected.aadharCard && (
            <p>
              <strong>Aadhar Card:</strong> {selected.aadharCard}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
