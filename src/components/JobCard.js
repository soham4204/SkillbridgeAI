const JobCard = ({ job }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        <img src="/api/placeholder/64/64" alt="Company logo" className="w-16 h-16 rounded" />
        <div className="ml-4 flex-1">
          <h3 className="text-xl font-semibold text-gray-800">{job.title}</h3>
          <p className="text-gray-600">{job.company}</p>
          <p className="text-gray-500 text-sm mt-1">{job.location}</p>
          <div className="mt-4">
            <p className="text-gray-700">{job.description}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {skill}
              </span>
            ))}
          </div>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-gray-500 text-sm">{job.postedDate}</span>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );

export default JobCard;