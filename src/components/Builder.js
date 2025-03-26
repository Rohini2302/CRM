import React, { useState } from "react";
import { ref, push, set } from "firebase/database";
import { 
  FaFont, FaTextHeight, FaCheckSquare, FaDotCircle, FaImage, FaUser, FaMapMarkedAlt,
  FaHashtag, FaEnvelope, FaLock, FaCaretDown, FaListAlt, FaCalendarAlt, FaClock,
  FaCalendarCheck, FaFileUpload, FaLink, FaPhone, FaSlidersH, FaToggleOn, FaPalette, FaPenFancy 
} from "react-icons/fa";
import './Builder.css';
import { database } from "../firebaseConfig";
import { Link } from "react-router-dom";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addField = (type) => {
    let newFields = [];

    if (type === "Name") {
      newFields = [
        { id: Date.now(), type: "text", label: "First Name", placeholder: "Enter First Name" },
        { id: Date.now() + 1, type: "text", label: "Last Name", placeholder: "Enter Last Name" }
      ];
    } else if (type === "Address") {
      newFields = [
        { id: Date.now(), type: "text", label: "Street", placeholder: "Enter Street" },
        { id: Date.now() + 1, type: "text", label: "City", placeholder: "Enter City" },
        { id: Date.now() + 2, type: "text", label: "State", placeholder: "Enter State" },
        { id: Date.now() + 3, type: "text", label: "Pincode", placeholder: "Enter Pincode" }
      ];
    } else if (type === "Select" || type === "MultiSelect" || type === "RadioButton" || type === "CheckBox") {
      newFields = [{ id: Date.now(), type, label: type, options: ["Option 1", "Option 2", "Option 3"] }];
    } else if (type === "Range") {
      newFields = [{ 
        id: Date.now(), 
        type, 
        label: type, 
        min: 0, 
        max: 100, 
        step: 1, 
        defaultValue: 50 
      }];
    } else if (type === "DateTime") {
      newFields = [{ 
        id: Date.now(), 
        type, 
        label: type,
        dateFormat: "YYYY-MM-DD",
        timeFormat: "HH:mm",
        showTime: true
      }];
    } else if (type === "Toggle") {
      newFields = [{ 
        id: Date.now(), 
        type, 
        label: type,
        defaultValue: false,
        onLabel: "On",
        offLabel: "Off"
      }];
    } else {
      newFields = [{ id: Date.now(), type, label: type, placeholder: "Enter Placeholder" }];
    }

    setFormFields([...formFields, ...newFields]);
  };

  const updateField = (id, key, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) => (field.id === id ? { ...field, [key]: value } : field))
    );
  };

  const updateOptions = (id, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, options: value.split(",") } : field
      )
    );
  };

  const updateRangeSettings = (id, key, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [key]: Number(value) } : field
      )
    );
  };

  const updateDateTimeSettings = (id, key, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const updateToggleSettings = (id, key, value) => {
    setFormFields((prevFields) =>
      prevFields.map((field) =>
        field.id === id ? { ...field, [key]: value } : field
      )
    );
  };

  const saveFormToFirebase = () => {
    if (!formTitle.trim()) {
      alert("Please enter a form title.");
      return;
    }

    const formRef = push(ref(database, "forms"));
    set(formRef, { title: formTitle, fields: formFields })
      .then(() => {
        alert("Form saved successfully!");
        setFormFields([]);
        setFormTitle("");
      })
      .catch((error) => {
        console.error("Error saving form:", error);
      });
  };

  const renderFieldInput = (field) => {
    switch (field.type) {
      case "TextArea":
        return <textarea placeholder={field.placeholder}></textarea>;
      
      case "Select":
        return (
          <div>
            <select>
              {field.options.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Edit options (comma-separated)"
              onChange={(e) => updateOptions(field.id, e.target.value)}
            />
          </div>
        );
      
      case "MultiSelect":
        return (
          <div>
            <select multiple>
              {field.options.map((option, index) => (
                <option key={index}>{option}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Edit options (comma-separated)"
              onChange={(e) => updateOptions(field.id, e.target.value)}
            />
          </div>
        );
      
      case "RadioButton":
        return (
          <div>
            {field.options.map((option, index) => (
              <div key={index}>
                <input type="radio" name={`radio-${field.id}`} id={`radio-${field.id}-${index}`} />
                <label htmlFor={`radio-${field.id}-${index}`}>{option}</label>
              </div>
            ))}
            <input
              type="text"
              placeholder="Edit options (comma-separated)"
              onChange={(e) => updateOptions(field.id, e.target.value)}
            />
          </div>
        );
      
      case "CheckBox":
        return (
          <div>
            {field.options.map((option, index) => (
              <div key={index}>
                <input type="checkbox" id={`checkbox-${field.id}-${index}`} />
                <label htmlFor={`checkbox-${field.id}-${index}`}>{option}</label>
              </div>
            ))}
            <input
              type="text"
              placeholder="Edit options (comma-separated)"
              onChange={(e) => updateOptions(field.id, e.target.value)}
            />
          </div>
        );
      
      case "Range":
        return (
          <div>
            <input 
              type="range" 
              min={field.min} 
              max={field.max} 
              step={field.step} 
              defaultValue={field.defaultValue}
            />
            <div className="range-settings">
              <label>
                Min:
                <input 
                  type="number" 
                  value={field.min} 
                  onChange={(e) => updateRangeSettings(field.id, "min", e.target.value)} 
                />
              </label>
              <label>
                Max:
                <input 
                  type="number" 
                  value={field.max} 
                  onChange={(e) => updateRangeSettings(field.id, "max", e.target.value)} 
                />
              </label>
              <label>
                Step:
                <input 
                  type="number" 
                  value={field.step} 
                  onChange={(e) => updateRangeSettings(field.id, "step", e.target.value)} 
                />
              </label>
            </div>
          </div>
        );
      
      case "ImagePicker":
        return (
          <div>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => updateField(field.id, "value", e.target.files[0])}
            />
          </div>
        );
      
      case "FileUpload":
        return (
          <div>
            <input 
              type="file" 
              onChange={(e) => updateField(field.id, "value", e.target.files[0])}
            />
          </div>
        );
      
      case "ColorPicker":
        return (
          <div>
            <input 
              type="color" 
              onChange={(e) => updateField(field.id, "value", e.target.value)}
            />
          </div>
        );
      
      case "Date":
        return (
          <div>
            <input 
              type="date" 
              onChange={(e) => updateField(field.id, "value", e.target.value)}
            />
          </div>
        );
      
      case "Time":
        return (
          <div>
            <input 
              type="time" 
              onChange={(e) => updateField(field.id, "value", e.target.value)}
            />
          </div>
        );
      
      case "DateTime":
        return (
          <div>
            <input 
              type="datetime-local" 
              onChange={(e) => updateField(field.id, "value", e.target.value)}
            />
            <div className="datetime-settings">
              <label>
                Date Format:
                <select 
                  value={field.dateFormat} 
                  onChange={(e) => updateDateTimeSettings(field.id, "dateFormat", e.target.value)}
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                </select>
              </label>
              <label>
                Time Format:
                <select 
                  value={field.timeFormat} 
                  onChange={(e) => updateDateTimeSettings(field.id, "timeFormat", e.target.value)}
                >
                  <option value="HH:mm">24-hour</option>
                  <option value="hh:mm A">12-hour</option>
                </select>
              </label>
              <label>
                Show Time:
                <input 
                  type="checkbox" 
                  checked={field.showTime} 
                  onChange={(e) => updateDateTimeSettings(field.id, "showTime", e.target.checked)}
                />
              </label>
            </div>
          </div>
        );
      
      case "Toggle":
        return (
          <div className="toggle-container">
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                defaultChecked={field.defaultValue}
                onChange={(e) => updateField(field.id, "defaultValue", e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
            <div className="toggle-settings">
              <label>
                On Label:
                <input
                  type="text"
                  value={field.onLabel}
                  onChange={(e) => updateToggleSettings(field.id, "onLabel", e.target.value)}
                />
              </label>
              <label>
                Off Label:
                <input
                  type="text"
                  value={field.offLabel}
                  onChange={(e) => updateToggleSettings(field.id, "offLabel", e.target.value)}
                />
              </label>
            </div>
          </div>
        );
      
      default:
        return <input type={field.type} placeholder={field.placeholder} />;
    }
  };

  return (
    
     <div className="form-builder-container">
       {/* Hamburger menu for mobile */}
       <button className="hamburger" onClick={toggleSidebar}>
  ☰
</button>
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
      <div className="sidebar-header1">
    <button className="back-button"><Link to={"/"}>Back</Link></button>
    <button className="close-button" onClick={toggleSidebar}>✖</button>
  </div>
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
              <div key={field.id} className="form-field">
                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => updateField(field.id, "label", e.target.value)}
                  className="label-input"
                />
                {renderFieldInput(field)}
              </div>
            ))}
          </div>
        )}
        <button className="submit-btn" onClick={saveFormToFirebase}>Submit</button>
      </div>
    </div>
  );
};

export default Builder;