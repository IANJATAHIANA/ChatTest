import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUserById, getUsers } from "../services/user.services";
import type { IUser } from "../types/user.types";
import { io } from "socket.io-client";

export default function Chat() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [connectedUserId, setConnectedUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const socketRef = useRef<any>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem("idUser");
    if (storedId) {
      setConnectedUserId(Number(storedId));
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (connectedUserId) {
      getUserById(connectedUserId)
        .then((res) => setProfile(res.data))
        .catch((err) => console.error("Erreur profil :", err));

      getUsers()
        .then((res) => {
          const otherUsers = res.data.filter((u: IUser) => u.idUser !== connectedUserId);
          setUsers(otherUsers);
        })
        .catch((err) => console.error("Erreur récupération utilisateurs :", err));
    }
  }, [connectedUserId]);

  useEffect(() => {
    socketRef.current = io("http://localhost:3006");

    socketRef.current.on("connect", () => {
      console.log("Socket connecté :", socketRef.current.id);
    });

    socketRef.current.on("receiveMessage", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const handleSend = () => {
    if (!input.trim() || !connectedUserId || !selectedUserId || !socketRef.current) return;

    const message = {
      id: Date.now(),
      sender: connectedUserId,
      receiver: selectedUserId,
      content: input,
    };

    socketRef.current.emit("sendMessage", message);
    setInput("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("idUser");
    navigate("/login");
  };

  const handleShowProfile = () => setShowProfile(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-2xl p-4 rounded-xl shadow-2xl bg-gray-800/80 backdrop-blur-sm">

        {/* Header */}
        <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-t-xl shadow">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold shadow">
              {profile ? profile.FirstName.charAt(0).toUpperCase() : "?"}
            </div>
            <div>
              <p className="font-semibold text-indigo-400">
                {profile ? `${profile.FirstName} ${profile.LastName}` : "Utilisateur"}
              </p>
              <p className="text-sm text-gray-400">
                {profile ? profile.Email : "loading@example.com"}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={handleShowProfile} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg font-medium shadow">
              Profil
            </button>
            <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-medium shadow">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        {!selectedUserId && (
          <div className="mt-6">
            <h2 className="text-white text-lg font-semibold mb-4">Choisissez un utilisateur pour discuter :</h2>
            <ul className="space-y-3">
              {users.map((user) => (
                <li key={user.idUser} className="flex items-center justify-between bg-gray-700 px-4 py-3 rounded-lg shadow hover:bg-gray-600 transition">
                  <div className="text-white">
                    <p className="font-medium">{user.FirstName} {user.LastName}</p>
                    <p className="text-sm text-gray-300">{user.Pseudo}</p>
                  </div>
                  <button
                    onClick={() => setSelectedUserId(user.idUser)}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg font-medium shadow"
                  >
                    Discuter
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Zone de chat */}
        {selectedUserId && (
          <div className="mt-6">
            <button
                onClick={() => setSelectedUserId(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-lg font-medium shadow"
            >
                ← Retour à la liste
            </button>
            <h2 className="text-white text-lg font-semibold mb-2">
              Discussion avec {users.find(u => u.idUser === selectedUserId)?.FirstName}
            </h2>
            <div className="mb-4 flex justify-end">
            </div>
            <div className="h-[400px] flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.sender === connectedUserId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xs break-words shadow ${
                        msg.sender === connectedUserId
                          ? "bg-indigo-500 text-white rounded-br-none"
                          : "bg-gray-700 text-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800 px-4 py-3 flex gap-2 rounded-b-xl">
                <input
                  type="text"
                  placeholder="Écrivez un message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 rounded-full px-4 py-2 bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button onClick={handleSend} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-semibold shadow">
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modale Profil */}
        {showProfile && profile && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 text-white rounded-2xl p-8 w-[400px] shadow-2xl border border-indigo-500/30">
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-extrabold text-indigo-400 tracking-wide">👤 Profil utilisateur</h2>
                <p className="text-sm text-gray-400">Informations personnelles</p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-start">
                  <span className="text-gray-400 font-medium">Nom :</span>
                  <span className="text-white">{profile.FirstName} {profile.LastName}</span>
                </div>
                <div className="flex justify-start">
                  <span className="text-gray-400 font-medium">Pseudo :</span>
                  <span className="text-white">{profile.Pseudo}</span>
                </div>
                <div className="flex justify-start">
                  <span className="text-gray-400 font-medium">Email :</span>
                  <span className="text-white">{profile.Email}</span>
                </div>
                <div className="flex justify-start">
                  <span className="text-gray-400 font-medium">Sexe :</span>
                  <span className="text-white">{profile.Sex}</span>
                </div>
                <div className="flex justify-start">
                  <span className="text-gray-400 font-medium">Status :</span>
                  <span className={`font-semibold ${profile.Status ? "text-green-400" : "text-red-400"}`}>
                                        {profile.Status ? " Actif " : " Inactif "}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setShowProfile(false)}
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 text-white py-2 rounded-lg font-semibold shadow-md"
              >
                Fermer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
