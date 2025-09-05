import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { getNextId } from "./Utils/getNextId";
import "./Styles/Insert.css";

function Insert({ onSubmitForm, entries }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);

  const onSubmit = (data) => {
    const newEntry = {
      id: getNextId(entries),
      ...data,
      cover: image,
    };
    onSubmitForm(newEntry);
    navigate("/books");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // revoke previous blob url if any
      if (image && String(image).startsWith("blob:"))
        URL.revokeObjectURL(image);
      setImage(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    if (image && String(image).startsWith("blob:")) URL.revokeObjectURL(image);
    setImage(null);
  };

  // Move to next input on Enter (prevent submit)
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      form.elements[index + 1]?.focus();
    }
  };

  return (
    <form className="insert-form" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="insert-title">Add new book</h2>

      <div className="row">
        <input
          className="input"
          {...register("title", { required: "Title is required" })}
          placeholder="Title"
          onKeyDown={handleKeyDown}
        />
        {errors.title && <span className="error">{errors.title.message}</span>}

        <input
          className="input"
          {...register("author", { required: "Author is required" })}
          placeholder="Author"
          onKeyDown={handleKeyDown}
        />
        {errors.author && (
          <span className="error">{errors.author.message}</span>
        )}
      </div>

      <div className="row">
        <input
          className="input"
          {...register("company", { required: "Company is required" })}
          placeholder="Company"
          onKeyDown={handleKeyDown}
        />
        {errors.company && (
          <span className="error">{errors.company.message}</span>
        )}

        <input
          className="input"
          {...register("price", {
            required: "Price is required",
            min: { value: 1, message: "Price must be >= 1" },
          })}
          type="number"
          placeholder="Price"
          onKeyDown={handleKeyDown}
        />
        {errors.price && <span className="error">{errors.price.message}</span>}
      </div>

      <div className="row">
        <input
          className="input"
          {...register("category")}
          placeholder="Category"
          onKeyDown={handleKeyDown}
        />
        <input
          className="input"
          {...register("year")}
          placeholder="Year"
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="row">
        <input
          className="input"
          {...register("language")}
          placeholder="Language"
          onKeyDown={handleKeyDown}
        />
        <input
          className="input"
          {...register("address")}
          placeholder="Shelf Address"
          onKeyDown={handleKeyDown}
        />
      </div>

      <textarea
        className="textarea"
        {...register("description")}
        placeholder="Description"
        rows="4"
        onKeyDown={handleKeyDown}
      />

      {/* Image Input */}
      <div className="file-row">
        {!image ? (
          <label className="file-label">
            <input
              className="file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <span className="file-text">Choose cover image</span>
          </label>
        ) : (
          <div className="preview">
            <img src={image} alt="preview" className="preview-img" />
            <div className="preview-actions">
              <button type="button" className="btn-ghost" onClick={removeImage}>
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="actions">
        <button
          type="button"
          className="btn-ghost"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Submit
        </button>
      </div>
    </form>
  );
}

export default Insert;
