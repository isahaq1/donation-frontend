"use client";

import { useForm } from "react-hook-form";
import axiosInstance from "@/app/api/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

type FormData = {
  username: string;
  email: string;
  password: string;
  roleId: string; // Role ID field
  isAdmin: boolean; // Is Admin field
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [roles, setRoles] = useState<{ id: string; name: string }[]>([]); // State to store roles
  const router = useRouter();

  // Fetch roles from the API (replace with your actual endpoint)
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get("/roles"); // Example roles API endpoint
        setRoles(response.data); // Assuming the response contains a list of roles
      } catch (error) {
        toast.error("Failed to fetch roles.");
      }
    };

    fetchRoles();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Send POST request with role_id and isAdmin
      await axiosInstance.post("/users/addUser", data);
      toast.success("Registration successful! Please verify your email.");
      router.push("/admin/users/list");
    } catch (error) {
      toast.error("Registration failed.");
    }
  };

  return (
    <div className="w-2/4 space-y-4 bg-white p-6 sm:p-8 md:space-y-6">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
        Add New User
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Username Input */}
        <input
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        {errors.username && (
          <p className="text-red-500">{errors.username.message}</p>
        )}

        {/* Email Input */}
        <input
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
          placeholder="Email"
          type="email"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* Password Input */}
        <input
          {...register("password", { required: "Password is required" })}
          placeholder="Password"
          type="password"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        {/* Role Dropdown */}
        <div className="space-y-2">
          <label
            htmlFor="role_id"
            className="block font-semibold text-gray-700"
          >
            Select Role
          </label>
          <select
            {...register("roleId", { required: "Role is required" })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="">Select a role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          {errors.roleId && (
            <p className="text-red-500">{errors.roleId.message}</p>
          )}
        </div>

        {/* Admin Checkbox */}
        <div className="flex items-center space-x-2">
          <input type="checkbox" {...register("isAdmin")} className="h-4 w-4" />
          <label className="text-gray-700">Is Admin</label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 py-2 text-white"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
