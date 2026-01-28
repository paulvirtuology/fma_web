import React from 'react';
import { Plus, X, Edit, Trash2, Save, Loader2 } from 'lucide-react';
import { User, UserRole } from '../../types';

interface UsersTabProps {
    users: User[];
    currentUser: User | null;
    showUserForm: boolean;
    setShowUserForm: (show: boolean) => void;
    editingUser: User | null;
    setEditingUser: (user: User | null) => void;
    newUser: any;
    setNewUser: (user: any) => void;
    handleCreateUser: () => void;
    handleUpdateUser: (id: string, updates: any) => void;
    handleDeleteUser: (id: string) => void;
    isLoading: boolean;
}

const UsersTab: React.FC<UsersTabProps> = ({
    users,
    currentUser,
    showUserForm,
    setShowUserForm,
    editingUser,
    setEditingUser,
    newUser,
    setNewUser,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    isLoading
}) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold italic">Gestion des Utilisateurs</h1>
                <button
                    onClick={() => {
                        setEditingUser(null);
                        setNewUser({ email: '', password: '', role: 'editor', full_name: '' });
                        setShowUserForm(true);
                    }}
                    className="bg-blue-600 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
                >
                    <Plus size={16} className="mr-2" /> Nouvel utilisateur
                </button>
            </div>

            {showUserForm && (
                <div className="bg-slate-800 p-6 rounded-2xl border border-blue-500/30 space-y-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">{editingUser ? 'Modifier' : 'Nouvel'} Utilisateur</h2>
                        <button onClick={() => setShowUserForm(false)}><X size={20} /></button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nom complet"
                            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                            value={editingUser ? editingUser.full_name || '' : newUser.full_name}
                            onChange={e => editingUser
                                ? setEditingUser({ ...editingUser, full_name: e.target.value })
                                : setNewUser({ ...newUser, full_name: e.target.value })
                            }
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                            value={editingUser ? editingUser.email : newUser.email}
                            onChange={e => !editingUser && setNewUser({ ...newUser, email: e.target.value })}
                            disabled={!!editingUser}
                        />
                        {!editingUser && (
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                                value={newUser.password}
                                onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                            />
                        )}
                        <select
                            className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-white"
                            value={editingUser ? editingUser.role : newUser.role}
                            onChange={e => editingUser
                                ? setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                                : setNewUser({ ...newUser, role: e.target.value as UserRole })
                            }
                        >
                            <option value="editor">Editor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setShowUserForm(false)}
                            className="px-4 py-2 border border-slate-700 rounded-lg hover:bg-slate-700"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={() => editingUser
                                ? handleUpdateUser(editingUser.id, { role: editingUser.role, full_name: editingUser.full_name, email: editingUser.email })
                                : handleCreateUser()
                            }
                            disabled={isLoading}
                            className="bg-green-600 px-6 py-3 rounded-lg font-bold flex items-center disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                            {editingUser ? 'Enregistrer' : 'Créer'}
                        </button>
                    </div>
                </div>
            )}

            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden text-white">
                <table className="w-full text-left">
                    <thead className="bg-slate-700/50 text-slate-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Nom</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Rôle</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-slate-700/50 transition-colors">
                                <td className="px-6 py-4 font-medium">{u.full_name || '-'}</td>
                                <td className="px-6 py-4">{u.email}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {u.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right flex justify-end gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingUser(u);
                                            setShowUserForm(true);
                                        }}
                                        className="p-2 hover:bg-blue-500/20 rounded-lg text-blue-400"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    {u.id !== currentUser?.id && (
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersTab;
