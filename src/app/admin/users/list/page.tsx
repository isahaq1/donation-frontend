"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  fetchUserDetails,
  deleteUser,
} from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { FaEdit, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { toast } from "react-toastify";

const UserList = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, error } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = dispatch(deleteUser(id));

      if (deleteUser.fulfilled.match(result)) {
        toast.success("Successfully Deleted");
        router.push("/admin/users/list");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-0 bg-white p-0">
      <h2 className="mb-4 text-xl font-bold">User List</h2>
      <table className="mt-4 w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Sl.</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="border-t">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2 text-center">{user.name}</td>
              <td className="border p-2 text-center">{user.username}</td>
              <td className="border p-2 text-center">{user.email}</td>

              <td className="border p-2 text-center">{user.role}</td>

              <td className="border p-2 text-center">
                <button
                  className="mr-2 text-blue-500"
                  onClick={() => router.push(`/admin/users/${user.id}`)}
                >
                  <FaEdit />
                </button>
                <button
                  className="text-red-500"
                  onClick={() => handleDelete(user.id)}
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
