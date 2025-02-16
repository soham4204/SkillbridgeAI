const AppliedJobsPage = () => {
    const appliedJobs = [
      {
        id: 1,
        company: "Tech Corp",
        logo: "/api/placeholder/64/64",
        position: "Senior Frontend Developer",
        location: "San Francisco, CA",
        appliedDate: "2024-02-01",
        status: "Interview Scheduled",
        statusColor: "text-green-600",
      },
      {
        id: 2,
        company: "Innovation Labs",
        logo: "/api/placeholder/64/64",
        position: "Full Stack Engineer",
        location: "Remote",
        appliedDate: "2024-01-28",
        status: "Under Review",
        statusColor: "text-yellow-600",
      },
    ];
  
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Applied Jobs</h2>
        <div className="space-y-4">
          {appliedJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start">
                <img src={job.logo} alt={job.company} className="w-16 h-16 rounded" />
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold">{job.position}</h3>
                      <p className="text-gray-600">{job.company}</p>
                      <p className="text-gray-500">{job.location}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${job.statusColor}`}>{job.status}</p>
                      <p className="text-gray-500 text-sm">Applied: {job.appliedDate}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <button className="text-blue-600 hover:text-blue-700">View Application</button>
                    <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                      Contact Recruiter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

export default AppliedJobsPage;