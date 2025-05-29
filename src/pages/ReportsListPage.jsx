import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For linking to individual report details later
import axios from 'axios'; // Import axios

// Mock data for reports - replace with data from API later
/* const mockReports = [
  {
    id: '1',
    title: 'Illegal Waste Dumping near Green Park',
    location: 'Green Park, City Center',
    dateReported: '2024-05-20',
    status: 'Pending Review',
    issueType: 'Waste Dumping',
    description: 'Large piles of construction debris and household waste dumped near the main entrance of Green Park. Poses a health hazard and is an eyesore.'
  },
  {
    id: '2',
    title: 'Chemical Spill in Riverbend Area',
    location: 'Riverbend Industrial Zone',
    dateReported: '2024-05-18',
    status: 'Investigation Underway',
    issueType: 'Water Pollution',
    description: 'Reports of discolored water and dead fish in the river adjacent to the industrial zone. Possible chemical leakage from one of the factories.'
  },
  {
    id: '3',
    title: 'Excessive Smoke from Factory Chimney',
    location: 'North Industrial Sector',
    dateReported: '2024-05-22',
    status: 'Resolved',
    issueType: 'Air Pollution',
    description: 'A factory was emitting thick black smoke for several hours. Issue has been addressed after inspection and a warning was issued.'
  },
  {
    id: '4',
    title: 'Fallen Trees Blocking Trail',
    location: 'Mountain View Trail - Path B',
    dateReported: '2024-05-23',
    status: 'Actioned',
    issueType: 'Deforestation/Damage',
    description: 'Several large trees have fallen across Path B of the Mountain View Trail after a recent storm, making it inaccessible.'
  },
]; */

const ReportsListPage = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/reports');
        setReports(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching reports:", err);
        setError(err.message || 'Failed to fetch reports.');
        setReports([]); // Clear reports on error
      }
      setIsLoading(false);
    };

    fetchReports();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-start md:items-center mb-4 md:mb-2 flex-col md:flex-row">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-0">Submitted Environmental Reports</h1>
            <Link 
              to="/submit-report"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out self-start md:self-center"
            >
              Submit New Report
            </Link>
          </div>
          <p className="text-lg text-gray-600">Browse and track the status of environmental concerns.</p>
        </header>

        {isLoading && <p className="text-center text-gray-700">Loading reports...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}

        {!isLoading && !error && reports.length === 0 && (
          <p className="text-center text-gray-700">No reports found. Be the first to submit one!</p>
        )}

        {!isLoading && !error && reports.length > 0 && (
          <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Reported</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Type</th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.imageUrl ? (
                        <img 
                          src={`http://localhost:8080/api/reports/images/${report.imageUrl}`}
                          alt={`Report ${report.id}`}
                          className="h-[40px] w-[40px] rounded-md object-cover" // Basic thumbnail styling
                          onError={(e) => { e.target.style.display = 'none'; }} // Hide if image fails to load
                        />
                      ) : (
                        <div className="h-[40px] w-[40px] rounded-md bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                          No img
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {/* We might not have a title field directly from the backend report object yet, so let's adapt */}
                      {report.issueType} at {report.location.substring(0,30)}{report.location.length > 30 ? '...' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(report.dateReported).toLocaleDateString()} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ 
                        report.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'Investigation Underway' ? 'bg-blue-100 text-blue-800' :
                        report.status === 'Resolved' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800' 
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.issueType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link to={`/reports/${report.id}`} className="text-green-600 hover:text-green-900">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsListPage; 