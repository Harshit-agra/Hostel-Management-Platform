// import React, { useEffect, useState } from "react";
// import { FaTrash } from "react-icons/fa";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from "../api/config";


// const View_complain = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch(`${BASE_URL}/route/get/mycomplain`, {
//       method: "GET",
//       headers: {
//         Authorization: "Bearer " + localStorage.getItem("jwt"),
//       },
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) {
//           setComplaints(data.data);
//         } else {
//           toast.error(data.message || "Failed to load complaints");
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error fetching complaints:", err);
//         toast.error("Something went wrong");
//         setLoading(false);
//       });
//   }, []);

//   const handleDelete = async (complainId, elementId) => {
//     try {
//       const res = await fetch(
//         `${BASE_URL}/route/delete/complain/${complainId}/${elementId}`,
//         {
//           method: "DELETE",
//           headers: {
//             Authorization: "Bearer " + localStorage.getItem("jwt"),
//           },
//         }
//       );
//       const data = await res.json();
//       if (data.success) {
//         toast.success(data.message);
//         setComplaints((prev) =>
//           prev
//             .map((doc) => {
//               if (doc._id === complainId) {
//                 return {
//                   ...doc,
//                   complaints: doc.complaints.filter(
//                     (c) => c._id !== elementId
//                   ),
//                 };
//               }
//               return doc;
//             })
//             .filter((doc) => doc.complaints.length > 0)
//         );
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       console.error("Delete error:", error);
//       toast.error("Delete failed");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <img
//           src="https://i.gifer.com/ZZ5H.gif"
//           alt="Loading..."
//           className="w-24 h-24"
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       {/* Back Button */}
//       <div className="mb-6">
//         <button
//           onClick={() => navigate("/student-dashboard")}
//           className="text-blue-600 hover:underline text-sm font-medium"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

//       <h2 className="text-2xl font-bold mb-6 text-center">Your Complaints</h2>

//       {complaints.length === 0 ? (
//         <p className="text-center text-gray-600">No complaints found.</p>
//       ) : (
//         complaints.map((doc) => (
//           <div key={doc._id} className="mb-10">
//             {doc.complaints.map((c) => (
//               <div
//                 key={c._id}
//                 className="flex flex-col md:flex-row gap-6 border p-6 rounded-lg mb-6 shadow-md bg-white"
//               >
//                 <img
//                   src={
//                     c.url ||
//                     "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
//                   }
//                   alt="Complaint"
//                   className="w-full md:w-80 h-64 object-cover rounded-lg border shadow"
//                 />

//                 <div className="flex flex-col justify-between flex-grow">
//                   <div>
//                     <p className="text-base font-semibold text-gray-700 mb-1">
//                       <strong>Type:</strong> {c.type}
//                     </p>
//                     <p className="text-base text-gray-600 mb-1">
//                       <strong>Comment:</strong> {c.comments}
//                     </p>
//                     <p className="text-sm text-gray-500 mb-2">
//                       <strong>Date:</strong>{" "}
//                       {new Date(c.createdAt).toLocaleString()}
//                     </p>
//                     <div className="mt-2 flex items-center gap-2">
//                       <span
//                         className={`w-3 h-3 rounded-full ${
//                           c.status ? "bg-green-500" : "bg-red-500"
//                         }`}
//                         title={c.status ? "Resolved" : "Pending"}
//                       ></span>
//                       <span className="text-sm font-medium">
//                         {c.status ? "Resolved" : "Pending"}
//                       </span>
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => handleDelete(doc._id, c._id)}
//                     className="self-end mt-4 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
//                   >
//                     <FaTrash /> Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default View_complain;
// src/pages/View_complain.js
import React, { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../api/config"; // should be "http://localhost:4000/route"

const View_complain = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // const fetchComplaints = async () => {
    //   try {
    //     const res = await fetch(`${BASE_URL}/get/mycomplain`, {
    //       method: "GET",
    //       headers: {
    //         Authorization: "Bearer " + localStorage.getItem("jwt"),
    //       },
    //     });

    //     if (!res.ok) {
    //       const text = await res.text();
    //       throw new Error(`Fetch failed (${res.status}): ${text}`);
    //     }

    //     const data = await res.json();
    //     if (data.success) {
    //       setComplaints(data.data);
    //     } else {
    //       toast.error(data.message || "Failed to load complaints");
    //     }
    //   } catch (err) {
    //     console.error("Error fetching complaints:", err);
    //     toast.error("Something went wrong while fetching complaints");
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    const fetchComplaints = async () => {
  try {
    const res = await fetch(`${BASE_URL}/get/mycomplain`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    });

    if (!res.ok) {
      // Try to parse body (might be JSON with message)
      const text = await res.text();
      // If it's JSON, parse
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (_) {
        parsed = null;
      }

      // Handle the "no complaints" case gracefully
      if (res.status === 404 && parsed && parsed.message && parsed.message.includes("No complaints found")) {
        setComplaints([]); // show empty state
        return;
      }

      // For other errors, surface message
      throw new Error(`Fetch failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    if (data.success) {
      setComplaints(data.data);
    } else {
      // If backend returns success:false but status 200, handle gracefully:
      if (data.message && data.message.includes("No complaints found")) {
        setComplaints([]);
      } else {
        toast.error(data.message || "Failed to load complaints");
      }
    }
  } catch (err) {
    console.error("Error fetching complaints:", err);
    // If we already set empty state above we return early; otherwise show toast
    if (!Array.isArray(complaints) || complaints.length > 0) {
      toast.error("Something went wrong while fetching complaints");
    }
  } finally {
    setLoading(false);
  }
};

    fetchComplaints();
  }, []);

  const handleDelete = async (complainId, elementId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      const res = await fetch(
        `${BASE_URL}/delete/complain/${complainId}/${elementId}`, // <-- no extra /route
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Delete failed (${res.status}): ${text}`);
      }

      const data = await res.json();

      if (data.success) {
        toast.success(data.message || "Deleted successfully");

        // Update local state: remove the deleted element from complaints
        setComplaints((prev) =>
          prev
            .map((doc) => {
              if (doc._id === complainId) {
                return {
                  ...doc,
                  complaints: doc.complaints.filter((c) => c._id !== elementId),
                };
              }
              return doc;
            })
            .filter((doc) => doc.complaints && doc.complaints.length > 0)
        );
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed. See console for details.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img
          src="https://i.gifer.com/ZZ5H.gif"
          alt="Loading..."
          className="w-24 h-24"
        />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/student-dashboard")}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          ← Back to Dashboard
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-6 text-center">Your Complaints</h2>

      {complaints.length === 0 ? (
        <p className="text-center text-gray-600">No complaints found.</p>
      ) : (
        complaints.map((doc) => (
          <div key={doc._id} className="mb-10">
            {doc.complaints.map((c) => (
              <div
                key={c._id}
                className="flex flex-col md:flex-row gap-6 border p-6 rounded-lg mb-6 shadow-md bg-white"
              >
                <img
                  src={
                    c.url ||
                    "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-512.png"
                  }
                  alt="Complaint"
                  className="w-full md:w-80 h-64 object-cover rounded-lg border shadow"
                />

                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <p className="text-base font-semibold text-gray-700 mb-1">
                      <strong>Type:</strong> {c.type}
                    </p>
                    <p className="text-base text-gray-600 mb-1">
                      <strong>Comment:</strong> {c.comments}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      <strong>Date:</strong>{" "}
                      {new Date(c.createdAt).toLocaleString()}
                    </p>
                    <div className="mt-2 flex items-center gap-2">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          c.status ? "bg-green-500" : "bg-red-500"
                        }`}
                        title={c.status ? "Resolved" : "Pending"}
                      ></span>
                      <span className="text-sm font-medium">
                        {c.status ? "Resolved" : "Pending"}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(doc._id, c._id)}
                    className="self-end mt-4 text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default View_complain;
