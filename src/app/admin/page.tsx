// // "use client"
// // import React, { useState, useEffect } from 'react';
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// // import { Pagination } from "@/components/ui/pagination";
// // import { API_URL } from "../config";
// // const AdminDashboard = () => {
// //   const [complaints, setComplaints] = useState([]);
// //   const [filteredComplaints, setFilteredComplaints] = useState([]);
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [complaintsPerPage] = useState(10);
// //   const [filter, setFilter] = useState('all');
// //   const [totalComplaints, setTotalComplaints] = useState(0);
// //   const [categories, setCategories] = useState([]);
// //   const [resolutionStatus, setResolutionStatus] = useState({ resolved: 0, unresolved: 0, resolution_rate: 0 });
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);

// //   useEffect(() => {
// //     const fetchData = async () => {
// //       setLoading(true);

// //       try {
// //         const [allComplaints] = await Promise.all([
// //           fetch('${API_URL}complaints/all').then(res => res.json()),
// //         ]);






// //         // try {
// //         //   const [allComplaints, categoriesData, resolutionData] = await Promise.all([
// //         //     fetch('${API_URL}complaints/all').then(res => res.json()),
// //         //     // fetch('/complaints/categories').then(res => res.json()),
// //         //     // fetch('/complaints/resolution_status').then(res => res.json())
// //         //   ]);

// //         // ///  try {
// //         // setLoading(true);
// //         // const response = await fetch(`${API_URL}textPrompt`, {
// //         //   method: "POST",
// //         //   headers: {
// //         //     "Content-Type": "application/json",
// //         //   },
// //         //   body: JSON.stringify({ prompt: inputText, userID: userId }),
// //         // });

// //         setComplaints(allComplaints.complaints);
// //         setTotalComplaints(allComplaints.total_complaints);
// //         setCategories(categoriesData.categories);
// //         setResolutionStatus(resolutionData);
// //         setFilteredComplaints(allComplaints.complaints);
// //       } catch (err) {
// //         setError('Failed to fetch data');
// //         console.error(err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   useEffect(() => {
// //     if (filter === 'unresolved') {
// //       const fetchOpenComplaints = async () => {
// //         try {
// //           const response = await fetch('/complaints/open');
// //           const data = await response.json();
// //           setFilteredComplaints(data.unresolved);
// //         } catch (err) {
// //           console.error('Failed to fetch open complaints:', err);
// //         }
// //       };
// //       fetchOpenComplaints();
// //     } else {
// //       setFilteredComplaints(complaints);
// //     }
// //   }, [complaints, filter]);

// //   const pieChartData = [
// //     { name: 'Resolved', value: resolutionStatus.resolved },
// //     { name: 'Unresolved', value: resolutionStatus.unresolved },
// //   ];

// //   const barChartData = categories.map(category => ({
// //     category: category.name,
// //     count: category.count,
// //   }));

// //   const indexOfLastComplaint = currentPage * complaintsPerPage;
// //   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
// //   const currentComplaints = filteredComplaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

// //   const paginate = (pageNumber) => setCurrentPage(pageNumber);

// //   const toggleResolution = async (id) => {
// //     // Here you would typically make an API call to update the complaint status
// //     // For now, we'll just update the local state
// //     setComplaints(complaints.map(complaint =>
// //       complaint.id === id
// //         ? { ...complaint, status: complaint.status === 'Resolved' ? 'Unresolved' : 'Resolved' }
// //         : complaint
// //     ));
// //   };

// //   const addAdminMessage = async (id, message) => {
// //     // Here you would typically make an API call to add the admin message
// //     // For now, we'll just update the local state
// //     setComplaints(complaints.map(complaint =>
// //       complaint.id === id
// //         ? { ...complaint, adminMessage: message }
// //         : complaint
// //     ));
// //   };

// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;

// //   return (
// //     <div className="p-8">
// //       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

// //       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
// //         <Card>
// //           <CardHeader>
// //             <CardTitle>Total Complaints</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <div className="text-2xl font-bold">{totalComplaints}</div>
// //           </CardContent>
// //         </Card>

// //         <Card>
// //           <CardHeader>
// //             <CardTitle>Complaint Status</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <ResponsiveContainer width="100%" height={200}>
// //               <PieChart>
// //                 <Pie
// //                   data={pieChartData}
// //                   cx="50%"
// //                   cy="50%"
// //                   outerRadius={80}
// //                   fill="#8884d8"
// //                   dataKey="value"
// //                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
// //                 />
// //               </PieChart>
// //             </ResponsiveContainer>
// //           </CardContent>
// //         </Card>

// //         <Card className="col-span-2">
// //           <CardHeader>
// //             <CardTitle>Complaint Categories</CardTitle>
// //           </CardHeader>
// //           <CardContent>
// //             <ResponsiveContainer width="100%" height={300}>
// //               <BarChart data={barChartData}>
// //                 <CartesianGrid strokeDasharray="3 3" />
// //                 <XAxis dataKey="category" />
// //                 <YAxis />
// //                 <Tooltip />
// //                 <Legend />
// //                 <Bar dataKey="count" fill="#8884d8" />
// //               </BarChart>
// //             </ResponsiveContainer>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <div className="mb-4">
// //         <Button
// //           onClick={() => setFilter(filter === 'all' ? 'unresolved' : 'all')}
// //           variant="outline"
// //         >
// //           {filter === 'all' ? 'Show Unresolved' : 'Show All'}
// //         </Button>
// //       </div>

// //       <Table>
// //         <TableHeader>
// //           <TableRow>
// //             <TableHead>ID</TableHead>
// //             <TableHead>Type</TableHead>
// //             <TableHead>Subtype</TableHead>
// //             <TableHead>Status</TableHead>
// //             <TableHead>Message</TableHead>
// //             <TableHead>Actions</TableHead>
// //           </TableRow>
// //         </TableHeader>
// //         <TableBody>
// //           {currentComplaints.map((complaint) => (
// //             <TableRow key={complaint.id}>
// //               <TableCell>{complaint.id}</TableCell>
// //               <TableCell>{complaint.type}</TableCell>
// //               <TableCell>{complaint.subtype}</TableCell>
// //               <TableCell>{complaint.status}</TableCell>
// //               <TableCell>{complaint.message}</TableCell>
// //               <TableCell>
// //                 <Button onClick={() => toggleResolution(complaint.id)}>
// //                   {complaint.status === 'Resolved' ? 'Unresolve' : 'Resolve'}
// //                 </Button>
// //                 <Input
// //                   placeholder="Admin message"
// //                   onChange={(e) => addAdminMessage(complaint.id, e.target.value)}
// //                 />
// //               </TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>

// //       <Pagination
// //         complaintsPerPage={complaintsPerPage}
// //         totalComplaints={filteredComplaints.length}
// //         paginate={paginate}
// //         currentPage={currentPage}
// //       />
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// "use client"
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { API_URL } from "../config";

// const AdminDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [totalComplaints, setTotalComplaints] = useState(0);
//   const [categories, setCategories] = useState({});
//   const [resolutionStatus, setResolutionStatus] = useState({ resolved: 0, unresolved: 0, resolution_rate: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const [allComplaintsRes, categoriesRes, resolutionStatusRes] = await Promise.all([
//           fetch(`${API_URL}complaints/all`),
//           fetch(`${API_URL}complaints/categories`),
//           fetch(`${API_URL}complaints/resolution_status`)
//         ]);

//         const allComplaintsData = await allComplaintsRes.json();
//         const categoriesData = await categoriesRes.json();
//         const resolutionStatusData = await resolutionStatusRes.json();

//         setComplaints(allComplaintsData.complaints);
//         setTotalComplaints(allComplaintsData.total_complaints);
//         setCategories(categoriesData.categories);
//         setResolutionStatus(resolutionStatusData);
//       } catch (err) {
//         setError('Failed to fetch data');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const pieChartData = [
//     { name: 'Resolved', value: resolutionStatus.resolved },
//     { name: 'Unresolved', value: resolutionStatus.unresolved },
//   ];

//   const barChartData = Object.entries(categories).map(([category, count]) => ({
//     category,
//     count,
//   }));

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Complaints</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalComplaints}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Complaint Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={pieChartData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="col-span-2">
//           <CardHeader>
//             <CardTitle>Complaint Categories</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={barChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="category" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <Table>
// //         <TableHeader>
// //           <TableRow>
// //             <TableHead>ID</TableHead>
// //             <TableHead>Category</TableHead>
// //             <TableHead>Sub-category</TableHead>
// //             <TableHead>Resolved</TableHead>
// //             <TableHead>Summary</TableHead>
// //           </TableRow>
// //         </TableHeader>
// //         <TableBody>
// //           {complaints.map((complaint) => (
// //             <TableRow key={complaint.id}>
// //               <TableCell>{complaint.id}</TableCell>
// //               <TableCell>{complaint.metadata.product}</TableCell>
// //               <TableCell>{complaint.metadata.sub_product}</TableCell>
// //               <TableCell>{complaint.metadata.resolved ? 'Yes' : 'No'}</TableCell>
// //               <TableCell>{complaint.metadata.summary}</TableCell>
// //             </TableRow>
// //           ))}
// //         </TableBody>
// //       </Table>
// //     </div>
// //   );
// // };

// // export default AdminDashboard;

// 'use client'
// import React, { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
// import { API_URL } from "../config";

// const AdminDashboard = () => {
//   const [complaints, setComplaints] = useState([]);
//   const [totalComplaints, setTotalComplaints] = useState(0);
//   const [categories, setCategories] = useState({});
//   const [resolutionStatus, setResolutionStatus] = useState({ resolved: 0, unresolved: 0, resolution_rate: 0 });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [complaintsPerPage] = useState(10);
//   const [adminNotes, setAdminNotes] = useState({});
//   const [similarComplaints, setSimilarComplaints] = useState([]);
//   const [complaintTextForSimilar, setComplaintTextForSimilar] = useState('');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [allComplaintsRes, categoriesRes, resolutionStatusRes] = await Promise.all([
//         fetch(`${API_URL}complaints/all`),
//         fetch(`${API_URL}complaints/categories`),
//         fetch(`${API_URL}complaints/resolution_status`)
//       ]);
      

//       const allComplaintsData = await allComplaintsRes.json();
//       const categoriesData = await categoriesRes.json();
//       const resolutionStatusData = await resolutionStatusRes.json();
//       console.log(categoriesData)
//       setComplaints(allComplaintsData.complaints);
//       setTotalComplaints(allComplaintsData.total_complaints);
//       setCategories(categoriesData.categories);
//       setResolutionStatus(resolutionStatusData);
//     } catch (err) {
//       setError('Failed to fetch data');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const toggleResolution = (id) => {
//     setComplaints(complaints.map(complaint => 
//       complaint.id === id 
//         ? { ...complaint, metadata: { ...complaint.metadata, resolved: !complaint.metadata.resolved } }
//         : complaint
//     ));
//   };

//   const updateAdminNote = (id, note) => {
//     setAdminNotes({ ...adminNotes, [id]: note });
//   };






  
//   const fetchSimilarComplaints = async () => {
//     try {
//       const response = await fetch(`${API_URL}complaints/similar`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ complaint: complaintTextForSimilar })
//       });
//       const data = await response.json();
//       setSimilarComplaints(data.similar_complaints);
//     } catch (err) {
//       console.error('Error fetching similar complaints:', err);
//     }
//   };

//   const pieChartData = [
//     { name: 'Resolved', value: resolutionStatus.resolved },
//     { name: 'Unresolved', value: resolutionStatus.unresolved },
//   ];

//   const barChartData = Object.entries(categories).map(([category, count]) => ({
//     category,
//     count,
//   }));

//   // Pagination
//   const indexOfLastComplaint = currentPage * complaintsPerPage;
//   const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
//   const currentComplaints = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

//   const paginate = (pageNumber) => setCurrentPage(pageNumber);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <Card>
//           <CardHeader>
//             <CardTitle>Total Complaints</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{totalComplaints}</div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle>Complaint Status</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={200}>
//               <PieChart>
//                 <Pie
//                   data={pieChartData}
//                   cx="50%"
//                   cy="50%"
//                   outerRadius={80}
//                   fill="#8884d8"
//                   dataKey="value"
//                   label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//                 />
//               </PieChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>

//         <Card className="col-span-2">
//           <CardHeader>
//             <CardTitle>Complaint Categories</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ResponsiveContainer width="100%" height={300}>
//               <BarChart data={barChartData}>
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis dataKey="category" />
//                 <YAxis />
//                 <Tooltip />
//                 <Legend />
//                 <Bar dataKey="count" fill="#8884d8" />
//               </BarChart>
//             </ResponsiveContainer>
//           </CardContent>
//         </Card>
//       </div>

//       <Table>
//         <TableHeader>
//           <TableRow>
//             <TableHead>ID</TableHead>
//             <TableHead>Category</TableHead>
//             <TableHead>Sub-category</TableHead>
//             <TableHead>Status</TableHead>
//             <TableHead>Summary</TableHead>
//             <TableHead>Admin Actions</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {currentComplaints.map((complaint) => (
//             <TableRow key={complaint.id}>
//               <TableCell>{complaint.id}</TableCell>
//               <TableCell>{complaint.metadata.product}</TableCell>
//               <TableCell>{complaint.metadata.sub_product}</TableCell>
//               <TableCell>{complaint.metadata.resolved ? 'Resolved' : 'Unresolved'}</TableCell>
//               <TableCell>{complaint.metadata.summary}</TableCell>
//               <TableCell>
//                 <Button onClick={() => toggleResolution(complaint.id)}>
//                   {complaint.metadata.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
//                 </Button>
//                 <Input
//                   placeholder="Admin note"
//                   value={adminNotes[complaint.id] || ''}
//                   onChange={(e) => updateAdminNote(complaint.id, e.target.value)}
//                 />
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>

//       <div className="mt-4 flex justify-between items-center">
//         <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
//           Previous
//         </Button>
//         <span>Page {currentPage} of {Math.ceil(complaints.length / complaintsPerPage)}</span>
//         <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(complaints.length / complaintsPerPage)}>
//           Next
//         </Button>
//       </div>

//       <Card className="mt-8">
//         <CardHeader>
//           <CardTitle>Find Similar Complaints</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex space-x-2">
//             <Input
//               placeholder="Enter complaint text"
//               value={complaintTextForSimilar}
//               onChange={(e) => setComplaintTextForSimilar(e.target.value)}
//             />
//             <Button onClick={fetchSimilarComplaints}>Find Similar</Button>
//           </div>
//           {similarComplaints.length > 0 && (
//             <Table className="mt-4">
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>ID</TableHead>
//                   <TableHead>Summary</TableHead>
//                   <TableHead>Similarity Score</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {similarComplaints.map((complaint) => (
//                   <TableRow key={complaint.id}>
//                     <TableCell>{complaint.id}</TableCell>
//                     <TableCell>{complaint.summary}</TableCell>
//                     <TableCell>{complaint.similarity_score.toFixed(2)}</TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// // export default AdminDashboard;


'use client'

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { API_URL } from "../config";

interface Complaint {
  id: string;
  metadata: {
    product: string;
    sub_product: string;
    resolved: boolean;
    summary: string;
    admin_text: string;
  };
}

interface Category {
  [key: string]: number;
}

interface ResolutionStatus {
  resolved: number;
  unresolved: number;
  resolution_rate: number;
}

interface SimilarComplaint {
  id: string;
  summary: string;
  similarity_score: number;
}

const AdminDashboard: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [totalComplaints, setTotalComplaints] = useState<number>(0);
  const [categories, setCategories] = useState<Category>({});
  const [resolutionStatus, setResolutionStatus] = useState<ResolutionStatus>({ resolved: 0, unresolved: 0, resolution_rate: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [complaintsPerPage] = useState<number>(10);
  const [tempAdminNotes, setTempAdminNotes] = useState<{ [key: string]: string }>({});
  const [similarComplaints, setSimilarComplaints] = useState<SimilarComplaint[]>([]);
  const [complaintTextForSimilar, setComplaintTextForSimilar] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [allComplaintsRes, categoriesRes, resolutionStatusRes] = await Promise.all([
        fetch(`${API_URL}complaints/all`),
        fetch(`${API_URL}complaints/categories`),
        fetch(`${API_URL}complaints/resolution_status`)
      ]);
      
      const allComplaintsData = await allComplaintsRes.json();
      const categoriesData = await categoriesRes.json();
      const resolutionStatusData = await resolutionStatusRes.json();
      
      setComplaints(allComplaintsData.complaints);
      setTotalComplaints(allComplaintsData.total_complaints);
      setCategories(categoriesData.categories);
      setResolutionStatus(resolutionStatusData);
    } catch (err) {
      setError('Failed to fetch data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleResolution = async (id: string) => {
    try {
      const complaintToUpdate = complaints.find(c => c.id === id);
      if (!complaintToUpdate) return;

      const newResolvedStatus = !complaintToUpdate.metadata.resolved;

      const response = await fetch(`${API_URL}complaints/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          resolved: newResolvedStatus,
        }),
      });

      if (response.ok) {
        setComplaints(complaints.map(complaint => 
          complaint.id === id 
            ? { ...complaint, metadata: { ...complaint.metadata, resolved: newResolvedStatus } }
            : complaint
        ));
        fetchData(); // Refresh all data
      } else {
        throw new Error('Failed to update resolution status');
      }
    } catch (error) {
      console.error('Error updating resolution status:', error);
      setError('Failed to update resolution status. Please try again.');
    }
  };

  const updateTempAdminNote = (id: string, note: string) => {
    setTempAdminNotes({ ...tempAdminNotes, [id]: note });
  };

  const submitAdminNote = async (id: string) => {
    if (tempAdminNotes[id]) {
      try {
        const response = await fetch(`${API_URL}complaints/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: id,
            admin_text: tempAdminNotes[id],
          }),
        });

        if (response.ok) {
          setComplaints(complaints.map(complaint => 
            complaint.id === id 
              ? { ...complaint, metadata: { ...complaint.metadata, admin_text: tempAdminNotes[id] } }
              : complaint
          ));
          setTempAdminNotes({ ...tempAdminNotes, [id]: '' });
          fetchData(); // Refresh all data
        } else {
          throw new Error('Failed to update admin note');
        }
      } catch (error) {
        console.error('Error updating admin note:', error);
        setError('Failed to update admin note. Please try again.');
      }
    }
  };

  const fetchSimilarComplaints = async () => {
    try {
      const response = await fetch(`${API_URL}complaints/similar?complaint=${encodeURIComponent(complaintTextForSimilar)}`);
      const data = await response.json();
      setSimilarComplaints(data.similar_complaints);
    } catch (err) {
      console.error('Error fetching similar complaints:', err);
      setError('Failed to fetch similar complaints. Please try again.');
    }
  };

  const pieChartData = [
    { name: 'Resolved', value: resolutionStatus.resolved },
    { name: 'Unresolved', value: resolutionStatus.unresolved },
  ];

  const barChartData = Object.entries(categories).map(([category, count]) => ({
    category,
    count,
  }));

  // Pagination
  const indexOfLastComplaint = currentPage * complaintsPerPage;
  const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage;
  const currentComplaints = complaints.slice(indexOfFirstComplaint, indexOfLastComplaint);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Complaints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComplaints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Complaint Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Complaint Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Sub-category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Summary</TableHead>
            <TableHead>Admin Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentComplaints.map((complaint) => (
            <TableRow key={complaint.id}>
              <TableCell>{complaint.id}</TableCell>
              <TableCell>{complaint.metadata.product}</TableCell>
              <TableCell>{complaint.metadata.sub_product}</TableCell>
              <TableCell>{complaint.metadata.resolved ? 'Resolved' : 'Unresolved'}</TableCell>
              <TableCell>{complaint.metadata.summary}</TableCell>
              <TableCell>
                <Button onClick={() => toggleResolution(complaint.id)}>
                  {complaint.metadata.resolved ? 'Mark Unresolved' : 'Mark Resolved'}
                </Button>
                <div className="flex mt-2">
                  <Input
                    placeholder="Admin note"
                    value={tempAdminNotes[complaint.id] || ''}
                    onChange={(e) => updateTempAdminNote(complaint.id, e.target.value)}
                  />
                  <Button onClick={() => submitAdminNote(complaint.id)} disabled={!tempAdminNotes[complaint.id]}>
                    Submit Note
                  </Button>
                </div>
                {complaint.metadata.admin_text && (
                  <div className="mt-2 text-sm">
                    <strong>Note:</strong> {complaint.metadata.admin_text}
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <Button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </Button>
        <span>Page {currentPage} of {Math.ceil(complaints.length / complaintsPerPage)}</span>
        <Button onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(complaints.length / complaintsPerPage)}>
          Next
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Find Similar Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter complaint text"
              value={complaintTextForSimilar}
              onChange={(e) => setComplaintTextForSimilar(e.target.value)}
            />
            <Button onClick={fetchSimilarComplaints} disabled={!complaintTextForSimilar}>Find Similar</Button>
          </div>
          {similarComplaints.length > 0 && (
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Similarity Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {similarComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>{complaint.id}</TableCell>
                    <TableCell>{complaint.summary}</TableCell>
                    <TableCell>{complaint.similarity_score.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;