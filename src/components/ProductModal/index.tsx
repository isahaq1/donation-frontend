import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axiosInstance from "@/app/api/axiosInstance";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface ProductFormData {
  name: string;
  details: string;
  price: number;
  categoryId: number;
  modelId: number;
  model: { id: number; name: string };
  category: { id: number; name: string };
  productImage: string | File;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  initialData?: ProductFormData;
  mode: "add" | "edit";
}

const defaultFormData: ProductFormData = {
  name: "",
  details: "",
  price: 0,
  categoryId: 0,
  modelId: 0,
  model: { id: 0, name: "" },
  category: { id: 0, name: "" },
  productImage: "",
};

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<ProductFormData>(
    initialData || defaultFormData,
  );

  const [modellist, setModel] = useState<{ id: number; name: string }[]>([]);
  const [selectedModel, setSelectedModel] = useState<number>(
    initialData?.model.id || 0,
  );

  const [categorylist, setCategory] = useState<{ id: number; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<number>(
    initialData?.category.id || 0,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get("/models");
        const modelData = response.data.data;
        if (Array.isArray(modelData)) {
          setModel(modelData);
        } else {
          console.error("Model data is not an array:", modelData);
        }
        const catresponse = await axiosInstance.get("/categories");
        const catData = catresponse.data.data;
        if (Array.isArray(catData)) {
          setCategory(catData);
        } else {
          console.error("Model data is not an array:", catData);
        }
        if (initialData) {
          setFormData(initialData);
          setSelectedModel(initialData.model.id);
          setSelectedCategory(initialData.category.id);
        }
      } catch (error) {
        console.error("Error fetching model list:", error);
      }
    };

    fetchData();
  }, [initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setFormData((prev) => ({ ...prev, productImage: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("details", formData.details);
    formDataToSend.append("modelId", formData.modelId.toString());
    formDataToSend.append("categoryId", formData.categoryId.toString());
    if (formData.productImage) {
      formDataToSend.append("productImage", formData.productImage); // Append the file if it exists
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto w-full max-w-md rounded-lg bg-white p-6">
          <div className="flex items-center justify-between">
            <Dialog.Title className="text-lg font-medium">
              {mode === "add" ? "Add New Product" : "Edit Product"}
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Details
              </label>
              <textarea
                value={formData.details}
                onChange={(e) =>
                  setFormData({ ...formData, details: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Model
              </label>
              <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                name="modelId"
                value={selectedModel}
                onChange={(e) => {
                  const modelId = parseInt(e.target.value);
                  setSelectedModel(modelId);
                  setFormData({ ...formData, modelId: modelId });
                }}
              >
                <option value="">Select a Model</option>
                {modellist.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                name="categoryId"
                value={selectedCategory}
                onChange={(e) => {
                  const categoryId = parseInt(e.target.value);
                  setSelectedCategory(categoryId);
                  setFormData({
                    ...formData,
                    categoryId: categoryId,
                  });
                }}
              >
                <option value="">Select a Category</option>
                {categorylist.map((catgory) => (
                  <option key={catgory.id} value={catgory.id}>
                    {catgory.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
              >
                {mode === "add" ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};
