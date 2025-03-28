import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { database } from "../../../firebaseConfig";
import { ref, push, onValue, set } from "firebase/database";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import "./Leads.css";

const Leads = () => {
  const [excelFiles, setExcelFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [previewData, setPreviewData] = useState([]);
  const [previewModal, setPreviewModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "upload" or "export"
  const [fileName, setFileName] = useState(""); // Store file name before upload

  useEffect(() => {
    const fetchExcelFiles = () => {
      const userUID = localStorage.getItem("firebaseUserUID");
      if (!userUID) return;
  
      const userLeadsRef = ref(database, `users/${userUID}/excelFiles`);
      
      onValue(userLeadsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const files = Object.keys(data).map((key) => ({ 
            id: key, 
            ...data[key] 
          }));
          setExcelFiles(files);
          setSelectedFile(files[0]?.id || null);
        } else {
          setExcelFiles([]);
          setSelectedFile(null);
        }
      });
    };
  
    fetchExcelFiles();
  }, []);
  // Handle file selection and preview before upload
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Swal.fire({
      title: "Enter File Name",
      input: "text",
      inputPlaceholder: "Enter a name for the file",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      preConfirm: (inputValue) => {
        if (!inputValue.trim()) {
          Swal.showValidationMessage("File name cannot be empty!");
        }
        return inputValue.trim();
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setFileName(result.value);

        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
              Swal.fire("Error!", "Selected file is empty!", "error");
              return;
            }

            setPreviewData(jsonData);
            setPreviewModal(true);
            setActionType("upload");
          } catch (error) {
            console.error("Preview Error:", error);
            Swal.fire("Error!", "Failed to read Excel file", "error");
          }
        };
        reader.readAsArrayBuffer(file);
      }
    });
  };

  const handleFileUpload = () => {
    if (!previewData.length || !fileName) return;
  
    // Get current user's UID
    const userUID = localStorage.getItem("firebaseUserUID");
    if (!userUID) {
      Swal.fire("Error!", "You must be logged in to upload files", "error");
      return;
    }
  
    setUploadLoading(true);
    
    // Create reference under user's excelFiles node
    const userExcelFilesRef = ref(database, `users/${userUID}/excelFiles`);
    const newFileRef = push(userExcelFilesRef);
  
    set(newFileRef, { 
      name: fileName, 
      data: previewData,
      uploadedAt: new Date().toISOString(), // Add timestamp
      uploadedBy: userUID // Optional: track who uploaded it
    })
      .then(() => {
        Swal.fire("Success!", "Excel file uploaded successfully", "success");
      })
      .catch((error) => {
        console.error("Upload Error:", error);
        Swal.fire("Error!", "Failed to upload Excel file", "error");
      })
      .finally(() => {
        setUploadLoading(false);
        setPreviewModal(false);
        setPreviewData([]);
        setFileName("");
      });
  };
  // Preview selected file before export
  const handleExportPreview = () => {
    const file = excelFiles.find((f) => f.id === selectedFile);
    if (!file || !file.data.length) {
      Swal.fire("Error!", "No data available for export", "error");
      return;
    }
    setPreviewData(file.data);
    setPreviewModal(true);
    setActionType("export");
  };

  // Export selected file to Excel
  const exportToExcel = () => {
    if (!previewData.length) return;

    setExportLoading(true);
    try {
      const worksheet = XLSX.utils.json_to_sheet(previewData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Leads");
      XLSX.writeFile(workbook, `${fileName || "Exported_File"}.xlsx`);

      Swal.fire("Success!", "Excel file downloaded successfully", "success");
    } catch (error) {
      console.error("Excel Export Error:", error);
      Swal.fire("Error!", "Failed to generate Excel file", "error");
    } finally {
      setExportLoading(false);
      setPreviewModal(false);
      setPreviewData([]);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Lead List</h2>
      <div className="mb-3">
        <label className="btn btn-primary">
          {uploadLoading ? "Uploading..." : "Upload Excel File"}
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileSelect}
            className="d-none"
            disabled={uploadLoading}
          />
        </label>

        <button
          className="btn btn-success ms-2"
          onClick={handleExportPreview}
          disabled={exportLoading || !selectedFile}
        >
          {exportLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Exporting...
            </>
          ) : (
            "Export Excel"
          )}
        </button>
      </div>

      {/* Tabs for uploaded Excel files */}
      <ul className="nav nav-tabs">
        {excelFiles.map((file) => (
          <li className="nav-item" key={file.id}>
            <button
              className={`nav-link ${selectedFile === file.id ? "active" : ""}`}
              onClick={() => setSelectedFile(file.id)}
            >
              {file.name}
            </button>
          </li>
        ))}
      </ul>

      {/* Display selected Excel file in a table */}
      <div className="table-responsive mt-3">
        {excelFiles.map(
          (file) =>
            selectedFile === file.id && (
              <table key={file.id} className="table table-bordered">
                <thead>
                  <tr>
                    {Object.keys(file.data[0] || {}).map((col, index) => (
                      <th key={index}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {file.data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {Object.keys(row).map((col, colIndex) => (
                        <td key={colIndex}>{row[col] || "-"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )
        )}
      </div>

      {/* Preview Modal */}
{previewModal && (
  <div className="modal fade show d-block" tabIndex="-1">
    <div className="modal-dialog modal-lg">
      <div className="modal-content">
        
        {/* Modal Header with Top-Right Buttons */}
        <div className="modal-header">
          <h5 className="modal-title">
            {actionType === "upload" ? "Preview File Before Uploading" : "Preview File Before Exporting"}
          </h5>
          <div className="modal-buttons">
            <button className="btn btn-secondary" onClick={() => setPreviewModal(false)}>Close</button>
            {actionType === "upload" ? (
              <button className="btn btn-primary" onClick={handleFileUpload}>Confirm Upload</button>
            ) : (
              <button className="btn btn-success" onClick={exportToExcel}>Confirm Export</button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  {Object.keys(previewData[0] || {}).map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {Object.keys(row).map((col, colIndex) => (
                      <td key={colIndex}>{row[col] || "-"}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Leads;
