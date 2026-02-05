import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config";

export default function Register_complain() {
  const [comments, setComments] = useState("");
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const [type, setType] = useState("electricity");
  const [regno, setRegno] = useState("");

  const navigate = useNavigate();
  const notifyA = (msg) => toast.error(msg);
  const notifyB = (msg) => toast.success(msg);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.regno) {
      setRegno(user.regno);
    }
  }, []);

  useEffect(() => {
    if (url) {
      submitComplaint(url);
    }
  }, [url]);

  const postComplaint = () => {
    if (!comments || !type) {
      notifyA("Please fill in all required fields");
      return;
    }

    if (image) {
      uploadToCloudinary();
    } else {
      // If no image, submit with default image or empty URL
      submitComplaint("https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png");
    }
  };

  const uploadToCloudinary = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta_clone"); // 👈 Your Cloudinary upload preset
    data.append("cloud_name", "dx0lfkfrj");       // 👈 Your Cloudinary cloud name

    fetch("https://api.cloudinary.com/v1_1/dx0lfkfrj/image/upload", {
      method: "POST",
      body: data
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.url) {
          setUrl(data.url);
        } else {
          notifyA("Image upload failed");
        }
      })
      .catch((err) => {
        console.error("Cloudinary upload error:", err);
        notifyA("Image upload error");
      });
  };

  const submitComplaint = (uploadedUrl) => {
    fetch(`${BASE_URL}/complain`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        type,
        comments,
        url: uploadedUrl,
        regno
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          notifyB("Complaint submitted successfully");
          navigate("/student-dashboard");
        } else {
          notifyA(data.message || "Submission failed");
        }
      })
      .catch((err) => {
        console.error("Complaint error:", err);
        notifyA("Something went wrong");
      });
  };

  const loadfile = (event) => {
    const output = document.getElementById("output");
    output.src = URL.createObjectURL(event.target.files[0]);
    output.onload = () => URL.revokeObjectURL(output.src);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      {/* Back Button */}
      <div className="mb-4">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-center">Submit a Complaint</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type of Complaint</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        >
          <option value="electricity">Electricity</option>
          <option value="internet">Internet</option>
          <option value="room">Room</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
          placeholder="Describe the issue..."
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Upload Photo (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            loadfile(e);
            setImage(e.target.files[0]);
          }}
        />
        <img
          id="output"
          className="mt-2 w-32 h-32 object-cover border rounded"
          src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
          alt="Preview"
        />
      </div>

      <button
        onClick={postComplaint}
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Submit Complaint
      </button>
    </div>
  );
}
// src/pages/Register_complain.js
// src/pages/Register_complain.js
// src/pages/Register_complain.js
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import BASE_URL from "../api/config"; // expected "http://localhost:4000/route"

// const TYPES = [
//   { value: "", label: "Select a category" },
//   { value: "plumbing", label: "Plumbing" },
//   { value: "electricity", label: "Electricity" },
//   { value: "cleaning", label: "Cleaning" },
//   { value: "internet", label: "Internet/Wi-Fi" },
//   { value: "security", label: "Security" },
//   { value: "other", label: "Other" },
// ];

// export default function Register_complain() {
//   const navigate = useNavigate();

//   const [type, setType] = useState("");
//   const [comments, setComments] = useState("");
//   const [file, setFile] = useState(null);
//   const [preview, setPreview] = useState(null);
//   const [submitting, setSubmitting] = useState(false);

//   // required student fields (loaded from localStorage user if available)
//   const [regno, setRegno] = useState("");
//   const [roomno, setRoomno] = useState("");
//   const [studentId, setStudentId] = useState(""); // optional, if backend expects it

//   useEffect(() => {
//     try {
//       const user = JSON.parse(localStorage.getItem("user"));
//       if (user) {
//         if (user.regno) setRegno(user.regno);
//         if (user.roomno) setRoomno(user.roomno);
//         if (user._id) setStudentId(user._id); // adapt if your key is different
//       }
//     } catch (e) {
//       // no user in localStorage
//     }
//   }, []);

//   useEffect(() => {
//     // cleanup preview object URL on unmount
//     return () => {
//       if (preview) URL.revokeObjectURL(preview);
//     };
//   }, [preview]);

//   const onFileChange = (e) => {
//     const f = e.target.files[0] ?? null;
//     setFile(f);
//     if (f) {
//       const url = URL.createObjectURL(f);
//       setPreview(url);
//     } else {
//       setPreview(null);
//     }
//   };

//   async function postComplaint(formData) {
//     const token = localStorage.getItem("jwt");
//     const res = await fetch(`${BASE_URL}/complain`, {
//       method: "POST",
//       headers: {
//         Authorization: token ? `Bearer ${token}` : "",
//         // DO NOT set Content-Type when sending FormData
//       },
//       body: formData,
//     });

//     const text = await res.text();
//     // Try to parse JSON if the server returned JSON text
//     let parsed = null;
//     try {
//       parsed = JSON.parse(text);
//     } catch (_) {
//       parsed = null;
//     }

//     if (!res.ok) {
//       // surface server message if present
//       const msg = parsed?.message || text || `Status ${res.status}`;
//       throw new Error(msg);
//     }

//     // success
//     return parsed;
//   }

//   const submitComplaint = async (e) => {
//     e.preventDefault();

//     // client-side validations
//     if (!type) {
//       toast.warn("Please select a complaint category.");
//       return;
//     }
//     if (!comments.trim()) {
//       toast.warn("Please describe the issue.");
//       return;
//     }

//     // ensure regno & roomno are present (your backend schema requires these)
//     if (!regno || !roomno) {
//       toast.warn("Registration number or room number missing in profile. Please update profile.");
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const formData = new FormData();
//       formData.append("type", type);
//       formData.append("comments", comments.trim());
//       formData.append("regno", regno);
//       formData.append("roomno", roomno);

//       // include student id if available (backend may use it)
//       if (studentId) formData.append("student_id", studentId);

//       if (file) formData.append("file", file); // key: 'file' — backend should accept this

//       const result = await postComplaint(formData);

//       if (result && result.success) {
//         toast.success(result.message || "Complaint submitted successfully");
//         // reset form
//         setType("");
//         setComments("");
//         setFile(null);
//         setPreview(null);
//         // navigate to dashboard or show confirmation
//         navigate("/student-dashboard");
//       } else {
//         // handle backend success:false
//         toast.error((result && result.message) || "Submission failed");
//       }
//     } catch (err) {
//       console.error("Complaint error:", err);
//       toast.error(err.message || "Network/server error while submitting complaint");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto p-6 bg-white rounded-md shadow">
//       <div className="mb-4">
//         <button onClick={() => navigate("/student-dashboard")} className="text-blue-600 hover:underline text-sm font-medium">
//           ← Back to Dashboard
//         </button>
//       </div>

//       <h2 className="text-2xl font-bold mb-4">Register a Complaint</h2>

//       <form onSubmit={submitComplaint} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Category</label>
//           <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 border rounded" required>
//             {TYPES.map((t) => (
//               <option key={t.value} value={t.value}>
//                 {t.label}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Comments</label>
//           <textarea
//             value={comments}
//             onChange={(e) => setComments(e.target.value)}
//             rows={4}
//             className="w-full px-3 py-2 border rounded"
//             placeholder="Describe the issue with as much detail as possible..."
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Upload Photo (optional)</label>
//           <input type="file" accept="image/*" onChange={onFileChange} />
//           {preview ? (
//             <img src={preview} alt="preview" className="mt-2 w-32 h-32 object-cover rounded" onLoad={() => URL.revokeObjectURL(preview)} />
//           ) : (
//             <img src="https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png" alt="placeholder" className="mt-2 w-32 h-32 object-cover rounded" />
//           )}
//         </div>

//         {/* show/edit regno & roomno so backend gets correct values */}
//         <div className="grid grid-cols-2 gap-3">
//           <input value={regno} onChange={(e) => setRegno(e.target.value)} placeholder="Reg No" className="px-3 py-2 border rounded" />
//           <input value={roomno} onChange={(e) => setRoomno(e.target.value)} placeholder="Room No" className="px-3 py-2 border rounded" />
//         </div>

//         <div className="flex gap-3">
//           <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
//             {submitting ? "Submitting..." : "Submit Complaint"}
//           </button>

//           <button type="button" onClick={() => navigate("/student-dashboard")} className="px-4 py-2 bg-gray-200 rounded">
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }
