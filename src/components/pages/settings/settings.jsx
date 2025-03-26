import React, { useEffect, useState } from "react";
import { ref, get, push, update } from "firebase/database";
import { database } from "../../../firebaseConfig";
import "./Settings.css";

const Settings = () => {
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);
  const [formData, setFormData] = useState({});
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const formRef = ref(database, "forms");
        const snapshot = await get(formRef);

        if (snapshot.exists()) {
          const formData = snapshot.val();
          const formArray = Object.values(formData);
          setForms(formArray);
          setSelectedForm(formArray[0]);
        }
      } catch (error) {
        console.error("Error fetching forms:", error);
      }
    };

    fetchForms();
  }, []);

  const handleChange = (e, fieldLabel) => {
    setFormData({ ...formData, [fieldLabel]: e.target.value });
  };

  const handleTabChange = (form) => {
    setAnimating(true);
    setTimeout(() => {
      setSelectedForm(form);
      setFormData({});
      setAnimating(false);
    }, 300); // Animation duration
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedForm) return;

    const formTitle = selectedForm.title;
    const formsRef = ref(database, "forms");

    try {
      const snapshot = await get(formsRef);
      const formsData = snapshot.val();

      if (formsData) {
        const matchingFormKey = Object.keys(formsData).find(
          (key) => formsData[key].title === formTitle
        );

        if (matchingFormKey) {
          const formSubmissionsRef = ref(database, `forms/${matchingFormKey}/submissions`);
          const newEntryRef = push(formSubmissionsRef);

          await update(newEntryRef, formData);
          alert("Form submitted successfully!");
          setFormData({});
        } else {
          alert("Error: Form title not found in the database.");
        }
      } else {
        alert("Error: No forms found in the database.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className="form-builder-container">
      {/* Tab Navigation */}
      <div className="tabs-container">
        <div className="tabs">
          {forms.map((form, index) => (
            <button
              key={index}
              className={`tab ${selectedForm?.title === form.title ? "active" : ""}`}
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
                {selectedForm.fields.map((field, index) => (
                  <div key={index} className="form-field">
                    <label>{field.label}</label>
                    <input
                      type={field.type === "Password" ? "password" : "text"}
                      placeholder={field.placeholder}
                      value={formData[field.label] || ""}
                      onChange={(e) => handleChange(e, field.label)}
                      required
                    />
                  </div>
                ))}
              </div>
              <button className="submit-btn" type="submit">
                Submit
              </button>
            </form>
          </>
        ) : (
          <p>Loading forms...</p>
        )}
      </div>
    </div>
  );
};

export default Settings;
