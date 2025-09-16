import { useState, useEffect } from "react";
import axios from "axios";

function AddMinifigureForm({ minifigureToEdit, onFormSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    personalNumber: "",
    theme: { id: "" },
    releaseDate: "",
    bricklinkNumber: "",
    estimatedValue: "",
    purchaseDate: "",
    purchasePrice: "",
    shippingCost: "",
    notes: "",
    quantity: 1,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [themes, setThemes] = useState([]);
  const [isAddingNewTheme, setIsAddingNewTheme] = useState(false);
  const [newThemeName, setNewThemeName] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/themes")
      .then((response) => {
        setThemes(response.data);
        if (response.data.length > 0 && !minifigureToEdit) {
          setFormData((prevState) => ({
            ...prevState,
            theme: { id: response.data[0].id },
          }));
        }
      })
      .catch((error) => console.error("Error fetching themes:", error));
  }, [minifigureToEdit]);

  useEffect(() => {
    if (minifigureToEdit) {
      const formattedData = {
        ...minifigureToEdit,
        theme: minifigureToEdit.theme || { id: "" },
        quantity: minifigureToEdit.quantity || 1,
        releaseDate: minifigureToEdit.releaseDate
          ? new Date(minifigureToEdit.releaseDate).toISOString().split("T")[0]
          : "",
        purchaseDate: minifigureToEdit.purchaseDate
          ? new Date(minifigureToEdit.purchaseDate).toISOString().split("T")[0]
          : "",
      };
      setFormData(formattedData);
    }
  }, [minifigureToEdit]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required.";
    if (!formData.personalNumber.trim())
      newErrors.personalNumber = "Personal Number is required.";
    if (formData.quantity < 1)
      newErrors.quantity = "Quantity must be at least 1.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewTheme = () => {
    if (newThemeName.trim() === "") return;
    axios
      .post("http://localhost:8080/api/themes", { name: newThemeName })
      .then((response) => {
        const newTheme = response.data;
        setThemes((prevThemes) => [...prevThemes, newTheme]);
        setFormData((prevState) => ({
          ...prevState,
          theme: { id: newTheme.id },
        }));
        setIsAddingNewTheme(false);
        setNewThemeName("");
      })
      .catch((error) => console.error("Error adding new theme:", error));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "theme") {
      setFormData((prevState) => ({
        ...prevState,
        theme: { id: parseInt(value) },
      }));
    } else {
      setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setPhotoFile(e.target.files[0]);
  };

  const uploadPhoto = async () => {
    if (!photoFile) return null;
    const fileUploadData = new FormData();
    fileUploadData.append("file", photoFile);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/files/upload",
        fileUploadData
      );
      return response.data;
    } catch (error) {
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const minifigureData = { ...formData };
    for (const key in minifigureData) {
      if (
        !minifigureData[key] ||
        (typeof minifigureData[key] === "object" && !minifigureData[key].id)
      ) {
        delete minifigureData[key];
      }
    }

    if (minifigureToEdit) {
      axios
        .put(
          `http://localhost:8080/api/minifigures/${minifigureToEdit.id}`,
          minifigureData
        )
        .then(() => onFormSubmit())
        .catch((error) => console.error("Error updating minifigure:", error));
    } else {
      const newPhotoFilename = await uploadPhoto();
      const finalData = { ...minifigureData, photoFilename: newPhotoFilename };
      axios
        .post("http://localhost:8080/api/minifigures", finalData)
        .then(() => onFormSubmit())
        .catch((error) => console.error("Error adding minifigure:", error));
    }
  };

  const inputStyle =
    "shadow-sm appearance-none border rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500";
  const errorStyle = "text-red-500 text-xs mt-1";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-2xl max-h-full overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
          {minifigureToEdit ? "Edit Minifigure" : "Add New Minifigure"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Darth Vader"
                className={inputStyle}
              />
              {errors.name && <p className={errorStyle}>{errors.name}</p>}
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Theme
              </label>
              {isAddingNewTheme ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newThemeName}
                    onChange={(e) => setNewThemeName(e.target.value)}
                    placeholder="Enter new theme name"
                    className={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={handleAddNewTheme}
                    className="bg-green-500 text-white font-bold p-2 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewTheme(false)}
                    className="bg-gray-300 p-2 rounded-lg"
                  >
                    X
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    name="theme"
                    value={formData.theme.id}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    {themes.map((theme) => (
                      <option key={theme.id} value={theme.id}>
                        {theme.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setIsAddingNewTheme(true)}
                    className="bg-blue-500 text-white font-bold p-2 rounded-lg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Personal Number
              </label>
              <input
                name="personalNumber"
                value={formData.personalNumber}
                onChange={handleChange}
                placeholder="e.g., SW001"
                className={inputStyle}
              />
              {errors.personalNumber && (
                <p className={errorStyle}>{errors.personalNumber}</p>
              )}
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Quantity
              </label>
              <input
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                className={inputStyle}
              />
              {errors.quantity && (
                <p className={errorStyle}>{errors.quantity}</p>
              )}
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Release Date
              </label>
              <input
                name="releaseDate"
                value={formData.releaseDate}
                type="date"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                BrickLink Number
              </label>
              <input
                name="bricklinkNumber"
                value={formData.bricklinkNumber}
                onChange={handleChange}
                placeholder="e.g., sw0004"
                className={inputStyle}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Estimated Value ($)
              </label>
              <input
                name="estimatedValue"
                value={formData.estimatedValue}
                type="number"
                step="0.01"
                onChange={handleChange}
                placeholder="e.g., 25.50"
                className={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 text-sm font-semibold mb-1">
              Photo
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              disabled={!!minifigureToEdit}
              className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
            {minifigureToEdit && (
              <small className="text-xs text-gray-500">
                Photo cannot be changed while editing.
              </small>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Purchase Date
              </label>
              <input
                name="purchaseDate"
                value={formData.purchaseDate}
                type="date"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Purchase Price ($)
              </label>
              <input
                name="purchasePrice"
                value={formData.purchasePrice}
                type="number"
                step="0.01"
                onChange={handleChange}
                placeholder="e.g., 20.00"
                className={inputStyle}
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm font-semibold mb-1">
                Shipping Cost ($)
              </label>
              <input
                name="shippingCost"
                value={formData.shippingCost}
                type="number"
                step="0.01"
                onChange={handleChange}
                placeholder="e.g., 5.00"
                className={inputStyle}
              />
            </div>
          </div>
          <div>
            <label className="block text-slate-600 text-sm font-semibold mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any extra details..."
              rows="3"
              className={inputStyle}
            ></textarea>
          </div>
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-slate-800 font-bold py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
            >
              {minifigureToEdit ? "Save Changes" : "Add to Collection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddMinifigureForm;
