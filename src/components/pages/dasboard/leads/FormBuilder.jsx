import { useState } from "react";
import { useLocation,useNavigate } from "react-router-dom";
import "./FormBuilder.css";
import { Trash, Eye,  User, Home, Phone, Mail, FileText, Hash, DollarSign, FunctionSquare,  Upload ,Menu,ArrowLeft} from "lucide-react";

const fieldOptions = [
  { type: "name", label: "Name", fields: ["First Name", "Last Name"], icon: <User size={24} /> },
  { type: "address", label: "Address", fields: ["Street Address","Address Line 2", "City", "State", "Zip Code","Country"], icon: <Home size={24} /> },
  { type: "phone", label: "Phone", fields: ["Phone Number"], icon: <Phone size={24} /> },
  { type: "email", label: "Email", fields: ["Email Address"], icon: <Mail size={24} /> },
];

const textOptions = [
  { type: "singleLine", label: "Single Line", fields: ["Text Input"], icon: <FileText size={24} /> },
  { type: "multiLine", label: "Multi Line", fields: ["Textarea"], icon: <FileText size={24} /> },
];

const numberOptions = [
  { type: "number", label: "Number", fields: ["Numeric Input"], icon: <Hash size={24} /> },
  { type: "decimal", label: "Decimal", fields: ["Decimal Input"], icon: <DollarSign size={24} /> },
  { type: "formula", label: "Formula", fields: ["Formula Calculation"], icon: <FunctionSquare size={24} /> },
];

const choiceOptions = [
  // { type: "checkbox", label: "Checkbox", fields: ["Select Options"], icon: <CheckSquare size={24} /> },
  // { type: "radio", label: "Radio", fields: ["Choose One"], icon: <Radio size={24} /> },
  { type: "imagePicker", label: "Image Picker", fields: ["Upload Image"], icon: <Upload size={24} /> },
];

export default function FormBuilder() {
  const location = useLocation();
  const formTitle = location.state?.formTitle || "Untitled Form";
  const [formFields, setFormFields] = useState([]);
  const [preview, setPreview] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate(); // Define navigate before using it


  const addField = (type) => {
    const field = [...fieldOptions, ...textOptions, ...numberOptions, ...choiceOptions].find((f) => f.type === type);
    if (field) {
      setFormFields([
        ...formFields, 
        { 
          ...field, 
          id: Date.now(), 
          subFields: field.fields,
          selectedFile: null
        }
      ]);
    }
  };
  

  const confirmDeleteField = (id) => {
    setFieldToDelete(id);
    setShowDeleteConfirmation(true);
  };

  const removeField = () => {
    setFormFields(formFields.filter((field) => field.id !== fieldToDelete));
    setShowDeleteConfirmation(false);
    setFieldToDelete(null);
  };

  const removeSubField = (fieldId, subFieldIndex) => {
    setFormFields(formFields.map(field => {
      if (field.id === fieldId) {
        return { 
          ...field, 
          subFields: field.subFields.filter((_, index) => index !== subFieldIndex)
        };
      }
      return field;
    }));
  };
  
  const filteredOptions = (options) => {
    return options.filter(option => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
  };


  return (
    <div className="container1">
       
     <button className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={24} />
      </button>
      
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* <div className="search-container">
          <Search className="search-icon" size={16} />
          <input 
              type="text"
              className="search-bar"
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div> */}
        <button className="back-button" onClick={() => navigate("/")}>
        <ArrowLeft size={24} /> Back
      </button>
     

        <h2>Basic Info</h2>
        <div className="sidebar-buttons">
          {filteredOptions(fieldOptions).map((option) => (
            <button key={option.type} className="button" onClick={() => addField(option.type)}>
              <span className="button-icon">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        <h2>Text</h2>
        <div className="sidebar-buttons">
          {filteredOptions(textOptions).map((option) => (
            <button key={option.type} className="button" onClick={() => addField(option.type)}>
              <span className="button-icon">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        <h2>Number</h2>
        <div className="sidebar-buttons">
          {filteredOptions(numberOptions).map((option) => (
            <button key={option.type} className="button" onClick={() => addField(option.type)}>
              <span className="button-icon">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        <h2>Choices</h2>
        <div className="sidebar-buttons">
          {filteredOptions(choiceOptions).map((option) => (
            <button key={option.type} className="button" onClick={() => addField(option.type)}>
              <span className="button-icon">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="form-builder">
        <h2>{formTitle}</h2>
        <div className="form-container">
          {formFields.length === 0 && <p className="no-fields">Drag fields from the left panel and drop here.</p>}
          {formFields.map((field) => (
            <div key={field.id} className="form-field">
              <div className="field-header">
                <h3>{field.label}</h3>
                <button className="delete-button1" onClick={() => confirmDeleteField(field.id)}>
                  <Trash size={16} />
                </button>
              </div>

              {field.type === "imagePicker" ? (
                <div className="image-picker">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      setFormFields(formFields.map(f => f.id === field.id ? { ...f, selectedFile: file.name } : f));
                    }} 
                  />
                  {field.selectedFile && <p>Uploaded: {field.selectedFile}</p>}
                </div>
              ) : field.type === "multiLine" ? (
                <textarea placeholder="Enter text here..." className="textarea-field"></textarea>
              ) : (
                field.subFields.map((subField, index) => (
                  <div key={index} className="sub-field-container">
                    <input placeholder={subField} className="input-field" />
                    <button className="sub-field-delete-button" onClick={() => removeSubField(field.id, index)}>
                    <Trash size={16} /></button>
                    
                  </div>
                ))
              )}
              

            </div>
          ))}
        </div>

        <button className="access-form-button" onClick={() => setPreview(true)}>
          <Eye className="icon" size={16} /> Preview Form
        </button>
      </div>

      {preview && (
        <div className="modal-overlay">
          <div className="preview-modal">
            <h2>{formTitle}</h2>
            {formFields.map((field) => (
              <div key={field.id} className="preview-field">
                <h3>{field.label}</h3>
                {field.type === "multiLine" ? (
                  <textarea className="textarea-field" placeholder="Enter text here..."></textarea>
                ) : field.type === "imagePicker" ? (
                  <div className="image-picker">
                    <input type="file" accept="image/*" />
                  </div>
                ) : field.subFields.map((subField, index) => (
                  <input key={index} placeholder={subField} className="input-field" />
                ))}
              </div>
            ))}
            <div className="button-container">
              <button className="submit-button">Submit</button>
              <button className="close-button" onClick={() => setPreview(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirmation && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Are you sure you want to delete this field?</h2>
            <button className="delete-button2" onClick={removeField}>Yes, Delete</button>
            <button className="close-button" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
