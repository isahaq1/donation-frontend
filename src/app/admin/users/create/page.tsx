"use client";

import { useForm } from "react-hook-form";
import axiosInstance from "@/app/api/axiosInstance";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

type FormData = {
  username: string;
  name: string;
  email: string;
  password: string;
  role: string; // Role ID field
};

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    try {
      // Send POST request with role_id and isAdmin
      await axiosInstance.post("/auth/register", data);
      toast.success("Registration successful!.");
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
          {...register("name", { required: "Name is required" })}
          placeholder="Name"
          className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}

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
            {...register("role", { required: "Role is required" })}
            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
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
