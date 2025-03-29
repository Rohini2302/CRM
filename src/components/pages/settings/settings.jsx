import React, { useEffect, useState } from "react";
import { set,ref, get, push, update } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./Settings.css";

const Settings = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [animating, setAnimating] = useState(false);
  const [filePreviews, setFilePreviews] = useState({});

  useEffect(() => {
    const fetchForms = async () => {
      try {
        // Get current user's UID
        const userUID = localStorage.getItem("firebaseUserUID");
        
        if (!userUID) {
          console.log("No user logged in");
          return;
        }
  
        // Reference to the user's forms
        const userFormsRef = ref(database, `users/${userUID}/forms`);
        const snapshot = await get(userFormsRef);
  
        if (snapshot.exists()) {
          const formData = snapshot.val();
          const formArray = Object.entries(formData).map(([key, value]) => ({
            id: key,
            ...value
          })).reverse();
          setForms(formArray);
if (formArray.length > 0) {
  setSelectedForm(formArray[0]); // Select the latest form
}
        } else {
          setForms([]); // Set empty array if no forms exist
          setSelectedForm(null);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };
  
    fetchForms();
  }, []);

  const handleChange = (e, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field.label]: value
    }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create preview for images
    if (field.type === "ImagePicker" && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFilePreviews(prev => ({
          ...prev,
          [field.label]: event.target.result
        }));
      };
      reader.readAsDataURL(file);
    }

    setFormData(prev => ({
      ...prev,
      [field.label]: file.name // Store file name or you could store the file object
    }));
  };

  const handleCheckboxChange = (e, field, option) => {
    const { checked } = e.target;
    setFormData(prev => {
      const currentValues = prev[field.label] || [];
      return {
        ...prev,
        [field.label]: checked
          ? [...currentValues, option]
          : currentValues.filter(item => item !== option)
      };
    });
  };

  const handleTabChange = (form) => {
    setAnimating(true);
    setTimeout(() => {
      setSelectedForm(form);
      setFormData({});
      setFilePreviews({});
      setAnimating(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedForm) return;
  
    try {
      // Get current user's UID
      const userUID = localStorage.getItem("firebaseUserUID");
      if (!userUID) {
        alert("You must be logged in to submit forms.");
        return;
      }
  
      // Create reference under user's forms and submissions
      const userFormSubmissionsRef = ref(
        database, 
        `users/${userUID}/forms/${selectedForm.id}/submissions`
      );
      const newEntryRef = push(userFormSubmissionsRef);
  
      // Include additional metadata with the submission
      await set(newEntryRef, {
        ...formData,
        submittedAt: new Date().toISOString(),
        submittedBy: userUID
      });
  
      alert("Form submitted successfully!");
      setFormData({});
      setFilePreviews({});
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };
  const renderFieldInput = (field) => {
    switch (field.type) {
      case "TextArea":
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          />
        );

      case "Select":
        return (
          <select
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          >
            <option value="">Select an option</option>
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "MultiSelect":
        return (
          <select
            multiple
            value={formData[field.label] || []}
            onChange={(e) => {
              const options = Array.from(e.target.selectedOptions, option => option.value);
              setFormData(prev => ({ ...prev, [field.label]: options }));
            }}
          >
            {field.options?.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "RadioButton":
        return (
          <div className="radio-group">
            {field.options?.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  checked={formData[field.label] === option}
                  onChange={(e) => handleChange(e, field)}
                  required
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "CheckBox":
        return (
          <div className="checkbox-group">
            {field.options?.map((option, i) => (
              <label key={i}>
                <input
                  type="checkbox"
                  value={option}
                  checked={formData[field.label]?.includes(option) || false}
                  onChange={(e) => handleCheckboxChange(e, field, option)}
                />
                {option}
              </label>
            ))}
          </div>
        );

      case "ImagePicker":
        return (
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, field)}
            />
            {filePreviews[field.label] && (
              <img 
                src={filePreviews[field.label]} 
                alt="Preview" 
                className="image-preview"
              />
            )}
          </div>
        );

      case "FileUpload":
        return (
          <div>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, field)}
            />
            {formData[field.label] && (
              <div className="file-name">{formData[field.label]}</div>
            )}
          </div>
        );

      case "ColorPicker":
        return (
          <input
            type="color"
            value={formData[field.label] || "#000000"}
            onChange={(e) => handleChange(e, field)}
          />
        );

      case "Date":
        return (
          <input
            type="date"
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          />
        );

      case "Time":
        return (
          <input
            type="time"
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          />
        );

      case "DateTime":
        return (
          <input
            type="datetime-local"
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          />
        );

      case "Range":
        return (
          <div>
            <input
              type="range"
              min={field.min || 0}
              max={field.max || 100}
              step={field.step || 1}
              value={formData[field.label] || field.defaultValue || 50}
              onChange={(e) => handleChange(e, field)}
            />
            <div className="range-value">
              {formData[field.label] || field.defaultValue || 50}
            </div>
          </div>
        );

      case "Toggle":
        return (
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={formData[field.label] || false}
              onChange={(e) => 
                setFormData(prev => ({ ...prev, [field.label]: e.target.checked }))
              }
            />
            <span className="slider round"></span>
          </label>
        );

      case "Password":
        return (
          <input
            type="password"
            placeholder={field.placeholder}
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          />
        );

      default:
        return (
          <input
            type={field.type === "Number" ? "number" : "text"}
            placeholder={field.placeholder}
            value={formData[field.label] || ""}
            onChange={(e) => handleChange(e, field)}
            required
          />
        );
    }
  };

  return (
    <div className="form-builder-container">
      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs">
          {forms.map((form, index) => (
            <button
              key={form.id || index}
              className={`tab ${selectedForm?.id === form.id ? "active" : ""}`}
              onClick={() => handleTabChange(form)}
            >
              {form.title}
            </button>
          ))}
        </div>
      </div>

      {/* Animated Form Container */}
      <div className={`form-area ${animating ? "animating" : ""}`}>
        {selectedForm ? (
          <>
            <h2 className="form-title">{selectedForm.title}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {selectedForm.fields?.map((field, index) => (
                  <div key={index} className={`form-field ${field.type}`}>
                    <label>{field.label}</label>
                    {renderFieldInput(field)}
                  </div>
                ))}
              </div>
              <button className="submit-btn" type="submit">
                Submit
              </button>
            </form>
          </>
        ) : (
          <p>No forms available. Please create a form first.</p>
        )}
      </div>
    </div>
  );
};

export default Settings;