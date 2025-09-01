import React, { useState } from "react";
import type { ILogin } from "../types/user.types";
import { loginUser } from "../services/user.services";
import { useNavigate } from "react-router-dom";


export default function LoginForm() {
    const [formData, setFormData] = useState<ILogin>({
        Email: "",
        Password: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

  const changeHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await loginUser(formData);
      console.log("Utilisateur connecté :", response);
      localStorage.setItem("token", response.token);
      localStorage.setItem("idUser", response.idUser.toString());
      setMessage("Connexion réussie !");
      navigate('/chat');

    } catch (error: any) {
      setMessage(error.response?.data?.message || "Erreur lors de la connexion");
      console.error(error);

    } finally {
      setLoading(false);

    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md p-10 rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm">
        <h2 className="text-4xl font-extrabold mb-8 text-indigo-400 text-center drop-shadow-lg">
          Connexion
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <input
            name="Email"
            type="email"
            placeholder="Email"
            value={formData.Email}
            onChange={changeHandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            required
          />
          <input
            name="Password"
            type="password"
            placeholder="Mot de passe"
            value={formData.Password}
            onChange={changeHandle}
            className="border border-gray-600 rounded-lg px-4 py-3 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-lg transition-all transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
          {message && <p className="text-center text-indigo-300 mt-2 font-medium">{message}</p>}
        </form>
      </div>
    </div>
  );
}
