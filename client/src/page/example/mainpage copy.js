// import { useState, useEffect } from "react";
// import axios from "axios";
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import 'boxicons/css/boxicons.min.css';
// // import UploadCourseDialog from "../component/UploadCourse";
// import CustomButton from "../../compounds/button";
// import DataTable from "../../compounds/tables/data-table";
// import '../../index.css';

// const API_BASE_URL = "http://localhost:8080/api";

// const EditInput = ({ value, onChange, name }) => (
//   <input
//     type="text"
//     name={name}
//     value={value || ''}
//     onChange={onChange}
//     className="border rounded px-2 py-1 w-full shadow-sm border-gray-300 bg-white"
//   />
// );

// const EditSelect = ({ value, onChange, name, options }) => (
//   <select
//     name={name}
//     value={value || ''}
//     onChange={onChange}
//     className="border rounded px-2 py-1 w-full shadow-sm border-gray-300 bg-white"
//   >
//     <option value="" disabled>Select...</option>
//     {options.map(option => (
//       <option key={option.value} value={option.value}>{option.label}</option>
//     ))}
//   </select>
// );

// function BasicExample() {
//   const [userData, setUserData] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showUploadDialog, setShowUploadDialog] = useState(false);
//   const [editingId, setEditingId] = useState(null);
//   const [editedUser, setEditedUser] = useState({});

//   useEffect(() => {
//     // Fetch both users and departments data when the component mounts
//     const fetchInitialData = async () => {
//       setLoading(true);
//       try {
//         const [usersRes, deptsRes] = await Promise.all([
//           axios.get(`${API_BASE_URL}/users`),
//           axios.get(`${API_BASE_URL}/departments`)
//         ]);
//         setUserData(usersRes.data || []);
//         setDepartments(deptsRes.data || []);
//       } catch (err) {
//         console.error("Failed to fetch initial data:", err);
//         toast.error("Failed to fetch data from server.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchInitialData();
//   }, []);

//   const fetchUserData = () => {
//     // This function can be used to refresh just the user list after an update/upload
//     axios.get(`${API_BASE_URL}/users`)
//       .then((res) => {
//         setUserData(res.data || []);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch user data:", err);
//         toast.error("Failed to refresh user data.");
//       });
//   };

//   const handleOpenUploadDialog = () => setShowUploadDialog(true);
//   const handleCloseUploadDialog = () => setShowUploadDialog(false);

//   const handleEditClick = (user) => {
//     setEditingId(user.id);
//     setEditedUser({ ...user });
//   };

//   const handleCancelClick = () => {
//     setEditingId(null);
//     setEditedUser({});
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
//     // Ensure dept value is an integer
//     const processedValue = name === "dept" ? parseInt(value, 10) : value;
//     setEditedUser(prev => ({ ...prev, [name]: processedValue }));
//   };

//   const handleUpdateClick = (id) => {
//     axios.put(`${API_BASE_URL}/users/${id}`, editedUser)
//       .then(() => {
//         toast.success("User updated successfully!");
//         setEditingId(null);
//         fetchUserData(); // Refresh user data
//       })
//       .catch(err => {
//         console.error("Failed to update user:", err);
//         const errorMsg = err.response?.data?.error || err.message;
//         toast.error(`Update failed: ${errorMsg}`);
//       });
//   };

//   const handleDeleteClick = (id, userName) => {
//     if (window.confirm(`Are you sure you want to delete the user: ${userName}?`)) {
//       axios.delete(`${API_BASE_URL}/users/${id}`)
//         .then(() => {
//           toast.info("User deleted successfully!");
//           fetchUserData(); // Refresh user data
//         })
//         .catch(err => {
//           console.error("Failed to delete user:", err);
//           const errorMsg = err.response?.data?.error || err.message;
//           toast.error(`Delete failed: ${errorMsg}`);
//         });
//     }
//   };

//   // Headers and fields for the data table
//   const headers = ["ID", "Name", "Email", "Dept", "Year", "Degree"];
//   const fields = ["id", "name", "email", "deptName", "year", "degree"];

//   // Dynamic dropdown options derived from state
//   const dropdownOptions = {
//     dept: departments.map(d => ({ label: d.dept_short, value: d.id })),
//     degree: [
//       { label: "UG", value: "UG" },
//       { label: "PG", value: "PG" },
//       { label: "MBA", value: "MBA" },
//       { label: "PHD", value: "PHD" },
//     ],
//   };

//   // Custom renderers for displaying data and edit fields
//   const customRenderers = fields.reduce((acc, field) => {
//     acc[field] = (user) => {
//       if (editingId === user.id) {
//         if (field === "deptName") { // Use 'deptName' for check but edit 'dept'
//           return (
//             <EditSelect
//               name="dept"
//               value={editedUser.dept}
//               onChange={handleEditChange}
//               options={dropdownOptions.dept}
//             />
//           );
//         }
//         if (field === "degree") {
//           return (
//             <EditSelect
//               name="degree"
//               value={editedUser.degree}
//               onChange={handleEditChange}
//               options={dropdownOptions.degree}
//             />

//           );
//         }
//         // Default text input for other fields
//         return (
//           <EditInput
//             name={field}
//             value={editedUser[field]}
//             onChange={handleEditChange}
//           />
//         );
//       }
//       // For Dept, we now display the deptName directly from the user object
//       return user[field];
//     };
//     return acc;
//   }, {});

//   // Custom renderer for the actions column
//   const actionsRenderer = (user) => {
//     return editingId === user.id ? (
//       <div className="flex items-center gap-2 justify-center">
//         <CustomButton label="Update" onClick={() => handleUpdateClick(user.id)} others="bg-green-500 hover:bg-green-600 px-3 py-1 text-white rounded-md shadow-sm" />
//         <CustomButton label="Cancel" onClick={handleCancelClick} others="bg-gray-500 hover:bg-gray-600 px-3 py-1 text-white rounded-md shadow-sm" />
//       </div>
//     ) : (
//       <div className="flex justify-center items-center gap-2">
//         <button className="text-blue-500 hover:text-blue-700"
//         style={{ color: "black" }}
//          onClick={() => handleEditClick(user)}>
//           <i className="bx bx-edit bx-sm bx-tada-hover"></i>
//         </button>
//         <div className="h-10 w-[1.5px] bg-gray-300"></div>
//         <button className="text-red-500 hover:text-red-700"
//         style={{ color: "red" }}
//         onClick={() => handleDeleteClick(user.id, user.name)}>
//           <i className="bx bx-trash bx-sm bx-tada-hover"></i>
//         </button>
//       </div>
//     );
//   };

//   return (
//     <div style={{ padding: "1rem" }} className="font-inter">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} />
//       {loading ? (
//         <div className="flex justify-center items-center h-48 text-lg text-gray-700">Loading users...</div>
//       ) : (
//         <>
//           <DataTable
//             title="All Users"
//             data={userData}
//             headers={headers}
//             fields={fields}
//             allow_download={true}
//             // addButton={handleOpenUploadDialog}
//             // addBtnLabel="Upload Users"
//             customRender={customRenderers}
//             actions={actionsRenderer}
//           />
//           {/* <UploadCourseDialog
//             open={showUploadDialog}
//             handleClose={handleCloseUploadDialog}
//             onUploadSuccess={fetchUserData}
//           /> */}
//         </>
//       )}
//     </div>
//   );
// }

// export default BasicExample;

import React, { useEffect, useRef, useState, useCallback } from "react";
import CustomButton from "../../compounds/button";
import CustomDropDown from "../../compounds/custom-dropdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../assets/img/logo.png";
import DOMPurify from "dompurify";
import "../style.css";
import { apiGetRequest } from "../../api/api";

function QuestionView() {
  const initialData = [];
  const [questionDetails, setQuestionDetails] = useState(initialData);
  const [questionDetailsRejected, setRejectedQuestions] = useState(0);
  const contentRef = useRef();
  const tempRef = useRef();

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseOptions, setcourseOptions] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // --- Dropdown Options ---
  // In a real application, you might fetch these from an API
  const academicYearOptions = [
    { value: "2025 - 2026 (ODD)", label: "2025 - 2026 (ODD)" },
    { value: "2025 - 2026 (EVEN)", label: "2025 - 2026 (EVEN)" },
  ];

  const [loading, setLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const GetCourse = async () => {
    try {
      setLoading(true);
      const res = await apiGetRequest(`/getcourses`);
      if (res.success) {
        setcourseOptions(
          res.data.data.map((course) => ({
            label: `${course.course_code} - ${course.course_name}`,
            value: course.course_code,
          }))
        );
      }
    } catch (error) {
      console.log("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAPI = async (academicYear, course) => {
    if (!academicYear || !course) {
      setQuestionDetails([]);
      return;
    }

    // Safely extract string
    const yearSemString =
      typeof academicYear === "object" && academicYear !== null
        ? academicYear.value
        : academicYear;

    if (typeof yearSemString !== "string") {
      console.error("Invalid academic year format:", yearSemString);
      setQuestionDetails([]);
      return;
    }

    const match = yearSemString.match(/^(.+?)\s+\((.+)\)$/);
    const year = match?.[1];
    const sem = match?.[2];

    const combinedCourse = encodeURIComponent(`(${course})`);

    try {
      const res = await apiGetRequest(
        `/getQuestion/${year}/${sem}/${combinedCourse}`
      );
      if (res.success) {
        setQuestionDetails(res.data.question_details);
      } else {
        setQuestionDetails([]);
      }
    } catch (err) {
      console.error("API error", err);
      setQuestionDetails([]);
    }
  };

  const sanitizedHTML = (html) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "i",
        "em",
        "a",
        "img",
        "p",
        "div",
        "span",
        "table",
        "thead",
        "tbody",
        "tr",
        "td",
        "th",
        "br",
        "sup",
        "sub",
        "h1",
        "h2",
        "h3",
      ],
      ALLOWED_ATTR: [
        "href",
        "src",
        "alt",
        "style",
        "width",
        "height",
        "colspan",
      ],
    });
  };

  const handleDownloadPdf = async () => {
    setPdfGenerating(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;
      const contentWidth = pageWidth - margin * 2;

      // Define how many questions to render per page/batch. Adjust as needed.
      const questionsPerPage = 7;
      const numPages = Math.ceil(questionDetails.length / questionsPerPage);

      // Create a single, off-screen, reusable container for rendering
      const tempDiv = document.createElement("div");
      tempDiv.style.width = `${contentWidth}mm`;
      tempDiv.style.position = "absolute";
      tempDiv.style.left = "-9999px";
      tempDiv.style.bottom = "-9999px";
      document.body.appendChild(tempDiv);

      // Loop through pages, not individual questions
      for (let p = 0; p < numPages; p++) {
        let yOffset = margin;

        // Add a new page for the second page onwards
        if (p > 0) {
          pdf.addPage();
        }

        // --- Build the HTML for the current page ---
        let pageHTML = "";

        // Add header only on the first page
        if (p === 0) {
          pageHTML += `
            <table class="qp-header-table" style="width: 100%; border-collapse: collapse;">
                <tbody>
                    <tr>
                        <td class="header-logo-cell" style="width: 20%; text-align: center; padding: 10px;">
                            <img src="${Logo}" width="100" alt="Logo" style="max-width: 100px; height: auto;"/>
                        </td>
                        <td class="header-text-cell" style="width: 80%; text-align: center; padding: 10px;">
                            <h3 style="margin: 0; font-size: 16px;">BANNARI AMMAN INSTITUTE OF TECHNOLOGY</h3>
                            <h3 style="margin: 5px 0; font-size: 14px;">(An Autonomous Institution)</h3>
                            <h3 style="margin: 0; font-size: 12px;">SATHYAMANGALAM - 638 401</h3>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div style="height: 10px;"></div>`;
        }

        // Get the questions for the current page
        const startIndex = p * questionsPerPage;
        const endIndex = startIndex + questionsPerPage;
        const pageQuestions = questionDetails.slice(startIndex, endIndex);

        // Generate HTML for each question on the current page
        pageQuestions.forEach((q, index) => {
          const questionNumber = startIndex + index + 1;
          pageHTML += `
            <table class="qp-questions-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px; page-break-inside: avoid;">
                <tbody>
                    <tr class="question-row">
                        <td class="qp-cell-a-number" style="width: 10%; vertical-align: top; padding: 5px; border: 1px solid #eee; font-weight: bold;">
                            A${questionNumber}
                        </td>
                        <td class="qp-cell-sub-q" style="width: 5%; vertical-align: top; padding: 5px; border: 1px solid #eee;">(i)</td>
                        <td class="qp-cell-question-content" style="width: 85%; padding: 5px; border: 1px solid #eee;">
                            <div class="sanitized-content">${sanitizedHTML(
                              q.question
                            )}</div>
                            ${
                              q.topic
                                ? `<h1 class="topic-heading" style="font-size: 10px; margin-top: 5px; margin-bottom: 2px;">Topic</h1><h3 class="font-medium" style="font-size: 12px; margin: 0;">${q.topic}</h3>`
                                : ""
                            }
                            <div class="mark-section" style="text-align: right; margin-top: 5px;">
                                <h2 class="mark-text" style="font-size: 12px; margin: 0;">
                                    ${q.course_co} - ${q.co_part} (${
            q.mark
          })<br />${q.cognitive}
                                </h2>
                            </div>
                        </td>
                    </tr>
                    <tr class="answer-row">
                        <td colspan="2" style="vertical-align: top; padding: 5px; border: 1px solid #eee; font-weight: bold;">Answer</td>
                        <td style="width: 85%; padding: 5px; border: 1px solid #eee;">
                            <div class="sanitized-content answer-text">${sanitizedHTML(
                              q.answer || "Answer not available."
                            )}</div>
                        </td>
                    </tr>
                </tbody>
            </table>`;
        });

        // --- Render the entire page's HTML to canvas at once ---
        tempDiv.innerHTML = pageHTML;

        // Wait for any images on the page to load
        await Promise.all(
          Array.from(tempDiv.getElementsByTagName("img")).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            });
          })
        );

        const canvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          scrollY: -window.scrollY,
          windowWidth: tempDiv.scrollWidth,
          windowHeight: tempDiv.scrollHeight,
        });
        const imgData = canvas.toDataURL("image/png");
        const imgHeight = (canvas.height * contentWidth) / canvas.width;

        // Add the single image of the entire page to the PDF
        if (imgHeight > pageHeight - margin) {
          // This case handles a single page's content being taller than the PDF page,
          // which can happen with large font sizes or many questions per page.
          // For simplicity, we add it and let it get cut off, but a more complex solution could split it.
          console.warn(
            "Content for page",
            p + 1,
            "is taller than the PDF page. Consider reducing questionsPerPage."
          );
        }
        pdf.addImage(imgData, "PNG", margin, margin, contentWidth, imgHeight);
      }

      pdf.save("download.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      document.body.removeChild(
        document.querySelector("div[style*='-9999px']")
      );
      setPdfGenerating(false);
    }
  };

  useEffect(() => {
    GetCourse();
  }, []);

  useEffect(() => {
    if (selectedAcademicYear && selectedCourse) {
      fetchAPI(selectedAcademicYear, selectedCourse);
    }
  }, [selectedAcademicYear, selectedCourse]);

  // The entire JSX return remains exactly the same as your original code
  return (
    <>
      <div className="flex-row">
        <div className="bg-white w-full p-5 rounded">
          {/* --- Dropdown Controls --- */}
          <div className="controls-container" style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "20px" }}>
              <CustomDropDown
                label="Academic Year"
                name="academicYear"
                options={academicYearOptions}
                onChange={(value) => setSelectedAcademicYear(value)}
                placeholder="Select Academic Year"
                className="dropdown-container"
              />
              {loading ? (
                <p>Loading Courses...</p>
              ) : (
                <CustomDropDown
                  label="Course"
                  name="course"
                  options={courseOptions}
                  onChange={(value) => setSelectedCourse(value)}
                  placeholder="Select Course"
                  className="dropdown-container"
                />
              )}
            </div>
          </div>
          <CustomButton
            label={pdfGenerating ? "Generating PDF..." : "Download PDF"}
            onClick={handleDownloadPdf}
            disabled={
              !questionDetails || questionDetails.length === 0 || pdfGenerating
            }
          />
          <div className="flex justify-center">
            <div
              ref={contentRef}
              className="question-paper-container"
              style={{
                width: "210mm",
                margin: "15mm",
                boxSizing: "border-box",
                border: "1px solid #666",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <table className="qp-header-table">
                <tbody>
                  <tr>
                    <td className="header-logo-cell">
                      <img src={Logo} width={100} alt="Logo" />
                    </td>
                    <td className="header-text-cell">
                      <div className="header-text-content">
                        <h3 className="institute-name">
                          BANNARI AMMAN INSTITUTE OF TECHNOLOGY
                        </h3>
                        <h3 className="affiliation">
                          (An Autonomous Institution Affiliated to Anna
                          University, Chennai)
                        </h3>
                        <h3 className="address">SATHYAMANGALAM - 638 401</h3>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="qp-questions-table">
                <tbody>
                  {Array.isArray(questionDetails) &&
                  questionDetails.length > 0 ? (
                    questionDetails.map((q, index) => (
                      <React.Fragment key={index}>
                        <tr className="question-row">
                          <td className="qp-cell-a-number" rowSpan={2}>
                            A{index + 1}
                          </td>
                          <td className="qp-cell-sub-q" rowSpan={2}>
                            (i)
                          </td>
                          <td className="qp-cell-question-content">
                            <div
                              className="sanitized-content"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedHTML(q.question),
                              }}
                            ></div>

                            <h1 className="topic-heading">Topic</h1>
                            <h3 className="font-medium ">{q.topic}</h3>

                            <div className="mark-section">
                              <h2 className="mark-text">
                                Unit - {q.course_co}
                                <br />({q.mark} Marks {q.rdt})
                              </h2>
                            </div>
                          </td>
                        </tr>

                        <tr className="answer-row">
                          {/* THIS IS THE FIX: The 'colSpan={2}' attribute has been removed. */}
                          <td className="qp-cell-answer-content">
                            <h3 className="answer-heading">Answer</h3>
                            <div
                              className="sanitized-content answer-text"
                              dangerouslySetInnerHTML={{
                                __html: sanitizedHTML(
                                  q.answer || "Answer not available."
                                ),
                              }}
                            ></div>
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        style={{
                          textAlign: "center",
                          padding: "20px",
                          margin: "15mm",
                        }}
                      >
                        Please select an academic year and a course to view the
                        question paper.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default QuestionView;
