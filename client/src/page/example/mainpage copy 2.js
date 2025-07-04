import React, { useEffect, useRef, useState, useCallback } from "react";
import CustomButton from "../../compounds/button";
import CustomDropDown from "../../compounds/custom-dropdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Logo from "../../assets/img/logo.png";
import DOMPurify from "dompurify";
import "../style.css";
import { apiGetRequest } from "../../api/api";
import JSZip from "jszip"; // Import JSZip
import { saveAs } from "file-saver"; // Import saveAs from file-saver

function QuestionView() {
  const initialData = [];
  const [questionDetails, setQuestionDetails] = useState(initialData);
  const [questionDetailsRejected, setRejectedQuestions] = useState(0); // This state isn't used in the provided code, consider removing if not needed.
  const contentRef = useRef(); // This ref isn't directly used for PDF generation in the new logic, consider removing if not needed.
  const tempRef = useRef(); // This ref isn't used in the provided code, consider removing if not needed.

  const [selectedAcademicYear, setSelectedAcademicYear] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseOptions, setcourseOptions] = useState(null);

  // State for loading indicators
  const [loading, setLoading] = useState(false);
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [bulkPdfGenerating, setBulkPdfGenerating] = useState(false);

  // --- Dropdown Options ---
  const academicYearOptions = [
    { value: "2025 - 2026 (ODD)", label: "2025 - 2026 (ODD)" },
    { value: "2025 - 2026 (EVEN)", label: "2025 - 2026 (EVEN)" },
  ];

  /**
   * Fetches the list of all available courses from the API.
   */
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

  // Corrected sanitizedHTML_download function
  const sanitizedHTML_download = (html) => {
    if (typeof html !== "string") {
      console.warn("sanitizedHTML_download received non-string input:", html);
      return ""; // Return empty string for invalid input
    }
    const div = document.createElement("div");
    div.innerHTML = html;

    // Remove script tags
    Array.from(div.querySelectorAll("script")).forEach((script) =>
      script.remove()
    );

    // Corrected: Iterate through all elements and then their attributes to remove event handlers
    const allElements = div.querySelectorAll("*"); // Select all elements
    allElements.forEach((el) => {
      // Loop backwards to safely remove attributes during iteration
      for (let i = el.attributes.length - 1; i >= 0; i--) {
        const attr = el.attributes[i];
        if (attr.name.startsWith("on")) {
          // Check if attribute name starts with "on" (e.g., onclick, onload)
          el.removeAttribute(attr.name);
        }
      }
    });
    return div.innerHTML;
  };
  const sanitizedHTML = (question) => {
    return DOMPurify.sanitize(question, {
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
        "superscript",
        "math",
        "mrow",
        "msup",
        "msub",
        "mi",
        "mo",
        "mn",
        "mfrac",
        "msqrt",
        "msubsup",
        "mtable",
        "mtr",
        "mtd",
        "mstyle",
        "merror",
        "mpadded",
        "mphantom",
        "mfenced",
        "mspace",
        "mprescripts",
        "none",
        "munder",
        "mover",
        "munderover",
        "mmultiscripts",
        "mtext",
        "ms",
        "maction",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "style"],
      ALLOW_DATA_ATTR: false,
      ALLOWED_URI_REGEXP:
        /^data:image\/(png|jpeg|jpg|gif);base64,|^https?:\/\//i,
    });
  };

  const generatePdfBlobForCourse = async (questionDetails, courseCode) => {
    const pdf = new jsPDF("p", "mm", "a4");
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    const questionSpacing = 10; // Vertical space between questions

    const tempDiv = document.createElement("div");
    tempDiv.style.width = `${contentWidth}mm`;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.visibility = "hidden";
    tempDiv.style.boxSizing = "border-box";
    document.body.appendChild(tempDiv);

    try {
      let currentPageHTML = "";
      let currentYOffset = margin;

      // --- 1. Measure and add Header to the first page ---
      const headerHtml = `
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

      tempDiv.innerHTML = headerHtml;
      await Promise.all(
        Array.from(tempDiv.getElementsByTagName("img")).map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = img.onerror = resolve;
          });
        })
      );
      const headerHeight = tempDiv.offsetHeight;

      const headerCanvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        scrollY: 0,
        windowWidth: tempDiv.scrollWidth,
        windowHeight: tempDiv.scrollHeight,
        x: tempDiv.offsetLeft,
        y: tempDiv.offsetTop,
      });
      const headerImgData = headerCanvas.toDataURL("image/png");
      const headerImgRenderHeight =
        (headerCanvas.height * contentWidth) / headerCanvas.width;
      pdf.addImage(
        headerImgData,
        "PNG",
        margin,
        margin,
        contentWidth,
        headerImgRenderHeight
      );

      currentYOffset += headerImgRenderHeight;

      // --- 2. Pre-measure all questions' heights ---
      const measuredQuestions = [];
      for (let i = 0; i < questionDetails.length; i++) {
        const q = questionDetails[i];
        const questionNumber = i + 1;

        const questionHtmlSnippet = `
        <table class="qp-questions-table" style="width: 100%; border-collapse: collapse; margin-bottom: 10px; page-break-inside: avoid;">
          <tbody>
            <tr class="question-row">
              <td class="qp-cell-a-number" style="width: 10%; vertical-align: top; padding: 5px; border: 1px solid #eee; font-weight: bold;">
                A${questionNumber}
              </td>
              <td class="qp-cell-sub-q" style="width: 5%; vertical-align: top; padding: 5px; border: 1px solid #eee;">(i)</td>
              <td class="qp-cell-question-content" style="width: 85%; padding: 5px; border: 1px solid #eee;">
                <div class="sanitized-content">${sanitizedHTML_download(
                  q.question
                )}</div>
                ${
                  q.topic
                    ? `<h1 class="topic-heading" style="font-size: 10px; margin-top: 5px; margin-bottom: 2px;">Topic</h1><h3 class="font-medium" style="font-size: 12px; margin: 0;">${q.topic}</h3>`
                    : ""
                }
                <div class="mark-section" style="text-align: right; margin-top: 5px;">
                  <h2 class="mark-text" style="font-size: 12px; margin: 0;">
                    ${q.course_co} - ${q.co_part} (${q.mark})<br />${
          q.cognitive
        }
                  </h2>
                </div>
              </td>
            </tr>
            <tr class="answer-row">
              <td colspan="2" style="vertical-align: top; padding: 5px; border: 1px solid #eee; font-weight: bold;">Answer</td>
              <td style="width: 85%; padding: 5px; border: 1px solid #eee;">
                <div class="sanitized-content answer-text">${sanitizedHTML_download(
                  q.answer || "Answer not available."
                )}</div>
              </td>
            </tr>
          </tbody>
        </table>`;

        tempDiv.innerHTML = questionHtmlSnippet;
        await Promise.all(
          Array.from(tempDiv.getElementsByTagName("img")).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            });
          })
        );
        const height = tempDiv.offsetHeight;
        measuredQuestions.push({
          ...q,
          html: questionHtmlSnippet,
          height: height,
        });
      }

      tempDiv.innerHTML = ""; // Clear tempDiv after pre-measurement

      // --- 3. Iterate through pre-measured questions to build pages ---
      for (let i = 0; i < measuredQuestions.length; i++) {
        const q = measuredQuestions[i];
        const questionRenderedHeight = q.height;

        // Check if adding this question exceeds the remaining page height
        if (
          currentYOffset + questionRenderedHeight + questionSpacing >
          pageHeight - margin
        ) {
          // Render the accumulated HTML for the current page
          tempDiv.innerHTML = currentPageHTML;

          await Promise.all(
            Array.from(tempDiv.getElementsByTagName("img")).map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((resolve) => {
                img.onload = img.onerror = resolve;
              });
            })
          );

          const pageCanvas = await html2canvas(tempDiv, {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowWidth: tempDiv.scrollWidth,
            windowHeight: tempDiv.scrollHeight,
            x: tempDiv.offsetLeft,
            y: tempDiv.offsetTop,
          });

          const pageImgData = pageCanvas.toDataURL("image/png");
          const pageImgRenderHeight =
            (pageCanvas.height * contentWidth) / pageCanvas.width;

          pdf.addImage(
            pageImgData,
            "PNG",
            margin,
            currentYOffset - pageImgRenderHeight,
            contentWidth,
            pageImgRenderHeight
          );

          pdf.addPage();
          currentPageHTML = "";
          currentYOffset = margin;
        }

        currentPageHTML += q.html;
        currentYOffset += questionRenderedHeight + questionSpacing;
      }

      // --- 4. Render any remaining content on the last page ---
      if (currentPageHTML.length > 0) {
        tempDiv.innerHTML = currentPageHTML;
        await Promise.all(
          Array.from(tempDiv.getElementsByTagName("img")).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            });
          })
        );

        const pageCanvas = await html2canvas(tempDiv, {
          scale: 2,
          useCORS: true,
          scrollY: 0,
          windowWidth: tempDiv.scrollWidth,
          windowHeight: tempDiv.scrollHeight,
          x: tempDiv.offsetLeft,
          y: tempDiv.offsetTop,
        });

        const pageImgData = pageCanvas.toDataURL("image/png");
        const pageImgRenderHeight =
          (pageCanvas.height * contentWidth) / pageCanvas.width;

        pdf.addImage(
          pageImgData,
          "PNG",
          margin,
          currentYOffset - pageImgRenderHeight,
          contentWidth,
          pageImgRenderHeight
        );
      }

      const pdfBlob = pdf.output("blob");
      return pdfBlob;
    } catch (error) {
      console.error(
        `Error in generatePdfBlobForCourse for ${courseCode}:`,
        error
      );
      throw new Error(`PDF generation failed: ${error.message || error}`);
    } finally {
      if (tempDiv && tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  const handleDownloadPdf = async () => {
    setPdfGenerating(true);
    try {
      if (
        !selectedAcademicYear ||
        !selectedCourse ||
        questionDetails.length === 0
      ) {
        alert(
          "Please select an academic year and a course, and ensure questions are loaded."
        );
        return;
      }
      const pdfBlob = await generatePdfBlobForCourse(
        questionDetails,
        selectedCourse
      );
      saveAs(pdfBlob, `${selectedCourse}.pdf`);
    } catch (error) {
      console.error("Error generating single PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setPdfGenerating(false);
    }
  };

  const handleDownloadAllCourses = async () => {
    if (!selectedAcademicYear || !courseOptions || courseOptions.length === 0) {
      alert("Please select an academic year and ensure courses are loaded.");
      return;
    }

    setBulkPdfGenerating(true);
    const zip = new JSZip();
    const yearSemString = selectedAcademicYear.value;
    const match = yearSemString.match(/^(.+?)\s+\((.+)\)$/);
    if (!match) {
      alert("Invalid academic year format.");
      setBulkPdfGenerating(false);
      return;
    }
    const year = match[1];
    const sem = match[2];

    console.log(
      `Starting bulk download for ${courseOptions.length} courses...`
    );

    for (const course of courseOptions) {
      const courseCode = course.value;
      const courseLabel = course.label;

      try {
        console.log(`[Processing]: ${courseLabel}`);

        const combinedCourse = encodeURIComponent(`(${courseCode})`);
        const res = await apiGetRequest(
          `/getQuestion/${year}/${sem}/${combinedCourse}`
        );

        if (
          res.success &&
          res.data.question_details &&
          res.data.question_details.length > 0
        ) {
          console.log(`Data found for ${courseCode}. Generating PDF Blob...`);
          const pdfBlob = await generatePdfBlobForCourse(
            res.data.question_details,
            courseCode
          );
          zip.file(`${courseCode}.pdf`, pdfBlob);
        } else {
          console.warn(
            `No question details found for ${courseCode}. Skipping PDF.`
          );
        }
      } catch (error) {
        console.error(`Failed to process ${courseCode}. Error:`, error);
      }
    }

    try {
      console.log("Generating ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" });
      saveAs(
        zipBlob,
        `QuestionPapers_${yearSemString.replace(/[\s()]/g, "_")}.zip`
      );
      console.log("ZIP file generated and downloaded successfully.");
      alert("Bulk download process finished. ZIP file downloaded.");
    } catch (zipError) {
      console.error("Error generating or saving ZIP file:", zipError);
      alert("Failed to create or download the ZIP file. Please try again.");
    } finally {
      setBulkPdfGenerating(false);
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
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <CustomButton
              label={
                pdfGenerating
                  ? "Generating Single PDF..."
                  : "Download Selected Course PDF"
              }
              onClick={handleDownloadPdf}
              disabled={
                !questionDetails ||
                questionDetails.length === 0 ||
                pdfGenerating ||
                bulkPdfGenerating
              }
            />
            <CustomButton
              label={
                bulkPdfGenerating
                  ? "Generating All PDFs (Zipping)..."
                  : "Download All Courses (ZIP)"
              }
              onClick={handleDownloadAllCourses}
              disabled={
                !selectedAcademicYear ||
                !courseOptions ||
                courseOptions.length === 0 ||
                bulkPdfGenerating ||
                pdfGenerating
              }
              others="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded-md shadow-sm"
            />
          </div>
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
