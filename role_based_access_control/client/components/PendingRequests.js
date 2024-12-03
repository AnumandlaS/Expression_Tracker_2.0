// import React, { useEffect, useState } from "react";
// // import "..styles/PendingRequests.css";

// const PendingRequests = () => {
//   const [requests, setRequests] = useState([]);

//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const response = await fetch("/api/pending-requests");
//         const data = await response.json();
//         setRequests(data);
//       } catch (error) {
//         console.error("Error fetching requests:", error);
//       }
//     };

//     fetchRequests();
//   }, []);

//   const handleAction = async (id, action) => {
//     try {
//       const response = await fetch(`/api/requests/${id}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ action }),
//       });
//       const data = await response.json();
//       alert(data.message);

//       // Refresh the list after action
//       setRequests((prev) => prev.filter((req) => req._id !== id));
//     } catch (error) {
//       console.error(`Error performing ${action}:`, error);
//     }
//   };

//   return (
//     <div className="pending-requests">
//       <h2>Pending Registration Requests</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>Email</th>
//             <th>Phone</th>
//             <th>Role</th>
//             <th>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {requests.map((req) => (
//             <tr key={req._id}>
//               <td>{req.name}</td>
//               <td>{req.email}</td>
//               <td>{req.phone}</td>
//               <td>{req.role}</td>
//               <td>
//                 <button onClick={() => handleAction(req._id, "accept")}>
//                   Accept
//                 </button>
//                 <button onClick={() => handleAction(req._id, "decline")}>
//                   Decline
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default PendingRequests;
import React from "react";

const PendingRequests = () => {
  return (
    <div>
      <h1>Pending Admin Requests</h1>
      <p>Here you can view and manage all pending admin requests.</p>
    </div>
  );
};

export default PendingRequests;
