import { zodResolver } from '@hookform/resolvers/zod';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { Edit, Search, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import z from 'zod';

const Read = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("");
    const [editingUser, setEditingUser] = useState(null);

    const schema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email"),
        passw: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(
                /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*])/,
                "Password must contain upper, lower, number & special char"
            ),
        age: z.coerce.number().min(1, "Age must be a positive number"),
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({ resolver: zodResolver(schema) });

    const fetchUsers = async () => {
        try {
            const res = await axios.get("http://localhost:3008/get");
            setUsers(res.data);
        } catch (error) {
            console.error("Fetch Error", error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const deleteUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.delete(`http://localhost:3008/get/${id}`);
                fetchUsers();
                toast.success("User deleted successfully");
            } catch (error) {
                console.error("Delete Error:", error.message);
                toast.error("Failed to delete user");
            }
        }
    };

    const startEdit = (user) => {
        setEditingUser(user);
        setValue("name", user.name);
        setValue("email", user.email);
        setValue("passw", user.passw);
        setValue("age", user.age);
    }

    const onSubmit = async (data) => {
        try {
            await axios.put(`http://localhost:3008/update/${editingUser._id}`, data);
            setEditingUser(null);
            reset();
            fetchUsers();
            toast.success("User updated successfully");
        } catch (error) {
            console.error("Update Error:", error.message);
            toast.error("Failed to update user");
        }
    }

    let filteredUsers = search
        ? users.filter((user) =>
            user.name.toLowerCase().includes(search.toLowerCase())
        )
        : users;

    switch (sort) {
        case "1":
            filteredUsers = [...filteredUsers].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;
        case "2":
            filteredUsers = [...filteredUsers].sort((a, b) =>
                b.name.localeCompare(a.name)
            );
            break;
        case "3":
            filteredUsers = [...filteredUsers].sort((a, b) =>
                a.email.localeCompare(b.email)
            );
            break;
        case "4":
            filteredUsers = [...filteredUsers].sort((a, b) =>
                b.email.localeCompare(a.email)
            );
            break;
        default:
            break;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <ToastContainer/>
            <h2 className="text-3xl font-bold mb-6 text-center">All Users</h2>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                {/* Search Input with Icon */}
                <div className="relative w-full md:w-1/2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <Search className="w-5 h-5" />
                    </span>
                    <input
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sort Select */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select sort option</option>
                    <option value="1">Sort Name (A - Z)</option>
                    <option value="2">Sort Name (Z - A)</option>
                    <option value="3">Sort Email (A - Z)</option>
                    <option value="4">Sort Email (Z - A)</option>
                </select>
            </div>

            {/* Responsive Table Container */}
            <div className="w-full overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Age
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.age}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(user.Record_time).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <button
                                                onClick={() => startEdit(user)}
                                                className="text-green-600 hover:text-green-900 p-1 rounded-md hover:bg-green-50"
                                                title="Edit"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteUser(user._id)}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                                    No Users Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Edit Form Modal */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Edit User
                                </h3>
                                <button
                                    onClick={() => {
                                        reset();
                                        setEditingUser(null);
                                    }}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <span className="sr-only">Close</span>
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register("name")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        {...register("email")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="passw" className="block text-sm font-medium text-gray-700 mb-1">
                                        Password
                                    </label>
                                    <input
                                        id="passw"
                                        type="password"
                                        {...register("passw")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.passw && <p className="mt-1 text-sm text-red-600">{errors.passw.message}</p>}
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                                        Age
                                    </label>
                                    <input
                                        id="age"
                                        type="number"
                                        {...register("age")}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.age && <p className="mt-1 text-sm text-red-600">{errors.age.message}</p>}
                                </div>
                                <div className="flex justify-end space-x-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            reset();
                                            setEditingUser(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Read;