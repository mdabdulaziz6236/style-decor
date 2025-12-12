import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { LuTrash2, LuShieldCheck, LuUser, LuSearch, LuUserCog } from "react-icons/lu";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";


const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch Users Data
  const { data: users = [], refetch, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users-for-admin");
      return res.data;
    },
  });

  // 2. Filter Users based on Search
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. Handle Make Admin
  const handleMakeAdmin = (user) => {
    Swal.fire({
      title: "Promote to Admin?",
      text: `Are you sure you want to make ${user.name} an Admin?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#13b6ec",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Promote!",
      background: "#1b2e35",
      color: "#fff"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.patch(`/users/admin/${user._id}`).then((res) => {
          if (res.data.modifiedCount > 0) {
            refetch();
            Swal.fire({
              title: "Success!",
              text: `${user.name} is now an Admin.`,
              icon: "success",
              background: "#1b2e35",
              color: "#fff"
            });
          }
        });
      }
    });
  };

  // 4. Handle Delete User (Database + Firebase via Server)
  const handleDeleteUser = (user) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will delete the user from Database AND Firebase permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#13b6ec",
      confirmButtonText: "Yes, delete it!",
      background: "#1b2e35",
      color: "#fff"
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/users/${user._id}`)
          .then((res) => {
            if (res.data.deletedCount > 0) {
              refetch();
              Swal.fire({
                title: "Deleted!",
                text: "User has been removed.",
                icon: "success",
                background: "#1b2e35",
                color: "#fff"
              });
            }
          })
          .catch((error) => {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Could not delete user. Check server logs.",
                icon: "error",
                background: "#1b2e35",
                color: "#fff"
            });
          });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#101d22]">
        <span className="loading loading-bars loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 bg-base-100 min-h-screen font-sans text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-4 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Manage Users</h2>
          <p className="text-secondary text-sm mt-1">Total Users: <span className="text-primary font-bold">{users.length}</span></p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="input input-bordered w-full md:w-72 pl-10 bg-[#1b2e35] border-gray-600 focus:border-primary text-white focus:outline-none"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <LuSearch className="absolute left-3 top-3.5 text-gray-400" />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#1b2e35] rounded-2xl shadow-xl overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-[#101d22] text-secondary text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="py-4 pl-6">#</th>
                <th>User Info</th>
                <th>Role</th>
                <th>Make Admin</th>
                <th className="text-right pr-6">Delete</th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="text-sm divide-y divide-gray-700">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-[#233f48] transition-colors">
                    <th className="pl-6 text-gray-500">{index + 1}</th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-linear-to-br from-primary to-accent text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-md ring-1 ring-white/10">
                            {user.photoURL ? (
                              <img src={user.photoURL} alt={user.name} />
                            ) : (
                              <span className="text-lg">{user.name?.slice(0, 1).toUpperCase()}</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-xs text-gray-400 font-mono">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    
                    {/* Role Badge */}
                    <td>
                      {user.role === "admin" ? (
                        <span className="badge bg-primary/20 text-primary border-primary/20 gap-1 font-bold p-3">
                          <LuShieldCheck /> Admin
                        </span>
                      ) : user.role === "decorator" ? (
                        <span className="badge bg-purple-500/20 text-purple-400 border-purple-500/20 gap-1 font-bold p-3">
                          <LuUserCog /> Decorator
                        </span>
                      ) : (
                        <span className="badge bg-gray-700/50 text-gray-300 border-gray-600 gap-1 font-medium p-3">
                          <LuUser /> User
                        </span>
                      )}
                    </td>

                    {/* Make Admin Button */}
                    <td>
                      {user.role === "admin" ? (
                        <button className="btn btn-xs btn-disabled bg-transparent border-none text-gray-600">
                          Promoted
                        </button>
                      ) : (
                        <button
                          onClick={() => handleMakeAdmin(user)}
                          className="btn btn-xs btn-outline border-primary text-primary hover:bg-primary hover:text-white"
                        >
                          <LuShieldCheck className="mr-1" /> Make Admin
                        </button>
                      )}
                    </td>

                    {/* Delete Button */}
                    <td className="text-right pr-6">
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="btn btn-sm btn-square btn-error btn-outline hover:bg-red-600 hover:text-white transition-all shadow-lg shadow-red-900/20"
                        title="Delete User"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    No users found matching "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;