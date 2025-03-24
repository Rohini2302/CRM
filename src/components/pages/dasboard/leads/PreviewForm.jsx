import { useEffect, useState } from "react";
import "../leads/PreviewForm.css";

export default function PreviewForm() {
  const [forms, setForms] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  // Fetch stored forms when the component mounts
  useEffect(() => {
    const storedForms = JSON.parse(localStorage.getItem("previewForms")) || [];

    if (storedForms.length > 0) {
      setForms(storedForms);
      initializeFormValues(storedForms[0]); // Initialize first form
    } else {
      console.warn("No forms found in localStorage.");
    }
  }, []);

  // Initialize form values
  const initializeFormValues = (form) => {
    if (!form) return;

    const initialValues = {};
    form.formFields.forEach((field) => {
      if (field.type === "multiLine") {
        initialValues[field.id] = "";
      } else if (field.type === "imagePicker") {
        initialValues[field.id] = null;
      } else {
        initialValues[field.id] = field.subFields.map(() => "");
      }
    });
    setFormValues(initialValues);
    setErrors({});
  };

  // Handle switching tabs
  const handleTabChange = (index) => {
    setActiveTab(index);
    initializeFormValues(forms[index]);
  };

//   // Handle input changes
//   const handleInputChange = (fieldId, value, index = null) => {
//     setFormValues((prev) => {
//       const updatedValues = { ...prev };
//       if (index !== null) {
//         updatedValues[fieldId][index] = value;
//       } else {
//         updatedValues[fieldId] = value;
//       }
//       return updatedValues;
//     });

//     // Clear errors when user starts typing
//     setErrors((prev) =>
//       index !== null
//         ? { ...prev, [fieldId]: { ...prev[fieldId], [index]: "" } }
//         : { ...prev, [fieldId]: "" }
//     );
//   };

  // Validate form before submission
  const validateForm = () => {
    let validationErrors = {};
    const activeForm = forms[activeTab];

    if (!activeForm) return false;

    activeForm.formFields.forEach((field) => {
      if (field.type === "multiLine" && !formValues[field.id]?.trim()) {
        validationErrors[field.id] = `${field.label} is required`;
      } else if (field.type === "imagePicker" && !formValues[field.id]) {
        validationErrors[field.id] = `Please upload an image`;
      } else {
        let subFieldErrors = {};
        formValues[field.id]?.forEach((value, index) => {
          if (!value.trim()) {
            subFieldErrors[index] = `This field is required`;
          }
        });

        if (Object.keys(subFieldErrors).length > 0) {
          validationErrors[field.id] = subFieldErrors;
        }
      }
    });

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    const submittedData = {
      formTitle: activeForm.formTitle,
      formValues: formValues,
      submittedAt: new Date().toISOString(),
    };
  
    // Retrieve previous submissions
    let previousSubmissions = JSON.parse(localStorage.getItem("submittedForms")) || [];
  
    // Add the new submission
    previousSubmissions.push(submittedData);
  
    // Save updated submissions
    localStorage.setItem("submittedForms", JSON.stringify(previousSubmissions));
  
    console.log("✅ Form Submitted:", submittedData);
  
    setSubmitted(true);
    setShowPopup(true);
    alert("Form Submitted")
    // console.log("Popup should be visible:", showPopup); 
  
    // Reset the form values after submission
    initializeFormValues(activeForm);
  
    // Show popup for 2 seconds then hide it
    setTimeout(() => {
      setShowPopup(false);
      console.log("Popup should be hidden now"); // Debugging log
    }, 2000);
  };
  

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setSubmitted(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);


 // Handle input changes
const handleInputChange = (fieldId, value, index = null) => {
    setFormValues((prev) => {
      const updatedValues = { ...prev };
  
      if (index !== null) {
        updatedValues[fieldId][index] = value;
      } else {
        if (value instanceof File) {
          // Convert image to URL for preview
          updatedValues[fieldId] = URL.createObjectURL(value);
        } else {
          updatedValues[fieldId] = value;
        }
      }
  
      return updatedValues;
    });
  
    // Clear errors when user starts typing
    setErrors((prev) =>
      index !== null
        ? { ...prev, [fieldId]: { ...prev[fieldId], [index]: "" } }
        : { ...prev, [fieldId]: "" }
    );
  };
  
  
    if (forms.length === 0) {
    return (
      <div className="no-forms-message">
        <p>🚀 No forms available. Please add a form first!</p>
      </div>
    );
  }

  const activeForm = forms[activeTab];

  return (
    <div className="preview-container3">
      {/* 🔹 Tabs */}
      <div className="tabs">
        {forms.map((form, index) => (
          <button
            key={index}
            className={`tab-button ${index === activeTab ? "active" : ""}`}
            onClick={() => handleTabChange(index)}
          >
            {form.formTitle || `Form ${index + 1}`}
          </button>
        ))}
      </div>
  
      {/* 🔹 Form Display */}
      <div className={`form-containers ${submitted ? "submitted" : ""}`}>
        <form className="form-card" onSubmit={handleSubmit}>
          <h2 className="form-title">{activeForm.formTitle}</h2>
  
          {activeForm.formFields.map((field) => (
            <div key={field.id} className="form-field">
              <label className="field-label">{field.label}</label>
  
              {field.type === "multiLine" ? (
                <>
                  <textarea
                    className="textarea-field"
                    placeholder="Enter text here..."
                    value={formValues[field.id] || ""}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                  />
                  {errors[field.id] && <p className="error-text">{errors[field.id]}</p>}
                </>
              ) : field.type === "imagePicker" ? (
                <>
                  <input
                    type="file"
                    className="file-input"
                    accept="image/*"
                    onChange={(e) => handleInputChange(field.id, e.target.files[0])}
                  />
                  {errors[field.id] && <p className="error-text">{errors[field.id]}</p>}
                </>
              ) : (
                <>
                  {field.subFields.map((subField, index) => (
                    <div key={index}>
                      <input
                        placeholder={subField}
                        className="input-field"
                        value={formValues[field.id]?.[index] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value, index)}
                      />
                      {errors[field.id]?.[index] && (
                        <p className="error-text">{errors[field.id][index]}</p>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          ))}
  
          <div className="submit-button-container">
            <button type="submit" className="submit-button2">Submit Form</button>
          </div>
        </form>
      </div>
    </div>
  );
  
}
