import React, { useState } from "react";
import type { IUser } from "../types/user.types";
import { createUser } from "../services/user.services";
import type { IUserCreation } from "../types/user.types";

export default function UserForm() {
    const initialFormData: IUserCreation = {
        FirstName: "",
        LastName: "",
        Pseudo: "",
        Email: "",
        Password: "",
        Birth: new Date(),
        Sex: "",
        Status: true,
    };

    const [formData, setFormData] = useState<IUserCreation>(initialFormData);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const changehandle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
        const { name, type, checked, value } = target;
        setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
        }));
    } else if (target instanceof HTMLSelectElement) {
        const { name, value } = target;
        setFormData((prev) => ({
        ...prev,
        [name]: value,
        }));
    }
    };


    const createUsers = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");

        try {
        const response = await createUser(formData as IUser);
        setMessage("Utilisateur créé avec succès !");
        console.log("Utilisateur créé :", response);
        setFormData(initialFormData);
        
        } catch (error) {
        setMessage("Erreur lors de la création de l'utilisateur");
        console.error(error);
        } finally {
        setLoading(false);
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-lg p-10 rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
          Créer un utilisateur
        </h2>
        <form className="space-y-6" onSubmit={createUsers}>
          <div className="grid grid-cols-2 gap-4">
            <input
              name="FirstName"
              type="text"
              placeholder="Prénom"
              value={formData.FirstName || ""}
              onChange={changehandle}
              className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
            <input
              name="LastName"
              type="text"
              placeholder="Nom"
              value={formData.LastName || ""}
              onChange={changehandle}
              className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              required
            />
          </div>

          <input
            name="Pseudo"
            type="text"
            placeholder="Pseudo"
            value={formData.Pseudo || ""}
            onChange={changehandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            required
          />

          <input
            name="Email"
            type="email"
            placeholder="Email"
            value={formData.Email || ""}
            onChange={changehandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />

          <input
            name="Password"
            type="password"
            placeholder="Mot de passe"
            value={formData.Password || ""}
            onChange={changehandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            required
          />

          <input
            name="Birth"
            type="date"
            value={formData.Birth ? new Date(formData.Birth).toISOString().split("T")[0] : ""}
            onChange={changehandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          />

          <select
            name="Sex"
            value={formData.Sex || ""}
            onChange={changehandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
          >
            <option value="">Sexe</option>
            <option value="M">Homme</option>
            <option value="F">Femme</option>
            <option value="O">Autre</option>
          </select>

          <label className="flex items-center space-x-2 text-gray-300">
            <input
              name="Status"
              type="checkbox"
              checked={formData.Status || false}
              onChange={changehandle}
              className="accent-indigo-400"
            />
            <span>Actif</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Enregistrement..." : "Enregistrer"}
          </button>

          {message && (
            <p className="text-center text-indigo-300 mt-2 font-medium">{message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
