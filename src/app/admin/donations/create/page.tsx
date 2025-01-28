"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createDonation } from "@/redux/slices/donationSlice";
import { toast } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

interface DonationForm {
  amount: number;
  description: string;
  user: {
    id: number;
    name: string;
  };
}
const CreateDonationForm: React.FC = () => {
  const [name, setName] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const storedAuthUser = localStorage.getItem("authUser");
  let authusername = "";
  let authuserid = 0;
  if (storedAuthUser) {
    const authUser = JSON.parse(storedAuthUser);
    authusername = authUser.name;
    authuserid = authUser.id;
  }

  const [formData, setFormData] = useState<DonationForm>({
    amount: 0,
    description: "",
    user: {
      id: authuserid,
      name: authusername,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Dispatching the action and awaiting the result
      const result = await dispatch(createDonation(formData));

      // Check if the action was successful
      if (createDonation.fulfilled.match(result)) {
        toast.success("Donation Successfully Created");
        router.push("/admin/donations"); // Redirect after success
      } else {
        toast.error("Failed to create Donation");
      }
    } catch (error) {
      // Handle any errors that might occur during dispatch
      toast.error("Failed to create Donation");
    }
  };

  return (
    <>
      <Breadcrumb pageName="Donation Create" />
      <div className="max-w-lg rounded-md bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-semibold">Create Donation</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Donation Amount:
            </label>

            <input
              type="text"
              id="name"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: Number(e.target.value) })
              }
              required
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Description:
            </label>

            <input
              type="text"
              id="name"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
            />
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateDonationForm;
