// /app/users/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/app/api/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchUserDetails, updateUser } from "@/redux/slices/userSlice";
import { toast } from "react-toastify";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { userDetails, loading, error } = useSelector(
    (state: RootState) => state.user,
  );
  const [formData, setFormData] = useState<{
    username: string;
    name: string;
    email: string;
    role: string;
  }>({
    username: "",
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch(fetchUserDetails(id));
    };

    fetchData();
  }, [dispatch, id]);

  useEffect(() => {
    if (userDetails) {
      setFormData({
        username: userDetails.username,
        email: userDetails.email,
        name: userDetails.name,
        role: userDetails.role,
      });
      setSelectedRole(userDetails.role);
    }
  }, [userDetails]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("role", formData.role.toString());

      const result = await dispatch(
        updateUser({ id: id, userData: formDataToSend }),
      );

      if (updateUser.fulfilled.match(result)) {
        toast.success("Successfully Updated");
        router.push("/admin/users/list");
      }
    } catch (error) {
      toast.error("failed to Update");
    }
  };

  return (
    <div className="">
      <div className="w-96 rounded bg-white p-4">
        <h2 className="mb-4 text-xl font-bold">Edit User</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {userDetails && (
          <form onSubmit={handleUpdate}>
            <div className="mb-4">
              <label className="mb-1 block">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="role_id"
                className="block font-semibold text-gray-700"
              >
                Select Role
              </label>
              <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                name="role"
                value={selectedRole}
                onChange={handleInputChange}
              >
                <option value="">Select a role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
