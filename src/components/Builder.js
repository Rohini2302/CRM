import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { 
  FaFont, FaTextHeight, FaCheckSquare, FaDotCircle, FaImage, FaUser, FaMapMarkedAlt,
  FaHashtag, FaEnvelope, FaLock, FaCaretDown, FaListAlt, FaCalendarAlt, FaClock,
  FaCalendarCheck, FaFileUpload, FaLink, FaPhone, FaSlidersH, FaToggleOn, FaPalette, FaPenFancy 
} from "react-icons/fa";
import './Builder.css';
import { database } from "../firebaseConfig";

const fieldOptions = [
  { type: "Name", label: "Name", icon: <FaUser /> },
  { type: "Address", label: "Address", icon: <FaMapMarkedAlt /> },
  { type: "EditText", label: "Text Input", icon: <FaFont /> },
  { type: "TextArea", label: "Text Area", icon: <FaTextHeight /> },
  { type: "Number", label: "Number Input", icon: <FaHashtag /> },
  { type: "Email", label: "Email Input", icon: <FaEnvelope /> },
  { type: "Password", label: "Password Input", icon: <FaLock /> },
  { type: "CheckBox", label: "Checkbox", icon: <FaCheckSquare /> },
  { type: "RadioButton", label: "Radio Button", icon: <FaDotCircle /> },
  { type: "Select", label: "Dropdown", icon: <FaCaretDown /> },
  { type: "MultiSelect", label: "Multi-Select", icon: <FaListAlt /> },
  { type: "Date", label: "Date Picker", icon: <FaCalendarAlt /> },
  { type: "Time", label: "Time Picker", icon: <FaClock /> },
  { type: "DateTime", label: "Date & Time Picker", icon: <FaCalendarCheck /> },
  { type: "ImagePicker", label: "Image Picker", icon: <FaImage /> },
  { type: "FileUpload", label: "File Upload", icon: <FaFileUpload /> },
  { type: "URL", label: "URL Input", icon: <FaLink /> },
  { type: "Phone", label: "Phone Number", icon: <FaPhone /> },
  { type: "Range", label: "Range Slider", icon: <FaSlidersH /> },
  { type: "Toggle", label: "Toggle Switch", icon: <FaToggleOn /> },
  { type: "ColorPicker", label: "Color Picker", icon: <FaPalette /> },
  { type: "Signature", label: "Signature Input", icon: <FaPenFancy /> }
];

const Builder = () => {
  const [formFields, setFormFields] = useState([]);
  const [formTitle, setFormTitle] = useState("");

  const addField = (type) => {
    let newFields = [];

    if (type === "Name") {
      newFields = [
        { id: Date.now(), type: "EditText", label: "First Name", placeholder: "Enter First Name" },
        { id: Date.now() + 1, type: "EditText", label: "Last Name", placeholder: "Enter Last Name" }
      ];
    } else if (type === "Address") {
      newFields = [
        { id: Date.now(), type: "EditText", label: "Street", placeholder: "Enter Street" },
        { id: Date.now() + 1, type: "EditText", label: "City", placeholder: "Enter City" },
        { id: Date.now() + 2, type: "EditText", label: "State", placeholder: "Enter State" },
        { id: Date.now() + 3, type: "EditText", label: "Pincode", placeholder: "Enter Pincode" }
      ];
    } else {
      newFields = [{ id: Date.now(), type, label: `Enter ${type} Label`, placeholder: "Enter Placeholder" }];
    }

    setFormFields([...formFields, { type, grouped: newFields }]); // Ensuring grouped is always an array
  };

  const updateField = (id, key, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.grouped
          ? {
              ...field,
              grouped: field.grouped.map((subField) =>
                subField.id === id ? { ...subField, [key]: value } : subField
              ),
            }
          : field
      )
    );
  };

  const saveFormToFirebase = () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title.");
      return;
    }

    const flatFields = formFields.flatMap(field => field.grouped);

    const formRef = push(ref(database, "forms"));
    set(formRef, { title: formTitle, fields: flatFields })
      .then(() => {
        alert("Form saved successfully!");
        setFormFields([]);
        setFormTitle("");
      })
      .catch((error) => {
        console.error("Error saving form:", error);
      });
  };

  return (
    <div className="form-builder-container">
      <div className="sidebar">
        <h3>Fields</h3>
        {fieldOptions.map((field) => (
          <div key={field.type} className="field-option" onClick={() => addField(field.type)}>
            {field.icon} {field.label}
          </div>
        ))}
      </div>

      <div className="form-area">
        <h3>Custom Form</h3>
        <input
          type="text"
          placeholder="Enter Form Title"
          value={formTitle}
          onChange={(e) => setFormTitle(e.target.value)}
          className="form-field"
        />
        {formFields.length === 0 ? (
          <p>Click a field to add it here</p>
        ) : (
          <div className="form-content">
            {formFields.map((field) => (
              <div key={field.type} className="field-group">
                <div className="row">
                  {field.grouped.map((subField) => (
                    <div key={subField.id} className="form-field">
                      <input
                        type="text"
                        value={subField.label}
                        onChange={(e) => updateField(subField.id, "label", e.target.value)}
                        className="label-input"
                      />
                      {(subField.type === "EditText" || subField.type === "TextArea") && (
                        <input
                          type="text"
                          placeholder={subField.placeholder}
                          onChange={(e) => updateField(subField.id, "placeholder", e.target.value)}
                          className="field-input"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <button className="submit-btn" onClick={saveFormToFirebase}>Save Form</button>
      </div>
    </div>
  );
};

export default Builder;
