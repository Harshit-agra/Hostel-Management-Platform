// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import BASE_URL from '../api/config';
// export default function VerifyOtp() {
//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleVerify = async (e) => {
//     e.preventDefault();
//     const email = localStorage.getItem("pendingEmail"); // ✅ stored after signup-request

//     if (!email) {
//       alert("No email found. Please signup again.");
//       navigate("/signup");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await fetch(`${BASE_URL}/route/verify-register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, otp }),
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("✅ Registration successful! Please login.");
//         localStorage.removeItem("pendingEmail"); // cleanup
//         navigate("/login");
//       } else {
//         alert(data.message);
//       }
//     } catch (err) {
//       alert("❌ OTP verification failed. Try again.");
//       console.error("Verify error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
//           Verify Your Email
//         </h2>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           Enter the OTP sent to your college email
//         </p>

//         <form onSubmit={handleVerify} className="space-y-4">
//           <input
//             type="text"
//             maxLength="6"
//             placeholder="Enter 6-digit OTP"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
//           >
//             {loading ? "Verifying..." : "Verify OTP"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from '../api/config'; // should be "http://localhost:4000/route"

export default function VerifyOtp() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    const email = localStorage.getItem("pendingEmail"); // stored during signup-request

    if (!email) {
      alert("No email found. Please signup again.");
      navigate("/signup");
      return;
    }

    const trimmedOtp = otp.trim();

    if (trimmedOtp.length !== 6) {
      alert("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      // IMPORTANT: BASE_URL already contains '/route', so DO NOT add another '/route' here
      const res = await fetch(`${BASE_URL}/verify-register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: trimmedOtp }),
      });

      // If not OK, read text (could be HTML error page) and show it
      if (!res.ok) {
        const text = await res.text();
        console.error("Verify failed:", res.status, text);
        alert(`Server error (${res.status}): ${text}`);
        return;
      }

      // Safe to parse JSON now
      const data = await res.json();
      console.log("Verify success:", data);

      if (data.success) {
        alert("✅ Registration successful! Please login.");
        localStorage.removeItem("pendingEmail");
        navigate("/login");
      } else {
        // server responded with JSON but success=false
        alert(data.message || "OTP verification failed.");
      }
    } catch (err) {
      console.error("Verify error:", err);
      alert("Network error while verifying OTP. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Verify Your Email
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter the OTP sent to your college email
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // only digits
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-center text-lg tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
