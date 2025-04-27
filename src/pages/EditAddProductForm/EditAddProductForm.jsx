import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiChevronDown } from "react-icons/bi";
import { FaPhotoFilm } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { useProductsData } from "../../App";
import { LoaderIcon } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "../../../supabaseClient";

const categories = [
  { value: "", label: "Select category" },
  {
    value: "Hot Drinks - نوشیدنی‌های گرم",
    label: "Hot Drinks - نوشیدنی‌های گرم",
  },
  {
    value: "Cold Drinks - نوشیدنی‌های سرد",
    label: "Cold Drinks - نوشیدنی‌های سرد",
  },
  { value: "Sandwiches - ساندویچ‌ها", label: "Sandwiches - ساندویچ‌ها" },
  { value: "Desserts - دسرها", label: "Desserts - دسرها" },
  { value: "Sweets - شیرینی‌ها", label: "Sweets - شیرینی‌ها" },
];

function EditAddProductForm() {
  const params = useParams();
  const [isEdit, setEdit] = useState(false);
  const { products, loading } = useProductsData();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setLoading] = useState(false);

  // set form values on edit mode
  useEffect(() => {
    if (params?.id && !loading && products?.length) {
      setEdit(true);
      const productInfo = products.find(({ id }) => id === params.id);

      Object.entries(productInfo).map(([k, v]) => {
        if (k !== "category__en" && k !== "category__fa") {
          setValue(k, v);
        } else {
          const category = categories.find(({ value }) =>
            value.includes(v)
          ).value;

          setValue("category", category);
          setValue("category__en", category.split("-")[0].replaceAll(" ", ""));
          setValue("category__fa", category.split("-")[1].replace(" ", ""));
        }
      });
    }
  }, [params, products, loading]);

  async function handleAddProduct(formData) {
    try {
      setLoading(true);

      const picUrl = await uploadImageToSupabase(formData.coverPhoto);

      const productData = {
        ...formData,
        category__en: formData.category.split("-")[0].replaceAll(" ", ""),
        category__fa: formData.category.split("-")[1].replace(" ", ""),
        thumbnailSrc: picUrl,
        id: formData.id || uuidv4(),
      };

      const { category, coverPhoto, ...finalProductData } = productData;

      const { data, error } = await supabase
        .from("Products")
        .insert([finalProductData]);
    } catch (error) {
      console.log(error);

      // setValue("category", v);
    } finally {
      setLoading(false);
    }
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setValue("coverPhoto", file, { shouldValidate: true });
    }
  }

  function handleRemoveImage() {
    setSelectedImage(null);
    setValue("coverPhoto", null, { shouldValidate: true });
  }

  const uploadImageToSupabase = async (file) => {
    if (!file) return { error: "No file provided" };

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error } = await supabase.storage
        .from("productimages")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("productimages")
          .createSignedUrl(filePath, 31536000);

      if (signedUrlError) {
        throw signedUrlError;
      }

      return signedUrlData.signedUrl;
    } catch (error) {
      return { error };
    }
  };

  function onChangeCategory(e) {
    const value = e.target.value;

    setValue("category", value);
  }

  return (
    <form
      onSubmit={handleSubmit(handleAddProduct)}
      className="w-[500px] mx-auto"
    >
      {/* main form */}
      <div className="border-b space-y-12 border-gray-900/10 pb-12">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label
              htmlFor="name__en"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Product Name
            </label>
            <div className="mt-2">
              <input
                {...register("name__en", {
                  required: "Product name is required",
                  minLength: { value: 3, message: "Minimum 3 characters" },
                })}
                id="name__en"
                name="name__en"
                type="text"
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#8d2f2d] sm:text-sm/6"
              />
              {errors.name__en && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name__en.message}
                </p>
              )}
            </div>
          </div>

          <div dir="rtl" className="sm:col-span-3">
            <label
              htmlFor="name__fa"
              className="block text-sm/6 font-medium text-gray-900"
            >
              نام محصول
            </label>
            <div className="mt-2">
              <input
                {...register("name__fa", {
                  required: "نام محصول الزامی است",
                  minLength: { value: 3, message: "حداقل ۳ کاراکتر" },
                })}
                id="name__fa"
                name="name__fa"
                type="text"
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#8d2f2d] sm:text-sm/6"
              />
              {errors.name__fa && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.name__fa.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="price"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Price
            </label>
            <div className="mt-2">
              <input
                {...register("price", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
                id="price"
                name="price"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#8d2f2d] sm:text-sm/6"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="category"
              className="block text-sm/6 font-medium text-gray-900"
            >
              Category
            </label>
            <div className="mt-2 grid grid-cols-1 relative">
              <select
                {...register("category", { required: "Category is required" })}
                onSelect={onChangeCategory}
                onChange={onChangeCategory}
                id="category"
                name="category"
                className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-[#8d2f2d] sm:text-sm/6"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              <BiChevronDown
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
              />
              {errors.category && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-full">
          <label
            htmlFor="cover-photo"
            className="block text-sm/6 font-medium text-gray-900"
          >
            Cover photo
          </label>

          <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 relative">
            {selectedImage ? (
              <div className="flex flex-col items-center">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="max-h-64 object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="mt-4 text-red-500 underline text-sm"
                >
                  Remove Image
                </button>
              </div>
            ) : (
              <div className="text-center">
                <FaPhotoFilm
                  aria-hidden="true"
                  className="mx-auto size-12 text-gray-300"
                />
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-[#8d2f2d] focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      {...register("coverPhoto", {
                        required: "Cover photo is required",
                      })}
                      id="file-upload"
                      name="coverPhoto"
                      type="file"
                      className="sr-only"
                      onChange={handleImageUpload}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs/5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            )}
          </div>
          {errors.coverPhoto && (
            <p className="text-xs text-red-500 mt-1 text-center">
              {errors.coverPhoto.message}
            </p>
          )}
        </div>

        <div className="col-span-full">
          <label
            htmlFor="about"
            className="block text-sm/6 font-medium text-gray-900"
          >
            About
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc__en", {
                required: "Description is required",
                minLength: { value: 10, message: "Minimum 10 characters" },
              })}
              id="desc__en"
              name="desc__en"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#8d2f2d] sm:text-sm/6"
              defaultValue=""
            />
            {errors.desc__en && (
              <p className="text-xs text-red-500 mt-1">
                {errors.desc__en.message}
              </p>
            )}
          </div>
        </div>

        <div dir="rtl" className="col-span-full">
          <label
            htmlFor="desc__fa"
            className="block text-sm/6 font-medium text-gray-900"
          >
            درباره محصول
          </label>
          <div className="mt-2">
            <textarea
              {...register("desc__fa", {
                required: "توضیح درباره محصول الزامی است",
                minLength: { value: 10, message: "حداقل ۱۰ کاراکتر" },
              })}
              id="desc__fa"
              name="desc__fa"
              rows={3}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-[#8d2f2d] sm:text-sm/6"
              defaultValue=""
            />
            {errors.desc__fa && (
              <p className="text-xs text-red-500 mt-1">
                {errors.desc__fa.message}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* action btn's */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-[#8d2f2d] px-3 py-2 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          Save
        </button>
      </div>
      {/* loading screen */}
      <div
        className={`${
          isLoading ? "visible opacity-100" : "invisible opacity-0"
        } absolute inset-0 h-screen flex items-center justify-center bg-gray-950/50 backdrop-blur-sm`}
      >
        <div className="px-12 py-2 bg-gray-200 rounded-md flex items-center gap-4 justify-center flex-col">
          <LoaderIcon className="!size-12" />
          <p>Laoding...</p>
        </div>
      </div>
    </form>
  );
}

export default EditAddProductForm;
